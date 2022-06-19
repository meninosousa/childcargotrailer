(function($){"use strict";
	var isHover = false;
	var navbarHeight = $("#main-navbar").outerHeight();
	var fixedNavbar = false;

	if ( $("#main-navbar").hasClass("fixed-top") || $("#main-navbar").hasClass("sticky-top") ) {
		fixedNavbar = true;
	}

	// toast active
	var toast = $('.toast');
	if ( toast.length ) {
		$('.toast').toast('show');
	}

	// collapse
	var collapse = $( ".collapsible-accordion" );
	if ( collapse.length && window.location.hash ) {
		collapse.removeClass("show");
		var hashArr = window.location.hash.split('c'),
			coll = $('#collapse-'+hashArr[1]);
		if (coll.length) {
			$('#collapse-'+hashArr[1]).addClass('show');
			var offsetSize = 0;
			if ( fixedNavbar ) {
				offsetSize = navbarHeight;
			}
			var collAnchor = '#collapse-'+hashArr[1];
			$("html, body").stop().animate({
				scrollTop: $(collAnchor).offset().top-offsetSize
			}, 1500, "easeInOutExpo");
		}
	}

	// collapsible active scroll to top
	$('.collapse').on('shown.bs.collapse', function(e) {
		var $card = $(this).closest('.card');
		if ( $card.find('a.temp-gets-shown').length != 1) {
			return;
		}
		$card.find('a.temp-gets-shown').removeClass('temp-gets-shown');
		if ( $card.length ) {
			var offsetSize = $card.find('.card-header').outerHeight()+15;
			if ( fixedNavbar ) {
				offsetSize += navbarHeight;
			}
			$('html,body').animate({
				scrollTop: $card.offset().top-offsetSize
			}, 500);
		}
	});
	$('.card a[data-toggle="collapse"]').on('click', function(e) {
		if ($(this).attr('aria-expanded') ==	'true') {
			return;
		}
		$(this).addClass('temp-gets-shown');
	});

	// card image overlay on mobile only
	if ( $(window).width() < 576  && $('.img-overlay').length ) {
		$('.card .img-overlay').each(function() {
			$(this).addClass( "card-img-overlay d-flex align-items-end" );
		});
	}


	// scroll anchor
	if (window.location.hash) {

		var hash = window.location.hash;

		if ($(hash).length) {
			var idArr = hash.split('#'),
				targetElement = document.getElementById(idArr[1]),
				targetOffset = targetElement.offsetTop,
				offsetSize = 29;

				if ( fixedNavbar ) {
					offsetSize += navbarHeight;
				}

				var scrollTo = targetOffset-offsetSize;

			$("html, body").stop().animate({
				'scrollTop': scrollTo
			}, 1500, "easeInOutExpo");
		}
	}


	// lightbox - page.jsFooterInline.5.5
	baguetteBox.run(".gallery, .image-gallery");


	// dropdown menu - page.jsFooterInline.5.6
	$(".dropdown-menu a.dropdown-toggle").on("click", function() {
		if (!$(this).next().hasClass("show")) {
			$(this).parents(".dropdown-menu").first().find(".show").removeClass("show");
		}
		var $subMenu = $(this).next(".dropdown-menu");
		$subMenu.toggleClass("show");

		$(this).parents("li.nav-item.dropdown.show").on("hidden.bs.dropdown", function() {
			$(".dropdown-submenu .show").removeClass("show");
		});

		return false;
	});


	// link to top - page.jsFooterInline.5.8
	var offset = 220;
	var duration = 500;
	$(window).scroll(function() {
		if ($(this).scrollTop() > offset) {
			$(".back-to-top").fadeIn(duration);
		} else {
			$(".back-to-top").fadeOut(duration);
		}
	});
	$(".back-to-top").click(function(event) {
		event.preventDefault(event);
		$("html, body").animate({scrollTop: 0}, duration);
		return false;
	});


	// carousel - page.jsFooterInline.5.10
	var carousel = $( ".carousel .carousel-inner .carousel-item:first-child" );
	if ( carousel.length ) {
		carousel.addClass( "active" );
	}

	var cardSlider = $( ".carousel.card-slider" );
	if ( cardSlider.length ) {
		$( cardSlider ).each(function( index ) {
			var sliderId = "#" + $( this ).attr("id");
			$(sliderId).on("slide.bs.carousel", function(e) {
				var $e = $(e.relatedTarget);
				var idx = $e.index();
				var itemsPerSlide = 3;
				var totalItems = $(sliderId + " .carousel-item").length;
				if (idx >= totalItems - (itemsPerSlide - 1)) {
					var it = itemsPerSlide - (totalItems - idx);
					for (var i = 0; i < it; i++) {
						if (e.direction == "left") {
							$(sliderId + " .carousel-item")
							.eq(i)
							.appendTo(sliderId + " .carousel-inner");
						} else {
							$(sliderId + ".carousel-item")
							.eq(0)
							.appendTo(sliderId + " .carousel-inner");
						}
					}
				}
			});
		});
	}


	// Mega menu - page.jsFooterInline.5.11
	$(document).on("click", ".mega-dropdown", function(event) {
	  event.stopPropagation();
	})


	// nav tab - page.jsFooterInline.5.12
	var tab = $( ".tab-content .tab-pane:first-child" );
	if ( tab.length ) {
		if ( window.location.hash ) {
			var tabHashArr = window.location.hash.split('c');
			$('.nav[role="tablist"] a[href="#tab-content-'+tabHashArr[1]+'"]').tab('show');
			var tabOffsetSize = 30;
			if ( fixedNavbar ) {
				tabOffsetSize = navbarHeight+30;
			}
			var tabAnchor = '#tab-'+tabHashArr[1];

			if ($(tabAnchor).length) {
				$("html, body").stop().animate({
					scrollTop: $(tabAnchor).offset().top-tabOffsetSize
				}, 1500, "easeInOutExpo");
			}

		} else {
			tab.addClass( "show active" );
		}
	}


	// Navbar hover - page.jsFooterInline.5.50
	function navbarHover() {
		isHover = true;
		$("ul.navbar-nav .dropdown, ul.navbar-nav .dropdown-submenu").hover(function() {
			$(this).find(" > .dropdown-menu").stop(true, true).delay(200).fadeIn();
			$(this).addClass("show");
			$(this).next(".dropdown-menu").addClass("show");
			$(this).next("a").attr("aria-expanded","true");
		}, function() {
			$(this).find(" > .dropdown-menu").stop(true, true).delay(200).fadeOut();
			$(this).removeClass("show");
			$(this).next(".dropdown-menu").removeClass("show");
			$(this).next("a").attr("aria-expanded","false");
		});
	}


	// Navbar hover - page.jsFooterInline.5.54 - xl
	if ( $(window).width() > 1200 ) {
		navbarHover();

	}
	// Shrinking Navbar on scrolling - page.jsFooterInline.5.61
	var navShrinkColorschemes = $('#main-navbar').data('shrinkcolorschemes'),
		navShrinkColor = $('#main-navbar').data('shrinkcolor'),
		navColorschemes = $('#main-navbar').data('colorschemes'),
		navColor = $('#main-navbar').data('color');

	$(window).scroll(function() {
		if ($("#main-navbar").offset().top > 100) {
			$("#main-navbar").removeClass("py-4").removeClass(navColorschemes).removeClass(navColor)
			.addClass("navbar-shrink").addClass(navShrinkColor).addClass(navShrinkColorschemes);
		} else {
			$("#main-navbar").addClass("py-4").removeClass("navbar-shrink").removeClass(navShrinkColor).removeClass(navShrinkColorschemes)
			.addClass(navColorschemes).addClass(navColor);
		}
	});


	// Navbar mega-menu - page.jsFooterInline.5.154 - xl
	if ( $(window).width() < 1200 ) {
		$(".remove-xl").remove();
	} else {
		$(".show-xl").remove();
	}
})(jQuery);