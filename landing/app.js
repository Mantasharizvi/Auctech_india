// Loads Our Websites, Reels, Posts and Clients from the API
(() => {
  const API = () => window.AUCTECH_API.replace(/\/$/, "");
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const mono = (n = "") => (n.match(/[A-Za-z]+/g) || ["?"]).filter((w) => !/^(dr|the)$/i.test(w)).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const get = (path) => fetch(`${API()}/${path}`).then((r) => r.json()).then((j) => j.data || []);
  const fail = (el, label) => { if (el) el.innerHTML = `<p class="dyn-msg">Could not load ${label}. Please refresh.</p>`; };
  const empty = (el, label) => { if (el) el.innerHTML = `<p class="dyn-msg">No ${label} yet.</p>`; };
  const fallback = (name) => `onerror="this.replaceWith(Object.assign(document.createElement('b'),{textContent:'${esc(mono(name))}'}))"`;

  const siteLogo = (s) => {
    if (!s.logo) return `<b>${esc(mono(s.name))}</b>`;
    const img = (cls) => `<img ${cls} src="${esc(s.logo)}" alt="${esc(s.name)} logo" loading="lazy" ${fallback(s.name)}>`;
    if (s.logoBg === "dark") return img("");
    // ARV's logo has white text: shown black on the white box
    if (/arvvastuinteriors/i.test(s.url)) return `<span class="chip-box">${img('class="arv-logo"')}</span>`;
    return img('class="chip"');
  };

  const render = {
    websites: (list) => list.map((s) => `
      <a class="site-card" href="${esc(s.url)}" target="_blank" rel="noopener">
        <div class="site-logo dark">${siteLogo(s)}</div>
        <h3>${esc(s.name)}</h3><p>${esc(s.description)}</p>
        <span class="site-link">${esc(s.domain || s.url)} <i>↗</i></span>
      </a>`).join(""),
    reels: (list) => list.map((r) => `
      <figure class="reel"><div class="reel-phone"><video src="${esc(r.posterUrl || String(r.videoUrl).includes("#") ? r.videoUrl : r.videoUrl + "#t=0.1")}" ${r.posterUrl ? `poster="${esc(r.posterUrl)}"` : ""} playsinline loop muted preload="${r.posterUrl ? "none" : "metadata"}" controls></video></div>
      <figcaption><b>${esc(r.title)}</b><small>${esc(r.subtitle)}</small></figcaption></figure>`).join(""),
    posts: (list) => list.map((p) => `
      <figure class="post"><img src="${esc(p.imageUrl)}" alt="${esc(p.title)} social media post" loading="lazy">
      <figcaption><b>${esc(p.title)}</b><small>${esc(p.subtitle)}</small></figcaption></figure>`).join(""),
  };

  const targets = [
    ["reels", "reelsRow", "reels"],
    ["posts", "postsGrid", "posts"],
  ];

  // Websites with category filter (All + every category that has websites)
  const loadWebsites = () => {
    const grid = document.getElementById("sitesGrid"), bar = document.getElementById("siteFilters");
    Promise.all([get("websites"), get("website-categories").catch(() => [])])
      .then(([sites, cats]) => {
        if (!sites.length) { bar.hidden = true; return empty(grid, "websites"); }
        const used = new Set(sites.map((s) => s.category).filter(Boolean));
        const order = cats.map((c) => c.name).filter((n) => used.has(n));
        used.forEach((n) => { if (!order.includes(n)) order.push(n); });
        let active = "All";
        const paint = () => {
          bar.innerHTML = ["All", ...order]
            .map((n) => `<button type="button" class="site-filter${n === active ? " active" : ""}" data-cat="${esc(n)}">${esc(n)}</button>`).join("");
          const list = active === "All" ? sites : sites.filter((s) => s.category === active);
          grid.innerHTML = list.length ? render.websites(list) : `<p class="dyn-msg">No websites in this category yet.</p>`;
        };
        bar.hidden = order.length === 0;
        bar.onclick = (e) => {
          const b = e.target.closest(".site-filter");
          if (b) { active = b.dataset.cat; paint(); }
        };
        paint();
      })
      .catch(() => { bar.hidden = true; fail(grid, "websites"); });
  };

  window.loadContent = () => {
    loadWebsites();
    targets.forEach(([path, id, label]) => {
      const el = document.getElementById(id);
      get(path)
        .then((list) => (list.length ? (el.innerHTML = render[path](list)) : empty(el, label)))
        .catch(() => fail(el, label));
    });
  };
})();
