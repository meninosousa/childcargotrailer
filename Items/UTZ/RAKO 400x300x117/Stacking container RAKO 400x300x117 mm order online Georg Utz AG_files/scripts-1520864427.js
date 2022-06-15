// Vendor namespace
"use strict";

var Snowflake = Snowflake || {};

// Extension namespace
Snowflake.SfpFrontender = Snowflake.SfpFrontender || {};
/*
 * jquery.closestchild 0.1.1
 *
 * Author: Andrey Mikhaylov aka lolmaus
 * Email: lolmaus@gmail.com
 *
 * https://github.com/lolmaus/jquery.closestchild
 */

"use strict";

;(function ($) {
  $.fn.closestChild = function (selector) {
    var $children, $results;

    $children = this.children();

    if ($children.length === 0) return $();

    $results = $children.filter(selector);

    if ($results.length > 0) return $results;else return $children.closestChild(selector);
  };
})(window.jQuery);
'use strict';

;(function ($) {

    var backToTopLink = $('.back-to-top');
    if (backToTopLink.length > 0) {
        var initBackToTop = function initBackToTop() {
            var element = $('#RootlineNavigation').parent(),
                marginTop;

            if (element.length === 0) {
                element = $('#Content');
            }
            marginTop = parseInt(element.css('margin-top'));
            if (isNaN(marginTop)) {
                marginTop = 0;
            }

            $(window).scroll(function () {
                if ($(this).scrollTop() > element.offset().top - marginTop) {
                    $('.back-to-top').fadeIn();
                } else {
                    $('.back-to-top').fadeOut();
                }
            });
            $('.back-to-top').click(function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 500);
                return false;
            });
        };

        initBackToTop();
    }
})(jQuery);
'use strict';

;(function ($) {
    if (!document.cookie.match(/utz_hide_country_selector=[1-9]/)) {
        var wrapElement = $('.country-selection');

        if (wrapElement.length > 0) {
            var selectElement = wrapElement.find('select'),
                textElement = wrapElement.find('p'),
                extraPixels = 110;

            var adjustWidth = function adjustWidth() {
                var bodyWidth = wrapElement.width();

                if (selectElement.offset().left + selectElement.width() + extraPixels > bodyWidth) {
                    textElement.css('max-width', bodyWidth - selectElement.width() - extraPixels + 'px');
                } else {
                    textElement.css('max-width', 0.8 * bodyWidth + 'px');
                }
            };

            $(window).on('resize', function () {
                setTimeout(adjustWidth, 300);
            });

            wrapElement.find('i.fa').on('click', function () {
                document.cookie = 'utz_hide_country_selector=1; path=/; ; expires=' + new Date(Date.now() + 1000 * 10 * 365 * 24 * 60 * 60).toUTCString();
                wrapElement.addClass('hidden');
            });

            selectElement.on('change', function () {
                document.cookie = 'utz_hide_country_selector=1; path=/; ; expires=' + new Date(Date.now() + 1000 * 10 * 365 * 24 * 60 * 60).toUTCString();
                wrapElement.find('form').submit();
            });

            wrapElement.removeClass('hidden');
            adjustWidth();
        }
    }
})(jQuery);
'use strict';

;(function ($) {

    $('.sfp-expanding-text > div').each(function () {
        var container = $(this),
            headers = container.find('> .header');

        headers.prepend('<i class="fa fa-caret-right"></i>');
        headers.click(function () {
            var header = $(this),
                caret = header.find('i'),
                bodyText = $(header.parent().find('> div'));
            bodyText.slideToggle(100);
            if (caret.hasClass('fa-caret-right')) {
                caret.removeClass('fa-caret-right');
                caret.addClass('fa-caret-down');
            } else {
                caret.removeClass('fa-caret-down');
                caret.addClass('fa-caret-right');
            }
        });
    });
})(jQuery);
'use strict';

