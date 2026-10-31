// Login gate: the visitor fills the form, the admin gets a mail / panel request,
// and the landing page opens only after the admin approves it. No signup, no password.
(() => {
  const API = () => window.AUCTECH_API.replace(/\/$/, "");
  const TOKEN = "auctech_token", PENDING = "auctech_pending";
  const $ = (id) => document.getElementById(id);
  const gate = $("authGate"), forms = $("authForms"), pending = $("authPending"), err = $("authError");
  const form = $("loginForm"), btn = $("loginBtn"), loader = $("loginLoader");
  let timer;

  const tokenValid = (t) => {
    try { return JSON.parse(atob(t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).exp * 1000 > Date.now(); } catch { return false; }
  };

  const setLoading = (on) => { btn.disabled = on; loader.hidden = !on; };

  const unlock = (token) => {
    if (token) localStorage.setItem(TOKEN, token);
    sessionStorage.removeItem(PENDING);
    clearInterval(timer);
    document.body.classList.remove("locked");
    gate.hidden = true;
    window.loadContent?.();
  };

  const lock = () => {
    localStorage.removeItem(TOKEN);
    document.body.classList.add("locked");
    gate.hidden = false;
    showForms();
  };

  const showForms = () => {
    clearInterval(timer);
    setLoading(false);
    forms.hidden = false; pending.hidden = true; $("authBack").hidden = true;
  };

  const showPending = (title, text, done) => {
    forms.hidden = true; pending.hidden = false;
    $("pendingTitle").textContent = title; $("pendingText").textContent = text;
    pending.classList.toggle("done", !!done);
    $("authBack").hidden = !done;
  };

  const poll = ({ id, key }) => {
    clearInterval(timer);
    showPending("Waiting for admin confirmation…", "Your request was sent. This page opens automatically as soon as the admin approves it.");
    const check = async () => {
      try {
        const j = await (await fetch(`${API()}/access/status/${id}?key=${key}`)).json();
        if (j.data?.status === "approved" && j.data.token) unlock(j.data.token);
        else if (j.data?.status === "rejected") {
          clearInterval(timer); sessionStorage.removeItem(PENDING);
          showPending("Request not approved", "Sorry, the admin did not approve this request.", true);
        }
      } catch { /* keep polling */ }
    };
    check();
    timer = setInterval(check, 4000);
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.textContent = "";
    setLoading(true); // loader shows below the button until the "Waiting for admin confirmation…" popup opens
    try {
      const res = await fetch(`${API()}/access/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message || "Something went wrong");
      const p = { id: j.data.requestId, key: j.data.statusKey };
      sessionStorage.setItem(PENDING, JSON.stringify(p));
      form.reset();
      poll(p);          // opens the waiting popup
      setLoading(false); // loader hides only now, as the popup is shown
    } catch (ex) {
      err.textContent = ex.message === "Failed to fetch" ? "Cannot reach the server. Please try again." : ex.message;
      setLoading(false);
    }
  });

  $("authBack").addEventListener("click", showForms);
  $("logoutBtn")?.addEventListener("click", lock);

  // start-up
  const saved = localStorage.getItem(TOKEN);
  if (saved && tokenValid(saved)) unlock();
  else {
    localStorage.removeItem(TOKEN);
    const p = sessionStorage.getItem(PENDING);
    if (p) poll(JSON.parse(p));
  }
})();
