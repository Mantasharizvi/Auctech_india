(function ($) {
    "use strict";
	
	var $window = $(window); 
	var $body = $('body'); 

	/* Preloader Effect */
	$window.on('load', function(){
		$(".preloader").fadeOut(600);
	});

	/* Sticky Header */	
	if($('.active-sticky-header').length){
		$window.on('resize', function(){
			setHeaderHeight();
		});

		function setHeaderHeight(){
	 		$("header.main-header").css("height", $('header .header-sticky').outerHeight());
		}	
	
		$(window).on("scroll", function() {
			var fromTop = $(window).scrollTop();
			setHeaderHeight();
			var headerHeight = $('header .header-sticky').outerHeight()
			$("header .header-sticky").removeClass("hide");
			$("header .header-sticky").toggleClass("active", (fromTop > 50));
		});
	}	
	
	/* Sidebar open: lock background scroll (also blocks SmoothScroll hijack) */
	var $offcanvasEl = $('#offcanvasRight');
	if($offcanvasEl.length){
		var lockScroll = function(e){
			if(!$('html').hasClass('offcanvas-open')){ return; }
			if($(e.target).closest('#offcanvasRight').length){
				e.stopPropagation();
			} else {
				e.stopPropagation();
				if(e.cancelable){ e.preventDefault(); }
			}
		};
		window.addEventListener('wheel', lockScroll, {capture:true, passive:false});
		window.addEventListener('touchmove', lockScroll, {capture:true, passive:false});
		$offcanvasEl.on('show.bs.offcanvas', function(){ $('html').addClass('offcanvas-open'); });
		$offcanvasEl.on('hidden.bs.offcanvas', function(){ $('html').removeClass('offcanvas-open'); });
	}

	/* Slick Menu JS */
	$('#menu').slicknav({
		label : '',
		prependTo : '.responsive-menu'
	});

	if($("a[href='#top']").length){
		$("a[href='#top']").click(function() {
			$("html, body").animate({ scrollTop: 0 }, "slow");
			return false;
		});
	}

	/* Typed subtitle */
	if ($('.typed-title').length) {
		$('.typed-title').typed({
			stringsElement: $('.typing-title'),
			backDelay: 2000,
			typeSpeed: 0,
			loop: true
		});
	}

	/* Hero Slider Layout JS */
	const hero_slider_layout = new Swiper('.hero-slider-layout .swiper', {
		effect: 'fade',
		slidesPerView : 1,
		speed: 1000,
		spaceBetween: 0,
		loop: true,
		autoplay: {
			delay: 4000,
		},
		pagination: {
			el: '.hero-pagination',
			clickable: true,
		},
	});

	if ($('.agency-supports-slider').length) {
		const agency_supports_slider = new Swiper('.agency-supports-slider .swiper', {
			slidesPerView : 2,
			speed: 2000,
			spaceBetween: 30,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			breakpoints: {
				768:{
				  	slidesPerView: 4,
				},
				991:{
				  	slidesPerView: 6,
				}
			}
		});
	}

	/* testimonial Slider JS */
	if ($('.testimonial-slider').length) {
		const testimonial_slider = new Swiper('.testimonial-slider .swiper', {
			slidesPerView : 1,
			speed: 1000,
			spaceBetween: 30,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			navigation: {
				nextEl: '.testimonial-button-next',
				prevEl: '.testimonial-button-prev',
			},
			breakpoints: {
				768:{
				  	slidesPerView: 1,
				},
				991:{
				  	slidesPerView: 1,
				}
			}
		});
	}

	/* Youtube Background Video JS */
	if ($('#herovideo').length) {
		var myPlayer = $("#herovideo").YTPlayer();
	}

	/* Init Counter */
	if ($('.counter').length) {
		$('.counter').counterUp({ delay: 6, time: 3000 });
	}

	/* Image Reveal Animation */
	if ($('.reveal').length) {
        gsap.registerPlugin(ScrollTrigger);
        let revealContainers = document.querySelectorAll(".reveal");
        revealContainers.forEach((container) => {
            let image = container.querySelector("img");
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    toggleActions: "play none none none"
                }
            });
            tl.set(container, {
                autoAlpha: 1
            });
            tl.from(container, 1, {
                xPercent: -100,
                ease: Power2.out
            });
            tl.from(image, 1, {
                xPercent: 100,
                scale: 1,
                delay: -1,
                ease: Power2.out
            });
        });
    }

	/* Text Effect Animation */
	if ($('.text-anime-style-1').length) {
		let staggerAmount 	= 0.05,
			translateXValue = 0,
			delayValue 		= 0.5,
		   animatedTextElements = document.querySelectorAll('.text-anime-style-1');
		
		animatedTextElements.forEach((element) => {
			let animationSplitText = new SplitText(element, { type: "chars, words" });
				gsap.from(animationSplitText.words, {
				duration: 1,
				delay: delayValue,
				x: 20,
				autoAlpha: 0,
				stagger: staggerAmount,
				scrollTrigger: { trigger: element, start: "top 85%" },
				});
		});		
	}
	
	if ($('.text-anime-style-2').length) {				
		let	 staggerAmount 		= 0.03,
			 translateXValue	= 20,
			 delayValue 		= 0.1,
			 easeType 			= "power2.out",
			 animatedTextElements = document.querySelectorAll('.text-anime-style-2');
		
		animatedTextElements.forEach((element) => {
			let animationSplitText = new SplitText(element, { type: "chars, words" });
				gsap.from(animationSplitText.chars, {
					duration: 1,
					delay: delayValue,
					x: translateXValue,
					autoAlpha: 0,
					stagger: staggerAmount,
					ease: easeType,
					scrollTrigger: { trigger: element, start: "top 85%"},
				});
		});		
	}
	
	if ($('.text-anime-style-3').length) {		
		let	animatedTextElements = document.querySelectorAll('.text-anime-style-3');
		
		 animatedTextElements.forEach((element) => {
			//Reset if needed
			if (element.animation) {
				element.animation.progress(1).kill();
				element.split.revert();
			}

			element.split = new SplitText(element, {
				type: "lines,words,chars",
				linesClass: "split-line",
			});
			gsap.set(element, { perspective: 400 });

			gsap.set(element.split.chars, {
				opacity: 0,
				x: "50",
			});

			element.animation = gsap.to(element.split.chars, {
				scrollTrigger: { trigger: element,	start: "top 90%" },
				x: "0",
				y: "0",
				rotateX: "0",
				opacity: 1,
				duration: 1,
				ease: Back.easeOut,
				stagger: 0.02,
			});
		});		
	}

	/* Parallaxie js */
	var $parallaxie = $('.parallaxie');
	if($parallaxie.length && ($window.width() > 991))
	{
		if ($window.width() > 768) {
			$parallaxie.parallaxie({
				speed: 0.55,
				offset: 0,
			});
		}
	}

	/* Zoom Gallery screenshot */
	$('.gallery-items').magnificPopup({
		delegate: 'a',
		type: 'image',
		closeOnContentClick: false,
		closeBtnInside: false,
		mainClass: 'mfp-with-zoom',
		image: {
			verticalFit: true,
		},
		gallery: {
			enabled: true
		},
		zoom: {
			enabled: true,
			duration: 300, // don't foget to change the duration also in CSS
			opener: function(element) {
			  return element.find('img');
			}
		}
	});

	/* Contact form validation */
	var $contactform = $("#contactForm");
	$contactform.validator({focus: false}).on("submit", function (event) {
		if (!event.isDefaultPrevented()) {
			event.preventDefault();
			submitForm();
		}
	});

	function submitForm(){
		/* Send contact form to email via FormSubmit */
		var payload = {
			Name: $("#fname").val() + " " + $("#lname").val(),
			Phone: $("#phone").val(),
			Email: $("#email").val(),
			Service: $("#service").val(),
			Message: $("#message").val(),
			_subject: "New enquiry from Auctech website",
			_replyto: $("#email").val(),
			_template: "table",
			_captcha: "false"
		};
		$.ajax({
			type: "POST",
			url: "https://formsubmit.co/ajax/admin@auctech.in",
			dataType: "json",
			headers: { "Accept": "application/json" },
			data: payload,
			success : function(res){
				if (res && (res.success === "true" || res.success === true)){
					formSuccess();
				} else {
					submitMSG(false, (res && res.message) ? res.message : "Unable to send message. Please try again later.");
				}
			},
			error : function(){
				submitMSG(false, "Unable to send message. Please try again later.");
			}
		});
	}

	function formSuccess(){
		$contactform[0].reset();
		submitMSG(true, "Message Sent Successfully!")
	}

	function submitMSG(valid, msg){
		if(valid){
			var msgClasses = "h4 text-success";
		} else {
			var msgClasses = "h4 text-danger";
		}
		$("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
	}
	/* Contact form validation end */

	/* Newsletter form submit */
	$("#newslettersForm").on("submit", function (event) {
		event.preventDefault();
		var $form = $(this);
		var $msg = $form.find(".newsletter-msg");
		if (!$msg.length) {
			$msg = $('<div class="newsletter-msg mt-2"></div>').appendTo($form);
		}
		$.ajax({
			type: "POST",
			url: "https://formsubmit.co/ajax/admin@auctech.in",
			dataType: "json",
			headers: { "Accept": "application/json" },
			data: {
				Email: $form.find("input[name=mail]").val(),
				_subject: "New newsletter subscriber - Auctech website",
				_captcha: "false"
			},
			success: function(res){
				if (res && (res.success === "true" || res.success === true)){
					$form[0].reset();
					$msg.removeClass("text-danger").addClass("text-success").text("Thanks for subscribing!");
				} else {
					$msg.removeClass("text-success").addClass("text-danger").text("Unable to subscribe. Please try again later.");
				}
			},
			error: function(){
				$msg.removeClass("text-success").addClass("text-danger").text("Unable to subscribe. Please try again later.");
			}
		});
	});
	/* Newsletter form submit end */

	/* Our Project (filtering) Start */
	$window.on( "load", function(){
		if( $(".project-item-boxes").length ) {
				
			/* Init Isotope */
			var $menuitem = $(".project-item-boxes").isotope({
				itemSelector: ".project-item-box",
				layoutMode: "masonry",
				masonry: {
					// use outer width of grid-sizer for columnWidth
					columnWidth: 1,
				}
			});
				
			/* Filter items on click */
			var $menudisesnav=$(".our-Project-nav li a");
				$menudisesnav.on('click', function (e) { 
			
				var filterValue = $(this).attr('data-filter');
				$menuitem.isotope({
					filter: filterValue
				}); 
				
				$menudisesnav.removeClass("active-btn"); 
				$(this).addClass("active-btn");
				e.preventDefault();
			});		
			$menuitem.isotope({ filter: "*" });
		}			
	});
	/* Our Project (filtering) End */

	/* Animated Wow Js */	
	new WOW().init();

	/* Popup Video */
	if ($('.popup-video').length) {
		$('.popup-video').magnificPopup({
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: true
		});
	}
	
	/* Why Choose us active Start */
	if ($('.why-choose-content').length) {
		var element = $('.why-choose-content');            
		var items = element.find('.why-choose-item');
		if (items.length) {
			items.on({
				mouseenter: function() {
					if($(this).hasClass('active')) return;

					items.removeClass('active');
					$(this).addClass('active');

				},
				mouseleave: function() {
					//stuff to do on mouse leave
				}
			});
		}                 
	}
	/* Why Choose us active End */
	
})(jQuery);