;(function ($) {

    var mainMenu = $('#MainNavigation'),
        topNavigation = $('.top-nav'),
        verticalPositionForFixedItems = mainMenu.offset().top + mainMenu.height();

    $(window).on('scroll', function () {
        // MSIE11 does not have window.scrollY and uses proprietary window.pageYOffset instead.
        var scrollY = typeof window.scrollY !== 'undefined' ? window.scrollY : window.pageYOffset;
        if (verticalPositionForFixedItems < scrollY) {
            if (!mainMenu.hasClass('fixed')) {
                topNavigation.addClass('fixed');
                mainMenu.addClass('fixed');
            }
        } else {
            if (mainMenu.hasClass('fixed')) {
                topNavigation.removeClass('fixed');
                mainMenu.removeClass('fixed');
            }
        }
    });
})(jQuery);
'use strict';

;(function ($) {

	$(function () {

		// Read labels from the cached file inside the typo3temp folder
		if (typeof Snowflake.SfpFrontender.language !== 'undefined') {
			var loc = document.location;
			$.getJSON(loc.protocol + '//' + loc.host + '/typo3temp/sfppackagelightbox/' + Snowflake.SfpFrontender.language + '.locallang.json', function (data) {
				lightcase.labels = data;
			});
		}

		// Initialize lightcase
		$('[data-rel^=lightcase],.lightcase').lightcase({
			iframe: {
				width: 1280,
				height: 720,
				frameborder: 0
			},
			onFinish: function onFinish() {
				// Remove clickenlarge label from title and replace caption
				var $lightbox = $('#lightcase-case'),
				    $lightboxCaption = $lightbox.find('.lightcase-caption'),
				    caption = lightcase.objectData.$link.parents('.csc-textpic-image').find('.csc-textpic-caption').html();

				$lightboxCaption.html(caption).show();
			}
		});

		// Check if we need to open the gallery on start
		if (document.location.hash.match(/#lightcase_\d+/)) {
			var contentElementId = document.location.hash.replace(/#lightcase_(\d+)/, '$1');
			contentElementId = parseInt(contentElementId);
			if (!isNaN(contentElementId)) {
				var elements = $('[data-rel="lightcase:c' + contentElementId + ':slideshow"]');
				if (elements.length === 0) {
					elements = $('[data-rel="lightcase:c' + contentElementId + '"]');
				}
				if (elements.length > 0) {
					elements.first().click();
				}
			}
		}
	});
})(jQuery);
'use strict';

;(function ($) {

	$(function () {
		var $cscmailform = $('.csc-mailform');
		$cscmailform.find('.csc-form-confirmation').addClass('col-sm-9 col-sm-push-3');
		$cscmailform.find('.csc-form-confirmation-false').find('input').addClass('btn btn-danger');
		$cscmailform.find('.csc-form-confirmation-true').find('input').addClass('btn btn-primary');
	});
})(jQuery);
/* Third level of main navigation */
'use strict';

;(function ($) {

  $(function () {

    $('#MainNavigation li:has(ul)').addClass('has-subnav').each(function () {
      var $li = $(this),
          $a = $('> a', $li);

      $a.on('mouseenter', function () {
        $li.addClass('active');
        $('#MainNavigation ul.nav li ul.third').css('z-index', '0');
        $('#MainNavigation ul.nav li.active li.sub.active ul.third').not('#MainNavigation ul.nav li.active li.sub.active_init ul.third').css('z-index', '1');
      });
      $li.on('mouseleave', function () {
        $li.removeClass('active');
        $li.removeClass('active_init');
      });
    });
  });
})(jQuery);
'use strict';

;(function ($) {

    /**
     * Adds a new navigation part to the current navigation
     * @param navi
     * @param selector
     * @param className
     */
    var addToNav = function addToNav(navi, selector, className, wrap) {
        var $newElement = $(selector).not($(selector+'.hideOnCanvasNav')).clone(true).attr('id', null);
        $newElement.filter('.float-left').removeClass('float-left');
        $newElement.appendTo(navi.find('> ul')).removeClass(className);
        if (wrap) {
            $newElement = $newElement.wrap(wrap).parent();
        }
        $newElement.addClass(className);
    };

    /**
     * Clones all availlable ID's and turn them into mm-{id} so we do not get douplicated ID's
     * @param $navigation
     */
    var cloneIds = function cloneIds($navigation) {
        $navigation.find('[id]').each(function () {
            $(this).attr('id', 'mm-' + $(this).attr('id'));
        });
    };

    /**
     * Remove some classes which makes troubles in mmenu.
     * @param $nav
     */
    var cleanNavClasses = function cleanNavClasses($nav) {
        $nav.find('.dropdown-menu, .dropdown-menu-hover, .navbar-nav').removeClass('dropdown-menu dropdown-menu-hover navbar-nav');
    };

    // Prepare a new navigation structure for offcanvas menu
    var $navigation = $("#MainNavigation").clone(true).attr('id', 'OffcanvasNavigation').removeClass('MainNavigation').addClass('OffcanvasNavigation');

    var $languageNavigation = $("#LanguageNavigation").clone(true).attr('id', 'LanguageNavigation');

    cloneIds($navigation);
    cloneIds($languageNavigation);

    cleanNavClasses($navigation);
    cleanNavClasses($languageNavigation);

    addToNav($navigation, '#MetaNavigation > ul > li', 'MetaNavigation');
    addToNav($navigation, '#LanguageNavigation > ul > li', 'LanguageNavigation');

    // Initialize mmenu
    $navigation.mmenu({
        "extensions": ["effect-menu-slide", "effect-listitems-slide", "shadow-page", "pagedim-black", "border-full"]
    });

    var api = $('#OffcanvasNavigation').data('mmenu');
    var panel = $('#OffcanvasNavigation').find('li.current').filter(function () {
        return $(this).closest('.LanguageNavigation').length === 0;
    }).closest('.mm-panel');

    if (panel.length) {
        api.openPanel(panel);
    }

    //  Due to some reason, not all the classes of the language navigation were
    //  removed at this point. This ensures that all the dropdown stuff is gone.
    $('.mm-panel').find('.dropdown-menu, .dropdown-menu-hover').removeClass('dropdown-menu dropdown-menu-hover');

    // Insert claim text into the offcanvas menu
    $('.topbar-offcanvas-menu').find('.menu').after('<li class="claim">' + $('.Logo').find('.claimlabel').html() + '</li>');
})(jQuery);
/* Modernizr Extend
 * Dependencies	Mordernizr v2.8.3
 *
 * Extends the Modernizr with additional features
 */

// Add box-sizing test
'use strict';

Modernizr.addTest('boxsizing', function () {
  return Modernizr.testAllProps('boxSizing') && (document.documentMode === undefined || document.documentMode > 7);
});
'use strict';

;(function ($) {
    /**
     * Fixes FireFox/Chrome/MSIE columns because they print in "xs" mode and
     * images in the gallery look like "col-xs-12".
     *
     * Problematic URLs:
     * - /en/products/individual-customer-solutions/
     * - /en/utz-group/organisation/
     *
     * Mind the order of adjustments!
     */
    function adjustColumns() {
        $('.fluidcontent_content').closestChild('.col-sm-4').each(function () {
            var element = $(this),
                clazz = element.attr('class');

            if (clazz.indexOf('col-xs-') < 0) {
                element.addClass('col-xs-4');
            }
        });

        // News on Chrome
        $('.sfpNewsArticleBody .col-xs-12').each(function () {
            var element = $(this),
                clazz = element.attr('class');

            element.removeClass('col-xs-12');
            if (clazz.indexOf('col-md-') >= 0) {
                var columnCount = clazz.replace(/.*col-md-(\d+).*/, '$1');
                element.addClass('col-xs-' + columnCount);
            }
        });

        $('.ce-textpic').closestChild('[class^="col-md-"]').each(function () {
            var element = $(this),
                clazz = element.attr('class');

            if (clazz.indexOf('col-xs-') < 0) {
                var columnCount = clazz.replace(/.*col-md-(\d+).*/, '$1');
                element.addClass('col-xs-' + columnCount);
            }
        });

        // /en/products/individual-customer-solutions/
        $('.ce-gallery').closestChild('[class^="col-md-"]').each(function () {
            var element = $(this),
                clazz = element.attr('class');

            if (clazz.indexOf('col-xs-') < 0) {
                var columnCount = clazz.replace(/.*col-md-(\d+).*/, '$1');
                element.addClass('col-xs-' + columnCount);
            }
        });

        $('.TeaserBoxes.col-sm-6').addClass('col-xs-6');
    }

    // Safari is the only browser that does not need ugly hacks.
    if (navigator.userAgent.indexOf('Safari') === -1 || navigator.userAgent.indexOf('Chrome') !== -1) {
        if (window.matchMedia) {
            var mediaQueryList = window.matchMedia('print');
            mediaQueryList.addListener(function (mql) {
                if (mql.matches) {
                    adjustColumns();
                }
            });
        }

        // MSIE way
        window.onbeforeprint = adjustColumns;
    }
})(jQuery);
'use strict';

;(function ($) {

	$('.search-item a').on('click', function (event) {
		var form = $(this).siblings('form');

		form.toggleClass('hidden');

		return false;
	});
})(jQuery);
'use strict';

;(function ($) {

    $(function () {

        $('.slick-slider').slick({
            infinite: true,
            mobileFirst: true,
            prevArrow: '<i class="fa fa-angle-left fa-3x"></i>',
            nextArrow: '<i class="fa fa-angle-right fa-3x"></i>',
            slidesToShow: 7,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 7
                }
            }, {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4
                }
            }, {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3
                }
            }]
        });
    });
})(jQuery);
'use strict';

