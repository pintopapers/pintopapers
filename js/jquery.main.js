 // page init
jQuery(function(){
	"use strict";
	
	initNavOpener();
	initPreLoader();	
	initStickyHeader();
});

jQuery(window).on('load', function() {
	"use strict";

	initPreLoader();
});

// PreLoader init
function initPreLoader() {
	jQuery('#pre-loader').delay(1200).fadeOut();
}
// NavOpener init
function initNavOpener() {
	jQuery(".side-close , .side-opener , .mt-side-over").click(function(){
		jQuery("body").toggleClass("side-col-active");
		jQuery(".side-opener").toggleClass("active");
		jQuery(".mt-side-over").toggleClass("active");
		return false;
	});
	jQuery(".mobile-toggle").click(function(){
		jQuery("body").toggleClass("mobile-active");
		jQuery(".mobile-toggle").toggleClass("active");
		return false;
	});
}

// sticky header init
function initStickyHeader() {
	var win = jQuery(window),
		stickyClass = 'sticky';

	jQuery('#mt-header').each(function() {
		var header = jQuery(this);
		var headerOffset = header.offset().top || 400;
		var flag = true;


		jQuery(this).css('height' , jQuery(this).innerHeight());

		function scrollHandler() {
			if (win.scrollTop() > headerOffset) {
				if (flag){
					flag = false;
					header.addClass(stickyClass);
				}
			} else {
				if (!flag) {
					flag = true;
					header.removeClass(stickyClass);
				}
			}

			ResponsiveHelper.addRange({
				'..767': {
					on: function() {
						header.removeClass(stickyClass);
					}
				}
			});
		}

		scrollHandler();
		win.on('scroll resize orientationchange', scrollHandler);
	});
}


/*
 * Responsive Layout helper
 */
ResponsiveHelper = (function($){
	// init variables
	var handlers = [],
		prevWinWidth,
		win = $(window),
		nativeMatchMedia = false;

	// detect match media support
	if(window.matchMedia) {
		if(window.Window && window.matchMedia === Window.prototype.matchMedia) {
			nativeMatchMedia = true;
		} else if(window.matchMedia.toString().indexOf('native') > -1) {
			nativeMatchMedia = true;
		}
	}

	// prepare resize handler
	function resizeHandler() {
		var winWidth = win.width();
		if(winWidth !== prevWinWidth) {
			prevWinWidth = winWidth;

			// loop through range groups
			$.each(handlers, function(index, rangeObject){
				// disable current active area if needed
				$.each(rangeObject.data, function(property, item) {
					if(item.currentActive && !matchRange(item.range[0], item.range[1])) {
						item.currentActive = false;
						if(typeof item.disableCallback === 'function') {
							item.disableCallback();
						}
					}
				});

				// enable areas that match current width
				$.each(rangeObject.data, function(property, item) {
					if(!item.currentActive && matchRange(item.range[0], item.range[1])) {
						// make callback
						item.currentActive = true;
						if(typeof item.enableCallback === 'function') {
							item.enableCallback();
						}
					}
				});
			});
		}
	}
	win.bind('load resize orientationchange', resizeHandler);

	// test range
	function matchRange(r1, r2) {
		var mediaQueryString = '';
		if(r1 > 0) {
			mediaQueryString += '(min-width: ' + r1 + 'px)';
		}
		if(r2 < Infinity) {
			mediaQueryString += (mediaQueryString ? ' and ' : '') + '(max-width: ' + r2 + 'px)';	
		}
		return matchQuery(mediaQueryString, r1, r2);
	}

	// media query function
	function matchQuery(query, r1, r2) {
		if(window.matchMedia && nativeMatchMedia) {
			return matchMedia(query).matches;
		} else if(window.styleMedia) {
			return styleMedia.matchMedium(query);
		} else if(window.media) {
			return media.matchMedium(query);
		} else {
			return prevWinWidth >= r1 && prevWinWidth <= r2;
		}
	}

	// range parser
	function parseRange(rangeStr) {
		var rangeData = rangeStr.split('..');
		var x1 = parseInt(rangeData[0], 10) || -Infinity;
		var x2 = parseInt(rangeData[1], 10) || Infinity;
		return [x1, x2].sort(function(a, b){
			return a - b;
		});
	}

	// export public functions
	return {
		addRange: function(ranges) {
			// parse data and add items to collection
			var result = {data:{}};
			$.each(ranges, function(property, data){
				result.data[property] = {
					range: parseRange(property),
					enableCallback: data.on,
					disableCallback: data.off
				};
			});
			handlers.push(result);

			// call resizeHandler to recalculate all events
			prevWinWidth = null;
			resizeHandler();
		}
	};
}(jQuery));