$(function () {
    'use strict';
    
    /*
    var $teaserBoxElements = $('.csc-element.teaser_boxes'),
        boxes = [];

    $teaserBoxElements.each(function () {
        boxes.push(this);
        if (!$(this).next().hasClass('teaser_boxes')) {
            $(boxes).wrapAll('<div class="teaser_boxes_wrap csc-element"></div>');
            boxes = [];
        }
    });
    $teaserBoxElements.find('.box-2').unwrap();

    // wrap .box-2 teasers pairwise
    $('.box-2:even').each(function () {
        var $this = $(this),
            wrapperMarkup = '<div class="box-2-container"><div class="row box-2-row"></div></div>';
        if ($this.next().hasClass('box-2')) {
            $this.next().addBack().wrapAll(wrapperMarkup);
        } else {
            $this.wrapAll(wrapperMarkup);
        }
    });
    */
});
'use strict';

$(function () {
	$('.timeline').Timeline();
});
"use strict";

;(function ($, window, document, undefined) {

	"use strict";

	var pluginName = "Timeline",
	    defaults = {
		offset: 0.8
	};

	function Plugin(element, options) {
		this.element = element;

		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	$.extend(Plugin.prototype, {
		init: function init() {
			var _this = this;

			var blocks = $(this.element).find('.block');
			this.hideBlocks(blocks, this.settings.offset);

			$(window).on('scroll', function () {
				!window.requestAnimationFrame ? setTimeout(function () {
					_this.showBlocks(blocks, _this.settings.offset);
				}, 100) : window.requestAnimationFrame(function () {
					_this.showBlocks(blocks, _this.settings.offset);
				});
			});
		},

		hideBlocks: function hideBlocks(blocks, offset) {
			blocks.each(function () {
				$(this).offset().top > $(window).scrollTop() + $(window).height() * offset && $(this).find('.marker, .content').addClass('is-hidden');
			});
		},

		showBlocks: function showBlocks(blocks, offset) {
			blocks.each(function () {
				$(this).offset().top <= $(window).scrollTop() + $(window).height() * offset && $(this).find('.marker').hasClass('is-hidden') && $(this).find('.marker, .content').removeClass('is-hidden').addClass('bounce-in');
			});
		}
	});

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};
})(jQuery, window, document);
'use strict';

;(function ($) {
    // Init Waves
    Waves.init();
    Waves.attach('.btn-default', ['waves-light']);
    Waves.attach('.btn-primary', ['waves-light']);
    Waves.attach('.btn-block', ['waves-light']);
    Waves.attach('.btn-block-wide', ['waves-light']);
    Waves.attach('.btn-white-transcluent', ['waves-light']);
})(jQuery);
'use strict';

;(function ($) {

    var minZoomLevel = 2;

    $(function () {
        $('.locations-form select').on('change', function () {
            $('.locations-form').submit();
        });

        function initOffliceLocationsMap() {
            if (officeLocationsMapData.length === 0) {
                $('#googleMap').hide();
            } else {
                var mapOptions = {};
                if (officeLocationsMapData.length === 1) {
                    mapOptions = {
                        center: officeLocationsMapData[0],
                        zoom: 16
                    };
                }
                var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
                map.addListener('zoom_changed', function () {
                    if (map.getZoom() < minZoomLevel) {
                        map.setZoom(minZoomLevel);
                    }
                });

                var markerBounds = new google.maps.LatLngBounds();
                for (var i = 0; i < officeLocationsMapData.length; i++) {
                    var infoWindow, marker;

                    infoWindow = new google.maps.InfoWindow({
                        content: $(officeLocationsMapData[i].infoWindow).html()
                    });

                    marker = new google.maps.Marker({
                        clickable: true,
                        icon: '//maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        map: map,
                        position: officeLocationsMapData[i]
                    });
                    marker.set('anchor', officeLocationsMapData[i].anchor);
                    marker.set('infoWindow', infoWindow);
                    marker.set('timeoutId', undefined);
                    marker.addListener('click', function () {
                        var anchor = $(this.anchor),
                            prev = anchor.prev();
                        if (prev.hasClass('country')) {
                            anchor = prev;
                        }
                        $('html, body').animate({
                            scrollTop: anchor.offset().top
                        }, 500);
                    });
                    marker.addListener('mouseover', function () {
                        var $this = this;
                        this.set('timeoutId', setTimeout(function () {
                            $this.infoWindow.open(map, $this);
                            $this.timeoutId = undefined;
                        }, 200));
                    });

                    marker.addListener('mouseout', function () {
                        if (this.timeoutId != undefined) {
                            clearTimeout(this.timeoutId);
                        }
                        this.infoWindow.close();
                    });

                    markerBounds.extend(new google.maps.LatLng(officeLocationsMapData[i].lat, officeLocationsMapData[i].lng));
                }
                if (officeLocationsMapData.length > 1) {
                    map.fitBounds(markerBounds);
                }
            }
        }

        if (typeof officeLocationsMapData !== 'undefined') {
            initOffliceLocationsMap();
        }
    });
})(jQuery);
'use strict';

;(function ($) {

    $(function () {
        // return here in case that google is not defined
        if (typeof google == 'undefined') return;

        var currentPosition = undefined,
            map,
            directionsDisplay,
            directionsService = new google.maps.DirectionsService();

        function initCurrentPosition() {
            if (navigator.geolocation) {
                // Safari throws non-catchable JS error for location API over insecure connection
                var isSafari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
                if (!isSafari || document.location.protocol === 'https:') {
                    var oldPlaceholder = $('#start_address').attr('placeholder');
                    // Set a message that location is being determined
                    $('#start_address').attr('placeholder', $('#tr_determiningLocation').text());
                    $('#start_address').attr('readonly', '');
                    $('#start_address').val('');
                    $('#directionsSubmitBtn').attr('disabled', '');
                    navigator.geolocation.getCurrentPosition(function (position) {
                        currentPosition = position;
                        // Find the address to fill in the start address textarea
                        $.ajax('/index.php', {
                            cache: false,
                            data: {
                                eID: 'geocoding',
                                language: officeLocationMapData.language,
                                latlng: currentPosition.coords.latitude + ',' + currentPosition.coords.longitude,
                                id: officeLocationMapData.pid
                            },
                            dataType: 'json',
                            xhrFields: {
                                withCredentials: true
                            },
                            complete: function complete() {
                                $('#start_address').attr('placeholder', oldPlaceholder);
                                $('#start_address').removeAttr('readonly');
                                $('#directionsSubmitBtn').removeAttr('disabled');
                            },
                            success: function success(data) {
                                if (data.status === 'OK') {
                                    // Set found address to the start address field
                                    $('#start_address').val(data.address);
                                }
                            }
                        });

                        routeFromLocation();
                    }, function () {
                        // User refused or cannot determine location, reset texts
                        $('#start_address').attr('placeholder', oldPlaceholder);
                        $('#start_address').removeAttr('readonly');
                    }, {
                        timeout: 5000
                    });
                }
            }
        }

        function initMap() {
            map = new google.maps.Map(document.getElementById('googleMap'), {
                center: officeLocationMapData,
                zoom: 16
            });
            new google.maps.Marker({
                clickable: true,
                icon: '//maps.google.com/mapfiles/ms/icons/blue-dot.png', //https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-pin-container-bg_4x.png,icons/onion/SHARED-mymaps-pin-container_4x.png,icons/onion/1899-blank-shape_pin_4x.png&highlight=ff000000,0288D1',
                map: map,
                position: officeLocationMapData
            });

            directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);
        }

        function routeFromAddress() {
            // Find the address to fill in the start address textarea
            $.ajax('/index.php', {
                cache: true,
                data: {
                    address: $('#start_address').val(),
                    eID: 'geocoding',
                    id: officeLocationMapData.pid
                },
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                error: function error() {
                    $('#directionsSubmitBtn').removeAttr('disabled');
                    setRouteInformation($('#tr_noAddress').text());
                },
                success: function success(data) {
                    if (data.status === 'OK') {
                        // Got coordinates, show route
                        currentPosition = {
                            coords: {
                                latitude: data.latitude,
                                longitude: data.longitude
                            }
                        };
                        routeFromLocation();
                    } else {
                        // Something wrong with routing from this address
                        $('#directionsSubmitBtn').removeAttr('disabled');
                        setRouteInformation($('#tr_noAddress').text());
                    }
                }
            });
        }

        function routeFromLocation() {
            var request = {
                origin: new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude),
                destination: new google.maps.LatLng(officeLocationMapData.lat, officeLocationMapData.lng),
                travelMode: $('#method').val()
            };
            directionsService.route(request, function (response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                    setRouteReadableInformation(response.routes[0]);
                } else {
                    setRouteInformation($('#tr_noRouting').text());
                }
                $('#directionsSubmitBtn').removeAttr('disabled');
            });
        }

        function initForm() {
            $('#start_address').change(function () {
                currentPosition = undefined;
            });
            $('#directionsSubmitBtn').click(function () {
                $('#directionsSubmitBtn').attr('disabled', '');
                setRouteInformation($('#tr_searching').text());
                if (currentPosition !== undefined) {
                    routeFromLocation();
                } else {
                    routeFromAddress();
                }
            });
        }

        function setRouteReadableInformation(route) {
            var formattedLegs = '',
                format = $('#tr_steps').html();

            for (var leg = 0; leg < route.legs.length; leg++) {
                var currentLeg = route.legs[leg],
                    extraInfo = '';
                if (typeof currentLeg.distance !== 'undefined') {
                    extraInfo = '' + currentLeg.distance.text;
                }
                if (typeof currentLeg.duration !== 'undefined') {
                    if (extraInfo !== '') {
                        extraInfo += ', ';
                    }
                    extraInfo += currentLeg.duration.text;
                }
                if (extraInfo !== '') {
                    extraInfo = '(' + extraInfo + ')';
                }
                formattedLegs += stringFormat(format, currentLeg.start_address, currentLeg.end_address, extraInfo);
                if (leg !== route.legs.length - 1) {
                    formattedLegs += '<br/>';
                }
            }
            setRouteInformation(formattedLegs);
        }

        function setRouteInformation(message) {
            $('#routeSummary').html(message);
            $('#routeInformation').removeClass('hidden');
        }

        function stringFormat(string) {
            var args = arguments;
            return string.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] !== 'undefined' ? args[number] : match;
            });
        }

        if (typeof officeLocationMapData !== 'undefined') {
            initCurrentPosition();
            initMap();
            initForm();
        }
    });
})(jQuery);