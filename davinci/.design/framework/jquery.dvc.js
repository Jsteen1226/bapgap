/******************************************
 * DaVinci UI Framework
 * 
 * js Revision : 2112
 * 
 ******************************************/
/*
 * Davinci UI Framework (www.davincisdk.com) is made available under the MIT License.
 *
 * Copyright (c) 2012 Incross co., LTD.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
*/
(function($, undefined) {
	$(document).bind("mobileinit", function() {
		console.log("mobileinit - in");
		$.mobile.loadingMessageTextVisible = true;
		if (typeof device !== "undefined") {
			$.mobile.autoInitializePage = false;
		}
		document.addEventListener("deviceready", function() {
			console.log("called deviceready");
			$.mobile.initializePage();
			$.davinci.deviceReady = true;
		});
		document.addEventListener("back", function() {
			if ($.davinci.deviceReady) {
				// body 바로 밑에 있는 page의 .ui-page-active를 찾는다.
				var $page = $("body>.ui-page-active");
				var pageInstance = $page.data("page");
				$page.trigger("ev_back", [pageInstance]);
			}
		});
		$.davinci = {};
		// get Device Info
		getDeviceInfo();
		if ($.davinci.deviceType == "Desktop") {
			$(window).bind("resize", function() {
				var mode = $.event.special.orientationchange.orientation();
				// body 바로 밑에 있는 page의 .ui-page-active를 찾는다.
				var $page = $("body>.ui-page-active");
				$._fnFindActivePagesInPagebox($page).each(function() {
					$._fnSubpageEventGenerate(this, "ev_orientationchange");
				});
				var pageInstance = $page.data("page");
				$page._pageTrigger("ev_orientationchange", [pageInstance, mode]);
			});
		}
		else {
			$(window).bind("orientationchange", function(e) {
				var mode = e.orientation;
				// body 바로 밑에 있는 page의 .ui-page-active를 찾는다.
				var $page = $("body>.ui-page-active");
				$._fnFindActivePagesInPagebox($page).each(function() {
					$._fnSubpageEventGenerate(this, "ev_orientationchange");
				});
				var pageInstance = $page.data("page");
				$page._pageTrigger("ev_orientationchange", [pageInstance, mode]);
			});
		}
		document.addEventListener("notification", function() {
			if ($.davinci.deviceReady) {
				var $page = $(".ui-page:first");
				var param = device.system.event.getParameter("notification");
				var pageInstance = $page.data("page");
				$page.trigger("ev_onnotification", [pageInstance, param]);
			}
		});
		document.addEventListener("push", function() {
			if ($.davinci.deviceReady) {
				var $page = $(".ui-page:first");
				var param = device.system.event.getParameter("push");
				var pageInstance = $page.data("page");
				$page.trigger("ev_onpush", [pageInstance, param]);
			}
		});
		console.log("mobileinit - out");
	});
	function getDeviceInfo() {
		var ua = navigator.userAgent;
		var plaform = navigator.platform;
		var OSNames = ['iOS', 'Android', 'Other'];
		var matches = [];
		matches[0] = ua.match(/(?:i(?:Pad|Phone|Pod)(?:.*)CPU(?: iPhone)? OS )([^\\s;]+)/);
		matches[1] = ua.match(/(?:(Android ))([^\\s;]+)/);
		for (var i = 0; i < matches.length; i++) {
			if (matches[i]) {
				break;
			}
		}
		if (i < matches.length) {
			$.davinci.osName = OSNames[i];
			if (matches[i]) {
				var match = matches[i];
				// 버전확인
				var strVersion = match[match.length - 1];
				var strVersion = strVersion.toLowerCase().replace(/_/g, '.').replace(/[\-+]/g, '');
				var endIndex = strVersion.search(/([^\d\.])/);
				if (endIndex !== -1) {
					$.davinci.osVersion = strVersion.substr(0, endIndex);
				}
				else {
					$.davinci.osVersion = strVersion;
				}
			}
		}
		else {
			$.davinci.osName = OSNames[i];
			$.davinci.osVersion = "";
		}
		if (!($.davinci.osName == 'iOS') && !($.davinci.osName == 'Android') && plaform != "iPad") {
			$.davinci.deviceType = "Desktop";
		}
		else if (plaform == "iPad" || ($.davinci.osName == 'Android' && parseInt($.davinci.osVersion) == 3) || (($.davinci.osName == 'Android' && parseInt($.davinci.osVersion) == 4) && ua.search(/mobile/i) == -1)) {
			$.davinci.deviceType = "Tablet";
		}
		else {
			$.davinci.deviceType = "Phone";
		}
	}
})(jQuery);
/*
* jQuery Mobile Framework 1.1.0 db342b1f315c282692791aa870455901fdb46a55
* http://jquerymobile.com
*
* Copyright 2011 (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/
(function(root, doc, factory) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["jquery"], function($) {
			factory($, root, doc);
			return $.mobile;
		});
	} else {
		// Browser globals
		factory(root.jQuery, root, doc);
	}
}(this, document, function($, window, document, undefined) {
	// This plugin is an experiment for abstracting away the touch and mouse
	// events so that developers don't have to worry about which method of input
	// the device their document is loaded on supports.
	//
	// The idea here is to allow the developer to register listeners for the
	// basic mouse events, such as mousedown, mousemove, mouseup, and click,
	// and the plugin will take care of registering the correct listeners
	// behind the scenes to invoke the listener at the fastest possible time
	// for that device, while still retaining the order of event firing in
	// the traditional mouse environment, should multiple handlers be registered
	// on the same element for different events.
	//
	// The current version exposes the following virtual events to jQuery bind methods:
	// "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel"
	(function($, window, document, undefined) {
		var dataPropertyName = "virtualMouseBindings",
			touchTargetPropertyName = "virtualTouchID",
			virtualEventNames = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),
			touchEventProps = "clientX clientY pageX pageY screenX screenY".split(" "),
			mouseHookProps = $.event.mouseHooks ? $.event.mouseHooks.props : [],
			mouseEventProps = $.event.props.concat(mouseHookProps),
			activeDocHandlers = {},
			resetTimerID = 0,
			startX = 0,
			startY = 0,
			didScroll = false,
			clickBlockList = [],
			blockMouseTriggers = false,
			blockTouchTriggers = false,
			eventCaptureSupported = "addEventListener" in document,
			$document = $(document),
			nextTouchID = 1,
			lastTouchID = 0;
		$.vmouse = {
			moveDistanceThreshold: 10,
			clickDistanceThreshold: 10,
			resetTimerDuration: 1500
		};
		function getNativeEvent(event) {
			while (event && typeof event.originalEvent !== "undefined") {
				event = event.originalEvent;
			}
			return event;
		}
		function createVirtualEvent(event, eventType) {
			var t = event.type,
				oe, props, ne, prop, ct, touch, i, j;
			event = $.Event(event);
			event.type = eventType;
			oe = event.originalEvent;
			props = $.event.props;
			// addresses separation of $.event.props in to $.event.mouseHook.props and Issue 3280
			// https://github.com/jquery/jquery-mobile/issues/3280
			if (t.search(/^(mouse|click)/) > -1) {
				props = mouseEventProps;
			}
			// copy original event properties over to the new event
			// this would happen if we could call $.event.fix instead of $.Event
			// but we don't have a way to force an event to be fixed multiple times
			if (oe) {
				for (i = props.length, prop; i;) {
					prop = props[--i];
					event[prop] = oe[prop];
				}
			}
			// make sure that if the mouse and click virtual events are generated
			// without a .which one is defined
			if (t.search(/mouse(down|up)|click/) > -1 && !event.which) {
				event.which = 1;
			}
			if (t.search(/^touch/) !== -1) {
				ne = getNativeEvent(oe);
				t = ne.touches;
				ct = ne.changedTouches;
				touch = (t && t.length) ? t[0] : ((ct && ct.length) ? ct[0] : undefined);
				if (touch) {
					for (j = 0, len = touchEventProps.length; j < len; j++) {
						prop = touchEventProps[j];
						event[prop] = touch[prop];
					}
				}
			}
			return event;
		}
		function getVirtualBindingFlags(element) {
			var flags = {},
				b, k;
			while (element) {
				b = $.data(element, dataPropertyName);
				for (k in b) {
					if (b[k]) {
						flags[k] = flags.hasVirtualBinding = true;
					}
				}
				element = element.parentNode;
			}
			return flags;
		}
		function getClosestElementWithVirtualBinding(element, eventType) {
			var b;
			while (element) {
				b = $.data(element, dataPropertyName);
				if (b && (!eventType || b[eventType])) {
					return element;
				}
				element = element.parentNode;
			}
			return null;
		}
		function enableTouchBindings() {
			blockTouchTriggers = false;
		}
		function disableTouchBindings() {
			blockTouchTriggers = true;
		}
		function enableMouseBindings() {
			lastTouchID = 0;
			clickBlockList.length = 0;
			blockMouseTriggers = false;
			// When mouse bindings are enabled, our
			// touch bindings are disabled.
			disableTouchBindings();
		}
		function disableMouseBindings() {
			// When mouse bindings are disabled, our
			// touch bindings are enabled.
			enableTouchBindings();
		}
		function startResetTimer() {
			clearResetTimer();
			resetTimerID = setTimeout(function() {
				resetTimerID = 0;
				enableMouseBindings();
			}, $.vmouse.resetTimerDuration);
		}
		function clearResetTimer() {
			if (resetTimerID) {
				clearTimeout(resetTimerID);
				resetTimerID = 0;
			}
		}
		function triggerVirtualEvent(eventType, event, flags) {
			var ve;
			if ((flags && flags[eventType]) || (!flags && getClosestElementWithVirtualBinding(event.target, eventType))) {
				ve = createVirtualEvent(event, eventType);
				$(event.target).trigger(ve);
			}
			return ve;
		}
		function mouseEventCallback(event) {
			var touchID = $.data(event.target, touchTargetPropertyName);
			if (!blockMouseTriggers && (!lastTouchID || lastTouchID !== touchID)) {
				var ve = triggerVirtualEvent("v" + event.type, event);
				if (ve) {
					if (ve.isDefaultPrevented()) {
						event.preventDefault();
					}
					if (ve.isPropagationStopped()) {
						event.stopPropagation();
					}
					if (ve.isImmediatePropagationStopped()) {
						event.stopImmediatePropagation();
					}
				}
			}
		}
		function handleTouchStart(event) {
			var touches = getNativeEvent(event).touches,
				target, flags;
			if (touches && touches.length === 1) {
				target = event.target;
				flags = getVirtualBindingFlags(target);
				if (flags.hasVirtualBinding) {
					lastTouchID = nextTouchID++;
					$.data(target, touchTargetPropertyName, lastTouchID);
					clearResetTimer();
					disableMouseBindings();
					didScroll = false;
					var t = getNativeEvent(event).touches[0];
					startX = t.pageX;
					startY = t.pageY;
					triggerVirtualEvent("vmouseover", event, flags);
					triggerVirtualEvent("vmousedown", event, flags);
				}
			}
		}
		function handleScroll(event) {
			if (blockTouchTriggers) {
				return;
			}
			if (!didScroll) {
				triggerVirtualEvent("vmousecancel", event, getVirtualBindingFlags(event.target));
			}
			didScroll = true;
			startResetTimer();
		}
		function handleTouchMove(event) {
			if (blockTouchTriggers) {
				return;
			}
			var t = getNativeEvent(event).touches[0],
				didCancel = didScroll,
				moveThreshold = $.vmouse.moveDistanceThreshold;
			didScroll = didScroll || (Math.abs(t.pageX - startX) > moveThreshold || Math.abs(t.pageY - startY) > moveThreshold), flags = getVirtualBindingFlags(event.target);
			if (didScroll && !didCancel) {
				triggerVirtualEvent("vmousecancel", event, flags);
			}
			triggerVirtualEvent("vmousemove", event, flags);
			startResetTimer();
		}
		function handleTouchEnd(event) {
			if (blockTouchTriggers) {
				return;
			}
			disableTouchBindings();
			var flags = getVirtualBindingFlags(event.target),
				t;
			triggerVirtualEvent("vmouseup", event, flags);
			if (!didScroll) {
				var ve = triggerVirtualEvent("vclick", event, flags);
				if (ve && ve.isDefaultPrevented()) {
					// The target of the mouse events that follow the touchend
					// event don't necessarily match the target used during the
					// touch. This means we need to rely on coordinates for blocking
					// any click that is generated.
					t = getNativeEvent(event).changedTouches[0];
					clickBlockList.push({
						touchID: lastTouchID,
						x: t.clientX,
						y: t.clientY
					});
					// Prevent any mouse events that follow from triggering
					// virtual event notifications.
					blockMouseTriggers = true;
				}
			}
			triggerVirtualEvent("vmouseout", event, flags);
			didScroll = false;
			startResetTimer();
		}
		function hasVirtualBindings(ele) {
			var bindings = $.data(ele, dataPropertyName),
				k;
			if (bindings) {
				for (k in bindings) {
					if (bindings[k]) {
						return true;
					}
				}
			}
			return false;
		}
		function dummyMouseHandler() {}
		function getSpecialEventObject(eventType) {
			var realType = eventType.substr(1);
			return {
				setup: function(data, namespace) {
					// If this is the first virtual mouse binding for this element,
					// add a bindings object to its data.
					if (!hasVirtualBindings(this)) {
						$.data(this, dataPropertyName, {});
					}
					// If setup is called, we know it is the first binding for this
					// eventType, so initialize the count for the eventType to zero.
					var bindings = $.data(this, dataPropertyName);
					bindings[eventType] = true;
					// If this is the first virtual mouse event for this type,
					// register a global handler on the document.
					activeDocHandlers[eventType] = (activeDocHandlers[eventType] || 0) + 1;
					if (activeDocHandlers[eventType] === 1) {
						$document.bind(realType, mouseEventCallback);
					}
					// Some browsers, like Opera Mini, won't dispatch mouse/click events
					// for elements unless they actually have handlers registered on them.
					// To get around this, we register dummy handlers on the elements.
					$(this).bind(realType, dummyMouseHandler);
					// For now, if event capture is not supported, we rely on mouse handlers.
					if (eventCaptureSupported) {
						// If this is the first virtual mouse binding for the document,
						// register our touchstart handler on the document.
						activeDocHandlers["touchstart"] = (activeDocHandlers["touchstart"] || 0) + 1;
						if (activeDocHandlers["touchstart"] === 1) {
							$document.bind("touchstart", handleTouchStart).bind("touchend", handleTouchEnd)
							// On touch platforms, touching the screen and then dragging your finger
							// causes the window content to scroll after some distance threshold is
							// exceeded. On these platforms, a scroll prevents a click event from being
							// dispatched, and on some platforms, even the touchend is suppressed. To
							// mimic the suppression of the click event, we need to watch for a scroll
							// event. Unfortunately, some platforms like iOS don't dispatch scroll
							// events until *AFTER* the user lifts their finger (touchend). This means
							// we need to watch both scroll and touchmove events to figure out whether
							// or not a scroll happenens before the touchend event is fired.
							.bind("touchmove", handleTouchMove).bind("scroll", handleScroll);
						}
					}
				},
				teardown: function(data, namespace) {
					// If this is the last virtual binding for this eventType,
					// remove its global handler from the document.
					--activeDocHandlers[eventType];
					if (!activeDocHandlers[eventType]) {
						$document.unbind(realType, mouseEventCallback);
					}
					if (eventCaptureSupported) {
						// If this is the last virtual mouse binding in existence,
						// remove our document touchstart listener.
						--activeDocHandlers["touchstart"];
						if (!activeDocHandlers["touchstart"]) {
							$document.unbind("touchstart", handleTouchStart).unbind("touchmove", handleTouchMove).unbind("touchend", handleTouchEnd).unbind("scroll", handleScroll);
						}
					}
					var $this = $(this),
						bindings = $.data(this, dataPropertyName);
					// teardown may be called when an element was
					// removed from the DOM. If this is the case,
					// jQuery core may have already stripped the element
					// of any data bindings so we need to check it before
					// using it.
					if (bindings) {
						bindings[eventType] = false;
					}
					// Unregister the dummy event handler.
					$this.unbind(realType, dummyMouseHandler);
					// If this is the last virtual mouse binding on the
					// element, remove the binding data from the element.
					if (!hasVirtualBindings(this)) {
						$this.removeData(dataPropertyName);
					}
				}
			};
		}
		// Expose our custom events to the jQuery bind/unbind mechanism.
		for (var i = 0; i < virtualEventNames.length; i++) {
			$.event.special[virtualEventNames[i]] = getSpecialEventObject(virtualEventNames[i]);
		}
		// Add a capture click handler to block clicks.
		// Note that we require event capture support for this so if the device
		// doesn't support it, we punt for now and rely solely on mouse events.
		if (eventCaptureSupported) {
			document.addEventListener("click", function(e) {
				var cnt = clickBlockList.length,
					target = e.target,
					x, y, ele, i, o, touchID;
				if (cnt) {
					x = e.clientX;
					y = e.clientY;
					threshold = $.vmouse.clickDistanceThreshold;
					// The idea here is to run through the clickBlockList to see if
					// the current click event is in the proximity of one of our
					// vclick events that had preventDefault() called on it. If we find
					// one, then we block the click.
					//
					// Why do we have to rely on proximity?
					//
					// Because the target of the touch event that triggered the vclick
					// can be different from the target of the click event synthesized
					// by the browser. The target of a mouse/click event that is syntehsized
					// from a touch event seems to be implementation specific. For example,
					// some browsers will fire mouse/click events for a link that is near
					// a touch event, even though the target of the touchstart/touchend event
					// says the user touched outside the link. Also, it seems that with most
					// browsers, the target of the mouse/click event is not calculated until the
					// time it is dispatched, so if you replace an element that you touched
					// with another element, the target of the mouse/click will be the new
					// element underneath that point.
					//
					// Aside from proximity, we also check to see if the target and any
					// of its ancestors were the ones that blocked a click. This is necessary
					// because of the strange mouse/click target calculation done in the
					// Android 2.1 browser, where if you click on an element, and there is a
					// mouse/click handler on one of its ancestors, the target will be the
					// innermost child of the touched element, even if that child is no where
					// near the point of touch.
					ele = target;
					while (ele) {
						for (i = 0; i < cnt; i++) {
							o = clickBlockList[i];
							touchID = 0;
							if ((ele === target && Math.abs(o.x - x) < threshold && Math.abs(o.y - y) < threshold) || $.data(ele, touchTargetPropertyName) === o.touchID) {
								// XXX: We may want to consider removing matches from the block list
								//      instead of waiting for the reset timer to fire.
								e.preventDefault();
								e.stopPropagation();
								return;
							}
						}
						ele = ele.parentNode;
					}
				}
			}, true);
		}
	})(jQuery, window, document);
	// Script: jQuery hashchange event
	// 
	// *Version: 1.3, Last updated: 7/21/2010*
	// 
	// Project Home - http://benalman.com/projects/jquery-hashchange-plugin/
	// GitHub       - http://github.com/cowboy/jquery-hashchange/
	// Source       - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.js
	// (Minified)   - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.min.js (0.8kb gzipped)
	// 
	// About: License
	// 
	// Copyright (c) 2010 "Cowboy" Ben Alman,
	// Dual licensed under the MIT and GPL licenses.
	// http://benalman.com/about/license/
	// 
	// About: Examples
	// 
	// These working examples, complete with fully commented code, illustrate a few
	// ways in which this plugin can be used.
	// 
	// hashchange event - http://benalman.com/code/projects/jquery-hashchange/examples/hashchange/
	// document.domain - http://benalman.com/code/projects/jquery-hashchange/examples/document_domain/
	// 
	// About: Support and Testing
	// 
	// Information about what version or versions of jQuery this plugin has been
	// tested with, what browsers it has been tested in, and where the unit tests
	// reside (so you can test it yourself).
	// 
	// jQuery Versions - 1.2.6, 1.3.2, 1.4.1, 1.4.2
	// Browsers Tested - Internet Explorer 6-8, Firefox 2-4, Chrome 5-6, Safari 3.2-5,
	//                   Opera 9.6-10.60, iPhone 3.1, Android 1.6-2.2, BlackBerry 4.6-5.
	// Unit Tests      - http://benalman.com/code/projects/jquery-hashchange/unit/
	// 
	// About: Known issues
	// 
	// While this jQuery hashchange event implementation is quite stable and
	// robust, there are a few unfortunate browser bugs surrounding expected
	// hashchange event-based behaviors, independent of any JavaScript
	// window.onhashchange abstraction. See the following examples for more
	// information:
	// 
	// Chrome: Back Button - http://benalman.com/code/projects/jquery-hashchange/examples/bug-chrome-back-button/
	// Firefox: Remote XMLHttpRequest - http://benalman.com/code/projects/jquery-hashchange/examples/bug-firefox-remote-xhr/
	// WebKit: Back Button in an Iframe - http://benalman.com/code/projects/jquery-hashchange/examples/bug-webkit-hash-iframe/
	// Safari: Back Button from a different domain - http://benalman.com/code/projects/jquery-hashchange/examples/bug-safari-back-from-diff-domain/
	// 
	// Also note that should a browser natively support the window.onhashchange 
	// event, but not report that it does, the fallback polling loop will be used.
	// 
	// About: Release History
	// 
	// 1.3   - (7/21/2010) Reorganized IE6/7 Iframe code to make it more
	//         "removable" for mobile-only development. Added IE6/7 document.title
	//         support. Attempted to make Iframe as hidden as possible by using
	//         techniques from http://www.paciellogroup.com/blog/?p=604. Added 
	//         support for the "shortcut" format $(window).hashchange( fn ) and
	//         $(window).hashchange() like jQuery provides for built-in events.
	//         Renamed jQuery.hashchangeDelay to <jQuery.fn.hashchange.delay> and
	//         lowered its default value to 50. Added <jQuery.fn.hashchange.domain>
	//         and <jQuery.fn.hashchange.src> properties plus document-domain.html
	//         file to address access denied issues when setting document.domain in
	//         IE6/7.
	// 1.2   - (2/11/2010) Fixed a bug where coming back to a page using this plugin
	//         from a page on another domain would cause an error in Safari 4. Also,
	//         IE6/7 Iframe is now inserted after the body (this actually works),
	//         which prevents the page from scrolling when the event is first bound.
	//         Event can also now be bound before DOM ready, but it won't be usable
	//         before then in IE6/7.
	// 1.1   - (1/21/2010) Incorporated document.documentMode test to fix IE8 bug
	//         where browser version is incorrectly reported as 8.0, despite
	//         inclusion of the X-UA-Compatible IE=EmulateIE7 meta tag.
	// 1.0   - (1/9/2010) Initial Release. Broke out the jQuery BBQ event.special
	//         window.onhashchange functionality into a separate plugin for users
	//         who want just the basic event & back button support, without all the
	//         extra awesomeness that BBQ provides. This plugin will be included as
	//         part of jQuery BBQ, but also be available separately.
	(function($, window, undefined) {
		// Reused string.
		var str_hashchange = 'hashchange',
			// Method / object references.
			doc = document,
			fake_onhashchange, special = $.event.special,
			// Does the browser support window.onhashchange? Note that IE8 running in
			// IE7 compatibility mode reports true for 'onhashchange' in window, even
			// though the event isn't supported, so also test document.documentMode.
			doc_mode = doc.documentMode,
			supports_onhashchange = 'on' + str_hashchange in window && (doc_mode === undefined || doc_mode > 7);
		// Get location.hash (or what you'd expect location.hash to be) sans any
		// leading #. Thanks for making this necessary, Firefox!


		function get_fragment(url) {
			url = url || location.href;
			return '#' + url.replace(/^[^#]*#?(.*)$/, '$1');
		};
		// Method: jQuery.fn.hashchange
		// 
		// Bind a handler to the window.onhashchange event or trigger all bound
		// window.onhashchange event handlers. This behavior is consistent with
		// jQuery's built-in event handlers.
		// 
		// Usage:
		// 
		// > jQuery(window).hashchange( [ handler ] );
		// 
		// Arguments:
		// 
		//  handler - (Function) Optional handler to be bound to the hashchange
		//    event. This is a "shortcut" for the more verbose form:
		//    jQuery(window).bind( 'hashchange', handler ). If handler is omitted,
		//    all bound window.onhashchange event handlers will be triggered. This
		//    is a shortcut for the more verbose
		//    jQuery(window).trigger( 'hashchange' ). These forms are described in
		//    the <hashchange event> section.
		// 
		// Returns:
		// 
		//  (jQuery) The initial jQuery collection of elements.
		// Allow the "shortcut" format $(elem).hashchange( fn ) for binding and
		// $(elem).hashchange() for triggering, like jQuery does for built-in events.
		$.fn[str_hashchange] = function(fn) {
			return fn ? this.bind(str_hashchange, fn) : this.trigger(str_hashchange);
		};
		// Property: jQuery.fn.hashchange.delay
		// 
		// The numeric interval (in milliseconds) at which the <hashchange event>
		// polling loop executes. Defaults to 50.
		// Property: jQuery.fn.hashchange.domain
		// 
		// If you're setting document.domain in your JavaScript, and you want hash
		// history to work in IE6/7, not only must this property be set, but you must
		// also set document.domain BEFORE jQuery is loaded into the page. This
		// property is only applicable if you are supporting IE6/7 (or IE8 operating
		// in "IE7 compatibility" mode).
		// 
		// In addition, the <jQuery.fn.hashchange.src> property must be set to the
		// path of the included "document-domain.html" file, which can be renamed or
		// modified if necessary (note that the document.domain specified must be the
		// same in both your main JavaScript as well as in this file).
		// 
		// Usage:
		// 
		// jQuery.fn.hashchange.domain = document.domain;
		// Property: jQuery.fn.hashchange.src
		// 
		// If, for some reason, you need to specify an Iframe src file (for example,
		// when setting document.domain as in <jQuery.fn.hashchange.domain>), you can
		// do so using this property. Note that when using this property, history
		// won't be recorded in IE6/7 until the Iframe src file loads. This property
		// is only applicable if you are supporting IE6/7 (or IE8 operating in "IE7
		// compatibility" mode).
		// 
		// Usage:
		// 
		// jQuery.fn.hashchange.src = 'path/to/file.html';
		$.fn[str_hashchange].delay = 50;
/*
  $.fn[ str_hashchange ].domain = null;
  $.fn[ str_hashchange ].src = null;
  */
		// Event: hashchange event
		// 
		// Fired when location.hash changes. In browsers that support it, the native
		// HTML5 window.onhashchange event is used, otherwise a polling loop is
		// initialized, running every <jQuery.fn.hashchange.delay> milliseconds to
		// see if the hash has changed. In IE6/7 (and IE8 operating in "IE7
		// compatibility" mode), a hidden Iframe is created to allow the back button
		// and hash-based history to work.
		// 
		// Usage as described in <jQuery.fn.hashchange>:
		// 
		// > // Bind an event handler.
		// > jQuery(window).hashchange( function(e) {
		// >   var hash = location.hash;
		// >   ...
		// > });
		// > 
		// > // Manually trigger the event handler.
		// > jQuery(window).hashchange();
		// 
		// A more verbose usage that allows for event namespacing:
		// 
		// > // Bind an event handler.
		// > jQuery(window).bind( 'hashchange', function(e) {
		// >   var hash = location.hash;
		// >   ...
		// > });
		// > 
		// > // Manually trigger the event handler.
		// > jQuery(window).trigger( 'hashchange' );
		// 
		// Additional Notes:
		// 
		// * The polling loop and Iframe are not created until at least one handler
		//   is actually bound to the 'hashchange' event.
		// * If you need the bound handler(s) to execute immediately, in cases where
		//   a location.hash exists on page load, via bookmark or page refresh for
		//   example, use jQuery(window).hashchange() or the more verbose 
		//   jQuery(window).trigger( 'hashchange' ).
		// * The event can be bound before DOM ready, but since it won't be usable
		//   before then in IE6/7 (due to the necessary Iframe), recommended usage is
		//   to bind it inside a DOM ready handler.
		// Override existing $.event.special.hashchange methods (allowing this plugin
		// to be defined after jQuery BBQ in BBQ's source code).
		special[str_hashchange] = $.extend(special[str_hashchange], {
			// Called only when the first 'hashchange' event is bound to window.
			setup: function() {
				// If window.onhashchange is supported natively, there's nothing to do..
				if (supports_onhashchange) {
					return false;
				}
				// Otherwise, we need to create our own. And we don't want to call this
				// until the user binds to the event, just in case they never do, since it
				// will create a polling loop and possibly even a hidden Iframe.
				$(fake_onhashchange.start);
			},
			// Called only when the last 'hashchange' event is unbound from window.
			teardown: function() {
				// If window.onhashchange is supported natively, there's nothing to do..
				if (supports_onhashchange) {
					return false;
				}
				// Otherwise, we need to stop ours (if possible).
				$(fake_onhashchange.stop);
			}
		});
		// fake_onhashchange does all the work of triggering the window.onhashchange
		// event for browsers that don't natively support it, including creating a
		// polling loop to watch for hash changes and in IE 6/7 creating a hidden
		// Iframe to enable back and forward.
		fake_onhashchange = (function() {
			var self = {},
				timeout_id,
				// Remember the initial hash so it doesn't get triggered immediately.
				last_hash = get_fragment(),
				fn_retval = function(val) {
					return val;
				},
				history_set = fn_retval,
				history_get = fn_retval;
			// Start the polling loop.
			self.start = function() {
				timeout_id || poll();
			};
			// Stop the polling loop.
			self.stop = function() {
				timeout_id && clearTimeout(timeout_id);
				timeout_id = undefined;
			};
			// This polling loop checks every $.fn.hashchange.delay milliseconds to see
			// if location.hash has changed, and triggers the 'hashchange' event on
			// window when necessary.


			function poll() {
				var hash = get_fragment(),
					history_hash = history_get(last_hash);
				if (hash !== last_hash) {
					history_set(last_hash = hash, history_hash);
					$(window).trigger(str_hashchange);
				} else if (history_hash !== last_hash) {
					location.href = location.href.replace(/#.*/, '') + history_hash;
				}
				timeout_id = setTimeout(poll, $.fn[str_hashchange].delay);
			};
			// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
			// vvvvvvvvvvvvvvvvvvv REMOVE IF NOT SUPPORTING IE6/7/8 vvvvvvvvvvvvvvvvvvv
			// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
			$.browser.msie && !supports_onhashchange && (function() {
				// Not only do IE6/7 need the "magical" Iframe treatment, but so does IE8
				// when running in "IE7 compatibility" mode.
				var iframe, iframe_src;
				// When the event is bound and polling starts in IE 6/7, create a hidden
				// Iframe for history handling.
				self.start = function() {
					if (!iframe) {
						iframe_src = $.fn[str_hashchange].src;
						iframe_src = iframe_src && iframe_src + get_fragment();
						// Create hidden Iframe. Attempt to make Iframe as hidden as possible
						// by using techniques from http://www.paciellogroup.com/blog/?p=604.
						iframe = $('<iframe tabindex="-1" title="empty"/>').hide()
						// When Iframe has completely loaded, initialize the history and
						// start polling.
						.one('load', function() {
							iframe_src || history_set(get_fragment());
							poll();
						})
						// Load Iframe src if specified, otherwise nothing.
						.attr('src', iframe_src || 'javascript:0')
						// Append Iframe after the end of the body to prevent unnecessary
						// initial page scrolling (yes, this works).
						.insertAfter('body')[0].contentWindow;
						// Whenever `document.title` changes, update the Iframe's title to
						// prettify the back/next history menu entries. Since IE sometimes
						// errors with "Unspecified error" the very first time this is set
						// (yes, very useful) wrap this with a try/catch block.
						doc.onpropertychange = function() {
							try {
								if (event.propertyName === 'title') {
									iframe.document.title = doc.title;
								}
							} catch (e) {}
						};
					}
				};
				// Override the "stop" method since an IE6/7 Iframe was created. Even
				// if there are no longer any bound event handlers, the polling loop
				// is still necessary for back/next to work at all!
				self.stop = fn_retval;
				// Get history by looking at the hidden Iframe's location.hash.
				history_get = function() {
					return get_fragment(iframe.location.href);
				};
				// Set a new history item by opening and then closing the Iframe
				// document, *then* setting its location.hash. If document.domain has
				// been set, update that as well.
				history_set = function(hash, history_hash) {
					var iframe_doc = iframe.document,
						domain = $.fn[str_hashchange].domain;
					if (hash !== history_hash) {
						// Update Iframe with any initial `document.title` that might be set.
						iframe_doc.title = doc.title;
						// Opening the Iframe's document after it has been closed is what
						// actually adds a history entry.
						iframe_doc.open();
						// Set document.domain for the Iframe document as well, if necessary.
						domain && iframe_doc.write('<script>document.domain="' + domain + '"</script>');
						iframe_doc.close();
						// Update the Iframe's hash, for great justice.
						iframe.location.hash = hash;
					}
				};
			})();
			// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
			// ^^^^^^^^^^^^^^^^^^^ REMOVE IF NOT SUPPORTING IE6/7/8 ^^^^^^^^^^^^^^^^^^^
			// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
			return self;
		})();
	})(jQuery, this);
/*!
 * jQuery UI Widget @VERSION
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
	(function($, undefined) {
		// jQuery 1.4+
		if ($.cleanData) {
			var _cleanData = $.cleanData;
			$.cleanData = function(elems) {
				for (var i = 0, elem;
				(elem = elems[i]) != null; i++) {
					$(elem).triggerHandler("remove");
				}
				_cleanData(elems);
			};
		} else {
			var _remove = $.fn.remove;
			$.fn.remove = function(selector, keepData) {
				return this.each(function() {
					if (!keepData) {
						if (!selector || $.filter(selector, [this]).length) {
							$("*", this).add([this]).each(function() {
								$(this).triggerHandler("remove");
							});
						}
					}
					return _remove.call($(this), selector, keepData);
				});
			};
		}
		$.widget = function(name, base, prototype) {
			var namespace = name.split(".")[0],
				fullName;
			name = name.split(".")[1];
			fullName = namespace + "-" + name;
			if (!prototype) {
				prototype = base;
				base = $.Widget;
			}
			// create selector for plugin
			$.expr[":"][fullName] = function(elem) {
				return !!$.data(elem, name);
			};
			$[namespace] = $[namespace] || {};
			$[namespace][name] = function(options, element) {
				// allow instantiation without initializing for simple inheritance
				if (arguments.length) {
					this._createWidget(options, element);
				}
			};
			var basePrototype = new base();
			// we need to make the options hash a property directly on the new instance
			// otherwise we'll modify the options hash on the prototype that we're
			// inheriting from
			//	$.each( basePrototype, function( key, val ) {
			//		if ( $.isPlainObject(val) ) {
			//			basePrototype[ key ] = $.extend( {}, val );
			//		}
			//	});
			basePrototype.options = $.extend(true, {}, basePrototype.options);
			// davinci widget has classes - ysjung(2012/06/13)
			basePrototype.classes = $.extend(true, {}, basePrototype.classes);
			$[namespace][name].prototype = $.extend(true, basePrototype, {
				namespace: namespace,
				widgetName: name,
				widgetEventPrefix: $[namespace][name].prototype.widgetEventPrefix || name,
				widgetBaseClass: fullName
			}, prototype);
			$.widget.bridge(name, $[namespace][name]);
		};
		$.widget.bridge = function(name, object) {
			$.fn[name] = function(options) {
				var isMethodCall = typeof options === "string",
					args = Array.prototype.slice.call(arguments, 1),
					returnValue = this;
				// allow multiple hashes to be passed on init
				options = !isMethodCall && args.length ? $.extend.apply(null, [true, options].concat(args)) : options;
				// prevent calls to internal methods
				if (isMethodCall && options.charAt(0) === "_") {
					return returnValue;
				}
				if (isMethodCall) {
					this.each(function() {
						var instance = $.data(this, name);
						if (!instance) {
							throw "cannot call methods on " + name + " prior to initialization; " + "attempted to call method '" + options + "'";
						}
						if (!$.isFunction(instance[options])) {
							throw "no such method '" + options + "' for " + name + " widget instance";
						}
						var methodValue = instance[options].apply(instance, args);
						if (methodValue !== instance && methodValue !== undefined) {
							returnValue = methodValue;
							return false;
						}
					});
				} else {
					this.each(function() {
						var instance = $.data(this, name);
						if (instance) {
							instance.option(options || {})._init();
						} else {
							$.data(this, name, new object(options, this));
						}
					});
				}
				return returnValue;
			};
		};
		$.Widget = function(options, element) {
			// allow instantiation without initializing for simple inheritance
			if (arguments.length) {
				this._createWidget(options, element);
			}
		};
		$.Widget.prototype = {
			widgetName: "widget",
			widgetEventPrefix: "",
			options: {
				disabled: false
			},
			_createWidget: function(options, element) {
				// $.widget.bridge stores the plugin instance, but we do it anyway
				// so that it's stored even before the _create function runs
				$.data(element, this.widgetName, this);
				this.element = $(element);
				this.options = $.extend(true, {}, this.options, this._getCreateOptions(), options);
				var self = this;
				this.element.bind("remove." + this.widgetName, function() {
					self.destroy();
				});
				this._create();
				this._trigger("create");
				this._init();
			},
			_getCreateOptions: function() {
				var options = {};
				if ($.metadata) {
					options = $.metadata.get(element)[this.widgetName];
				}
				return options;
			},
			_create: function() {},
			_init: function() {},
			destroy: function() {
				this.element.unbind("." + this.widgetName).removeData(this.widgetName);
				this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(
				this.widgetBaseClass + "-disabled " + "ui-state-disabled");
			},
			widget: function() {
				return this.element;
			},
			option: function(key, value) {
				var options = key;
				if (arguments.length === 0) {
					// don't return a reference to the internal hash
					return $.extend({}, this.options);
				}
				if (typeof key === "string") {
					if (value === undefined) {
						return this.options[key];
					}
					options = {};
					options[key] = value;
				}
				this._setOptions(options);
				return this;
			},
			_setOptions: function(options) {
				var self = this;
				$.each(options, function(key, value) {
					self._setOption(key, value);
				});
				return this;
			},
			_setOption: function(key, value) {
				this.options[key] = value;
				if (key === "disabled") {
					this.widget()[value ? "addClass" : "removeClass"](
					this.widgetBaseClass + "-disabled" + " " + "ui-state-disabled").attr("aria-disabled", value);
				}
				return this;
			},
			enable: function() {
				return this._setOption("disabled", false);
			},
			disable: function() {
				return this._setOption("disabled", true);
			},
			_trigger: function(type, event, data) {
				var callback = this.options[type];
				event = $.Event(event);
				event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase();
				data = data || {};
				// copy original event properties over to the new event
				// this would happen if we could call $.event.fix instead of $.Event
				// but we don't have a way to force an event to be fixed multiple times
				if (event.originalEvent) {
					for (var i = $.event.props.length, prop; i;) {
						prop = $.event.props[--i];
						event[prop] = event.originalEvent[prop];
					}
				}
				this.element.trigger(event, data);
				return !($.isFunction(callback) && callback.call(this.element[0], event, data) === false || event.isDefaultPrevented());
			}
		};
	})(jQuery);
	(function($, undefined) {
		$.widget("mobile.widget", {
			// decorate the parent _createWidget to trigger `widgetinit` for users
			// who wish to do post post `widgetcreate` alterations/additions
			//
			// TODO create a pull request for jquery ui to trigger this event
			// in the original _createWidget
			_createWidget: function() {
				$.Widget.prototype._createWidget.apply(this, arguments);
				this._trigger('init');
			},
			_getCreateOptions: function() {
				var elem = this.element,
					options = {};
				$.each(this.options, function(option) {
					var value = elem.jqmData(option.replace(/[A-Z]/g, function(c) {
						return "-" + c.toLowerCase();
					}));
					if (value !== undefined) {
						options[option] = value;
					}
				});
				return options;
			},
			enhanceWithin: function(target, useKeepNative) {
				this.enhance($(this.options.initSelector, $(target)), useKeepNative);
			},
			enhance: function(targets, useKeepNative) {
				var page, keepNative, $widgetElements = $(targets),
					self = this;
				// if ignoreContentEnabled is set to true the framework should
				// only enhance the selected elements when they do NOT have a
				// parent with the data-namespace-ignore attribute
				$widgetElements = $.mobile.enhanceable($widgetElements);
				if (useKeepNative && $widgetElements.length) {
					// TODO remove dependency on the page widget for the keepNative.
					// Currently the keepNative value is defined on the page prototype so
					// the method is as well
					page = $.mobile.closestPageData($widgetElements);
					keepNative = (page && page.keepNativeSelector()) || "";
					$widgetElements = $widgetElements.not(keepNative);
				}
				$widgetElements[this.widgetName]();
			},
			raise: function(msg) {
				throw "Widget [" + this.widgetName + "]: " + msg;
			}
		});
	})(jQuery);
	(function($, window, undefined) {
		var nsNormalizeDict = {};
		// jQuery.mobile configurable options
		$.mobile = $.extend({}, {
			// Version of the jQuery Mobile Framework
			version: "1.1.0",
			// Namespace used framework-wide for data-attrs. Default is no namespace
			ns: "",
			// Define the url parameter used for referencing widget-generated sub-pages.
			// Translates to to example.html&ui-page=subpageIdentifier
			// hash segment before &ui-page= is used to make Ajax request
			subPageUrlKey: "ui-page",
			// Class assigned to page currently in view, and during transitions
			activePageClass: "ui-page-active",
			// Class used for "active" button state, from CSS framework
			activeBtnClass: "ui-btn-active",
			// Class used for "focus" form element state, from CSS framework
			focusClass: "ui-focus",
			// Automatically handle clicks and form submissions through Ajax, when same-domain
			ajaxEnabled: true,
			// Automatically load and show pages based on location.hash
			hashListeningEnabled: true,
			// disable to prevent jquery from bothering with links
			linkBindingEnabled: true,
			// Set default page transition - 'none' for no transitions
			defaultPageTransition: "fade",
			// Set maximum window width for transitions to apply - 'false' for no limit
			maxTransitionWidth: false,
			// Minimum scroll distance that will be remembered when returning to a page
			minScrollBack: 250,
			// DEPRECATED: the following property is no longer in use, but defined until 2.0 to prevent conflicts
			touchOverflowEnabled: false,
			// Set default dialog transition - 'none' for no transitions
			defaultDialogTransition: "pop",
			// Show loading message during Ajax requests
			// if false, message will not appear, but loading classes will still be toggled on html el
			loadingMessage: "loading",
			// Error response message - appears when an Ajax page request fails
			pageLoadErrorMessage: "Error Loading Page",
			// Should the text be visble in the loading message?
			loadingMessageTextVisible: false,
			// When the text is visible, what theme does the loading box use?
			loadingMessageTheme: "a",
			// For error messages, which theme does the box uses?
			pageLoadErrorMessageTheme: "e",
			//automatically initialize the DOM when it's ready
			autoInitializePage: true,
			pushStateEnabled: true,
			// allows users to opt in to ignoring content by marking a parent element as
			// data-ignored
			ignoreContentEnabled: false,
			// turn of binding to the native orientationchange due to android orientation behavior
			orientationChangeEnabled: true,
			buttonMarkup: {
				hoverDelay: 200
			},
			// TODO might be useful upstream in jquery itself ?
			keyCode: {
				ALT: 18,
				BACKSPACE: 8,
				CAPS_LOCK: 20,
				COMMA: 188,
				COMMAND: 91,
				COMMAND_LEFT: 91,
				// COMMAND
				COMMAND_RIGHT: 93,
				CONTROL: 17,
				DELETE: 46,
				DOWN: 40,
				END: 35,
				ENTER: 13,
				ESCAPE: 27,
				HOME: 36,
				INSERT: 45,
				LEFT: 37,
				MENU: 93,
				// COMMAND_RIGHT
				NUMPAD_ADD: 107,
				NUMPAD_DECIMAL: 110,
				NUMPAD_DIVIDE: 111,
				NUMPAD_ENTER: 108,
				NUMPAD_MULTIPLY: 106,
				NUMPAD_SUBTRACT: 109,
				PAGE_DOWN: 34,
				PAGE_UP: 33,
				PERIOD: 190,
				RIGHT: 39,
				SHIFT: 16,
				SPACE: 32,
				TAB: 9,
				UP: 38,
				WINDOWS: 91 // COMMAND
			},
			// Scroll page vertically: scroll to 0 to hide iOS address bar, or pass a Y value
			silentScroll: function(ypos) {
				if ($.type(ypos) !== "number") {
					ypos = $.mobile.defaultHomeScroll;
				}
				// prevent scrollstart and scrollstop events
				$.event.special.scrollstart.enabled = false;
				setTimeout(function() {
					window.scrollTo(0, ypos);
					$(document).trigger("silentscroll", {
						x: 0,
						y: ypos
					});
				}, 20);
				setTimeout(function() {
					$.event.special.scrollstart.enabled = true;
				}, 150);
			},
			// Expose our cache for testing purposes.
			nsNormalizeDict: nsNormalizeDict,
			// Take a data attribute property, prepend the namespace
			// and then camel case the attribute string. Add the result
			// to our nsNormalizeDict so we don't have to do this again.
			nsNormalize: function(prop) {
				if (!prop) {
					return;
				}
				return nsNormalizeDict[prop] || (nsNormalizeDict[prop] = $.camelCase($.mobile.ns + prop));
			},
			getInheritedTheme: function(el, defaultTheme) {
				// Find the closest parent with a theme class on it. Note that
				// we are not using $.fn.closest() on purpose here because this
				// method gets called quite a bit and we need it to be as fast
				// as possible.
				var e = el[0],
					ltr = "",
					re = /ui-(bar|body|overlay)-([a-z])\b/,
					c, m;
				while (e) {
					var c = e.className || "";
					if ((m = re.exec(c)) && (ltr = m[2])) {
						// We found a parent with a theme class
						// on it so bail from this loop.
						break;
					}
					e = e.parentNode;
				}
				// Return the theme letter we found, if none, return the
				// specified default.
				return ltr || defaultTheme || "a";
			},
			// TODO the following $ and $.fn extensions can/probably should be moved into jquery.mobile.core.helpers
			//
			// Find the closest javascript page element to gather settings data jsperf test
			// http://jsperf.com/single-complex-selector-vs-many-complex-selectors/edit
			// possibly naive, but it shows that the parsing overhead for *just* the page selector vs
			// the page and dialog selector is negligable. This could probably be speed up by
			// doing a similar parent node traversal to the one found in the inherited theme code above
			closestPageData: function($target) {
				return $target.closest(':jqmData(role="page"), :jqmData(role="dialog")').data("page");
			},
			enhanceable: function($set) {
				return this.haveParents($set, "enhance");
			},
			hijackable: function($set) {
				return this.haveParents($set, "ajax");
			},
			haveParents: function($set, attr) {
				if (!$.mobile.ignoreContentEnabled) {
					return $set;
				}
				var count = $set.length,
					$newSet = $(),
					e, $element, excluded;
				for (var i = 0; i < count; i++) {
					$element = $set.eq(i);
					excluded = false;
					e = $set[i];
					while (e) {
						var c = e.getAttribute ? e.getAttribute("data-" + $.mobile.ns + attr) : "";
						if (c === "false") {
							excluded = true;
							break;
						}
						e = e.parentNode;
					}
					if (!excluded) {
						$newSet = $newSet.add($element);
					}
				}
				return $newSet;
			}
		}, $.mobile);
		// Mobile version of data and removeData and hasData methods
		// ensures all data is set and retrieved using jQuery Mobile's data namespace
		$.fn.jqmData = function(prop, value) {
			var result;
			if (typeof prop != "undefined") {
				if (prop) {
					prop = $.mobile.nsNormalize(prop);
				}
				result = this.data.apply(this, arguments.length < 2 ? [prop] : [prop, value]);
			}
			return result;
		};
		$.jqmData = function(elem, prop, value) {
			var result;
			if (typeof prop != "undefined") {
				result = $.data(elem, prop ? $.mobile.nsNormalize(prop) : prop, value);
			}
			return result;
		};
		$.fn.jqmRemoveData = function(prop) {
			return this.removeData($.mobile.nsNormalize(prop));
		};
		$.jqmRemoveData = function(elem, prop) {
			return $.removeData(elem, $.mobile.nsNormalize(prop));
		};
		$.fn.removeWithDependents = function() {
			$.removeWithDependents(this);
		};
		$.removeWithDependents = function(elem) {
			var $elem = $(elem);
			($elem.jqmData('dependents') || $()).remove();
			$elem.remove();
		};
		$.fn.addDependents = function(newDependents) {
			$.addDependents($(this), newDependents);
		};
		$.addDependents = function(elem, newDependents) {
			var dependents = $(elem).jqmData('dependents') || $();
			$(elem).jqmData('dependents', $.merge(dependents, newDependents));
		};
		// note that this helper doesn't attempt to handle the callback
		// or setting of an html elements text, its only purpose is
		// to return the html encoded version of the text in all cases. (thus the name)
		$.fn.getEncodedText = function() {
			return $("<div/>").text($(this).text()).html();
		};
		// fluent helper function for the mobile namespaced equivalent
		$.fn.jqmEnhanceable = function() {
			return $.mobile.enhanceable(this);
		};
		$.fn.jqmHijackable = function() {
			return $.mobile.hijackable(this);
		};
		// Monkey-patching Sizzle to filter the :jqmData selector
		var oldFind = $.find,
			jqmDataRE = /:jqmData\(([^)]*)\)/g;
		$.find = function(selector, context, ret, extra) {
			selector = selector.replace(jqmDataRE, "[data-" + ($.mobile.ns || "") + "$1]");
			return oldFind.call(this, selector, context, ret, extra);
		};
		$.extend($.find, oldFind);
		$.find.matches = function(expr, set) {
			return $.find(expr, null, null, set);
		};
		$.find.matchesSelector = function(node, expr) {
			return $.find(expr, null, null, [node]).length > 0;
		};
	})(jQuery, this);
	(function($, undefined) {
		var $window = $(window),
			$html = $("html");
/* $.mobile.media method: pass a CSS media type or query and get a bool return
	note: this feature relies on actual media query support for media queries, though types will work most anywhere
	examples:
		$.mobile.media('screen') // tests for screen media type
		$.mobile.media('screen and (min-width: 480px)') // tests for screen media type with window width > 480px
		$.mobile.media('@media screen and (-webkit-min-device-pixel-ratio: 2)') // tests for webkit 2x pixel ratio (iPhone 4)
*/
		$.mobile.media = (function() {
			// TODO: use window.matchMedia once at least one UA implements it
			var cache = {},
				testDiv = $("<div id='jquery-mediatest'>"),
				fakeBody = $("<body>").append(testDiv);
			return function(query) {
				if (!(query in cache)) {
					var styleBlock = document.createElement("style"),
						cssrule = "@media " + query + " { #jquery-mediatest { position:absolute; } }";
					//must set type for IE!
					styleBlock.type = "text/css";
					if (styleBlock.styleSheet) {
						styleBlock.styleSheet.cssText = cssrule;
					} else {
						styleBlock.appendChild(document.createTextNode(cssrule));
					}
					$html.prepend(fakeBody).prepend(styleBlock);
					cache[query] = testDiv.css("position") === "absolute";
					fakeBody.add(styleBlock).remove();
				}
				return cache[query];
			};
		})();
	})(jQuery);
	(function($, undefined) {
		var fakeBody = $("<body>").prependTo("html"),
			fbCSS = fakeBody[0].style,
			vendors = ["Webkit", "Moz", "O"],
			webos = "palmGetResource" in window,
			//only used to rule out scrollTop
			operamini = window.operamini && ({}).toString.call(window.operamini) === "[object OperaMini]",
			bb = window.blackberry; //only used to rule out box shadow, as it's filled opaque on BB
		// thx Modernizr


		function propExists(prop) {
			var uc_prop = prop.charAt(0).toUpperCase() + prop.substr(1),
				props = (prop + " " + vendors.join(uc_prop + " ") + uc_prop).split(" ");
			for (var v in props) {
				if (fbCSS[props[v]] !== undefined) {
					return true;
				}
			}
		}
		function validStyle(prop, value, check_vend) {
			var div = document.createElement('div'),
				uc = function(txt) {
					return txt.charAt(0).toUpperCase() + txt.substr(1)
				},
				vend_pref = function(vend) {
					return "-" + vend.charAt(0).toLowerCase() + vend.substr(1) + "-";
				},
				check_style = function(vend) {
					var vend_prop = vend_pref(vend) + prop + ": " + value + ";",
						uc_vend = uc(vend),
						propStyle = uc_vend + uc(prop);
					div.setAttribute("style", vend_prop);
					if ( !! div.style[propStyle]) {
						ret = true;
					}
				},
				check_vends = check_vend ? [check_vend] : vendors,
				ret;
			for (i = 0; i < check_vends.length; i++) {
				check_style(check_vends[i]);
			}
			return !!ret;
		}
		// Thanks to Modernizr src for this test idea. `perspective` check is limited to Moz to prevent a false positive for 3D transforms on Android.


		function transform3dTest() {
			var prop = "transform-3d";
			return validStyle('perspective', '10px', 'moz') || $.mobile.media("(-" + vendors.join("-" + prop + "),(-") + "-" + prop + "),(" + prop + ")");
		}
		// Test for dynamic-updating base tag support ( allows us to avoid href,src attr rewriting )


		function baseTagTest() {
			var fauxBase = location.protocol + "//" + location.host + location.pathname + "ui-dir/",
				base = $("head base"),
				fauxEle = null,
				href = "",
				link, rebase;
			if (!base.length) {
				base = fauxEle = $("<base>", {
					"href": fauxBase
				}).appendTo("head");
			} else {
				href = base.attr("href");
			}
			link = $("<a href='testurl' />").prependTo(fakeBody);
			rebase = link[0].href;
			base[0].href = href || location.pathname;
			if (fauxEle) {
				fauxEle.remove();
			}
			return rebase.indexOf(fauxBase) === 0;
		}
		// non-UA-based IE version check by James Padolsey, modified by jdalton - from http://gist.github.com/527683
		// allows for inclusion of IE 6+, including Windows Mobile 7
		$.extend($.mobile, {
			browser: {}
		});
		$.mobile.browser.ie = (function() {
			var v = 3,
				div = document.createElement("div"),
				a = div.all || [];
			// added {} to silence closure compiler warnings. registering my dislike of all things
			// overly clever here for future reference
			while (div.innerHTML = "<!--[if gt IE " + (++v) + "]><br><![endif]-->", a[0]) {};
			return v > 4 ? v : !v;
		})();
		$.extend($.support, {
			orientation: false,
			/*davinci don't use device orientation event. - ysjung (2012/06/09)*/
			touch: "ontouchend" in document,
			cssTransitions: "WebKitTransitionEvent" in window || validStyle('transition', 'height 100ms linear'),
			pushState: "pushState" in history && "replaceState" in history,
			mediaquery: $.mobile.media("only all"),
			cssPseudoElement: !! propExists("content"),
			touchOverflow: !! propExists("overflowScrolling"),
			cssTransform3d: transform3dTest(),
			boxShadow: !! propExists("boxShadow") && !bb,
			scrollTop: ("pageXOffset" in window || "scrollTop" in document.documentElement || "scrollTop" in fakeBody[0]) && !webos && !operamini,
			dynamicBaseTag: baseTagTest()
		});
		fakeBody.remove();
		// $.mobile.ajaxBlacklist is used to override ajaxEnabled on platforms that have known conflicts with hash history updates (BB5, Symbian)
		// or that generally work better browsing in regular http for full page refreshes (Opera Mini)
		// Note: This detection below is used as a last resort.
		// We recommend only using these detection methods when all other more reliable/forward-looking approaches are not possible
		var nokiaLTE7_3 = (function() {
			var ua = window.navigator.userAgent;
			//The following is an attempt to match Nokia browsers that are running Symbian/s60, with webkit, version 7.3 or older
			return ua.indexOf("Nokia") > -1 && (ua.indexOf("Symbian/3") > -1 || ua.indexOf("Series60/5") > -1) && ua.indexOf("AppleWebKit") > -1 && ua.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/);
		})();
		// Support conditions that must be met in order to proceed
		// default enhanced qualifications are media query support OR IE 7+
		$.mobile.gradeA = function() {
			return $.support.mediaquery || $.mobile.browser.ie && $.mobile.browser.ie >= 7;
		};
		$.mobile.ajaxBlacklist =
		// BlackBerry browsers, pre-webkit
		window.blackberry && !window.WebKitPoint ||
		// Opera Mini
		operamini ||
		// Symbian webkits pre 7.3
		nokiaLTE7_3;
		// Lastly, this workaround is the only way we've found so far to get pre 7.3 Symbian webkit devices
		// to render the stylesheets when they're referenced before this script, as we'd recommend doing.
		// This simply reappends the CSS in place, which for some reason makes it apply
		if (nokiaLTE7_3) {
			$(function() {
				$("head link[rel='stylesheet']").attr("rel", "alternate stylesheet").attr("rel", "stylesheet");
			});
		}
		// For ruling out shadows via css
		if (!$.support.boxShadow) {
			$("html").addClass("ui-mobile-nosupport-boxshadow");
		}
	})(jQuery);
	(function($, window, undefined) {
		// add new event shortcuts
		$.each(("touchstart touchmove touchend orientationchange throttledresize " + "tap taphold swipe swipeleft swiperight scrollstart scrollstop").split(" "), function(i, name) {
			$.fn[name] = function(fn) {
				return fn ? this.bind(name, fn) : this.trigger(name);
			};
			$.attrFn[name] = true;
		});
		var supportTouch = $.support.touch,
			scrollEvent = "touchmove scroll",
			touchStartEvent = supportTouch ? "touchstart" : "mousedown",
			touchStopEvent = supportTouch ? "touchend" : "mouseup",
			touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
		function triggerCustomEvent(obj, eventType, event) {
			var originalType = event.type;
			event.type = eventType;
			$.event.handle.call(obj, event);
			event.type = originalType;
		}
		// also handles scrollstop
		$.event.special.scrollstart = {
			enabled: true,
			setup: function() {
				var thisObject = this,
					$this = $(thisObject),
					scrolling, timer;
				function trigger(event, state) {
					scrolling = state;
					triggerCustomEvent(thisObject, scrolling ? "scrollstart" : "scrollstop", event);
				}
				// iPhone triggers scroll after a small delay; use touchmove instead
				$this.bind(scrollEvent, function(event) {
					if (!$.event.special.scrollstart.enabled) {
						return;
					}
					if (!scrolling) {
						trigger(event, true);
					}
					clearTimeout(timer);
					timer = setTimeout(function() {
						trigger(event, false);
					}, 50);
				});
			}
		};
		// also handles taphold
		$.event.special.tap = {
			setup: function() {
				var thisObject = this,
					$this = $(thisObject);
				$this.bind("vmousedown", function(event) {
					if (event.which && event.which !== 1) {
						return false;
					}
					var origTarget = event.target,
						origEvent = event.originalEvent,
						timer;
					function clearTapTimer() {
						clearTimeout(timer);
					}
					function clearTapHandlers() {
						clearTapTimer();
						$this.unbind("vclick", clickHandler).unbind("vmouseup", clearTapTimer);
						$(document).unbind("vmousecancel", clearTapHandlers);
					}
					function clickHandler(event) {
						clearTapHandlers();
						// ONLY trigger a 'tap' event if the start target is
						// the same as the stop target.
						if (origTarget == event.target) {
							triggerCustomEvent(thisObject, "tap", event);
						}
					}
					$this.bind("vmouseup", clearTapTimer).bind("vclick", clickHandler);
					$(document).bind("vmousecancel", clearTapHandlers);
					timer = setTimeout(function() {
						triggerCustomEvent(thisObject, "taphold", $.Event("taphold", {
							target: origTarget
						}));
					}, 750);
				});
			}
		};
		// also handles swipeleft, swiperight
		$.event.special.swipe = {
			scrollSupressionThreshold: 10,
			// More than this horizontal displacement, and we will suppress scrolling.
			durationThreshold: 1000,
			// More time than this, and it isn't a swipe.
			horizontalDistanceThreshold: 30,
			// Swipe horizontal displacement must be more than this.
			verticalDistanceThreshold: 75,
			// Swipe vertical displacement must be less than this.
			setup: function() {
				var thisObject = this,
					$this = $(thisObject);
				$this.bind(touchStartEvent, function(event) {
					var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event,
						start = {
							time: (new Date()).getTime(),
							coords: [data.pageX, data.pageY],
							origin: $(event.target)
						},
						stop;
					function moveHandler(event) {
						if (!start) {
							return;
						}
						var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
						stop = {
							time: (new Date()).getTime(),
							coords: [data.pageX, data.pageY]
						};
						// prevent scrolling
						if (Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.scrollSupressionThreshold) {
							event.preventDefault();
						}
					}
					$this.bind(touchMoveEvent, moveHandler).one(touchStopEvent, function(event) {
						$this.unbind(touchMoveEvent, moveHandler);
						if (start && stop) {
							if (stop.time - start.time < $.event.special.swipe.durationThreshold && Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.horizontalDistanceThreshold && Math.abs(start.coords[1] - stop.coords[1]) < $.event.special.swipe.verticalDistanceThreshold) {
								start.origin.trigger("swipe").trigger(start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight");
							}
						}
						start = stop = undefined;
					});
				});
			}
		};
		(function($, window) {
			// "Cowboy" Ben Alman
			var win = $(window),
				special_event, get_orientation, last_orientation, initial_orientation_is_landscape, initial_orientation_is_default, portrait_map = {
					"0": true,
					"180": true
				};
			// It seems that some device/browser vendors use window.orientation values 0 and 180 to
			// denote the "default" orientation. For iOS devices, and most other smart-phones tested,
			// the default orientation is always "portrait", but in some Android and RIM based tablets,
			// the default orientation is "landscape". The following code attempts to use the window
			// dimensions to figure out what the current orientation is, and then makes adjustments
			// to the to the portrait_map if necessary, so that we can properly decode the
			// window.orientation value whenever get_orientation() is called.
			//
			// Note that we used to use a media query to figure out what the orientation the browser
			// thinks it is in:
			//
			//     initial_orientation_is_landscape = $.mobile.media("all and (orientation: landscape)");
			//
			// but there was an iPhone/iPod Touch bug beginning with iOS 4.2, up through iOS 5.1,
			// where the browser *ALWAYS* applied the landscape media query. This bug does not
			// happen on iPad.
			if ($.support.orientation) {
				// Check the window width and height to figure out what the current orientation
				// of the device is at this moment. Note that we've initialized the portrait map
				// values to 0 and 180, *AND* we purposely check for landscape so that if we guess
				// wrong, , we default to the assumption that portrait is the default orientation.
				// We use a threshold check below because on some platforms like iOS, the iPhone
				// form-factor can report a larger width than height if the user turns on the
				// developer console. The actual threshold value is somewhat arbitrary, we just
				// need to make sure it is large enough to exclude the developer console case.
				var ww = window.innerWidth || $(window).width(),
					wh = window.innerHeight || $(window).height(),
					landscape_threshold = 50;
				initial_orientation_is_landscape = ww > wh && (ww - wh) > landscape_threshold;
				// Now check to see if the current window.orientation is 0 or 180.
				initial_orientation_is_default = portrait_map[window.orientation];
				// If the initial orientation is landscape, but window.orientation reports 0 or 180, *OR*
				// if the initial orientation is portrait, but window.orientation reports 90 or -90, we
				// need to flip our portrait_map values because landscape is the default orientation for
				// this device/browser.
				if ((initial_orientation_is_landscape && initial_orientation_is_default) || (!initial_orientation_is_landscape && !initial_orientation_is_default)) {
					portrait_map = {
						"-90": true,
						"90": true
					};
				}
			}
			$.event.special.orientationchange = special_event = {
				setup: function() {
					// If the event is supported natively, return false so that jQuery
					// will bind to the event using DOM methods.
					if ($.support.orientation && $.mobile.orientationChangeEnabled) {
						return false;
					}
					// Get the current orientation to avoid initial double-triggering.
					last_orientation = get_orientation();
					// Because the orientationchange event doesn't exist, simulate the
					// event by testing window dimensions on resize.
					win.bind("throttledresize", handler);
				},
				teardown: function() {
					// If the event is not supported natively, return false so that
					// jQuery will unbind the event using DOM methods.
					if ($.support.orientation && $.mobile.orientationChangeEnabled) {
						return false;
					}
					// Because the orientationchange event doesn't exist, unbind the
					// resize event handler.
					win.unbind("throttledresize", handler);
				},
				add: function(handleObj) {
					// Save a reference to the bound event handler.
					var old_handler = handleObj.handler;
					handleObj.handler = function(event) {
						// Modify event object, adding the .orientation property.
						event.orientation = get_orientation();
						// Call the originally-bound event handler and return its result.
						return old_handler.apply(this, arguments);
					};
				}
			};
			// If the event is not supported natively, this handler will be bound to
			// the window resize event to simulate the orientationchange event.


			function handler() {
				// Get the current orientation.
				var orientation = get_orientation();
				if (orientation !== last_orientation) {
					// The orientation has changed, so trigger the orientationchange event.
					last_orientation = orientation;
					win.trigger("orientationchange");
				}
			}
			// Get the current page orientation. This method is exposed publicly, should it
			// be needed, as jQuery.event.special.orientationchange.orientation()
			$.event.special.orientationchange.orientation = get_orientation = function() {
				var isPortrait = true,
					elem = document.documentElement;
				// prefer window orientation to the calculation based on screensize as
				// the actual screen resize takes place before or after the orientation change event
				// has been fired depending on implementation (eg android 2.3 is before, iphone after).
				// More testing is required to determine if a more reliable method of determining the new screensize
				// is possible when orientationchange is fired. (eg, use media queries + element + opacity)
				if ($.support.orientation) {
					// if the window orientation registers as 0 or 180 degrees report
					// portrait, otherwise landscape
					isPortrait = portrait_map[window.orientation];
				} else {
					isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
				}
				return isPortrait ? "portrait" : "landscape";
			};
		})(jQuery, window);
		// throttled resize event
		(function() {
			$.event.special.throttledresize = {
				setup: function() {
					$(this).bind("resize", handler);
				},
				teardown: function() {
					$(this).unbind("resize", handler);
				}
			};
			var throttle = 250,
				handler = function() {
					curr = (new Date()).getTime();
					diff = curr - lastCall;
					if (diff >= throttle) {
						lastCall = curr;
						$(this).trigger("throttledresize");
					} else {
						if (heldCall) {
							clearTimeout(heldCall);
						}
						// Promise a held call will still execute
						heldCall = setTimeout(handler, throttle - diff);
					}
				},
				lastCall = 0,
				heldCall, curr, diff;
		})();
		$.each({
			scrollstop: "scrollstart",
			taphold: "tap",
			swipeleft: "swipe",
			swiperight: "swipe"
		}, function(event, sourceEvent) {
			$.event.special[event] = {
				setup: function() {
					$(this).bind(sourceEvent, $.noop);
				}
			};
		});
	})(jQuery, this);
	(function($, undefined) {
		$.widget("mobile.page", $.mobile.widget, {
			options: {
				theme: "a",
				/*the default page theme is "a" in davinci. - ysjung (2012/06/09)*/
				domCache: false,
				keepNativeDefault: ":jqmData(role='none'), :jqmData(role='nojs'), :jqmData(role^='dvc')" /*add selector for davinci. - ysjung (2012/06/09)*/
			},
			// add method for getting id  - ysjung (2012-06-07)
			getId: function() {
				return this.element[0].id;
			},
			_create: function() {
				var self = this;
				// if false is returned by the callbacks do not create the page
				if (self._trigger("beforecreate") === false) {
					return false;
				}
				self.element.attr("tabindex", "0").addClass("ui-page ui-body-" + self.options.theme).bind("pagebeforehide", function() {
					self.removeContainerBackground();
				}).bind("pagebeforeshow", function() {
					self.setContainerBackground();
				});
			},
			removeContainerBackground: function() {
				$.mobile.pageContainer.removeClass("ui-overlay-" + $.mobile.getInheritedTheme(this.element.parent()));
			},
			// set the page container background to the page theme
			setContainerBackground: function(theme) {
				if (this.options.theme) {
					$.mobile.pageContainer.addClass("ui-overlay-" + (theme || this.options.theme));
				}
			},
			keepNativeSelector: function() {
				var options = this.options,
					keepNativeDefined = options.keepNative && $.trim(options.keepNative);
				if (keepNativeDefined && options.keepNative !== options.keepNativeDefault) {
					return [options.keepNative, options.keepNativeDefault].join(", ");
				}
				return options.keepNativeDefault;
			}
		});
	})(jQuery);
	(function($, window, undefined) {
		var createHandler = function(sequential) {
			// Default to sequential
			if (sequential === undefined) {
				sequential = true;
			}
			return function(name, reverse, $to, $from) {
				var deferred = new $.Deferred(),
					reverseClass = reverse ? " reverse" : "",
					active = $.mobile.urlHistory.getActive(),
					toScroll = active.lastScroll || $.mobile.defaultHomeScroll,
					screenHeight = $.mobile.getScreenHeight(),
					maxTransitionOverride = $.mobile.maxTransitionWidth !== false && $(window).width() > $.mobile.maxTransitionWidth,
					none = !$.support.cssTransitions || maxTransitionOverride || !name || name === "none",
					toggleViewportClass = function() {
						$.mobile.pageContainer.toggleClass("ui-mobile-viewport-transitioning viewport-" + name);
					},
					scrollPage = function() {
						// By using scrollTo instead of silentScroll, we can keep things better in order
						// Just to be precautios, disable scrollstart listening like silentScroll would
						$.event.special.scrollstart.enabled = false;
						window.scrollTo(0, toScroll);
						// reenable scrollstart listening like silentScroll would
						setTimeout(function() {
							$.event.special.scrollstart.enabled = true;
						}, 150);
					},
					cleanFrom = function() {
						$from.removeClass($.mobile.activePageClass + " out in reverse " + name).height("");
					},
					startOut = function() {
						// if it's not sequential, call the doneOut transition to start the TO page animating in simultaneously
						if (!sequential) {
							doneOut();
						}
						else {
							$from.animationComplete(doneOut);
						}
						// Set the from page's height and start it transitioning out
						// Note: setting an explicit height helps eliminate tiling in the transitions
						$from.height(screenHeight + $(window).scrollTop()).addClass(name + " out" + reverseClass);
					},
					doneOut = function() {
						if ($from && sequential) {
							cleanFrom();
						}
						startIn();
					},
					startIn = function() {
						$to.addClass($.mobile.activePageClass);
						// Send focus to page as it is now display: block
						$.mobile.focusPage($to);
						// Set to page height
						$to.height(screenHeight + toScroll);
						scrollPage();
						if (!none) {
							$to.animationComplete(doneIn);
						}
						$to.addClass(name + " in" + reverseClass);
						if (none) {
							doneIn();
						}
					},
					doneIn = function() {
						if (!sequential) {
							if ($from) {
								cleanFrom();
							}
						}
						$to.removeClass("out in reverse " + name).height("");
						toggleViewportClass();
						// In some browsers (iOS5), 3D transitions block the ability to scroll to the desired location during transition
						// This ensures we jump to that spot after the fact, if we aren't there already.
						if ($(window).scrollTop() !== toScroll) {
							scrollPage();
						}
						deferred.resolve(name, reverse, $to, $from, true);
					};
				toggleViewportClass();
				if ($from && !none) {
					startOut();
				}
				else {
					doneOut();
				}
				return deferred.promise();
			};
		}
		// generate the handlers from the above
		var sequentialHandler = createHandler(),
			simultaneousHandler = createHandler(false);
		// Make our transition handler the public default.
		$.mobile.defaultTransitionHandler = sequentialHandler;
		//transition handler dictionary for 3rd party transitions
		$.mobile.transitionHandlers = {
			"default": $.mobile.defaultTransitionHandler,
			"sequential": sequentialHandler,
			"simultaneous": simultaneousHandler
		};
		$.mobile.transitionFallbacks = {};
	})(jQuery, this);
	(function($, undefined) {
		//define vars for interal use
		var $window = $(window),
			$html = $('html'),
			$head = $('head'),
			//url path helpers for use in relative url management
			path = {
				// This scary looking regular expression parses an absolute URL or its relative
				// variants (protocol, site, document, query, and hash), into the various
				// components (protocol, host, path, query, fragment, etc that make up the
				// URL as well as some other commonly used sub-parts. When used with RegExp.exec()
				// or String.match, it parses the URL into a results array that looks like this:
				//
				//     [0]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread#msg-content
				//     [1]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread
				//     [2]: http://jblas:password@mycompany.com:8080/mail/inbox
				//     [3]: http://jblas:password@mycompany.com:8080
				//     [4]: http:
				//     [5]: //
				//     [6]: jblas:password@mycompany.com:8080
				//     [7]: jblas:password
				//     [8]: jblas
				//     [9]: password
				//    [10]: mycompany.com:8080
				//    [11]: mycompany.com
				//    [12]: 8080
				//    [13]: /mail/inbox
				//    [14]: /mail/
				//    [15]: inbox
				//    [16]: ?msg=1234&type=unread
				//    [17]: #msg-content
				//
				urlParseRE: /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,
				//Parse a URL into a structure that allows easy access to
				//all of the URL components by name.
				parseUrl: function(url) {
					// If we're passed an object, we'll assume that it is
					// a parsed url object and just return it back to the caller.
					if ($.type(url) === "object") {
						return url;
					}
					var matches = path.urlParseRE.exec(url || "") || [];
					// Create an object that allows the caller to access the sub-matches
					// by name. Note that IE returns an empty string instead of undefined,
					// like all other browsers do, so we normalize everything so its consistent
					// no matter what browser we're running on.
					return {
						href: matches[0] || "",
						hrefNoHash: matches[1] || "",
						hrefNoSearch: matches[2] || "",
						domain: matches[3] || "",
						protocol: matches[4] || "",
						doubleSlash: matches[5] || "",
						authority: matches[6] || "",
						username: matches[8] || "",
						password: matches[9] || "",
						host: matches[10] || "",
						hostname: matches[11] || "",
						port: matches[12] || "",
						pathname: matches[13] || "",
						directory: matches[14] || "",
						filename: matches[15] || "",
						search: matches[16] || "",
						hash: matches[17] || ""
					};
				},
				//Turn relPath into an asbolute path. absPath is
				//an optional absolute path which describes what
				//relPath is relative to.
				makePathAbsolute: function(relPath, absPath) {
					if (relPath && relPath.charAt(0) === "/") {
						return relPath;
					}
					relPath = relPath || "";
					absPath = absPath ? absPath.replace(/^\/|(\/[^\/]*|[^\/]+)$/g, "") : "";
					var absStack = absPath ? absPath.split("/") : [],
						relStack = relPath.split("/");
					for (var i = 0; i < relStack.length; i++) {
						var d = relStack[i];
						switch (d) {
						case ".":
							break;
						case "..":
							if (absStack.length) {
								absStack.pop();
							}
							break;
						default:
							absStack.push(d);
							break;
						}
					}
					return "/" + absStack.join("/");
				},
				//Returns true if both urls have the same domain.
				isSameDomain: function(absUrl1, absUrl2) {
					return path.parseUrl(absUrl1).domain === path.parseUrl(absUrl2).domain;
				},
				//Returns true for any relative variant.
				isRelativeUrl: function(url) {
					// All relative Url variants have one thing in common, no protocol.
					return path.parseUrl(url).protocol === "";
				},
				//Returns true for an absolute url.
				isAbsoluteUrl: function(url) {
					return path.parseUrl(url).protocol !== "";
				},
				//Turn the specified realtive URL into an absolute one. This function
				//can handle all relative variants (protocol, site, document, query, fragment).
				makeUrlAbsolute: function(relUrl, absUrl) {
					if (!path.isRelativeUrl(relUrl)) {
						return relUrl;
					}
					var relObj = path.parseUrl(relUrl),
						absObj = path.parseUrl(absUrl),
						protocol = relObj.protocol || absObj.protocol,
						doubleSlash = relObj.protocol ? relObj.doubleSlash : (relObj.doubleSlash || absObj.doubleSlash),
						authority = relObj.authority || absObj.authority,
						hasPath = relObj.pathname !== "",
						pathname = path.makePathAbsolute(relObj.pathname || absObj.filename, absObj.pathname),
						search = relObj.search || (!hasPath && absObj.search) || "",
						hash = relObj.hash;
					return protocol + doubleSlash + authority + pathname + search + hash;
				},
				//Add search (aka query) params to the specified url.
				addSearchParams: function(url, params) {
					var u = path.parseUrl(url),
						p = (typeof params === "object") ? $.param(params) : params,
						s = u.search || "?";
					return u.hrefNoSearch + s + (s.charAt(s.length - 1) !== "?" ? "&" : "") + p + (u.hash || "");
				},
				convertUrlToDataUrl: function(absUrl) {
					var u = path.parseUrl(absUrl);
					if (path.isEmbeddedPage(u)) {
						// For embedded pages, remove the dialog hash key as in getFilePath(),
						// otherwise the Data Url won't match the id of the embedded Page.
						return u.hash.split(dialogHashKey)[0].replace(/^#/, "");
					} else if (path.isSameDomain(u, documentBase)) {
						return u.hrefNoHash.replace(documentBase.domain, "");
					}
					return absUrl;
				},
				//get path from current hash, or from a file path
				get: function(newPath) {
					if (newPath === undefined) {
						newPath = location.hash;
					}
					return path.stripHash(newPath).replace(/[^\/]*\.[^\/*]+$/, '');
				},
				//return the substring of a filepath before the sub-page key, for making a server request
				getFilePath: function(path) {
					var splitkey = '&' + $.mobile.subPageUrlKey;
					return path && path.split(splitkey)[0].split(dialogHashKey)[0];
				},
				//set location hash to path
				set: function(path) {
					location.hash = path;
				},
				//test if a given url (string) is a path
				//NOTE might be exceptionally naive
				isPath: function(url) {
					return (/\//).test(url);
				},
				//return a url path with the window's location protocol/hostname/pathname removed
				clean: function(url) {
					return url.replace(documentBase.domain, "");
				},
				//just return the url without an initial #
				stripHash: function(url) {
					return url.replace(/^#/, "");
				},
				//remove the preceding hash, any query params, and dialog notations
				cleanHash: function(hash) {
					return path.stripHash(hash.replace(/\?.*$/, "").replace(dialogHashKey, ""));
				},
				//check whether a url is referencing the same domain, or an external domain or different protocol
				//could be mailto, etc
				isExternal: function(url) {
					var u = path.parseUrl(url);
					return u.protocol && u.domain !== documentUrl.domain ? true : false;
				},
				hasProtocol: function(url) {
					return (/^(:?\w+:)/).test(url);
				},
				//check if the specified url refers to the first page in the main application document.
				isFirstPageUrl: function(url) {
					// We only deal with absolute paths.
					var u = path.parseUrl(path.makeUrlAbsolute(url, documentBase)),
						// Does the url have the same path as the document?
						samePath = u.hrefNoHash === documentUrl.hrefNoHash || (documentBaseDiffers && u.hrefNoHash === documentBase.hrefNoHash),
						// Get the first page element.
						fp = $.mobile.firstPage,
						// Get the id of the first page element if it has one.
						fpId = fp && fp[0] ? fp[0].id : undefined;
					// The url refers to the first page if the path matches the document and
					// it either has no hash value, or the hash is exactly equal to the id of the
					// first page element.
					return samePath && (!u.hash || u.hash === "#" || (fpId && u.hash.replace(/^#/, "") === fpId));
				},
				isEmbeddedPage: function(url) {
					var u = path.parseUrl(url);
					//if the path is absolute, then we need to compare the url against
					//both the documentUrl and the documentBase. The main reason for this
					//is that links embedded within external documents will refer to the
					//application document, whereas links embedded within the application
					//document will be resolved against the document base.
					if (u.protocol !== "") {
						return (u.hash && (u.hrefNoHash === documentUrl.hrefNoHash || (documentBaseDiffers && u.hrefNoHash === documentBase.hrefNoHash)));
					}
					return (/^#/).test(u.href);
				}
			},
			//will be defined when a link is clicked and given an active class
			$activeClickedLink = null,
			//urlHistory is purely here to make guesses at whether the back or forward button was clicked
			//and provide an appropriate transition
			urlHistory = {
				// Array of pages that are visited during a single page load.
				// Each has a url and optional transition, title, and pageUrl (which represents the file path, in cases where URL is obscured, such as dialogs)
				stack: [],
				//maintain an index number for the active page in the stack
				activeIndex: 0,
				//get active
				getActive: function() {
					return urlHistory.stack[urlHistory.activeIndex];
				},
				getPrev: function() {
					return urlHistory.stack[urlHistory.activeIndex - 1];
				},
				getNext: function() {
					return urlHistory.stack[urlHistory.activeIndex + 1];
				},
				// addNew is used whenever a new page is added
				addNew: function(url, transition, title, pageUrl, role) {
					//if there's forward history, wipe it
					if (urlHistory.getNext()) {
						urlHistory.clearForward();
					}
					urlHistory.stack.push({
						url: url,
						transition: transition,
						title: title,
						pageUrl: pageUrl,
						role: role
					});
					urlHistory.activeIndex = urlHistory.stack.length - 1;
				},
				//wipe urls ahead of active index
				clearForward: function() {
					urlHistory.stack = urlHistory.stack.slice(0, urlHistory.activeIndex + 1);
				},
				directHashChange: function(opts) {
					var back, forward, newActiveIndex, prev = this.getActive();
					// check if url isp in history and if it's ahead or behind current page
					$.each(urlHistory.stack, function(i, historyEntry) {
						//if the url is in the stack, it's a forward or a back
						if (opts.currentUrl === historyEntry.url) {
							//define back and forward by whether url is older or newer than current page
							back = i < urlHistory.activeIndex;
							forward = !back;
							newActiveIndex = i;
						}
					});
					// save new page index, null check to prevent falsey 0 result
					this.activeIndex = newActiveIndex !== undefined ? newActiveIndex : this.activeIndex;
					if (back) {
						(opts.either || opts.isBack)(true);
					} else if (forward) {
						(opts.either || opts.isForward)(false);
					}
				},
				//disable hashchange event listener internally to ignore one change
				//toggled internally when location.hash is updated to match the url of a successful page load
				ignoreNextHashChange: false
			},
			//define first selector to receive focus when a page is shown
			focusable = "[tabindex],a,button:visible,select:visible,input",
			//queue to hold simultanious page transitions
			pageTransitionQueue = [],
			//indicates whether or not page is in process of transitioning
			isPageTransitioning = false,
			//nonsense hash change key for dialogs, so they create a history entry
			dialogHashKey = "&ui-state=dialog",
			//existing base tag?
			$base = $head.children("base"),
			//tuck away the original document URL minus any fragment.
			documentUrl = path.parseUrl(location.href),
			//if the document has an embedded base tag, documentBase is set to its
			//initial value. If a base tag does not exist, then we default to the documentUrl.
			documentBase = $base.length ? path.parseUrl(path.makeUrlAbsolute($base.attr("href"), documentUrl.href)) : documentUrl,
			//cache the comparison once.
			documentBaseDiffers = (documentUrl.hrefNoHash !== documentBase.hrefNoHash);
		//base element management, defined depending on dynamic base tag support
		var base = $.support.dynamicBaseTag ? {
			//define base element, for use in routing asset urls that are referenced in Ajax-requested markup
			element: ($base.length ? $base : $("<base>", {
				href: documentBase.hrefNoHash
			}).prependTo($head)),
			//set the generated BASE element's href attribute to a new page's base path
			set: function(href) {
				base.element.attr("href", path.makeUrlAbsolute(href, documentBase));
			},
			//set the generated BASE element's href attribute to a new page's base path
			reset: function() {
				base.element.attr("href", documentBase.hrefNoHash);
			}
		} : undefined;
/*
	internal utility functions
--------------------------------------*/
		//direct focus to the page title, or otherwise first focusable element
		$.mobile.focusPage = function(page) {
			var autofocus = page.find("[autofocus]"),
				pageTitle = page.find(".ui-title:eq(0)");
			if (autofocus.length) {
				autofocus.focus();
				return;
			}
			if (pageTitle.length) {
				pageTitle.focus();
			}
			else {
				page.focus();
			}
		}
		//remove active classes after page transition or error


		function removeActiveLinkClass(forceRemoval) {
			if ( !! $activeClickedLink && (!$activeClickedLink.closest('.ui-page-active').length || forceRemoval)) {
				$activeClickedLink.removeClass($.mobile.activeBtnClass);
			}
			$activeClickedLink = null;
		}
		function releasePageTransitionLock() {
			isPageTransitioning = false;
			if (pageTransitionQueue.length > 0) {
				$.mobile.changePage.apply(null, pageTransitionQueue.pop());
			}
		}
		// Save the last scroll distance per page, before it is hidden
		var setLastScrollEnabled = true,
			setLastScroll, delayedSetLastScroll;
		setLastScroll = function() {
			// this barrier prevents setting the scroll value based on the browser
			// scrolling the window based on a hashchange
			if (!setLastScrollEnabled) {
				return;
			}
			var active = $.mobile.urlHistory.getActive();
			if (active) {
				var lastScroll = $window.scrollTop();
				// Set active page's lastScroll prop.
				// If the location we're scrolling to is less than minScrollBack, let it go.
				active.lastScroll = lastScroll < $.mobile.minScrollBack ? $.mobile.defaultHomeScroll : lastScroll;
			}
		};
		// bind to scrollstop to gather scroll position. The delay allows for the hashchange
		// event to fire and disable scroll recording in the case where the browser scrolls
		// to the hash targets location (sometimes the top of the page). once pagechange fires
		// getLastScroll is again permitted to operate
		delayedSetLastScroll = function() {
			setTimeout(setLastScroll, 100);
		};
		// disable an scroll setting when a hashchange has been fired, this only works
		// because the recording of the scroll position is delayed for 100ms after
		// the browser might have changed the position because of the hashchange
		$window.bind($.support.pushState ? "popstate" : "hashchange", function() {
			setLastScrollEnabled = false;
		});
		// handle initial hashchange from chrome :(
		$window.one($.support.pushState ? "popstate" : "hashchange", function() {
			setLastScrollEnabled = true;
		});
		// wait until the mobile page container has been determined to bind to pagechange
		$window.one("pagecontainercreate", function() {
			// once the page has changed, re-enable the scroll recording
			$.mobile.pageContainer.bind("pagechange", function() {
				setLastScrollEnabled = true;
				// remove any binding that previously existed on the get scroll
				// which may or may not be different than the scroll element determined for
				// this page previously
				$window.unbind("scrollstop", delayedSetLastScroll);
				// determine and bind to the current scoll element which may be the window
				// or in the case of touch overflow the element with touch overflow
				$window.bind("scrollstop", delayedSetLastScroll);
			});
		});
		// bind to scrollstop for the first page as "pagechange" won't be fired in that case
		$window.bind("scrollstop", delayedSetLastScroll);
		//function for transitioning between two existing pages


		function transitionPages(toPage, fromPage, transition, reverse) {
			if (fromPage) {
				//trigger before show/hide events
				fromPage.data("page")._trigger("beforehide", null, {
					nextPage: toPage
				});
			}
			toPage.data("page")._trigger("beforeshow", null, {
				prevPage: fromPage || $("")
			});
			//clear page loader
			$.mobile.hidePageLoadingMsg();
			// If transition is defined, check if css 3D transforms are supported, and if not, if a fallback is specified
			if (transition && !$.support.cssTransform3d && $.mobile.transitionFallbacks[transition]) {
				transition = $.mobile.transitionFallbacks[transition];
			}
			//find the transition handler for the specified transition. If there
			//isn't one in our transitionHandlers dictionary, use the default one.
			//call the handler immediately to kick-off the transition.
			var th = $.mobile.transitionHandlers[transition || "default"] || $.mobile.defaultTransitionHandler,
				promise = th(transition, reverse, toPage, fromPage);
			promise.done(function() {
				//trigger show/hide events
				if (fromPage) {
					fromPage.data("page")._trigger("hide", null, {
						nextPage: toPage
					});
				}
				//trigger pageshow, define prevPage as either fromPage or empty jQuery obj
				toPage.data("page")._trigger("show", null, {
					prevPage: fromPage || $("")
				});
			});
			return promise;
		}
		//simply set the active page's minimum height to screen height, depending on orientation


		function getScreenHeight() {
			// Native innerHeight returns more accurate value for this across platforms, 
			// jQuery version is here as a normalized fallback for platforms like Symbian
			return window.innerHeight || $(window).height();
		}
		$.mobile.getScreenHeight = getScreenHeight;
		//simply set the active page's minimum height to screen height, depending on orientation


		function resetActivePageHeight() {
			var aPage = $("." + $.mobile.activePageClass),
				aPagePadT = parseFloat(aPage.css("padding-top")),
				aPagePadB = parseFloat(aPage.css("padding-bottom"));
			aPage.css("min-height", getScreenHeight() - aPagePadT - aPagePadB);
		}
		//shared page enhancements


		function enhancePage($page, role) {
			// If a role was specified, make sure the data-role attribute
			// on the page element is in sync.
			if (role) {
				$page.attr("data-" + $.mobile.ns + "role", role);
			}
			//run page plugin
			$page.page();
		} /* exposed $.mobile methods	 */
		//animation complete callback
		$.fn.animationComplete = function(callback) {
			if ($.support.cssTransitions) {
				return $(this).one('webkitAnimationEnd animationend', callback);
			}
			else {
				// defer execution for consistency between webkit/non webkit
				setTimeout(callback, 0);
				return $(this);
			}
		};
		//expose path object on $.mobile
		$.mobile.path = path;
		//expose base object on $.mobile
		$.mobile.base = base;
		//history stack
		$.mobile.urlHistory = urlHistory;
		$.mobile.dialogHashKey = dialogHashKey;
		//enable cross-domain page support
		$.mobile.allowCrossDomainPages = false;
		//return the original document url
		$.mobile.getDocumentUrl = function(asParsedObject) {
			return asParsedObject ? $.extend({}, documentUrl) : documentUrl.href;
		};
		//return the original document base url
		$.mobile.getDocumentBase = function(asParsedObject) {
			return asParsedObject ? $.extend({}, documentBase) : documentBase.href;
		};
		$.mobile._bindPageRemove = function() {
			var page = $(this);
			// when dom caching is not enabled or the page is embedded bind to remove the page on hide
			if (!page.data("page").options.domCache && page.is(":jqmData(external-page='true')")) {
				page.bind('pagehide.remove', function() {
					var $this = $(this),
						prEvent = new $.Event("pageremove");
					$this.trigger(prEvent);
					if (!prEvent.isDefaultPrevented()) {
						$this.removeWithDependents();
					}
				});
			}
		};
		// Load a page into the DOM.
		$.mobile.loadPage = function(url, options) {
			// This function uses deferred notifications to let callers
			// know when the page is done loading, or if an error has occurred.
			var deferred = $.Deferred(),
				// The default loadPage options with overrides specified by
				// the caller.
				settings = $.extend({}, $.mobile.loadPage.defaults, options),
				// The DOM element for the page after it has been loaded.
				page = null,
				// If the reloadPage option is true, and the page is already
				// in the DOM, dupCachedPage will be set to the page element
				// so that it can be removed after the new version of the
				// page is loaded off the network.
				dupCachedPage = null,
				// determine the current base url
				findBaseWithDefault = function() {
					var closestBase = ($.mobile.activePage && getClosestBaseUrl($.mobile.activePage));
					return closestBase || documentBase.hrefNoHash;
				},
				// The absolute version of the URL passed into the function. This
				// version of the URL may contain dialog/subpage params in it.
				absUrl = path.makeUrlAbsolute(url, findBaseWithDefault());
			// If the caller provided data, and we're using "get" request,
			// append the data to the URL.
			if (settings.data && settings.type === "get") {
				absUrl = path.addSearchParams(absUrl, settings.data);
				settings.data = undefined;
			}
			// If the caller is using a "post" request, reloadPage must be true
			if (settings.data && settings.type === "post") {
				settings.reloadPage = true;
			}
			// The absolute version of the URL minus any dialog/subpage params.
			// In otherwords the real URL of the page to be loaded.
			var fileUrl = path.getFilePath(absUrl),
				// The version of the Url actually stored in the data-url attribute of
				// the page. For embedded pages, it is just the id of the page. For pages
				// within the same domain as the document base, it is the site relative
				// path. For cross-domain pages (Phone Gap only) the entire absolute Url
				// used to load the page.
				dataUrl = path.convertUrlToDataUrl(absUrl);
			// Make sure we have a pageContainer to work with.
			settings.pageContainer = settings.pageContainer || $.mobile.pageContainer;
			// Check to see if the page already exists in the DOM.
			page = settings.pageContainer.children(":jqmData(url='" + dataUrl + "')");
			// If we failed to find the page, check to see if the url is a
			// reference to an embedded page. If so, it may have been dynamically
			// injected by a developer, in which case it would be lacking a data-url
			// attribute and in need of enhancement.
			if (page.length === 0 && dataUrl && !path.isPath(dataUrl)) {
				page = settings.pageContainer.children("#" + dataUrl).attr("data-" + $.mobile.ns + "url", dataUrl);
			}
			// If we failed to find a page in the DOM, check the URL to see if it
			// refers to the first page in the application. If it isn't a reference
			// to the first page and refers to non-existent embedded page, error out.
			if (page.length === 0) {
				if ($.mobile.firstPage && path.isFirstPageUrl(fileUrl)) {
					// Check to make sure our cached-first-page is actually
					// in the DOM. Some user deployed apps are pruning the first
					// page from the DOM for various reasons, we check for this
					// case here because we don't want a first-page with an id
					// falling through to the non-existent embedded page error
					// case. If the first-page is not in the DOM, then we let
					// things fall through to the ajax loading code below so
					// that it gets reloaded.
					if ($.mobile.firstPage.parent().length) {
						page = $($.mobile.firstPage);
					}
				} else if (path.isEmbeddedPage(fileUrl)) {
					deferred.reject(absUrl, options);
					return deferred.promise();
				}
			}
			// Reset base to the default document base.
			if (base) {
				base.reset();
			}
			// If the page we are interested in is already in the DOM,
			// and the caller did not indicate that we should force a
			// reload of the file, we are done. Otherwise, track the
			// existing page as a duplicated.
			if (page.length) {
				if (!settings.reloadPage) {
					enhancePage(page, settings.role);
					deferred.resolve(absUrl, options, page);
					return deferred.promise();
				}
				dupCachedPage = page;
			}
			var mpc = settings.pageContainer,
				pblEvent = new $.Event("pagebeforeload"),
				triggerData = {
					url: url,
					absUrl: absUrl,
					dataUrl: dataUrl,
					deferred: deferred,
					options: settings
				};
			// Let listeners know we're about to load a page.
			mpc.trigger(pblEvent, triggerData);
			// If the default behavior is prevented, stop here!
			if (pblEvent.isDefaultPrevented()) {
				return deferred.promise();
			}
			if (settings.showLoadMsg) {
				// This configurable timeout allows cached pages a brief delay to load without showing a message
				var loadMsgDelay = setTimeout(function() {
					$.mobile.showPageLoadingMsg();
				}, settings.loadMsgDelay),
					// Shared logic for clearing timeout and removing message.
					hideMsg = function() {
						// Stop message show timer
						clearTimeout(loadMsgDelay);
						// Hide loading message
						$.mobile.hidePageLoadingMsg();
					};
			}
			if (!($.mobile.allowCrossDomainPages || path.isSameDomain(documentUrl, absUrl))) {
				deferred.reject(absUrl, options);
			} else {
				// Load the new page.
				$.ajax({
					url: fileUrl,
					type: settings.type,
					data: settings.data,
					dataType: "html",
					success: function(html, textStatus, xhr) {
						//pre-parse html to check for a data-url,
						//use it as the new fileUrl, base path, etc
						var all = $("<div></div>"),
							//page title regexp
							newPageTitle = html.match(/<title[^>]*>([^<]*)/) && RegExp.$1,
							// TODO handle dialogs again
							pageElemRegex = new RegExp("(<[^>]+\\bdata-" + $.mobile.ns + "role=[\"']?page[\"']?[^>]*>)"),
							dataUrlRegex = new RegExp("\\bdata-" + $.mobile.ns + "url=[\"']?([^\"'>]*)[\"']?");
						// data-url must be provided for the base tag so resource requests can be directed to the
						// correct url. loading into a temprorary element makes these requests immediately
						if (pageElemRegex.test(html) && RegExp.$1 && dataUrlRegex.test(RegExp.$1) && RegExp.$1) {
							url = fileUrl = path.getFilePath(RegExp.$1);
						}
						if (base) {
							base.set(fileUrl);
						}
						//workaround to allow scripts to execute when included in page divs
						all.get(0).innerHTML = html;
						page = all.find(":jqmData(role='page'), :jqmData(role='dialog')").first();
						//if page elem couldn't be found, create one and insert the body element's contents
						if (!page.length) {
							page = $("<div data-" + $.mobile.ns + "role='page'>" + html.split(/<\/?body[^>]*>/gmi)[1] + "</div>");
						}
						if (newPageTitle && !page.jqmData("title")) {
							if (~newPageTitle.indexOf("&")) {
								newPageTitle = $("<div>" + newPageTitle + "</div>").text();
							}
							page.jqmData("title", newPageTitle);
						}
						//rewrite src and href attrs to use a base url
						if (!$.support.dynamicBaseTag) {
							var newPath = path.get(fileUrl);
							page.find("[src], link[href], a[rel='external'], :jqmData(ajax='false'), a[target]").each(function() {
								var thisAttr = $(this).is('[href]') ? 'href' : $(this).is('[src]') ? 'src' : 'action',
									thisUrl = $(this).attr(thisAttr);
								// XXX_jblas: We need to fix this so that it removes the document
								//            base URL, and then prepends with the new page URL.
								//if full path exists and is same, chop it - helps IE out
								thisUrl = thisUrl.replace(location.protocol + '//' + location.host + location.pathname, '');
								if (!/^(\w+:|#|\/)/.test(thisUrl)) {
									$(this).attr(thisAttr, newPath + thisUrl);
								}
							});
						}
						//append to page and enhance
						// TODO taging a page with external to make sure that embedded pages aren't removed
						//      by the various page handling code is bad. Having page handling code in many
						//      places is bad. Solutions post 1.0
						page.attr("data-" + $.mobile.ns + "url", path.convertUrlToDataUrl(fileUrl)).attr("data-" + $.mobile.ns + "external-page", true).appendTo(settings.pageContainer);
						// wait for page creation to leverage options defined on widget
						page.one('pagecreate', $.mobile._bindPageRemove);
						enhancePage(page, settings.role);
						// Enhancing the page may result in new dialogs/sub pages being inserted
						// into the DOM. If the original absUrl refers to a sub-page, that is the
						// real page we are interested in.
						if (absUrl.indexOf("&" + $.mobile.subPageUrlKey) > -1) {
							page = settings.pageContainer.children(":jqmData(url='" + dataUrl + "')");
						}
						//bind pageHide to removePage after it's hidden, if the page options specify to do so
						// Remove loading message.
						if (settings.showLoadMsg) {
							hideMsg();
						}
						// Add the page reference and xhr to our triggerData.
						triggerData.xhr = xhr;
						triggerData.textStatus = textStatus;
						triggerData.page = page;
						// Let listeners know the page loaded successfully.
						settings.pageContainer.trigger("pageload", triggerData);
						deferred.resolve(absUrl, options, page, dupCachedPage);
					},
					error: function(xhr, textStatus, errorThrown) {
						//set base back to current path
						if (base) {
							base.set(path.get());
						}
						// Add error info to our triggerData.
						triggerData.xhr = xhr;
						triggerData.textStatus = textStatus;
						triggerData.errorThrown = errorThrown;
						var plfEvent = new $.Event("pageloadfailed");
						// Let listeners know the page load failed.
						settings.pageContainer.trigger(plfEvent, triggerData);
						// If the default behavior is prevented, stop here!
						// Note that it is the responsibility of the listener/handler
						// that called preventDefault(), to resolve/reject the
						// deferred object within the triggerData.
						if (plfEvent.isDefaultPrevented()) {
							return;
						}
						// Remove loading message.
						if (settings.showLoadMsg) {
							// Remove loading message.
							hideMsg();
							// show error message
							$.mobile.showPageLoadingMsg($.mobile.pageLoadErrorMessageTheme, $.mobile.pageLoadErrorMessage, true);
							// hide after delay
							setTimeout($.mobile.hidePageLoadingMsg, 1500);
						}
						deferred.reject(absUrl, options);
					}
				});
			}
			return deferred.promise();
		};
		$.mobile.loadPage.defaults = {
			type: "get",
			data: undefined,
			reloadPage: false,
			role: undefined,
			// By default we rely on the role defined by the @data-role attribute.
			showLoadMsg: false,
			pageContainer: undefined,
			loadMsgDelay: 50 // This delay allows loads that pull from browser cache to occur without showing the loading message.
		};
		// Show a specific page in the page container.
		$.mobile.changePage = function(toPage, options) {
			// If we are in the midst of a transition, queue the current request.
			// We'll call changePage() once we're done with the current transition to
			// service the request.
			if (isPageTransitioning) {
				pageTransitionQueue.unshift(arguments);
				return;
			}
			var settings = $.extend({}, $.mobile.changePage.defaults, options);
			// Make sure we have a pageContainer to work with.
			settings.pageContainer = settings.pageContainer || $.mobile.pageContainer;
			// Make sure we have a fromPage.
			settings.fromPage = settings.fromPage || $.mobile.activePage;
			var mpc = settings.pageContainer,
				pbcEvent = new $.Event("pagebeforechange"),
				triggerData = {
					toPage: toPage,
					options: settings
				};
			// Let listeners know we're about to change the current page.
			mpc.trigger(pbcEvent, triggerData);
			// If the default behavior is prevented, stop here!
			if (pbcEvent.isDefaultPrevented()) {
				return;
			}
			// We allow "pagebeforechange" observers to modify the toPage in the trigger
			// data to allow for redirects. Make sure our toPage is updated.
			toPage = triggerData.toPage;
			// Set the isPageTransitioning flag to prevent any requests from
			// entering this method while we are in the midst of loading a page
			// or transitioning.
			isPageTransitioning = true;
			// If the caller passed us a url, call loadPage()
			// to make sure it is loaded into the DOM. We'll listen
			// to the promise object it returns so we know when
			// it is done loading or if an error ocurred.
			if (typeof toPage == "string") {
				$.mobile.loadPage(toPage, settings).done(function(url, options, newPage, dupCachedPage) {
					isPageTransitioning = false;
					options.duplicateCachedPage = dupCachedPage;
					$.mobile.changePage(newPage, options);
				}).fail(function(url, options) {
					isPageTransitioning = false;
					//clear out the active button state
					removeActiveLinkClass(true);
					//release transition lock so navigation is free again
					releasePageTransitionLock();
					settings.pageContainer.trigger("pagechangefailed", triggerData);
				});
				return;
			}
			// If we are going to the first-page of the application, we need to make
			// sure settings.dataUrl is set to the application document url. This allows
			// us to avoid generating a document url with an id hash in the case where the
			// first-page of the document has an id attribute specified.
			if (toPage[0] === $.mobile.firstPage[0] && !settings.dataUrl) {
				settings.dataUrl = documentUrl.hrefNoHash;
			}
			// The caller passed us a real page DOM element. Update our
			// internal state and then trigger a transition to the page.
			var fromPage = settings.fromPage,
				url = (settings.dataUrl && path.convertUrlToDataUrl(settings.dataUrl)) || toPage.jqmData("url"),
				// The pageUrl var is usually the same as url, except when url is obscured as a dialog url. pageUrl always contains the file path
				pageUrl = url,
				fileUrl = path.getFilePath(url),
				active = urlHistory.getActive(),
				activeIsInitialPage = urlHistory.activeIndex === 0,
				historyDir = 0,
				pageTitle = document.title,
				isDialog = settings.role === "dialog" || toPage.jqmData("role") === "dialog";
			// By default, we prevent changePage requests when the fromPage and toPage
			// are the same element, but folks that generate content manually/dynamically
			// and reuse pages want to be able to transition to the same page. To allow
			// this, they will need to change the default value of allowSamePageTransition
			// to true, *OR*, pass it in as an option when they manually call changePage().
			// It should be noted that our default transition animations assume that the
			// formPage and toPage are different elements, so they may behave unexpectedly.
			// It is up to the developer that turns on the allowSamePageTransitiona option
			// to either turn off transition animations, or make sure that an appropriate
			// animation transition is used.
			if (fromPage && fromPage[0] === toPage[0] && !settings.allowSamePageTransition) {
				isPageTransitioning = false;
				mpc.trigger("pagechange", triggerData);
				return;
			}
			// We need to make sure the page we are given has already been enhanced.
			enhancePage(toPage, settings.role);
			// If the changePage request was sent from a hashChange event, check to see if the
			// page is already within the urlHistory stack. If so, we'll assume the user hit
			// the forward/back button and will try to match the transition accordingly.
			if (settings.fromHashChange) {
				urlHistory.directHashChange({
					currentUrl: url,
					isBack: function() {
						historyDir = -1;
					},
					isForward: function() {
						historyDir = 1;
					}
				});
			}
			// Kill the keyboard.
			// XXX_jblas: We need to stop crawling the entire document to kill focus. Instead,
			//            we should be tracking focus with a delegate() handler so we already have
			//            the element in hand at this point.
			// Wrap this in a try/catch block since IE9 throw "Unspecified error" if document.activeElement
			// is undefined when we are in an IFrame.
			try {
				if (document.activeElement && document.activeElement.nodeName.toLowerCase() != 'body') {
					$(document.activeElement).blur();
				} else {
					$("input:focus, textarea:focus, select:focus").blur();
				}
			} catch (e) {}
			// If we're displaying the page as a dialog, we don't want the url
			// for the dialog content to be used in the hash. Instead, we want
			// to append the dialogHashKey to the url of the current page.
			if (isDialog && active) {
				// on the initial page load active.url is undefined and in that case should
				// be an empty string. Moving the undefined -> empty string back into
				// urlHistory.addNew seemed imprudent given undefined better represents
				// the url state
				url = (active.url || "") + dialogHashKey;
			}
			// Set the location hash.
			if (settings.changeHash !== false && url) {
				//disable hash listening temporarily
				urlHistory.ignoreNextHashChange = true;
				//update hash and history
				path.set(url);
			}
			// if title element wasn't found, try the page div data attr too
			// If this is a deep-link or a reload ( active === undefined ) then just use pageTitle
			var newPageTitle = (!active) ? pageTitle : toPage.jqmData("title") || toPage.children(":jqmData(role='header')").find(".ui-title").getEncodedText();
			if ( !! newPageTitle && pageTitle == document.title) {
				pageTitle = newPageTitle;
			}
			if (!toPage.jqmData("title")) {
				toPage.jqmData("title", pageTitle);
			}
			// Make sure we have a transition defined.
			settings.transition = settings.transition || ((historyDir && !activeIsInitialPage) ? active.transition : undefined) || (isDialog ? $.mobile.defaultDialogTransition : $.mobile.defaultPageTransition);
			//add page to history stack if it's not back or forward
			if (!historyDir) {
				urlHistory.addNew(url, settings.transition, pageTitle, pageUrl, settings.role);
			}
			//set page title
			document.title = urlHistory.getActive().title;
			//set "toPage" as activePage
			$.mobile.activePage = toPage;
			// If we're navigating back in the URL history, set reverse accordingly.
			settings.reverse = settings.reverse || historyDir < 0;
			transitionPages(toPage, fromPage, settings.transition, settings.reverse).done(function(name, reverse, $to, $from, alreadyFocused) {
				removeActiveLinkClass();
				//if there's a duplicateCachedPage, remove it from the DOM now that it's hidden
				if (settings.duplicateCachedPage) {
					settings.duplicateCachedPage.remove();
				}
				// Send focus to the newly shown page. Moved from promise .done binding in transitionPages
				// itself to avoid ie bug that reports offsetWidth as > 0 (core check for visibility)
				// despite visibility: hidden addresses issue #2965
				// https://github.com/jquery/jquery-mobile/issues/2965
				if (!alreadyFocused) {
					$.mobile.focusPage(toPage);
				}
				releasePageTransitionLock();
				// Let listeners know we're all done changing the current page.
				mpc.trigger("pagechange", triggerData);
			});
		};
		$.mobile.changePage.defaults = {
			transition: undefined,
			reverse: false,
			changeHash: true,
			fromHashChange: false,
			role: undefined,
			// By default we rely on the role defined by the @data-role attribute.
			duplicateCachedPage: undefined,
			pageContainer: undefined,
			showLoadMsg: true,
			//loading message shows by default when pages are being fetched during changePage
			dataUrl: undefined,
			fromPage: undefined,
			allowSamePageTransition: false
		}; /* Event Bindings - hashchange, submit, and click */

		function findClosestLink(ele) {
			while (ele) {
				// Look for the closest element with a nodeName of "a".
				// Note that we are checking if we have a valid nodeName
				// before attempting to access it. This is because the
				// node we get called with could have originated from within
				// an embedded SVG document where some symbol instance elements
				// don't have nodeName defined on them, or strings are of type
				// SVGAnimatedString.
				if ((typeof ele.nodeName === "string") && ele.nodeName.toLowerCase() == "a") {
					break;
				}
				ele = ele.parentNode;
			}
			return ele;
		}
		// The base URL for any given element depends on the page it resides in.


		function getClosestBaseUrl(ele) {
			// Find the closest page and extract out its url.
			var url = $(ele).closest(".ui-page").jqmData("url"),
				base = documentBase.hrefNoHash;
			if (!url || !path.isPath(url)) {
				url = base;
			}
			return path.makeUrlAbsolute(url, base);
		}
		//The following event bindings should be bound after mobileinit has been triggered
		//the following function is called in the init file
		$.mobile._registerInternalEvents = function() {
			//bind to form submit events, handle with Ajax
			$(document).delegate("form", "submit", function(event) {
				var $this = $(this);
				if (!$.mobile.ajaxEnabled ||
				// test that the form is, itself, ajax false
				$this.is(":jqmData(ajax='false')") ||
				// test that $.mobile.ignoreContentEnabled is set and
				// the form or one of it's parents is ajax=false
				!$this.jqmHijackable().length) {
					return;
				}
				var type = $this.attr("method"),
					target = $this.attr("target"),
					url = $this.attr("action");
				// If no action is specified, browsers default to using the
				// URL of the document containing the form. Since we dynamically
				// pull in pages from external documents, the form should submit
				// to the URL for the source document of the page containing
				// the form.
				if (!url) {
					// Get the @data-url for the page containing the form.
					url = getClosestBaseUrl($this);
					if (url === documentBase.hrefNoHash) {
						// The url we got back matches the document base,
						// which means the page must be an internal/embedded page,
						// so default to using the actual document url as a browser
						// would.
						url = documentUrl.hrefNoSearch;
					}
				}
				url = path.makeUrlAbsolute(url, getClosestBaseUrl($this));
				//external submits use regular HTTP
				if (path.isExternal(url) || target) {
					return;
				}
				$.mobile.changePage(
				url, {
					type: type && type.length && type.toLowerCase() || "get",
					data: $this.serialize(),
					transition: $this.jqmData("transition"),
					direction: $this.jqmData("direction"),
					reloadPage: true
				});
				event.preventDefault();
			});
			//add active state on vclick
			$(document).bind("vclick", function(event) {
				// if this isn't a left click we don't care. Its important to note
				// that when the virtual event is generated it will create the which attr
				if (event.which > 1 || !$.mobile.linkBindingEnabled) {
					return;
				}
				var link = findClosestLink(event.target);
				// split from the previous return logic to avoid find closest where possible
				// TODO teach $.mobile.hijackable to operate on raw dom elements so the link wrapping
				// can be avoided
				if (!$(link).jqmHijackable().length) {
					return;
				}
				if (link) {
					if (path.parseUrl(link.getAttribute("href") || "#").hash !== "#") {
						removeActiveLinkClass(true);
						$activeClickedLink = $(link).closest(".ui-btn").not(".ui-disabled");
						$activeClickedLink.addClass($.mobile.activeBtnClass);
						$("." + $.mobile.activePageClass + " .ui-btn").not(link).blur();
						// By caching the href value to data and switching the href to a #, we can avoid address bar showing in iOS. The click handler resets the href during its initial steps if this data is present
						$(link).jqmData("href", $(link).attr("href")).attr("href", "#");
					}
				}
			});
			// click routing - direct to HTTP or Ajax, accordingly
			$(document).bind("click", function(event) {
				if (!$.mobile.linkBindingEnabled) {
					return;
				}
				var link = findClosestLink(event.target),
					$link = $(link),
					httpCleanup;
				// If there is no link associated with the click or its not a left
				// click we want to ignore the click
				// TODO teach $.mobile.hijackable to operate on raw dom elements so the link wrapping
				// can be avoided
				if (!link || event.which > 1 || !$link.jqmHijackable().length) {
					return;
				}
				//remove active link class if external (then it won't be there if you come back)
				httpCleanup = function() {
					window.setTimeout(function() {
						removeActiveLinkClass(true);
					}, 200);
				};
				// If there's data cached for the real href value, set the link's href back to it again. This pairs with an address bar workaround from the vclick handler
				if ($link.jqmData("href")) {
					$link.attr("href", $link.jqmData("href"));
				}
				//if there's a data-rel=back attr, go back in history
				if ($link.is(":jqmData(rel='back')")) {
					window.history.back();
					return false;
				}
				var baseUrl = getClosestBaseUrl($link),
					//get href, if defined, otherwise default to empty hash
					href = path.makeUrlAbsolute($link.attr("href") || "#", baseUrl);
				//if ajax is disabled, exit early
				if (!$.mobile.ajaxEnabled && !path.isEmbeddedPage(href)) {
					httpCleanup();
					//use default click handling
					return;
				}
				// XXX_jblas: Ideally links to application pages should be specified as
				//            an url to the application document with a hash that is either
				//            the site relative path or id to the page. But some of the
				//            internal code that dynamically generates sub-pages for nested
				//            lists and select dialogs, just write a hash in the link they
				//            create. This means the actual URL path is based on whatever
				//            the current value of the base tag is at the time this code
				//            is called. For now we are just assuming that any url with a
				//            hash in it is an application page reference.
				if (href.search("#") != -1) {
					href = href.replace(/[^#]*#/, "");
					if (!href) {
						//link was an empty hash meant purely
						//for interaction, so we ignore it.
						event.preventDefault();
						return;
					} else if (path.isPath(href)) {
						//we have apath so make it the href we want to load.
						href = path.makeUrlAbsolute(href, baseUrl);
					} else {
						//we have a simple id so use the documentUrl as its base.
						href = path.makeUrlAbsolute("#" + href, documentUrl.hrefNoHash);
					}
				}
				// Should we handle this link, or let the browser deal with it?
				var useDefaultUrlHandling = $link.is("[rel='external']") || $link.is(":jqmData(ajax='false')") || $link.is("[target]"),
					// Some embedded browsers, like the web view in Phone Gap, allow cross-domain XHR
					// requests if the document doing the request was loaded via the file:// protocol.
					// This is usually to allow the application to "phone home" and fetch app specific
					// data. We normally let the browser handle external/cross-domain urls, but if the
					// allowCrossDomainPages option is true, we will allow cross-domain http/https
					// requests to go through our page loading logic.
					isCrossDomainPageLoad = ($.mobile.allowCrossDomainPages && documentUrl.protocol === "file:" && href.search(/^https?:/) != -1),
					//check for protocol or rel and its not an embedded page
					//TODO overlap in logic from isExternal, rel=external check should be
					//     moved into more comprehensive isExternalLink
					isExternal = useDefaultUrlHandling || (path.isExternal(href) && !isCrossDomainPageLoad);
				if (isExternal) {
					httpCleanup();
					//use default click handling
					return;
				}
				//use ajax
				var transition = $link.jqmData("transition"),
					direction = $link.jqmData("direction"),
					reverse = (direction && direction === "reverse") ||
					// deprecated - remove by 1.0
					$link.jqmData("back"),
					//this may need to be more specific as we use data-rel more
					role = $link.attr("data-" + $.mobile.ns + "rel") || undefined;
				$.mobile.changePage(href, {
					transition: transition,
					reverse: reverse,
					role: role
				});
				event.preventDefault();
			});
			//prefetch pages when anchors with data-prefetch are encountered
			$(document).delegate(".ui-page", "pageshow.prefetch", function() {
				var urls = [];
				$(this).find("a:jqmData(prefetch)").each(function() {
					var $link = $(this),
						url = $link.attr("href");
					if (url && $.inArray(url, urls) === -1) {
						urls.push(url);
						$.mobile.loadPage(url, {
							role: $link.attr("data-" + $.mobile.ns + "rel")
						});
					}
				});
			});
			$.mobile._handleHashChange = function(hash) {
				//find first page via hash
				var to = path.stripHash(hash),
					//transition is false if it's the first page, undefined otherwise (and may be overridden by default)
					transition = $.mobile.urlHistory.stack.length === 0 ? "none" : undefined,
					// default options for the changPage calls made after examining the current state
					// of the page and the hash
					changePageOptions = {
						transition: transition,
						changeHash: false,
						fromHashChange: true
					};
				//if listening is disabled (either globally or temporarily), or it's a dialog hash
				if (!$.mobile.hashListeningEnabled || urlHistory.ignoreNextHashChange) {
					urlHistory.ignoreNextHashChange = false;
					return;
				}
				// special case for dialogs
				if (urlHistory.stack.length > 1 && to.indexOf(dialogHashKey) > -1) {
					// If current active page is not a dialog skip the dialog and continue
					// in the same direction
					if (!$.mobile.activePage.is(".ui-dialog")) {
						//determine if we're heading forward or backward and continue accordingly past
						//the current dialog
						urlHistory.directHashChange({
							currentUrl: to,
							isBack: function() {
								window.history.back();
							},
							isForward: function() {
								window.history.forward();
							}
						});
						// prevent changePage()
						return;
					} else {
						// if the current active page is a dialog and we're navigating
						// to a dialog use the dialog objected saved in the stack
						urlHistory.directHashChange({
							currentUrl: to,
							// regardless of the direction of the history change
							// do the following
							either: function(isBack) {
								var active = $.mobile.urlHistory.getActive();
								to = active.pageUrl;
								// make sure to set the role, transition and reversal
								// as most of this is lost by the domCache cleaning
								$.extend(changePageOptions, {
									role: active.role,
									transition: active.transition,
									reverse: isBack
								});
							}
						});
					}
				}
				//if to is defined, load it
				if (to) {
					// At this point, 'to' can be one of 3 things, a cached page element from
					// a history stack entry, an id, or site-relative/absolute URL. If 'to' is
					// an id, we need to resolve it against the documentBase, not the location.href,
					// since the hashchange could've been the result of a forward/backward navigation
					// that crosses from an external page/dialog to an internal page/dialog.
					to = (typeof to === "string" && !path.isPath(to)) ? (path.makeUrlAbsolute('#' + to, documentBase)) : to;
					$.mobile.changePage(to, changePageOptions);
				} else {
					//there's no hash, go to the first page in the dom
					$.mobile.changePage($.mobile.firstPage, changePageOptions);
				}
			};
			//hashchange event handler
			$window.bind("hashchange", function(e, triggered) {
				$.mobile._handleHashChange(location.hash);
			});
			//set page min-heights to be device specific
			// prevent to set min-height - modified by ysjung (2012-06-07)
			//$( document ).bind( "pageshow", resetActivePageHeight );
			//$( window ).bind( "throttledresize", resetActivePageHeight );
		}; //_registerInternalEvents callback
	})(jQuery);
	(function($, window) {
		// For now, let's Monkeypatch this onto the end of $.mobile._registerInternalEvents
		// Scope self to pushStateHandler so we can reference it sanely within the
		// methods handed off as event handlers
		var pushStateHandler = {},
			self = pushStateHandler,
			$win = $(window),
			url = $.mobile.path.parseUrl(location.href);
		$.extend(pushStateHandler, {
			// TODO move to a path helper, this is rather common functionality
			initialFilePath: (function() {
				return url.pathname + url.search;
			})(),
			initialHref: url.hrefNoHash,
			state: function() {
				return {
					hash: location.hash || "#" + self.initialFilePath,
					title: document.title,
					// persist across refresh
					initialHref: self.initialHref
				};
			},
			resetUIKeys: function(url) {
				var dialog = $.mobile.dialogHashKey,
					subkey = "&" + $.mobile.subPageUrlKey,
					dialogIndex = url.indexOf(dialog);
				if (dialogIndex > -1) {
					url = url.slice(0, dialogIndex) + "#" + url.slice(dialogIndex);
				} else if (url.indexOf(subkey) > -1) {
					url = url.split(subkey).join("#" + subkey);
				}
				return url;
			},
			hashValueAfterReset: function(url) {
				var resetUrl = self.resetUIKeys(url);
				return $.mobile.path.parseUrl(resetUrl).hash;
			},
			// TODO sort out a single barrier to hashchange functionality
			nextHashChangePrevented: function(value) {
				$.mobile.urlHistory.ignoreNextHashChange = value;
				self.onHashChangeDisabled = value;
			},
			// on hash change we want to clean up the url
			// NOTE this takes place *after* the vanilla navigation hash change
			// handling has taken place and set the state of the DOM
			onHashChange: function(e) {
				// disable this hash change
				if (self.onHashChangeDisabled) {
					return;
				}
				var href, state, hash = location.hash,
					isPath = $.mobile.path.isPath(hash),
					resolutionUrl = isPath ? location.href : $.mobile.getDocumentUrl();
				hash = isPath ? hash.replace("#", "") : hash;
				// propulate the hash when its not available
				state = self.state();
				// make the hash abolute with the current href
				href = $.mobile.path.makeUrlAbsolute(hash, resolutionUrl);
				if (isPath) {
					href = self.resetUIKeys(href);
				}
				// replace the current url with the new href and store the state
				// Note that in some cases we might be replacing an url with the
				// same url. We do this anyways because we need to make sure that
				// all of our history entries have a state object associated with
				// them. This allows us to work around the case where window.history.back()
				// is called to transition from an external page to an embedded page.
				// In that particular case, a hashchange event is *NOT* generated by the browser.
				// Ensuring each history entry has a state object means that onPopState()
				// will always trigger our hashchange callback even when a hashchange event
				// is not fired.
				history.replaceState(state, document.title, href);
			},
			// on popstate (ie back or forward) we need to replace the hash that was there previously
			// cleaned up by the additional hash handling
			onPopState: function(e) {
				var poppedState = e.originalEvent.state,
					timeout, fromHash, toHash, hashChanged;
				// if there's no state its not a popstate we care about, eg chrome's initial popstate
				if (poppedState) {
					// the active url in the history stack will still be from the previous state
					// so we can use it to verify if a hashchange will be fired from the popstate
					fromHash = self.hashValueAfterReset($.mobile.urlHistory.getActive().url);
					// the hash stored in the state popped off the stack will be our currenturl or
					// the url to which we wish to navigate
					toHash = self.hashValueAfterReset(poppedState.hash.replace("#", ""));
					// if the hashes of the urls are different we must assume that the browser
					// will fire a hashchange
					hashChanged = fromHash !== toHash;
					// unlock hash handling once the hashchange caused be the popstate has fired
					if (hashChanged) {
						$win.one("hashchange.pushstate", function() {
							self.nextHashChangePrevented(false);
						});
					}
					// enable hash handling for the the _handleHashChange call
					self.nextHashChangePrevented(false);
					// change the page based on the hash
					$.mobile._handleHashChange(poppedState.hash);
					// only prevent another hash change handling if a hash change will be fired
					// by the browser
					if (hashChanged) {
						// disable hash handling until one of the above timers fires
						self.nextHashChangePrevented(true);
					}
				}
			},
			init: function() {
				$win.bind("hashchange", self.onHashChange);
				// Handle popstate events the occur through history changes
				$win.bind("popstate", self.onPopState);
				// if there's no hash, we need to replacestate for returning to home
				if (location.hash === "") {
					history.replaceState(self.state(), document.title, location.href);
				}
			}
		});
		$(function() {
			if ($.mobile.pushStateEnabled && $.support.pushState) {
				pushStateHandler.init();
			}
		});
	})(jQuery, this);
/*
* fallback transition for pop in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/
	(function($, window, undefined) {
		$.mobile.transitionFallbacks.pop = "fade";
	})(jQuery, this);
/*
* fallback transition for slide in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/
	(function($, window, undefined) {
		// Use the simultaneous transition handler for slide transitions
		$.mobile.transitionHandlers.slide = $.mobile.transitionHandlers.simultaneous;
		// Set the slide transition's fallback to "fade"
		$.mobile.transitionFallbacks.slide = "fade";
	})(jQuery, this);
/*
* fallback transition for slidedown in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/
	(function($, window, undefined) {
		$.mobile.transitionFallbacks.slidedown = "fade";
	})(jQuery, this);
/*
* fallback transition for slideup in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/
	(function($, window, undefined) {
		$.mobile.transitionFallbacks.slideup = "fade";
	})(jQuery, this);
/*
* fallback transition for flip in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/
	(function($, window, undefined) {
		$.mobile.transitionFallbacks.flip = "fade";
	})(jQuery, this);
/*
* fallback transition for flow in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/
	(function($, window, undefined) {
		$.mobile.transitionFallbacks.flow = "fade";
	})(jQuery, this);
/*
* fallback transition for turn in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/
	(function($, window, undefined) {
		$.mobile.transitionFallbacks.turn = "fade";
	})(jQuery, this);
	(function($, undefined) {
		$.mobile.page.prototype.options.degradeInputs = {
			color: false,
			date: false,
			datetime: false,
			"datetime-local": false,
			email: false,
			month: false,
			number: false,
			range: "number",
			search: "text",
			tel: false,
			time: false,
			url: false,
			week: false
		};
		//auto self-init widgets
		$(document).bind("pagecreate create", function(e) {
			var page = $.mobile.closestPageData($(e.target)),
				options;
			if (!page) {
				return;
			}
			options = page.options;
			// degrade inputs to avoid poorly implemented native functionality
			$(e.target).find("input").not(page.keepNativeSelector()).each(function() {
				var $this = $(this),
					type = this.getAttribute("type"),
					optType = options.degradeInputs[type] || "text";
				if (options.degradeInputs[type]) {
					var html = $("<div>").html($this.clone()).html(),
						// In IE browsers, the type sometimes doesn't exist in the cloned markup, so we replace the closing tag instead
						hasType = html.indexOf(" type=") > -1,
						findstr = hasType ? /\s+type=["']?\w+['"]?/ : /\/?>/,
						repstr = " type=\"" + optType + "\" data-" + $.mobile.ns + "type=\"" + type + "\"" + (hasType ? "" : ">");
					$this.replaceWith(html.replace(findstr, repstr));
				}
			});
		});
	})(jQuery);
	(function($, window, undefined) {
		$.widget("mobile.dialog", $.mobile.widget, {
			options: {
				closeBtnText: "Close",
				overlayTheme: "a",
				initSelector: ":jqmData(role='dialog')"
			},
			_create: function() {
				var self = this,
					$el = this.element,
					headerCloseButton = $("<a href='#' data-" + $.mobile.ns + "icon='delete' data-" + $.mobile.ns + "iconpos='notext'>" + this.options.closeBtnText + "</a>"),
					dialogWrap = $("<div/>", {
						"role": "dialog",
						"class": "ui-dialog-contain ui-corner-all ui-overlay-shadow"
					});
				$el.addClass("ui-dialog ui-overlay-" + this.options.overlayTheme);
				// Class the markup for dialog styling
				// Set aria role
				$el.wrapInner(dialogWrap).children().find(":jqmData(role='header')").prepend(headerCloseButton).end().children(':first-child').addClass("ui-corner-top").end().children(":last-child").addClass("ui-corner-bottom");
				// this must be an anonymous function so that select menu dialogs can replace
				// the close method. This is a change from previously just defining data-rel=back
				// on the button and letting nav handle it
				//
				// Use click rather than vclick in order to prevent the possibility of unintentionally
				// reopening the dialog if the dialog opening item was directly under the close button.
				headerCloseButton.bind("click", function() {
					self.close();
				});
/* bind events
			- clicks and submits should use the closing transition that the dialog opened with
			  unless a data-transition is specified on the link/form
			- if the click was on the close button, or the link has a data-rel="back" it'll go back in history naturally
		*/
				$el.bind("vclick submit", function(event) {
					var $target = $(event.target).closest(event.type === "vclick" ? "a" : "form"),
						active;
					if ($target.length && !$target.jqmData("transition")) {
						active = $.mobile.urlHistory.getActive() || {};
						$target.attr("data-" + $.mobile.ns + "transition", (active.transition || $.mobile.defaultDialogTransition)).attr("data-" + $.mobile.ns + "direction", "reverse");
					}
				}).bind("pagehide", function(e, ui) {
					$(this).find("." + $.mobile.activeBtnClass).removeClass($.mobile.activeBtnClass);
				})
				// Override the theme set by the page plugin on pageshow
				.bind("pagebeforeshow", function() {
					if (self.options.overlayTheme) {
						self.element.page("removeContainerBackground").page("setContainerBackground", self.options.overlayTheme);
					}
				});
			},
			// Close method goes back in history
			close: function() {
				window.history.back();
			}
		});
		//auto self-init widgets
		$(document).delegate($.mobile.dialog.prototype.options.initSelector, "pagecreate", function() {
			$.mobile.dialog.prototype.enhance(this);
		});
	})(jQuery, this);
	(function($, undefined) {
		$.fn.fieldcontain = function(options) {
			return this.addClass("ui-field-contain ui-body ui-br");
		};
		//auto self-init widgets
		$(document).bind("pagecreate create", function(e) {
			$(":jqmData(role='fieldcontain')", e.target).jqmEnhanceable().fieldcontain();
		});
	})(jQuery);
	(function($, undefined) {
		$.fn.grid = function(options) {
			return this.each(function() {
				var $this = $(this),
					o = $.extend({
						grid: null
					}, options),
					$kids = $this.children(),
					gridCols = {
						solo: 1,
						a: 2,
						b: 3,
						c: 4,
						d: 5
					},
					grid = o.grid,
					iterator;
				if (!grid) {
					if ($kids.length <= 5) {
						for (var letter in gridCols) {
							if (gridCols[letter] === $kids.length) {
								grid = letter;
							}
						}
					} else {
						grid = "a";
					}
				}
				iterator = gridCols[grid];
				$this.addClass("ui-grid-" + grid);
				$kids.filter(":nth-child(" + iterator + "n+1)").addClass("ui-block-a");
				if (iterator > 1) {
					$kids.filter(":nth-child(" + iterator + "n+2)").addClass("ui-block-b");
				}
				if (iterator > 2) {
					$kids.filter(":nth-child(3n+3)").addClass("ui-block-c");
				}
				if (iterator > 3) {
					$kids.filter(":nth-child(4n+4)").addClass("ui-block-d");
				}
				if (iterator > 4) {
					$kids.filter(":nth-child(5n+5)").addClass("ui-block-e");
				}
			});
		};
	})(jQuery);
	(function($, undefined) {
		$(document).bind("pagecreate create", function(e) {
			$(":jqmData(role='nojs')", e.target).addClass("ui-nojs");
		});
	})(jQuery);
	(function($, undefined) {
		$.fn.buttonMarkup = function(options) {
			var $workingSet = this;
			// Enforce options to be of type string
			options = (options && ($.type(options) == "object")) ? options : {};
			for (var i = 0; i < $workingSet.length; i++) {
				var el = $workingSet.eq(i),
					e = el[0],
					o = $.extend({}, $.fn.buttonMarkup.defaults, {
						icon: options.icon !== undefined ? options.icon : el.jqmData("icon"),
						iconpos: options.iconpos !== undefined ? options.iconpos : el.jqmData("iconpos"),
						theme: options.theme !== undefined ? options.theme : el.jqmData("theme") || $.mobile.getInheritedTheme(el, "c"),
						inline: options.inline !== undefined ? options.inline : el.jqmData("inline"),
						shadow: options.shadow !== undefined ? options.shadow : el.jqmData("shadow"),
						corners: options.corners !== undefined ? options.corners : el.jqmData("corners"),
						iconshadow: options.iconshadow !== undefined ? options.iconshadow : el.jqmData("iconshadow"),
						mini: options.mini !== undefined ? options.mini : el.jqmData("mini")
					}, options),
					// Classes Defined
					innerClass = "ui-btn-inner",
					textClass = "ui-btn-text",
					buttonClass, iconClass,
					// Button inner markup
					buttonInner, buttonText, buttonIcon, buttonElements;
				$.each(o, function(key, value) {
					e.setAttribute("data-" + $.mobile.ns + key, value);
					el.jqmData(key, value);
				});
				// Check if this element is already enhanced
				buttonElements = $.data(((e.tagName === "INPUT" || e.tagName === "BUTTON") ? e.parentNode : e), "buttonElements");
				if (buttonElements) {
					e = buttonElements.outer;
					el = $(e);
					buttonInner = buttonElements.inner;
					buttonText = buttonElements.text;
					// We will recreate this icon below
					$(buttonElements.icon).remove();
					buttonElements.icon = null;
				}
				else {
					buttonInner = document.createElement(o.wrapperEls);
					buttonText = document.createElement(o.wrapperEls);
				}
				buttonIcon = o.icon ? document.createElement("span") : null;
				if (attachEvents && !buttonElements) {
					attachEvents();
				}
				// if not, try to find closest theme container	
				if (!o.theme) {
					o.theme = $.mobile.getInheritedTheme(el, "c");
				}
				buttonClass = "ui-btn ui-btn-up-" + o.theme;
				buttonClass += o.inline ? " ui-btn-inline" : "";
				buttonClass += o.shadow ? " ui-shadow" : "";
				buttonClass += o.corners ? " ui-btn-corner-all" : "";
				if (o.mini !== undefined) {
					// Used to control styling in headers/footers, where buttons default to `mini` style.
					buttonClass += o.mini ? " ui-mini" : " ui-fullsize";
				}
				if (o.inline !== undefined) {
					// Used to control styling in headers/footers, where buttons default to `mini` style.
					buttonClass += o.inline === false ? " ui-btn-block" : " ui-btn-inline";
				}
				if (o.icon) {
					o.icon = "ui-icon-" + o.icon;
					o.iconpos = o.iconpos || "left";
					iconClass = "ui-icon " + o.icon;
					if (o.iconshadow) {
						iconClass += " ui-icon-shadow";
					}
				}
				if (o.iconpos) {
					buttonClass += " ui-btn-icon-" + o.iconpos;
					if (o.iconpos == "notext" && !el.attr("title")) {
						el.attr("title", el.getEncodedText());
					}
				}
				innerClass += o.corners ? " ui-btn-corner-all" : "";
				if (o.iconpos && o.iconpos === "notext" && !el.attr("title")) {
					el.attr("title", el.getEncodedText());
				}
				if (buttonElements) {
					el.removeClass(buttonElements.bcls || "");
				}
				el.removeClass("ui-link").addClass(buttonClass);
				buttonInner.className = innerClass;
				buttonText.className = textClass;
				if (!buttonElements) {
					buttonInner.appendChild(buttonText);
				}
				if (buttonIcon) {
					buttonIcon.className = iconClass;
					if (!(buttonElements && buttonElements.icon)) {
						buttonIcon.appendChild(document.createTextNode("\u00a0"));
						buttonInner.appendChild(buttonIcon);
					}
				}
				while (e.firstChild && !buttonElements) {
					buttonText.appendChild(e.firstChild);
				}
				if (!buttonElements) {
					e.appendChild(buttonInner);
				}
				// Assign a structure containing the elements of this button to the elements of this button. This
				// will allow us to recognize this as an already-enhanced button in future calls to buttonMarkup().
				buttonElements = {
					bcls: buttonClass,
					outer: e,
					inner: buttonInner,
					text: buttonText,
					icon: buttonIcon
				};
				$.data(e, 'buttonElements', buttonElements);
				$.data(buttonInner, 'buttonElements', buttonElements);
				$.data(buttonText, 'buttonElements', buttonElements);
				if (buttonIcon) {
					$.data(buttonIcon, 'buttonElements', buttonElements);
				}
			}
			return this;
		};
		$.fn.buttonMarkup.defaults = {
			corners: true,
			shadow: true,
			iconshadow: true,
			wrapperEls: "span"
		};
		function closestEnabledButton(element) {
			var cname;
			while (element) {
				// Note that we check for typeof className below because the element we
				// handed could be in an SVG DOM where className on SVG elements is defined to
				// be of a different type (SVGAnimatedString). We only operate on HTML DOM
				// elements, so we look for plain "string".
				cname = (typeof element.className === 'string') && (element.className + ' ');
				if (cname && cname.indexOf("ui-btn ") > -1 && cname.indexOf("ui-disabled ") < 0) {
					break;
				}
				element = element.parentNode;
			}
			return element;
		}
		var attachEvents = function() {
			var hoverDelay = $.mobile.buttonMarkup.hoverDelay,
				hov, foc;
			$(document).bind({
				"vmousedown vmousecancel vmouseup vmouseover vmouseout focus blur scrollstart": function(event) {
					var theme, $btn = $(closestEnabledButton(event.target)),
						evt = event.type;
					if ($btn.length) {
						theme = $btn.attr("data-" + $.mobile.ns + "theme");
						if (evt === "vmousedown") {
							if ($.support.touch) {
								hov = setTimeout(function() {
									$btn.removeClass("ui-btn-up-" + theme).addClass("ui-btn-down-" + theme);
								}, hoverDelay);
							} else {
								$btn.removeClass("ui-btn-up-" + theme).addClass("ui-btn-down-" + theme);
							}
						} else if (evt === "vmousecancel" || evt === "vmouseup") {
							$btn.removeClass("ui-btn-down-" + theme).addClass("ui-btn-up-" + theme);
						} else if (evt === "vmouseover" || evt === "focus") {
							if ($.support.touch) {
								foc = setTimeout(function() {
									$btn.removeClass("ui-btn-up-" + theme).addClass("ui-btn-hover-" + theme);
								}, hoverDelay);
							} else {
								$btn.removeClass("ui-btn-up-" + theme).addClass("ui-btn-hover-" + theme);
							}
						} else if (evt === "vmouseout" || evt === "blur" || evt === "scrollstart") {
							$btn.removeClass("ui-btn-hover-" + theme + " ui-btn-down-" + theme).addClass("ui-btn-up-" + theme);
							if (hov) {
								clearTimeout(hov);
							}
							if (foc) {
								clearTimeout(foc);
							}
						}
					}
				},
				"focusin focus": function(event) {
					$(closestEnabledButton(event.target)).addClass($.mobile.focusClass);
				},
				"focusout blur": function(event) {
					$(closestEnabledButton(event.target)).removeClass($.mobile.focusClass);
				}
			});
			attachEvents = null;
		};
		//links in bars, or those with  data-role become buttons
		//auto self-init widgets
		$(document).bind("pagecreate create", function(e) {
			$(":jqmData(role='button'), .ui-bar > a, .ui-header > a, .ui-footer > a, .ui-bar > :jqmData(role='controlgroup') > a", e.target).not(".ui-btn, :jqmData(role='none'), :jqmData(role='nojs')").buttonMarkup();
		});
	})(jQuery);
	(function($, undefined) {
		$.mobile.page.prototype.options.backBtnText = "Back";
		$.mobile.page.prototype.options.addBackBtn = false;
		$.mobile.page.prototype.options.backBtnTheme = null;
		$.mobile.page.prototype.options.headerTheme = "a";
		$.mobile.page.prototype.options.footerTheme = "a";
		$.mobile.page.prototype.options.contentTheme = null;
		$(document).delegate(":jqmData(role='page'), :jqmData(role='dialog')", "pagecreate", function(e) {
			var $page = $(this),
				o = $page.data("page").options,
				pageRole = $page.jqmData("role"),
				pageTheme = o.theme;
			$(":jqmData(role='header'), :jqmData(role='footer'), :jqmData(role='content')", this).jqmEnhanceable().each(function() {
				var $this = $(this),
					role = $this.jqmData("role"),
					theme = $this.jqmData("theme"),
					contentTheme = theme || o.contentTheme || (pageRole === "dialog" && pageTheme),
					$headeranchors, leftbtn, rightbtn, backBtn;
				$this.addClass("ui-" + role);
				//apply theming and markup modifications to page,header,content,footer
				if (role === "header" || role === "footer") {
					var thisTheme = theme || (role === "header" ? o.headerTheme : o.footerTheme) || pageTheme;
					$this
					//add theme class
					.addClass("ui-bar-" + thisTheme)
					// Add ARIA role
					.attr("role", role === "header" ? "banner" : "contentinfo");
					if (role === "header") {
						// Right,left buttons
						$headeranchors = $this.children("a");
						leftbtn = $headeranchors.hasClass("ui-btn-left");
						rightbtn = $headeranchors.hasClass("ui-btn-right");
						leftbtn = leftbtn || $headeranchors.eq(0).not(".ui-btn-right").addClass("ui-btn-left").length;
						rightbtn = rightbtn || $headeranchors.eq(1).addClass("ui-btn-right").length;
					}
					// Auto-add back btn on pages beyond first view
					if (o.addBackBtn && role === "header" && $(".ui-page").length > 1 && $page.jqmData("url") !== $.mobile.path.stripHash(location.hash) && !leftbtn) {
						backBtn = $("<a href='#' class='ui-btn-left' data-" + $.mobile.ns + "rel='back' data-" + $.mobile.ns + "icon='arrow-l'>" + o.backBtnText + "</a>")
						// If theme is provided, override default inheritance
						.attr("data-" + $.mobile.ns + "theme", o.backBtnTheme || thisTheme).prependTo($this);
					}
					// Page title
					$this.children("h1, h2, h3, h4, h5, h6").addClass("ui-title")
					// Regardless of h element number in src, it becomes h1 for the enhanced page
					.attr({
						"role": "heading",
						"aria-level": "1"
					});
				} else if (role === "content") {
					if (contentTheme) {
						$this.addClass("ui-body-" + (contentTheme));
					}
					// Add ARIA role
					$this.attr("role", "main");
				}
			});
		});
	})(jQuery);
	(function($, undefined) {
		$.widget("mobile.collapsible", $.mobile.widget, {
			options: {
				expandCueText: " click to expand contents",
				collapseCueText: " click to collapse contents",
				collapsed: true,
				heading: "h1,h2,h3,h4,h5,h6,legend",
				theme: null,
				contentTheme: null,
				iconTheme: "d",
				mini: false,
				initSelector: ":jqmData(role='collapsible')"
			},
			_create: function() {
				var $el = this.element,
					o = this.options,
					collapsible = $el.addClass("ui-collapsible"),
					collapsibleHeading = $el.children(o.heading).first(),
					collapsibleContent = collapsible.wrapInner("<div class='ui-collapsible-content'></div>").find(".ui-collapsible-content"),
					collapsibleSet = $el.closest(":jqmData(role='collapsible-set')").addClass("ui-collapsible-set");
				// Replace collapsibleHeading if it's a legend
				if (collapsibleHeading.is("legend")) {
					collapsibleHeading = $("<div role='heading'>" + collapsibleHeading.html() + "</div>").insertBefore(collapsibleHeading);
					collapsibleHeading.next().remove();
				}
				// If we are in a collapsible set
				if (collapsibleSet.length) {
					// Inherit the theme from collapsible-set
					if (!o.theme) {
						o.theme = collapsibleSet.jqmData("theme") || $.mobile.getInheritedTheme(collapsibleSet, "c");
					}
					// Inherit the content-theme from collapsible-set
					if (!o.contentTheme) {
						o.contentTheme = collapsibleSet.jqmData("content-theme");
					}
					// Gets the preference icon position in the set
					if (!o.iconPos) {
						o.iconPos = collapsibleSet.jqmData("iconpos");
					}
					if (!o.mini) {
						o.mini = collapsibleSet.jqmData("mini");
					}
				}
				collapsibleContent.addClass((o.contentTheme) ? ("ui-body-" + o.contentTheme) : "");
				collapsibleHeading
				//drop heading in before content
				.insertBefore(collapsibleContent)
				//modify markup & attributes
				.addClass("ui-collapsible-heading").append("<span class='ui-collapsible-heading-status'></span>").wrapInner("<a href='#' class='ui-collapsible-heading-toggle'></a>").find("a").first().buttonMarkup({
					shadow: false,
					corners: false,
					iconpos: $el.jqmData("iconpos") || o.iconPos || "left",
					icon: "plus",
					mini: o.mini,
					theme: o.theme
				}).add(".ui-btn-inner", $el).addClass("ui-corner-top ui-corner-bottom");
				//events
				collapsible.bind("expand collapse", function(event) {
					if (!event.isDefaultPrevented()) {
						event.preventDefault();
						var $this = $(this),
							isCollapse = (event.type === "collapse"),
							contentTheme = o.contentTheme;
						collapsibleHeading.toggleClass("ui-collapsible-heading-collapsed", isCollapse).find(".ui-collapsible-heading-status").text(isCollapse ? o.expandCueText : o.collapseCueText).end().find(".ui-icon").toggleClass("ui-icon-minus", !isCollapse).toggleClass("ui-icon-plus", isCollapse);
						$this.toggleClass("ui-collapsible-collapsed", isCollapse);
						collapsibleContent.toggleClass("ui-collapsible-content-collapsed", isCollapse).attr("aria-hidden", isCollapse);
						if (contentTheme && (!collapsibleSet.length || collapsible.jqmData("collapsible-last"))) {
							collapsibleHeading.find("a").first().add(collapsibleHeading.find(".ui-btn-inner")).toggleClass("ui-corner-bottom", isCollapse);
							collapsibleContent.toggleClass("ui-corner-bottom", !isCollapse);
						}
						collapsibleContent.trigger("updatelayout");
					}
				}).trigger(o.collapsed ? "collapse" : "expand");
				collapsibleHeading.bind("click", function(event) {
					var type = collapsibleHeading.is(".ui-collapsible-heading-collapsed") ? "expand" : "collapse";
					collapsible.trigger(type);
					event.preventDefault();
				});
			}
		});
		//auto self-init widgets
		$(document).bind("pagecreate create", function(e) {
			$.mobile.collapsible.prototype.enhanceWithin(e.target);
		});
	})(jQuery);
	(function($, undefined) {
		$.widget("mobile.collapsibleset", $.mobile.widget, {
			options: {
				initSelector: ":jqmData(role='collapsible-set')"
			},
			_create: function() {
				var $el = this.element.addClass("ui-collapsible-set"),
					o = this.options;
				// Inherit the theme from collapsible-set
				if (!o.theme) {
					o.theme = $.mobile.getInheritedTheme($el, "c");
				}
				// Inherit the content-theme from collapsible-set
				if (!o.contentTheme) {
					o.contentTheme = $el.jqmData("content-theme");
				}
				if (!o.corners) {
					o.corners = $el.jqmData("corners") === undefined ? true : false;
				}
				// Initialize the collapsible set if it's not already initialized
				if (!$el.jqmData("collapsiblebound")) {
					$el.jqmData("collapsiblebound", true).bind("expand collapse", function(event) {
						var isCollapse = (event.type === "collapse"),
							collapsible = $(event.target).closest(".ui-collapsible"),
							widget = collapsible.data("collapsible"),
							contentTheme = widget.options.contentTheme;
						if (contentTheme && collapsible.jqmData("collapsible-last")) {
							collapsible.find(widget.options.heading).first().find("a").first().add(".ui-btn-inner").toggleClass("ui-corner-bottom", isCollapse);
							collapsible.find(".ui-collapsible-content").toggleClass("ui-corner-bottom", !isCollapse);
						}
					}).bind("expand", function(event) {
						$(event.target).closest(".ui-collapsible").siblings(".ui-collapsible").trigger("collapse");
					});
				}
			},
			_init: function() {
				this.refresh();
			},
			refresh: function() {
				var $el = this.element,
					o = this.options,
					collapsiblesInSet = $el.children(":jqmData(role='collapsible')");
				$.mobile.collapsible.prototype.enhance(collapsiblesInSet.not(".ui-collapsible"));
				// clean up borders
				collapsiblesInSet.each(function() {
					$(this).find($.mobile.collapsible.prototype.options.heading).find("a").first().add(".ui-btn-inner").removeClass("ui-corner-top ui-corner-bottom");
				});
				collapsiblesInSet.first().find("a").first().addClass(o.corners ? "ui-corner-top" : "").find(".ui-btn-inner").addClass("ui-corner-top");
				collapsiblesInSet.last().jqmData("collapsible-last", true).find("a").first().addClass(o.corners ? "ui-corner-bottom" : "").find(".ui-btn-inner").addClass("ui-corner-bottom");
			}
		});
		//auto self-init widgets
		$(document).bind("pagecreate create", function(e) {
			$.mobile.collapsibleset.prototype.enhanceWithin(e.target);
		});
	})(jQuery);
	(function($, undefined) {
		$.widget("mobile.navbar", $.mobile.widget, {
			options: {
				iconpos: "top",
				grid: null,
				initSelector: ":jqmData(role='navbar')"
			},
			_create: function() {
				var $navbar = this.element,
					$navbtns = $navbar.find("a"),
					iconpos = $navbtns.filter(":jqmData(icon)").length ? this.options.iconpos : undefined;
				$navbar.addClass("ui-navbar").attr("role", "navigation").find("ul").jqmEnhanceable().grid({
					grid: this.options.grid
				});
				if (!iconpos) {
					$navbar.addClass("ui-navbar-noicons");
				}
				$navbtns.buttonMarkup({
					corners: false,
					shadow: false,
					inline: true,
					iconpos: iconpos
				});
				$navbar.delegate("a", "vclick", function(event) {
					if (!$(event.target).hasClass("ui-disabled")) {
						$navbtns.removeClass($.mobile.activeBtnClass);
						$(this).addClass($.mobile.activeBtnClass);
					}
				});
				// Buttons in the navbar with ui-state-persist class should regain their active state before page show
				$navbar.closest(".ui-page").bind("pagebeforeshow", function() {
					$navbtns.filter(".ui-state-persist").addClass($.mobile.activeBtnClass);
				});
			}
		});
		//auto self-init widgets
		$(document).bind("pagecreate create", function(e) {
			$.mobile.navbar.prototype.enhanceWithin(e.target);
		});
	})(jQuery);
	(function($, undefined) {
		//Keeps track of the number of lists per page UID
		//This allows support for multiple nested list in the same page
		//https://github.com/jquery/jquery-mobile/issues/1617
		var listCountPerPage = {};
		$.widget("mobile.listview", $.mobile.widget, {
			options: {
				theme: null,
				countTheme: "c",
				headerTheme: "b",
				dividerTheme: "b",
				splitIcon: "arrow-r",
				splitTheme: "b",
				mini: false,
				inset: false,
				initSelector: ":jqmData(role='listview')"
			},
			_create: function() {
				var t = this,
					listviewClasses = "";
				listviewClasses += t.options.inset ? " ui-listview-inset ui-corner-all ui-shadow " : "";
				listviewClasses += t.element.jqmData("mini") || t.options.mini === true ? " ui-mini" : "";
				// create listview markup
				t.element.addClass(function(i, orig) {
					return orig + " ui-listview " + listviewClasses;
				});
				t.refresh(true);
			},
			_removeCorners: function(li, which) {
				var top = "ui-corner-top ui-corner-tr ui-corner-tl",
					bot = "ui-corner-bottom ui-corner-br ui-corner-bl";
				li = li.add(li.find(".ui-btn-inner, .ui-li-link-alt, .ui-li-thumb"));
				if (which === "top") {
					li.removeClass(top);
				} else if (which === "bottom") {
					li.removeClass(bot);
				} else {
					li.removeClass(top + " " + bot);
				}
			},
			_refreshCorners: function(create) {
				var $li, $visibleli, $topli, $bottomli;
				if (this.options.inset) {
					$li = this.element.children("li");
					// at create time the li are not visible yet so we need to rely on .ui-screen-hidden
					$visibleli = create ? $li.not(".ui-screen-hidden") : $li.filter(":visible");
					this._removeCorners($li);
					// Select the first visible li element
					$topli = $visibleli.first().addClass("ui-corner-top");
					$topli.add($topli.find(".ui-btn-inner").not(".ui-li-link-alt span:first-child")).addClass("ui-corner-top").end().find(".ui-li-link-alt, .ui-li-link-alt span:first-child").addClass("ui-corner-tr").end().find(".ui-li-thumb").not(".ui-li-icon").addClass("ui-corner-tl");
					// Select the last visible li element
					$bottomli = $visibleli.last().addClass("ui-corner-bottom");
					$bottomli.add($bottomli.find(".ui-btn-inner")).find(".ui-li-link-alt").addClass("ui-corner-br").end().find(".ui-li-thumb").not(".ui-li-icon").addClass("ui-corner-bl");
				}
				if (!create) {
					this.element.trigger("updatelayout");
				}
			},
			// This is a generic utility method for finding the first
			// node with a given nodeName. It uses basic DOM traversal
			// to be fast and is meant to be a substitute for simple
			// $.fn.closest() and $.fn.children() calls on a single
			// element. Note that callers must pass both the lowerCase
			// and upperCase version of the nodeName they are looking for.
			// The main reason for this is that this function will be
			// called many times and we want to avoid having to lowercase
			// the nodeName from the element every time to ensure we have
			// a match. Note that this function lives here for now, but may
			// be moved into $.mobile if other components need a similar method.
			_findFirstElementByTagName: function(ele, nextProp, lcName, ucName) {
				var dict = {};
				dict[lcName] = dict[ucName] = true;
				while (ele) {
					if (dict[ele.nodeName]) {
						return ele;
					}
					ele = ele[nextProp];
				}
				return null;
			},
			_getChildrenByTagName: function(ele, lcName, ucName) {
				var results = [],
					dict = {};
				dict[lcName] = dict[ucName] = true;
				ele = ele.firstChild;
				while (ele) {
					if (dict[ele.nodeName]) {
						results.push(ele);
					}
					ele = ele.nextSibling;
				}
				return $(results);
			},
			_addThumbClasses: function(containers) {
				var i, img, len = containers.length;
				for (i = 0; i < len; i++) {
					img = $(this._findFirstElementByTagName(containers[i].firstChild, "nextSibling", "img", "IMG"));
					if (img.length) {
						img.addClass("ui-li-thumb");
						$(this._findFirstElementByTagName(img[0].parentNode, "parentNode", "li", "LI")).addClass(img.is(".ui-li-icon") ? "ui-li-has-icon" : "ui-li-has-thumb");
					}
				}
			},
			refresh: function(create) {
				this.parentPage = this.element.closest(".ui-page");
				this._createSubPages();
				var o = this.options,
					$list = this.element,
					self = this,
					dividertheme = $list.jqmData("dividertheme") || o.dividerTheme,
					listsplittheme = $list.jqmData("splittheme"),
					listspliticon = $list.jqmData("spliticon"),
					li = this._getChildrenByTagName($list[0], "li", "LI"),
					counter = $.support.cssPseudoElement || !$.nodeName($list[0], "ol") ? 0 : 1,
					itemClassDict = {},
					item, itemClass, itemTheme, a, last, splittheme, countParent, icon, imgParents, img, linkIcon;
				if (counter) {
					$list.find(".ui-li-dec").remove();
				}
				if (!o.theme) {
					o.theme = $.mobile.getInheritedTheme(this.element, "c");
				}
				for (var pos = 0, numli = li.length; pos < numli; pos++) {
					item = li.eq(pos);
					itemClass = "ui-li";
					// If we're creating the element, we update it regardless
					if (create || !item.hasClass("ui-li")) {
						itemTheme = item.jqmData("theme") || o.theme;
						a = this._getChildrenByTagName(item[0], "a", "A");
						if (a.length) {
							icon = item.jqmData("icon");
							item.buttonMarkup({
								wrapperEls: "div",
								shadow: false,
								corners: false,
								iconpos: "right",
								icon: a.length > 1 || icon === false ? false : icon || "arrow-r",
								theme: itemTheme
							});
							if ((icon != false) && (a.length == 1)) {
								item.addClass("ui-li-has-arrow");
							}
							a.first().removeClass("ui-link").addClass("ui-link-inherit");
							if (a.length > 1) {
								itemClass += " ui-li-has-alt";
								last = a.last();
								splittheme = listsplittheme || last.jqmData("theme") || o.splitTheme;
								linkIcon = last.jqmData("icon");
								last.appendTo(item).attr("title", last.getEncodedText()).addClass("ui-li-link-alt").empty().buttonMarkup({
									shadow: false,
									corners: false,
									theme: itemTheme,
									icon: false,
									iconpos: false
								}).find(".ui-btn-inner").append(
								$(document.createElement("span")).buttonMarkup({
									shadow: true,
									corners: true,
									theme: splittheme,
									iconpos: "notext",
									// link icon overrides list item icon overrides ul element overrides options
									icon: linkIcon || icon || listspliticon || o.splitIcon
								}));
							}
						} else if (item.jqmData("role") === "list-divider") {
							itemClass += " ui-li-divider ui-bar-" + dividertheme;
							item.attr("role", "heading");
							//reset counter when a divider heading is encountered
							if (counter) {
								counter = 1;
							}
						} else {
							itemClass += " ui-li-static ui-body-" + itemTheme;
						}
					}
					if (counter && itemClass.indexOf("ui-li-divider") < 0) {
						countParent = item.is(".ui-li-static:first") ? item : item.find(".ui-link-inherit");
						countParent.addClass("ui-li-jsnumbering").prepend("<span class='ui-li-dec'>" + (counter++) + ". </span>");
					}
					// Instead of setting item class directly on the list item and its
					// btn-inner at this point in time, push the item into a dictionary
					// that tells us what class to set on it so we can do this after this
					// processing loop is finished.
					if (!itemClassDict[itemClass]) {
						itemClassDict[itemClass] = [];
					}
					itemClassDict[itemClass].push(item[0]);
				}
				// Set the appropriate listview item classes on each list item
				// and their btn-inner elements. The main reason we didn't do this
				// in the for-loop above is because we can eliminate per-item function overhead
				// by calling addClass() and children() once or twice afterwards. This
				// can give us a significant boost on platforms like WP7.5.
				for (itemClass in itemClassDict) {
					$(itemClassDict[itemClass]).addClass(itemClass).children(".ui-btn-inner").addClass(itemClass);
				}
				$list.find("h1, h2, h3, h4, h5, h6").addClass("ui-li-heading").end().find("p, dl").addClass("ui-li-desc").end().find(".ui-li-aside").each(function() {
					var $this = $(this);
					$this.prependTo($this.parent()); //shift aside to front for css float
				}).end().find(".ui-li-count").each(function() {
					$(this).closest("li").addClass("ui-li-has-count");
				}).addClass("ui-btn-up-" + ($list.jqmData("counttheme") || this.options.countTheme) + " ui-btn-corner-all");
				// The idea here is to look at the first image in the list item
				// itself, and any .ui-link-inherit element it may contain, so we
				// can place the appropriate classes on the image and list item.
				// Note that we used to use something like:
				//
				//    li.find(">img:eq(0), .ui-link-inherit>img:eq(0)").each( ... );
				//
				// But executing a find() like that on Windows Phone 7.5 took a
				// really long time. Walking things manually with the code below
				// allows the 400 listview item page to load in about 3 seconds as
				// opposed to 30 seconds.
				this._addThumbClasses(li);
				this._addThumbClasses($list.find(".ui-link-inherit"));
				this._refreshCorners(create);
			},
			//create a string for ID/subpage url creation
			_idStringEscape: function(str) {
				return str.replace(/[^a-zA-Z0-9]/g, '-');
			},
			_createSubPages: function() {
				var parentList = this.element,
					parentPage = parentList.closest(".ui-page"),
					parentUrl = parentPage.jqmData("url"),
					parentId = parentUrl || parentPage[0][$.expando],
					parentListId = parentList.attr("id"),
					o = this.options,
					dns = "data-" + $.mobile.ns,
					self = this,
					persistentFooterID = parentPage.find(":jqmData(role='footer')").jqmData("id"),
					hasSubPages;
				if (typeof listCountPerPage[parentId] === "undefined") {
					listCountPerPage[parentId] = -1;
				}
				parentListId = parentListId || ++listCountPerPage[parentId];
				$(parentList.find("li>ul, li>ol").toArray().reverse()).each(function(i) {
					var self = this,
						list = $(this),
						listId = list.attr("id") || parentListId + "-" + i,
						parent = list.parent(),
						nodeEls = $(list.prevAll().toArray().reverse()),
						nodeEls = nodeEls.length ? nodeEls : $("<span>" + $.trim(parent.contents()[0].nodeValue) + "</span>"),
						title = nodeEls.first().getEncodedText(),
						//url limits to first 30 chars of text
						id = (parentUrl || "") + "&" + $.mobile.subPageUrlKey + "=" + listId,
						theme = list.jqmData("theme") || o.theme,
						countTheme = list.jqmData("counttheme") || parentList.jqmData("counttheme") || o.countTheme,
						newPage, anchor;
					//define hasSubPages for use in later removal
					hasSubPages = true;
					newPage = list.detach().wrap("<div " + dns + "role='page' " + dns + "url='" + id + "' " + dns + "theme='" + theme + "' " + dns + "count-theme='" + countTheme + "'><div " + dns + "role='content'></div></div>").parent().before("<div " + dns + "role='header' " + dns + "theme='" + o.headerTheme + "'><div class='ui-title'>" + title + "</div></div>").after(persistentFooterID ? $("<div " + dns + "role='footer' " + dns + "id='" + persistentFooterID + "'>") : "").parent().appendTo($.mobile.pageContainer);
					newPage.page();
					anchor = parent.find('a:first');
					if (!anchor.length) {
						anchor = $("<a/>").html(nodeEls || title).prependTo(parent.empty());
					}
					anchor.attr("href", "#" + id);
				}).listview();
				// on pagehide, remove any nested pages along with the parent page, as long as they aren't active
				// and aren't embedded
				if (hasSubPages && parentPage.is(":jqmData(external-page='true')") && parentPage.data("page").options.domCache === false) {
					var newRemove = function(e, ui) {
						var nextPage = ui.nextPage,
							npURL;
						if (ui.nextPage) {
							npURL = nextPage.jqmData("url");
							if (npURL.indexOf(parentUrl + "&" + $.mobile.subPageUrlKey) !== 0) {
								self.childPages().remove();
								parentPage.remove();
							}
						}
					};
					// unbind the original page remove and replace with our specialized version
					parentPage.unbind("pagehide.remove").bind("pagehide.remove", newRemove);
				}
			},
			// TODO sort out a better way to track sub pages of the listview this is brittle
			childPages: function() {
				var parentUrl = this.parentPage.jqmData("url");
				return $(":jqmData(url^='" + parentUrl + "&" + $.mobile.subPageUrlKey + "')");
			}
		});
		//auto self-init widgets
		$(document).bind("pagecreate create", function(e) {
			$.mobile.listview.prototype.enhanceWithin(e.target);
		});
	})(jQuery);
/*
* "checkboxradio" plugin
*/
	(function($, undefined) {
		$.widget("mobile.checkboxradio", $.mobile.widget, {
			options: {
				theme: null,
				initSelector: "input[type='checkbox'],input[type='radio']"
			},
			_create: function() {
				var self = this,
					input = this.element,
					inheritAttr = function(input, dataAttr) {
						return input.jqmData(dataAttr) || input.closest("form,fieldset").jqmData(dataAttr)
					},
					// NOTE: Windows Phone could not find the label through a selector
					// filter works though.
					parentLabel = $(input).closest("label"),
					label = parentLabel.length ? parentLabel : $(input).closest("form,fieldset,:jqmData(role='page'),:jqmData(role='dialog')").find("label").filter("[for='" + input[0].id + "']"),
					inputtype = input[0].type,
					mini = inheritAttr(input, "mini"),
					checkedState = inputtype + "-on",
					uncheckedState = inputtype + "-off",
					icon = input.parents(":jqmData(type='horizontal')").length ? undefined : uncheckedState,
					iconpos = inheritAttr(input, "iconpos"),
					activeBtn = icon ? "" : " " + $.mobile.activeBtnClass,
					checkedClass = "ui-" + checkedState + activeBtn,
					uncheckedClass = "ui-" + uncheckedState,
					checkedicon = "ui-icon-" + checkedState,
					uncheckedicon = "ui-icon-" + uncheckedState;
				if (inputtype !== "checkbox" && inputtype !== "radio") {
					return;
				}
				// Expose for other methods
				$.extend(this, {
					label: label,
					inputtype: inputtype,
					checkedClass: checkedClass,
					uncheckedClass: uncheckedClass,
					checkedicon: checkedicon,
					uncheckedicon: uncheckedicon
				});
				// If there's no selected theme check the data attr
				if (!this.options.theme) {
					this.options.theme = $.mobile.getInheritedTheme(this.element, "c");
				}
				label.buttonMarkup({
					theme: this.options.theme,
					icon: icon,
					shadow: false,
					mini: mini,
					iconpos: iconpos
				});
				// Wrap the input + label in a div
				var wrapper = document.createElement('div');
				wrapper.className = 'ui-' + inputtype;
				input.add(label).wrapAll(wrapper);
				label.bind({
					vmouseover: function(event) {
						if ($(this).parent().is(".ui-disabled")) {
							event.stopPropagation();
						}
					},
					vclick: function(event) {
						if (input.is(":disabled")) {
							event.preventDefault();
							return;
						}
						self._cacheVals();
						input.prop("checked", inputtype === "radio" && true || !input.prop("checked"));
						// trigger click handler's bound directly to the input as a substitute for
						// how label clicks behave normally in the browsers
						// TODO: it would be nice to let the browser's handle the clicks and pass them
						//       through to the associate input. we can swallow that click at the parent
						//       wrapper element level
						input.triggerHandler('click');
						// Input set for common radio buttons will contain all the radio
						// buttons, but will not for checkboxes. clearing the checked status
						// of other radios ensures the active button state is applied properly
						self._getInputSet().not(input).prop("checked", false);
						self._updateAll();
						return false;
					}
				});
				input.bind({
					vmousedown: function() {
						self._cacheVals();
					},
					vclick: function() {
						var $this = $(this);
						// Adds checked attribute to checked input when keyboard is used
						if ($this.is(":checked")) {
							$this.prop("checked", true);
							self._getInputSet().not($this).prop("checked", false);
						} else {
							$this.prop("checked", false);
						}
						self._updateAll();
					},
					focus: function() {
						label.addClass($.mobile.focusClass);
					},
					blur: function() {
						label.removeClass($.mobile.focusClass);
					}
				});
				this.refresh();
			},
			_cacheVals: function() {
				this._getInputSet().each(function() {
					$(this).jqmData("cacheVal", this.checked);
				});
			},
			//returns either a set of radios with the same name attribute, or a single checkbox
			_getInputSet: function() {
				if (this.inputtype === "checkbox") {
					return this.element;
				}
				return this.element.closest("form,fieldset,:jqmData(role='page')").find("input[name='" + this.element[0].name + "'][type='" + this.inputtype + "']");
			},
			_updateAll: function() {
				var self = this;
				this._getInputSet().each(function() {
					var $this = $(this);
					if (this.checked || self.inputtype === "checkbox") {
						$this.trigger("change");
					}
				}).checkboxradio("refresh");
			},
			refresh: function() {
				var input = this.element[0],
					label = this.label,
					icon = label.find(".ui-icon");
				if (input.checked) {
					label.addClass(this.checkedClass).removeClass(this.uncheckedClass);
					icon.addClass(this.checkedicon).removeClass(this.uncheckedicon);
				} else {
					label.removeClass(this.checkedClass).addClass(this.uncheckedClass);
					icon.removeClass(this.checkedicon).addClass(this.uncheckedicon);
				}
				if (input.disabled) {
					this.disable();
				} else {
					this.enable();
				}
			},
			disable: function() {
				this.element.prop("disabled", true).parent().addClass("ui-disabled");
			},
			enable: function() {
				this.element.prop("disabled", false).parent().removeClass("ui-disabled");
			}
		});
		//auto self-init widgets
		$(document).bind("pagecreate create", function(e) {
			$.mobile.checkboxradio.prototype.enhanceWithin(e.target, true);
		});
	})(jQuery);
	(function($, undefined) {
		$.widget("mobile.button", $.mobile.widget, {
			options: {
				theme: null,
				icon: null,
				iconpos: null,
				inline: false,
				corners: true,
				shadow: true,
				iconshadow: true,
				initSelector: "button, [type='button'], [type='submit'], [type='reset'], [type='image']",
				mini: false
			},
			_create: function() {
				var $el = this.element,
					$button, o = this.options,
					type, name, classes = "",
					$buttonPlaceholder;
				// if this is a link, check if it's been enhanced and, if not, use the right function
				if ($el[0].tagName === "A") {
					!$el.hasClass("ui-btn") && $el.buttonMarkup();
					return;
				}
				// get the inherited theme
				// TODO centralize for all widgets
				if (!this.options.theme) {
					this.options.theme = $.mobile.getInheritedTheme(this.element, "c");
				}
				// TODO: Post 1.1--once we have time to test thoroughly--any classes manually applied to the original element should be carried over to the enhanced element, with an `-enhanced` suffix. See https://github.com/jquery/jquery-mobile/issues/3577
/* if( $el[0].className.length ) {
			classes = $el[0].className;
		} */
				if ( !! ~$el[0].className.indexOf("ui-btn-left")) {
					classes = "ui-btn-left";
				}
				if ( !! ~$el[0].className.indexOf("ui-btn-right")) {
					classes = "ui-btn-right";
				}
				// Add ARIA role
				this.button = $("<div></div>").text($el.text() || $el.val()).insertBefore($el).buttonMarkup({
					theme: o.theme,
					icon: o.icon,
					iconpos: o.iconpos,
					inline: o.inline,
					corners: o.corners,
					shadow: o.shadow,
					iconshadow: o.iconshadow,
					mini: o.mini
				}).addClass(classes).append($el.addClass("ui-btn-hidden"));
				$button = this.button;
				type = $el.attr("type");
				name = $el.attr("name");
				// Add hidden input during submit if input type="submit" has a name.
				if (type !== "button" && type !== "reset" && name) {
					$el.bind("vclick", function() {
						// Add hidden input if it doesn?�t already exist.
						if ($buttonPlaceholder === undefined) {
							$buttonPlaceholder = $("<input>", {
								type: "hidden",
								name: $el.attr("name"),
								value: $el.attr("value")
							}).insertBefore($el);
							// Bind to doc to remove after submit handling
							$(document).one("submit", function() {
								$buttonPlaceholder.remove();
								// reset the local var so that the hidden input
								// will be re-added on subsequent clicks
								$buttonPlaceholder = undefined;
							});
						}
					});
				}
				$el.bind({
					focus: function() {
						$button.addClass($.mobile.focusClass);
					},
					blur: function() {
						$button.removeClass($.mobile.focusClass);
					}
				});
				this.refresh();
			},
			enable: function() {
				this.element.attr("disabled", false);
				this.button.removeClass("ui-disabled").attr("aria-disabled", false);
				return this._setOption("disabled", false);
			},
			disable: function() {
				this.element.attr("disabled", true);
				this.button.addClass("ui-disabled").attr("aria-disabled", true);
				return this._setOption("disabled", true);
			},
			refresh: function() {
				var $el = this.element;
				if ($el.prop("disabled")) {
					this.disable();
				} else {
					this.enable();
				}
				// Grab the button's text element from its implementation-independent data item
				$(this.button.data('buttonElements').text).text($el.text() || $el.val());
			}
		});
		//auto self-init widgets
		$(document).bind("pagecreate create", function(e) {
			$.mobile.button.prototype.enhanceWithin(e.target, true);
		});
	})(jQuery);
	(function($, undefined) {
		$.fn.controlgroup = function(options) {
			function flipClasses(els, flCorners) {
				els.removeClass("ui-btn-corner-all ui-shadow").eq(0).addClass(flCorners[0]).end().last().addClass(flCorners[1]).addClass("ui-controlgroup-last");
			}
			return this.each(function() {
				var $el = $(this),
					o = $.extend({
						direction: $el.jqmData("type") || "vertical",
						shadow: false,
						excludeInvisible: true,
						mini: $el.jqmData("mini")
					}, options),
					groupheading = $el.children("legend"),
					flCorners = o.direction == "horizontal" ? ["ui-corner-left", "ui-corner-right"] : ["ui-corner-top", "ui-corner-bottom"],
					type = $el.find("input").first().attr("type");
				// Replace legend with more stylable replacement div
				if (groupheading.length) {
					$el.wrapInner("<div class='ui-controlgroup-controls'></div>");
					$("<div role='heading' class='ui-controlgroup-label'>" + groupheading.html() + "</div>").insertBefore($el.children(0));
					groupheading.remove();
				}
				$el.addClass("ui-corner-all ui-controlgroup ui-controlgroup-" + o.direction);
				flipClasses($el.find(".ui-btn" + (o.excludeInvisible ? ":visible" : "")).not('.ui-slider-handle'), flCorners);
				flipClasses($el.find(".ui-btn-inner"), flCorners);
				if (o.shadow) {
					$el.addClass("ui-shadow");
				}
				if (o.mini) {
					$el.addClass("ui-mini");
				}
			});
		};
		// The pagecreate handler for controlgroup is in jquery.mobile.init because of the soft-dependency on the wrapped widgets
	})(jQuery);
	(function($, undefined) {
		$(document).bind("pagecreate create", function(e) {
			//links within content areas, tests included with page
			$(e.target).find("a").jqmEnhanceable().not(".ui-btn, .ui-link-inherit, :jqmData(role='none'), :jqmData(role='nojs')").addClass("ui-link");
		});
	})(jQuery);
	(function($) {
		var meta = $("meta[name=viewport]"),
			initialContent = meta.attr("content"),
			disabledZoom = initialContent + ",maximum-scale=1, user-scalable=no",
			enabledZoom = initialContent + ",maximum-scale=10, user-scalable=yes",
			disabledInitially = /(user-scalable[\s]*=[\s]*no)|(maximum-scale[\s]*=[\s]*1)[$,\s]/.test(initialContent);
		$.mobile.zoom = $.extend({}, {
			enabled: !disabledInitially,
			locked: false,
			disable: function(lock) {
				if (!disabledInitially && !$.mobile.zoom.locked) {
					meta.attr("content", disabledZoom);
					$.mobile.zoom.enabled = false;
					$.mobile.zoom.locked = lock || false;
				}
			},
			enable: function(unlock) {
				if (!disabledInitially && (!$.mobile.zoom.locked || unlock === true)) {
					meta.attr("content", enabledZoom);
					$.mobile.zoom.enabled = true;
					$.mobile.zoom.locked = false;
				}
			},
			restore: function() {
				if (!disabledInitially) {
					meta.attr("content", initialContent);
					$.mobile.zoom.enabled = true;
				}
			}
		});
	}(jQuery));
	(function($, undefined) {
		$.widget("mobile.textinput", $.mobile.widget, {
			options: {
				theme: null,
				// This option defaults to true on iOS devices.
				preventFocusZoom: /iPhone|iPad|iPod/.test(navigator.platform) && navigator.userAgent.indexOf("AppleWebKit") > -1,
				initSelector: "input[type='text'], input[type='search'], :jqmData(type='search'), input[type='number'], :jqmData(type='number'), input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea, input[type='time'], input[type='date'], input[type='month'], input[type='week'], input[type='datetime'], input[type='datetime-local'], input[type='color'], input:not([type])",
				clearSearchButtonText: "clear text"
			},
			_create: function() {
				var input = this.element,
					o = this.options,
					theme = o.theme || $.mobile.getInheritedTheme(this.element, "c"),
					themeclass = " ui-body-" + theme,
					mini = input.jqmData("mini") == true,
					miniclass = mini ? " ui-mini" : "",
					focusedEl, clearbtn;
				$("label[for='" + input.attr("id") + "']").addClass("ui-input-text");
				focusedEl = input.addClass("ui-input-text ui-body-" + theme);
				// XXX: Temporary workaround for issue 785 (Apple bug 8910589).
				//      Turn off autocorrect and autocomplete on non-iOS 5 devices
				//      since the popup they use can't be dismissed by the user. Note
				//      that we test for the presence of the feature by looking for
				//      the autocorrect property on the input element. We currently
				//      have no test for iOS 5 or newer so we're temporarily using
				//      the touchOverflow support flag for jQM 1.0. Yes, I feel dirty. - jblas
				if (typeof input[0].autocorrect !== "undefined" && !$.support.touchOverflow) {
					// Set the attribute instead of the property just in case there
					// is code that attempts to make modifications via HTML.
					input[0].setAttribute("autocorrect", "off");
					input[0].setAttribute("autocomplete", "off");
				}
				//"search" input widget
				if (input.is("[type='search'],:jqmData(type='search')")) {
					focusedEl = input.wrap("<div class='ui-input-search ui-shadow-inset ui-btn-corner-all ui-btn-shadow ui-icon-searchfield" + themeclass + miniclass + "'></div>").parent();
					clearbtn = $("<a href='#' class='ui-input-clear' title='" + o.clearSearchButtonText + "'>" + o.clearSearchButtonText + "</a>").bind('click', function(event) {
						input.val("").focus().trigger("change");
						clearbtn.addClass("ui-input-clear-hidden");
						event.preventDefault();
					}).appendTo(focusedEl).buttonMarkup({
						icon: "delete",
						iconpos: "notext",
						corners: true,
						shadow: true,
						mini: mini
					});
					function toggleClear() {
						setTimeout(function() {
							clearbtn.toggleClass("ui-input-clear-hidden", !input.val());
						}, 0);
					}
					toggleClear();
					input.bind('paste cut keyup focus change blur', toggleClear);
				} else {
					input.addClass("ui-corner-all ui-shadow-inset" + themeclass + miniclass);
				}
				input.focus(function() {
					focusedEl.addClass($.mobile.focusClass);
				}).blur(function() {
					focusedEl.removeClass($.mobile.focusClass);
				})
				// In many situations, iOS will zoom into the select upon tap, this prevents that from happening
				.bind("focus", function() {
					if (o.preventFocusZoom) {
						$.mobile.zoom.disable(true);
					}
				}).bind("blur", function() {
					if (o.preventFocusZoom) {
						$.mobile.zoom.enable(true);
					}
				});
				// Autogrow
				if (input.is("textarea")) {
					var extraLineHeight = 15,
						keyupTimeoutBuffer = 100,
						keyup = function() {
							var scrollHeight = input[0].scrollHeight,
								clientHeight = input[0].clientHeight;
							if (clientHeight < scrollHeight) {
								input.height(scrollHeight + extraLineHeight);
							}
						},
						keyupTimeout;
					input.keyup(function() {
						clearTimeout(keyupTimeout);
						keyupTimeout = setTimeout(keyup, keyupTimeoutBuffer);
					});
					// binding to pagechange here ensures that for pages loaded via
					// ajax the height is recalculated without user input
					$(document).one("pagechange", keyup);
					// Issue 509: the browser is not providing scrollHeight properly until the styles load
					if ($.trim(input.val())) {
						// bind to the window load to make sure the height is calculated based on BOTH
						// the DOM and CSS
						$(window).load(keyup);
					}
				}
			},
			disable: function() {
				(this.element.attr("disabled", true).is("[type='search'],:jqmData(type='search')") ? this.element.parent() : this.element).addClass("ui-disabled");
			},
			enable: function() {
				(this.element.attr("disabled", false).is("[type='search'],:jqmData(type='search')") ? this.element.parent() : this.element).removeClass("ui-disabled");
			}
		});
		//auto self-init widgets
		$(document).bind("pagecreate create", function(e) {
			$.mobile.textinput.prototype.enhanceWithin(e.target, true);
		});
	})(jQuery);
	(function($, undefined) {
		$.mobile.listview.prototype.options.filter = false;
		$.mobile.listview.prototype.options.filterPlaceholder = "Filter items...";
		$.mobile.listview.prototype.options.filterTheme = "c";
		$.mobile.listview.prototype.options.filterCallback = function(text, searchValue) {
			return text.toLowerCase().indexOf(searchValue) === -1;
		};
		$(document).delegate(":jqmData(role='listview')", "listviewcreate", function() {
			var list = $(this),
				listview = list.data("listview");
			if (!listview.options.filter) {
				return;
			}
			var wrapper = $("<form>", {
				"class": "ui-listview-filter ui-bar-" + listview.options.filterTheme,
				"role": "search"
			}),
				search = $("<input>", {
					placeholder: listview.options.filterPlaceholder
				}).attr("data-" + $.mobile.ns + "type", "search").jqmData("lastval", "").bind("keyup change", function() {
					var $this = $(this),
						val = this.value.toLowerCase(),
						listItems = null,
						lastval = $this.jqmData("lastval") + "",
						childItems = false,
						itemtext = "",
						item;
					// Change val as lastval for next execution
					$this.jqmData("lastval", val);
					if (val.length < lastval.length || val.indexOf(lastval) !== 0) {
						// Removed chars or pasted something totally different, check all items
						listItems = list.children();
					} else {
						// Only chars added, not removed, only use visible subset
						listItems = list.children(":not(.ui-screen-hidden)");
					}
					if (val) {
						// This handles hiding regular rows without the text we search for
						// and any list dividers without regular rows shown under it
						for (var i = listItems.length - 1; i >= 0; i--) {
							item = $(listItems[i]);
							itemtext = item.jqmData("filtertext") || item.text();
							if (item.is("li:jqmData(role=list-divider)")) {
								item.toggleClass("ui-filter-hidequeue", !childItems);
								// New bucket!
								childItems = false;
							} else if (listview.options.filterCallback(itemtext, val)) {
								//mark to be hidden
								item.toggleClass("ui-filter-hidequeue", true);
							} else {
								// There's a shown item in the bucket
								childItems = true;
							}
						}
						// Show items, not marked to be hidden
						listItems.filter(":not(.ui-filter-hidequeue)").toggleClass("ui-screen-hidden", false);
						// Hide items, marked to be hidden
						listItems.filter(".ui-filter-hidequeue").toggleClass("ui-screen-hidden", true).toggleClass("ui-filter-hidequeue", false);
					} else {
						//filtervalue is empty => show all
						listItems.toggleClass("ui-screen-hidden", false);
					}
					listview._refreshCorners();
				}).appendTo(wrapper).textinput();
			if (listview.options.inset) {
				wrapper.addClass("ui-listview-filter-inset");
			}
			wrapper.bind("submit", function() {
				return false;
			}).insertBefore(list);
		});
	})(jQuery);
	(function($, undefined) {
		$.widget("mobile.slider", $.mobile.widget, {
			options: {
				theme: null,
				trackTheme: null,
				disabled: false,
				initSelector: "input[type='range'], :jqmData(type='range'), :jqmData(role='slider')",
				mini: false
			},
			_create: function() {
				// TODO: Each of these should have comments explain what they're for
				var self = this,
					control = this.element,
					parentTheme = $.mobile.getInheritedTheme(control, "c"),
					theme = this.options.theme || parentTheme,
					trackTheme = this.options.trackTheme || parentTheme,
					cType = control[0].nodeName.toLowerCase(),
					selectClass = (cType == "select") ? "ui-slider-switch" : "",
					controlID = control.attr("id"),
					labelID = controlID + "-label",
					label = $("[for='" + controlID + "']").attr("id", labelID),
					val = function() {
						return cType == "input" ? parseFloat(control.val()) : control[0].selectedIndex;
					},
					min = cType == "input" ? parseFloat(control.attr("min")) : 0,
					max = cType == "input" ? parseFloat(control.attr("max")) : control.find("option").length - 1,
					step = window.parseFloat(control.attr("step") || 1),
					inlineClass = (this.options.inline || control.jqmData("inline") == true) ? " ui-slider-inline" : "",
					miniClass = (this.options.mini || control.jqmData("mini")) ? " ui-slider-mini" : "",
					domHandle = document.createElement('a'),
					handle = $(domHandle),
					domSlider = document.createElement('div'),
					slider = $(domSlider),
					valuebg = control.jqmData("highlight") && cType != "select" ? (function() {
						var bg = document.createElement('div');
						bg.className = 'ui-slider-bg ui-btn-active ui-btn-corner-all';
						return $(bg).prependTo(slider);
					})() : false,
					options;
				domHandle.setAttribute('href', "#");
				domSlider.setAttribute('role', 'application');
				domSlider.className = ['ui-slider ', selectClass, " ui-btn-down-", trackTheme, ' ui-btn-corner-all', inlineClass, miniClass].join("");
				domHandle.className = 'ui-slider-handle';
				domSlider.appendChild(domHandle);
				handle.buttonMarkup({
					corners: true,
					theme: theme,
					shadow: true
				}).attr({
					"role": "slider",
					"aria-valuemin": min,
					"aria-valuemax": max,
					"aria-valuenow": val(),
					"aria-valuetext": val(),
					"title": val(),
					"aria-labelledby": labelID
				});
				$.extend(this, {
					slider: slider,
					handle: handle,
					valuebg: valuebg,
					dragging: false,
					beforeStart: null,
					userModified: false,
					mouseMoved: false
				});
				if (cType == "select") {
					var wrapper = document.createElement('div');
					wrapper.className = 'ui-slider-inneroffset';
					for (var j = 0, length = domSlider.childNodes.length; j < length; j++) {
						wrapper.appendChild(domSlider.childNodes[j]);
					}
					domSlider.appendChild(wrapper);
					// slider.wrapInner( "<div class='ui-slider-inneroffset'></div>" );
					// make the handle move with a smooth transition
					handle.addClass("ui-slider-handle-snapping");
					options = control.find("option");
					for (var i = 0, optionsCount = options.length; i < optionsCount; i++) {
						var side = !i ? "b" : "a",
							sliderTheme = !i ? " ui-btn-down-" + trackTheme : (" " + $.mobile.activeBtnClass),
							sliderLabel = document.createElement('div'),
							sliderImg = document.createElement('span');
						sliderImg.className = ['ui-slider-label ui-slider-label-', side, sliderTheme, " ui-btn-corner-all"].join("");
						sliderImg.setAttribute('role', 'img');
						sliderImg.appendChild(document.createTextNode(options[i].innerHTML));
						$(sliderImg).prependTo(slider);
					}
					self._labels = $(".ui-slider-label", slider);
				}
				label.addClass("ui-slider");
				// monitor the input for updated values
				control.addClass(cType === "input" ? "ui-slider-input" : "ui-slider-switch").change(function() {
					// if the user dragged the handle, the "change" event was triggered from inside refresh(); don't call refresh() again
					if (!self.mouseMoved) {
						self.refresh(val(), true);
					}
				}).keyup(function() { // necessary?
					self.refresh(val(), true, true);
				}).blur(function() {
					self.refresh(val(), true);
				});
				// prevent screen drag when slider activated
				$(document).bind("vmousemove", function(event) {
					if (self.dragging) {
						// self.mouseMoved must be updated before refresh() because it will be used in the control "change" event
						self.mouseMoved = true;
						if (cType === "select") {
							// make the handle move in sync with the mouse
							handle.removeClass("ui-slider-handle-snapping");
						}
						self.refresh(event);
						// only after refresh() you can calculate self.userModified
						self.userModified = self.beforeStart !== control[0].selectedIndex;
						return false;
					}
				});
				slider.bind("vmousedown", function(event) {
					self.dragging = true;
					self.userModified = false;
					self.mouseMoved = false;
					if (cType === "select") {
						self.beforeStart = control[0].selectedIndex;
					}
					self.refresh(event);
					return false;
				}).bind("vclick", false);
				slider.add(document).bind("vmouseup", function() {
					if (self.dragging) {
						self.dragging = false;
						if (cType === "select") {
							// make the handle move with a smooth transition
							handle.addClass("ui-slider-handle-snapping");
							if (self.mouseMoved) {
								// this is a drag, change the value only if user dragged enough
								if (self.userModified) {
									self.refresh(self.beforeStart == 0 ? 1 : 0);
								}
								else {
									self.refresh(self.beforeStart);
								}
							}
							else {
								// this is just a click, change the value
								self.refresh(self.beforeStart == 0 ? 1 : 0);
							}
						}
						self.mouseMoved = false;
						return false;
					}
				});
				slider.insertAfter(control);
				// Only add focus class to toggle switch, sliders get it automatically from ui-btn
				if (cType == 'select') {
					this.handle.bind({
						focus: function() {
							slider.addClass($.mobile.focusClass);
						},
						blur: function() {
							slider.removeClass($.mobile.focusClass);
						}
					});
				}
				this.handle.bind({
					// NOTE force focus on handle
					vmousedown: function() {
						$(this).focus();
					},
					vclick: false,
					keydown: function(event) {
						var index = val();
						if (self.options.disabled) {
							return;
						}
						// In all cases prevent the default and mark the handle as active
						switch (event.keyCode) {
						case $.mobile.keyCode.HOME:
						case $.mobile.keyCode.END:
						case $.mobile.keyCode.PAGE_UP:
						case $.mobile.keyCode.PAGE_DOWN:
						case $.mobile.keyCode.UP:
						case $.mobile.keyCode.RIGHT:
						case $.mobile.keyCode.DOWN:
						case $.mobile.keyCode.LEFT:
							event.preventDefault();
							if (!self._keySliding) {
								self._keySliding = true;
								$(this).addClass("ui-state-active");
							}
							break;
						}
						// move the slider according to the keypress
						switch (event.keyCode) {
						case $.mobile.keyCode.HOME:
							self.refresh(min);
							break;
						case $.mobile.keyCode.END:
							self.refresh(max);
							break;
						case $.mobile.keyCode.PAGE_UP:
						case $.mobile.keyCode.UP:
						case $.mobile.keyCode.RIGHT:
							self.refresh(index + step);
							break;
						case $.mobile.keyCode.PAGE_DOWN:
						case $.mobile.keyCode.DOWN:
						case $.mobile.keyCode.LEFT:
							self.refresh(index - step);
							break;
						}
					},
					// remove active mark
					keyup: function(event) {
						if (self._keySliding) {
							self._keySliding = false;
							$(this).removeClass("ui-state-active");
						}
					}
				});
				this.refresh(undefined, undefined, true);
			},
			refresh: function(val, isfromControl, preventInputUpdate) {
				if (this.options.disabled || this.element.attr('disabled')) {
					this.disable();
				}
				var control = this.element,
					percent, cType = control[0].nodeName.toLowerCase(),
					min = cType === "input" ? parseFloat(control.attr("min")) : 0,
					max = cType === "input" ? parseFloat(control.attr("max")) : control.find("option").length - 1,
					step = (cType === "input" && parseFloat(control.attr("step")) > 0) ? parseFloat(control.attr("step")) : 1;
				if (typeof val === "object") {
					var data = val,
						// a slight tolerance helped get to the ends of the slider
						tol = 8;
					if (!this.dragging || data.pageX < this.slider.offset().left - tol || data.pageX > this.slider.offset().left + this.slider.width() + tol) {
						return;
					}
					percent = Math.round(((data.pageX - this.slider.offset().left) / this.slider.width()) * 100);
				} else {
					if (val == null) {
						val = cType === "input" ? parseFloat(control.val() || 0) : control[0].selectedIndex;
					}
					percent = (parseFloat(val) - min) / (max - min) * 100;
				}
				if (isNaN(percent)) {
					return;
				}
				if (percent < 0) {
					percent = 0;
				}
				if (percent > 100) {
					percent = 100;
				}
				var newval = (percent / 100) * (max - min) + min;
				//from jQuery UI slider, the following source will round to the nearest step
				var valModStep = (newval - min) % step;
				var alignValue = newval - valModStep;
				if (Math.abs(valModStep) * 2 >= step) {
					alignValue += (valModStep > 0) ? step : (-step);
				}
				// Since JavaScript has problems with large floats, round
				// the final value to 5 digits after the decimal point (see jQueryUI: #4124)
				newval = parseFloat(alignValue.toFixed(5));
				if (newval < min) {
					newval = min;
				}
				if (newval > max) {
					newval = max;
				}
				this.handle.css("left", percent + "%");
				this.handle.attr({
					"aria-valuenow": cType === "input" ? newval : control.find("option").eq(newval).attr("value"),
					"aria-valuetext": cType === "input" ? newval : control.find("option").eq(newval).getEncodedText(),
					title: cType === "input" ? newval : control.find("option").eq(newval).getEncodedText()
				});
				this.valuebg && this.valuebg.css("width", percent + "%");
				// drag the label widths
				if (this._labels) {
					var handlePercent = this.handle.width() / this.slider.width() * 100,
						aPercent = percent && handlePercent + (100 - handlePercent) * percent / 100,
						bPercent = percent === 100 ? 0 : Math.min(handlePercent + 100 - aPercent, 100);
					this._labels.each(function() {
						var ab = $(this).is(".ui-slider-label-a");
						$(this).width((ab ? aPercent : bPercent) + "%");
					});
				}
				if (!preventInputUpdate) {
					var valueChanged = false;
					// update control"s value
					if (cType === "input") {
						valueChanged = control.val() !== newval;
						control.val(newval);
					} else {
						valueChanged = control[0].selectedIndex !== newval;
						control[0].selectedIndex = newval;
					}
					if (!isfromControl && valueChanged) {
						control.trigger("change");
					}
				}
			},
			enable: function() {
				this.element.attr("disabled", false);
				this.slider.removeClass("ui-disabled").attr("aria-disabled", false);
				return this._setOption("disabled", false);
			},
			disable: function() {
				this.element.attr("disabled", true);
				this.slider.addClass("ui-disabled").attr("aria-disabled", true);
				return this._setOption("disabled", true);
			}
		});
		//auto self-init widgets
		$(document).bind("pagecreate create", function(e) {
			$.mobile.slider.prototype.enhanceWithin(e.target, true);
		});
	})(jQuery);
	(function($, undefined) {
		$.widget("mobile.selectmenu", $.mobile.widget, {
			options: {
				theme: null,
				disabled: false,
				icon: "arrow-d",
				iconpos: "right",
				inline: false,
				corners: true,
				shadow: true,
				iconshadow: true,
				overlayTheme: "a",
				hidePlaceholderMenuItems: true,
				closeText: "Close",
				nativeMenu: true,
				// This option defaults to true on iOS devices.
				preventFocusZoom: /iPhone|iPad|iPod/.test(navigator.platform) && navigator.userAgent.indexOf("AppleWebKit") > -1,
				initSelector: "select:not(:jqmData(role='slider'))",
				mini: false
			},
			_button: function() {
				return $("<div/>");
			},
			_setDisabled: function(value) {
				this.element.attr("disabled", value);
				this.button.attr("aria-disabled", value);
				return this._setOption("disabled", value);
			},
			_focusButton: function() {
				var self = this;
				setTimeout(function() {
					self.button.focus();
				}, 40);
			},
			_selectOptions: function() {
				return this.select.find("option");
			},
			// setup items that are generally necessary for select menu extension
			_preExtension: function() {
				var classes = "";
				// TODO: Post 1.1--once we have time to test thoroughly--any classes manually applied to the original element should be carried over to the enhanced element, with an `-enhanced` suffix. See https://github.com/jquery/jquery-mobile/issues/3577
/* if( $el[0].className.length ) {
			classes = $el[0].className;
		} */
				if ( !! ~this.element[0].className.indexOf("ui-btn-left")) {
					classes = " ui-btn-left";
				}
				if ( !! ~this.element[0].className.indexOf("ui-btn-right")) {
					classes = " ui-btn-right";
				}
				this.select = this.element.wrap("<div class='ui-select" + classes + "'>");
				this.selectID = this.select.attr("id");
				this.label = $("label[for='" + this.selectID + "']").addClass("ui-select");
				this.isMultiple = this.select[0].multiple;
				if (!this.options.theme) {
					this.options.theme = $.mobile.getInheritedTheme(this.select, "c");
				}
			},
			_create: function() {
				this._preExtension();
				// Allows for extension of the native select for custom selects and other plugins
				// see select.custom for example extension
				// TODO explore plugin registration
				this._trigger("beforeCreate");
				this.button = this._button();
				var self = this,
					options = this.options,
					// IE throws an exception at options.item() function when
					// there is no selected item
					// select first in this case
					selectedIndex = this.select[0].selectedIndex == -1 ? 0 : this.select[0].selectedIndex,
					// TODO values buttonId and menuId are undefined here
					button = this.button.text($(this.select[0].options.item(selectedIndex)).text()).insertBefore(this.select).buttonMarkup({
						theme: options.theme,
						icon: options.icon,
						iconpos: options.iconpos,
						inline: options.inline,
						corners: options.corners,
						shadow: options.shadow,
						iconshadow: options.iconshadow,
						mini: options.mini
					});
				// Opera does not properly support opacity on select elements
				// In Mini, it hides the element, but not its text
				// On the desktop,it seems to do the opposite
				// for these reasons, using the nativeMenu option results in a full native select in Opera
				if (options.nativeMenu && window.opera && window.opera.version) {
					this.select.addClass("ui-select-nativeonly");
				}
				// Add counter for multi selects
				if (this.isMultiple) {
					this.buttonCount = $("<span>").addClass("ui-li-count ui-btn-up-c ui-btn-corner-all").hide().appendTo(button.addClass('ui-li-has-count'));
				}
				// Disable if specified
				if (options.disabled || this.element.attr('disabled')) {
					this.disable();
				}
				// Events on native select
				this.select.change(function() {
					self.refresh();
				});
				this.build();
			},
			build: function() {
				var self = this;
				this.select.appendTo(self.button).bind("vmousedown", function() {
					// Add active class to button
					self.button.addClass($.mobile.activeBtnClass);
				}).bind("focus", function() {
					self.button.addClass($.mobile.focusClass);
				}).bind("blur", function() {
					self.button.removeClass($.mobile.focusClass);
				}).bind("focus vmouseover", function() {
					self.button.trigger("vmouseover");
				}).bind("vmousemove", function() {
					// Remove active class on scroll/touchmove
					self.button.removeClass($.mobile.activeBtnClass);
				}).bind("change blur vmouseout", function() {
					self.button.trigger("vmouseout").removeClass($.mobile.activeBtnClass);
				}).bind("change blur", function() {
					self.button.removeClass("ui-btn-down-" + self.options.theme);
				});
				// In many situations, iOS will zoom into the select upon tap, this prevents that from happening
				self.button.bind("vmousedown", function() {
					if (self.options.preventFocusZoom) {
						$.mobile.zoom.disable(true);
					}
				}).bind("mouseup", function() {
					if (self.options.preventFocusZoom) {
						$.mobile.zoom.enable(true);
					}
				});
			},
			selected: function() {
				return this._selectOptions().filter(":selected");
			},
			selectedIndices: function() {
				var self = this;
				return this.selected().map(function() {
					return self._selectOptions().index(this);
				}).get();
			},
			setButtonText: function() {
				var self = this,
					selected = this.selected();
				this.button.find(".ui-btn-text").text(function() {
					if (!self.isMultiple) {
						return selected.text();
					}
					return selected.length ? selected.map(function() {
						return $(this).text();
					}).get().join(", ") : self.placeholder;
				});
			},
			setButtonCount: function() {
				var selected = this.selected();
				// multiple count inside button
				if (this.isMultiple) {
					this.buttonCount[selected.length > 1 ? "show" : "hide"]().text(selected.length);
				}
			},
			refresh: function() {
				this.setButtonText();
				this.setButtonCount();
			},
			// open and close preserved in native selects
			// to simplify users code when looping over selects
			open: $.noop,
			close: $.noop,
			disable: function() {
				this._setDisabled(true);
				this.button.addClass("ui-disabled");
			},
			enable: function() {
				this._setDisabled(false);
				this.button.removeClass("ui-disabled");
			}
		});
		//auto self-init widgets
		$(document).bind("pagecreate create", function(e) {
			$.mobile.selectmenu.prototype.enhanceWithin(e.target, true);
		});
	})(jQuery);
/*
* custom "selectmenu" plugin
*/
	(function($, undefined) {
		var extendSelect = function(widget) {
			var select = widget.select,
				selectID = widget.selectID,
				label = widget.label,
				thisPage = widget.select.closest(".ui-page"),
				screen = $("<div>", {
					"class": "ui-selectmenu-screen ui-screen-hidden"
				}).appendTo(thisPage),
				selectOptions = widget._selectOptions(),
				isMultiple = widget.isMultiple = widget.select[0].multiple,
				buttonId = selectID + "-button",
				menuId = selectID + "-menu",
				menuPage = $("<div data-" + $.mobile.ns + "role='dialog' data-" + $.mobile.ns + "theme='" + widget.options.theme + "' data-" + $.mobile.ns + "overlay-theme='" + widget.options.overlayTheme + "'>" + "<div data-" + $.mobile.ns + "role='header'>" + "<div class='ui-title'>" + label.getEncodedText() + "</div>" + "</div>" + "<div data-" + $.mobile.ns + "role='content'></div>" + "</div>"),
				listbox = $("<div>", {
					"class": "ui-selectmenu ui-selectmenu-hidden ui-overlay-shadow ui-corner-all ui-body-" + widget.options.overlayTheme + " " + $.mobile.defaultDialogTransition
				}).insertAfter(screen),
				list = $("<ul>", {
					"class": "ui-selectmenu-list",
					"id": menuId,
					"role": "listbox",
					"aria-labelledby": buttonId
				}).attr("data-" + $.mobile.ns + "theme", widget.options.theme).appendTo(listbox),
				header = $("<div>", {
					"class": "ui-header ui-bar-" + widget.options.theme
				}).prependTo(listbox),
				headerTitle = $("<h1>", {
					"class": "ui-title"
				}).appendTo(header),
				menuPageContent, menuPageClose, headerClose;
			if (widget.isMultiple) {
				headerClose = $("<a>", {
					"text": widget.options.closeText,
					"href": "#",
					"class": "ui-btn-left"
				}).attr("data-" + $.mobile.ns + "iconpos", "notext").attr("data-" + $.mobile.ns + "icon", "delete").appendTo(header).buttonMarkup();
			}
			$.extend(widget, {
				select: widget.select,
				selectID: selectID,
				buttonId: buttonId,
				menuId: menuId,
				thisPage: thisPage,
				menuPage: menuPage,
				label: label,
				screen: screen,
				selectOptions: selectOptions,
				isMultiple: isMultiple,
				theme: widget.options.theme,
				listbox: listbox,
				list: list,
				header: header,
				headerTitle: headerTitle,
				headerClose: headerClose,
				menuPageContent: menuPageContent,
				menuPageClose: menuPageClose,
				placeholder: "",
				build: function() {
					var self = this;
					// Create list from select, update state
					self.refresh();
					self.select.attr("tabindex", "-1").focus(function() {
						$(this).blur();
						self.button.focus();
					});
					// Button events
					self.button.bind("vclick keydown", function(event) {
						if (event.type == "vclick" || event.keyCode && (event.keyCode === $.mobile.keyCode.ENTER || event.keyCode === $.mobile.keyCode.SPACE)) {
							self.open();
							event.preventDefault();
						}
					});
					// Events for list items
					self.list.attr("role", "listbox").bind("focusin", function(e) {
						$(e.target).attr("tabindex", "0").trigger("vmouseover");
					}).bind("focusout", function(e) {
						$(e.target).attr("tabindex", "-1").trigger("vmouseout");
					}).delegate("li:not(.ui-disabled, .ui-li-divider)", "click", function(event) {
						// index of option tag to be selected
						var oldIndex = self.select[0].selectedIndex,
							newIndex = self.list.find("li:not(.ui-li-divider)").index(this),
							option = self._selectOptions().eq(newIndex)[0];
						// toggle selected status on the tag for multi selects
						option.selected = self.isMultiple ? !option.selected : true;
						// toggle checkbox class for multiple selects
						if (self.isMultiple) {
							$(this).find(".ui-icon").toggleClass("ui-icon-checkbox-on", option.selected).toggleClass("ui-icon-checkbox-off", !option.selected);
						}
						// trigger change if value changed
						if (self.isMultiple || oldIndex !== newIndex) {
							self.select.trigger("change");
						}
						//hide custom select for single selects only
						if (!self.isMultiple) {
							self.close();
						}
						event.preventDefault();
					}).keydown(function(event) { //keyboard events for menu items
						var target = $(event.target),
							li = target.closest("li"),
							prev, next;
						// switch logic based on which key was pressed
						switch (event.keyCode) {
							// up or left arrow keys
						case 38:
							prev = li.prev().not(".ui-selectmenu-placeholder");
							if (prev.is(".ui-li-divider")) {
								prev = prev.prev();
							}
							// if there's a previous option, focus it
							if (prev.length) {
								target.blur().attr("tabindex", "-1");
								prev.addClass("ui-btn-down-" + widget.options.theme).find("a").first().focus();
							}
							return false;
							break;
							// down or right arrow keys
						case 40:
							next = li.next();
							if (next.is(".ui-li-divider")) {
								next = next.next();
							}
							// if there's a next option, focus it
							if (next.length) {
								target.blur().attr("tabindex", "-1");
								next.addClass("ui-btn-down-" + widget.options.theme).find("a").first().focus();
							}
							return false;
							break;
							// If enter or space is pressed, trigger click
						case 13:
						case 32:
							target.trigger("click");
							return false;
							break;
						}
					});
					// button refocus ensures proper height calculation
					// by removing the inline style and ensuring page inclusion
					self.menuPage.bind("pagehide", function() {
						self.list.appendTo(self.listbox);
						self._focusButton();
						// TODO centralize page removal binding / handling in the page plugin.
						// Suggestion from @jblas to do refcounting
						//
						// TODO extremely confusing dependency on the open method where the pagehide.remove
						// bindings are stripped to prevent the parent page from disappearing. The way
						// we're keeping pages in the DOM right now sucks
						//
						// rebind the page remove that was unbound in the open function
						// to allow for the parent page removal from actions other than the use
						// of a dialog sized custom select
						//
						// doing this here provides for the back button on the custom select dialog
						$.mobile._bindPageRemove.call(self.thisPage);
					});
					// Events on "screen" overlay
					self.screen.bind("vclick", function(event) {
						self.close();
					});
					// Close button on small overlays
					if (self.isMultiple) {
						self.headerClose.click(function() {
							if (self.menuType == "overlay") {
								self.close();
								return false;
							}
						});
					}
					// track this dependency so that when the parent page
					// is removed on pagehide it will also remove the menupage
					self.thisPage.addDependents(this.menuPage);
				},
				_isRebuildRequired: function() {
					var list = this.list.find("li"),
						options = this._selectOptions();
					// TODO exceedingly naive method to determine difference
					// ignores value changes etc in favor of a forcedRebuild
					// from the user in the refresh method
					return options.text() !== list.text();
				},
				refresh: function(forceRebuild, foo) {
					var self = this,
						select = this.element,
						isMultiple = this.isMultiple,
						options = this._selectOptions(),
						selected = this.selected(),
						// return an array of all selected index's
						indicies = this.selectedIndices();
					if (forceRebuild || this._isRebuildRequired()) {
						self._buildList();
					}
					self.setButtonText();
					self.setButtonCount();
					self.list.find("li:not(.ui-li-divider)").removeClass($.mobile.activeBtnClass).attr("aria-selected", false).each(function(i) {
						if ($.inArray(i, indicies) > -1) {
							var item = $(this);
							// Aria selected attr
							item.attr("aria-selected", true);
							// Multiple selects: add the "on" checkbox state to the icon
							if (self.isMultiple) {
								item.find(".ui-icon").removeClass("ui-icon-checkbox-off").addClass("ui-icon-checkbox-on");
							} else {
								if (item.is(".ui-selectmenu-placeholder")) {
									item.next().addClass($.mobile.activeBtnClass);
								} else {
									item.addClass($.mobile.activeBtnClass);
								}
							}
						}
					});
				},
				close: function() {
					if (this.options.disabled || !this.isOpen) {
						return;
					}
					var self = this;
					if (self.menuType == "page") {
						// doesn't solve the possible issue with calling change page
						// where the objects don't define data urls which prevents dialog key
						// stripping - changePage has incoming refactor
						window.history.back();
					} else {
						self.screen.addClass("ui-screen-hidden");
						self.listbox.addClass("ui-selectmenu-hidden").removeAttr("style").removeClass("in");
						self.list.appendTo(self.listbox);
						self._focusButton();
					}
					// allow the dialog to be closed again
					self.isOpen = false;
				},
				open: function() {
					if (this.options.disabled) {
						return;
					}
					var self = this,
						$window = $(window),
						selfListParent = self.list.parent(),
						menuHeight = selfListParent.outerHeight(),
						menuWidth = selfListParent.outerWidth(),
						activePage = $(".ui-page-active"),
						tScrollElem = activePage,
						scrollTop = $window.scrollTop(),
						btnOffset = self.button.offset().top,
						screenHeight = $window.height(),
						screenWidth = $window.width();
					//add active class to button
					self.button.addClass($.mobile.activeBtnClass);
					//remove after delay
					setTimeout(function() {
						self.button.removeClass($.mobile.activeBtnClass);
					}, 300);
					function focusMenuItem() {
						self.list.find("." + $.mobile.activeBtnClass + " a").focus();
					}
					if (menuHeight > screenHeight - 80 || !$.support.scrollTop) {
						self.menuPage.appendTo($.mobile.pageContainer).page();
						self.menuPageContent = menuPage.find(".ui-content");
						self.menuPageClose = menuPage.find(".ui-header a");
						// prevent the parent page from being removed from the DOM,
						// otherwise the results of selecting a list item in the dialog
						// fall into a black hole
						self.thisPage.unbind("pagehide.remove");
						//for WebOS/Opera Mini (set lastscroll using button offset)
						if (scrollTop == 0 && btnOffset > screenHeight) {
							self.thisPage.one("pagehide", function() {
								$(this).jqmData("lastScroll", btnOffset);
							});
						}
						self.menuPage.one("pageshow", function() {
							focusMenuItem();
							self.isOpen = true;
						});
						self.menuType = "page";
						self.menuPageContent.append(self.list);
						self.menuPage.find("div .ui-title").text(self.label.text());
						$.mobile.changePage(self.menuPage, {
							transition: $.mobile.defaultDialogTransition
						});
					} else {
						self.menuType = "overlay";
						self.screen.height($(document).height()).removeClass("ui-screen-hidden");
						// Try and center the overlay over the button
						var roomtop = btnOffset - scrollTop,
							roombot = scrollTop + screenHeight - btnOffset,
							halfheight = menuHeight / 2,
							maxwidth = parseFloat(self.list.parent().css("max-width")),
							newtop, newleft;
						if (roomtop > menuHeight / 2 && roombot > menuHeight / 2) {
							newtop = btnOffset + (self.button.outerHeight() / 2) - halfheight;
						} else {
							// 30px tolerance off the edges
							newtop = roomtop > roombot ? scrollTop + screenHeight - menuHeight - 30 : scrollTop + 30;
						}
						// If the menuwidth is smaller than the screen center is
						if (menuWidth < maxwidth) {
							newleft = (screenWidth - menuWidth) / 2;
						} else {
							//otherwise insure a >= 30px offset from the left
							newleft = self.button.offset().left + self.button.outerWidth() / 2 - menuWidth / 2;
							// 30px tolerance off the edges
							if (newleft < 30) {
								newleft = 30;
							} else if ((newleft + menuWidth) > screenWidth) {
								newleft = screenWidth - menuWidth - 30;
							}
						}
						self.listbox.append(self.list).removeClass("ui-selectmenu-hidden").css({
							top: newtop,
							left: newleft
						}).addClass("in");
						focusMenuItem();
						// duplicate with value set in page show for dialog sized selects
						self.isOpen = true;
					}
				},
				_buildList: function() {
					var self = this,
						o = this.options,
						placeholder = this.placeholder,
						needPlaceholder = true,
						optgroups = [],
						lis = [],
						dataIcon = self.isMultiple ? "checkbox-off" : "false";
					self.list.empty().filter(".ui-listview").listview("destroy");
					var $options = self.select.find("option"),
						numOptions = $options.length,
						select = this.select[0],
						dataPrefix = 'data-' + $.mobile.ns,
						dataIndexAttr = dataPrefix + 'option-index',
						dataIconAttr = dataPrefix + 'icon',
						dataRoleAttr = dataPrefix + 'role',
						fragment = document.createDocumentFragment(),
						optGroup;
					for (var i = 0; i < numOptions; i++) {
						var option = $options[i],
							$option = $(option),
							parent = option.parentNode,
							text = $option.text(),
							anchor = document.createElement('a'),
							classes = [];
						anchor.setAttribute('href', '#');
						anchor.appendChild(document.createTextNode(text));
						// Are we inside an optgroup?
						if (parent !== select && parent.nodeName.toLowerCase() === "optgroup") {
							var optLabel = parent.getAttribute('label');
							if (optLabel != optGroup) {
								var divider = document.createElement('li');
								divider.setAttribute(dataRoleAttr, 'list-divider');
								divider.setAttribute('role', 'option');
								divider.setAttribute('tabindex', '-1');
								divider.appendChild(document.createTextNode(optLabel));
								fragment.appendChild(divider);
								optGroup = optLabel;
							}
						}
						if (needPlaceholder && (!option.getAttribute("value") || text.length == 0 || $option.jqmData("placeholder"))) {
							needPlaceholder = false;
							if (o.hidePlaceholderMenuItems) {
								classes.push("ui-selectmenu-placeholder");
							}
							if (!placeholder) {
								placeholder = self.placeholder = text;
							}
						}
						var item = document.createElement('li');
						if (option.disabled) {
							classes.push("ui-disabled");
							item.setAttribute('aria-disabled', true);
						}
						item.setAttribute(dataIndexAttr, i);
						item.setAttribute(dataIconAttr, dataIcon);
						item.className = classes.join(" ");
						item.setAttribute('role', 'option');
						anchor.setAttribute('tabindex', '-1');
						item.appendChild(anchor);
						fragment.appendChild(item);
					}
					self.list[0].appendChild(fragment);
					// Hide header if it's not a multiselect and there's no placeholder
					if (!this.isMultiple && !placeholder.length) {
						this.header.hide();
					} else {
						this.headerTitle.text(this.placeholder);
					}
					// Now populated, create listview
					self.list.listview();
				},
				_button: function() {
					return $("<a>", {
						"href": "#",
						"role": "button",
						// TODO value is undefined at creation
						"id": this.buttonId,
						"aria-haspopup": "true",
						// TODO value is undefined at creation
						"aria-owns": this.menuId
					});
				}
			});
		};
		// issue #3894 - core doesn't triggered events on disabled delegates
		$(document).bind("selectmenubeforecreate", function(event) {
			var selectmenuWidget = $(event.target).data("selectmenu");
			if (!selectmenuWidget.options.nativeMenu) {
				extendSelect(selectmenuWidget);
			}
		});
	})(jQuery);
	(function($, undefined) {
		$.widget("mobile.fixedtoolbar", $.mobile.widget, {
			options: {
				visibleOnPageShow: true,
				disablePageZoom: true,
				transition: "slide",
				//can be none, fade, slide (slide maps to slideup or slidedown)
				fullscreen: false,
				tapToggle: true,
				tapToggleBlacklist: "a, input, select, textarea, .ui-header-fixed, .ui-footer-fixed",
				hideDuringFocus: "input, textarea, select",
				updatePagePadding: true,
				trackPersistentToolbars: true,
				// Browser detection! Weeee, here we go...
				// Unfortunately, position:fixed is costly, not to mention probably impossible, to feature-detect accurately.
				// Some tests exist, but they currently return false results in critical devices and browsers, which could lead to a broken experience.
				// Testing fixed positioning is also pretty obtrusive to page load, requiring injected elements and scrolling the window
				// The following function serves to rule out some popular browsers with known fixed-positioning issues
				// This is a plugin option like any other, so feel free to improve or overwrite it
				supportBlacklist: function() {
					var w = window,
						ua = navigator.userAgent,
						platform = navigator.platform,
						// Rendering engine is Webkit, and capture major version
						wkmatch = ua.match(/AppleWebKit\/([0-9]+)/),
						wkversion = !! wkmatch && wkmatch[1],
						ffmatch = ua.match(/Fennec\/([0-9]+)/),
						ffversion = !! ffmatch && ffmatch[1],
						operammobilematch = ua.match(/Opera Mobi\/([0-9]+)/),
						omversion = !! operammobilematch && operammobilematch[1];
					if (
					// iOS 4.3 and older : Platform is iPhone/Pad/Touch and Webkit version is less than 534 (ios5)
					((platform.indexOf("iPhone") > -1 || platform.indexOf("iPad") > -1 || platform.indexOf("iPod") > -1) && wkversion && wkversion < 534) ||
					// Opera Mini
					(w.operamini && ({}).toString.call(w.operamini) === "[object OperaMini]") || (operammobilematch && omversion < 7458) ||
					//Android lte 2.1: Platform is Android and Webkit version is less than 533 (Android 2.2)
					(ua.indexOf("Android") > -1 && wkversion && wkversion < 533) ||
					// Firefox Mobile before 6.0 -
					(ffversion && ffversion < 6) ||
					// WebOS less than 3
					("palmGetResource" in window && wkversion && wkversion < 534) ||
					// MeeGo
					(ua.indexOf("MeeGo") > -1 && ua.indexOf("NokiaBrowser/8.5.0") > -1)) {
						return true;
					}
					return false;
				},
				initSelector: ":jqmData(position='fixed')"
			},
			_create: function() {
				var self = this,
					o = self.options,
					$el = self.element,
					tbtype = $el.is(":jqmData(role='header')") ? "header" : "footer",
					$page = $el.closest(".ui-page");
				// Feature detecting support for
				if (o.supportBlacklist()) {
					self.destroy();
					return;
				}
				$el.addClass("ui-" + tbtype + "-fixed");
				// "fullscreen" overlay positioning
				if (o.fullscreen) {
					$el.addClass("ui-" + tbtype + "-fullscreen");
					$page.addClass("ui-page-" + tbtype + "-fullscreen");
				}
				// If not fullscreen, add class to page to set top or bottom padding
				else {
					$page.addClass("ui-page-" + tbtype + "-fixed");
				}
				self._addTransitionClass();
				self._bindPageEvents();
				self._bindToggleHandlers();
			},
			_addTransitionClass: function() {
				var tclass = this.options.transition;
				if (tclass && tclass !== "none") {
					// use appropriate slide for header or footer
					if (tclass === "slide") {
						tclass = this.element.is(".ui-header") ? "slidedown" : "slideup";
					}
					this.element.addClass(tclass);
				}
			},
			_bindPageEvents: function() {
				var self = this,
					o = self.options,
					$el = self.element;
				//page event bindings
				// Fixed toolbars require page zoom to be disabled, otherwise usability issues crop up
				// This method is meant to disable zoom while a fixed-positioned toolbar page is visible
				$el.closest(".ui-page").bind("pagebeforeshow", function() {
					if (o.disablePageZoom) {
						$.mobile.zoom.disable(true);
					}
					if (!o.visibleOnPageShow) {
						self.hide(true);
					}
				}).bind("webkitAnimationStart animationstart updatelayout", function() {
					if (o.updatePagePadding) {
						self.updatePagePadding();
					}
				}).bind("pageshow", function() {
					self.updatePagePadding();
					if (o.updatePagePadding) {
						$(window).bind("throttledresize." + self.widgetName, function() {
							self.updatePagePadding();
						});
					}
				}).bind("pagebeforehide", function(e, ui) {
					if (o.disablePageZoom) {
						$.mobile.zoom.enable(true);
					}
					if (o.updatePagePadding) {
						$(window).unbind("throttledresize." + self.widgetName);
					}
					if (o.trackPersistentToolbars) {
						var thisFooter = $(".ui-footer-fixed:jqmData(id)", this),
							thisHeader = $(".ui-header-fixed:jqmData(id)", this),
							nextFooter = thisFooter.length && ui.nextPage && $(".ui-footer-fixed:jqmData(id='" + thisFooter.jqmData("id") + "')", ui.nextPage),
							nextHeader = thisHeader.length && ui.nextPage && $(".ui-header-fixed:jqmData(id='" + thisHeader.jqmData("id") + "')", ui.nextPage);
						nextFooter = nextFooter || $();
						if (nextFooter.length || nextHeader.length) {
							nextFooter.add(nextHeader).appendTo($.mobile.pageContainer);
							ui.nextPage.one("pageshow", function() {
								nextFooter.add(nextHeader).appendTo(this);
							});
						}
					}
				});
			},
			_visible: true,
			// This will set the content element's top or bottom padding equal to the toolbar's height
			updatePagePadding: function() {
				var $el = this.element,
					header = $el.is(".ui-header");
				// This behavior only applies to "fixed", not "fullscreen"
				if (this.options.fullscreen) {
					return;
				}
				$el.closest(".ui-page").css("padding-" + (header ? "top" : "bottom"), $el.outerHeight());
			},
			_useTransition: function(notransition) {
				var $win = $(window),
					$el = this.element,
					scroll = $win.scrollTop(),
					elHeight = $el.height(),
					pHeight = $el.closest(".ui-page").height(),
					viewportHeight = $.mobile.getScreenHeight(),
					tbtype = $el.is(":jqmData(role='header')") ? "header" : "footer";
				return !notransition && (this.options.transition && this.options.transition !== "none" && ((tbtype === "header" && !this.options.fullscreen && scroll > elHeight) || (tbtype === "footer" && !this.options.fullscreen && scroll + viewportHeight < pHeight - elHeight)) || this.options.fullscreen);
			},
			show: function(notransition) {
				var hideClass = "ui-fixed-hidden",
					$el = this.element;
				if (this._useTransition(notransition)) {
					$el.removeClass("out " + hideClass).addClass("in");
				}
				else {
					$el.removeClass(hideClass);
				}
				this._visible = true;
			},
			hide: function(notransition) {
				var hideClass = "ui-fixed-hidden",
					$el = this.element,
					// if it's a slide transition, our new transitions need the reverse class as well to slide outward
					outclass = "out" + (this.options.transition === "slide" ? " reverse" : "");
				if (this._useTransition(notransition)) {
					$el.addClass(outclass).removeClass("in").animationComplete(function() {
						$el.addClass(hideClass).removeClass(outclass);
					});
				}
				else {
					$el.addClass(hideClass).removeClass(outclass);
				}
				this._visible = false;
			},
			toggle: function() {
				this[this._visible ? "hide" : "show"]();
			},
			_bindToggleHandlers: function() {
				var self = this,
					o = self.options,
					$el = self.element;
				// tap toggle
				$el.closest(".ui-page").bind("vclick", function(e) {
					if (o.tapToggle && !$(e.target).closest(o.tapToggleBlacklist).length) {
						self.toggle();
					}
				}).bind("focusin focusout", function(e) {
					if (screen.width < 500 && $(e.target).is(o.hideDuringFocus) && !$(e.target).closest(".ui-header-fixed, .ui-footer-fixed").length) {
						self[(e.type === "focusin" && self._visible) ? "hide" : "show"]();
					}
				});
			},
			destroy: function() {
				this.element.removeClass("ui-header-fixed ui-footer-fixed ui-header-fullscreen ui-footer-fullscreen in out fade slidedown slideup ui-fixed-hidden");
				this.element.closest(".ui-page").removeClass("ui-page-header-fixed ui-page-footer-fixed ui-page-header-fullscreen ui-page-footer-fullscreen");
			}
		});
		//auto self-init widgets
		$(document).bind("pagecreate create", function(e) {
			// DEPRECATED in 1.1: support for data-fullscreen=true|false on the page element.
			// This line ensures it still works, but we recommend moving the attribute to the toolbars themselves.
			if ($(e.target).jqmData("fullscreen")) {
				$($.mobile.fixedtoolbar.prototype.options.initSelector, e.target).not(":jqmData(fullscreen)").jqmData("fullscreen", true);
			}
			$.mobile.fixedtoolbar.prototype.enhanceWithin(e.target);
		});
	})(jQuery);
	(function($, window) {
		// This fix addresses an iOS bug, so return early if the UA claims it's something else.
		if (!(/iPhone|iPad|iPod/.test(navigator.platform) && navigator.userAgent.indexOf("AppleWebKit") > -1)) {
			return;
		}
		var zoom = $.mobile.zoom,
			evt, x, y, z, aig;
		function checkTilt(e) {
			evt = e.originalEvent;
			aig = evt.accelerationIncludingGravity;
			x = Math.abs(aig.x);
			y = Math.abs(aig.y);
			z = Math.abs(aig.z);
			// If portrait orientation and in one of the danger zones
			if (!window.orientation && (x > 7 || ((z > 6 && y < 8 || z < 8 && y > 6) && x > 5))) {
				if (zoom.enabled) {
					zoom.disable();
				}
			}
			else if (!zoom.enabled) {
				zoom.enable();
			}
		}
		$(window).bind("orientationchange.iosorientationfix", zoom.enable).bind("devicemotion.iosorientationfix", checkTilt);
	}(jQuery, this));
	(function($, window, undefined) {
		var $html = $("html"),
			$head = $("head"),
			$window = $(window);
		// trigger mobileinit event - useful hook for configuring $.mobile settings before they're used
		$(window.document).trigger("mobileinit");
		// support conditions
		// if device support condition(s) aren't met, leave things as they are -> a basic, usable experience,
		// otherwise, proceed with the enhancements
		if (!$.mobile.gradeA()) {
			return;
		}
		// override ajaxEnabled on platforms that have known conflicts with hash history updates
		// or generally work better browsing in regular http for full page refreshes (BB5, Opera Mini)
		if ($.mobile.ajaxBlacklist) {
			$.mobile.ajaxEnabled = false;
		}
		// Add mobile, initial load "rendering" classes to docEl
		$html.addClass("ui-mobile ui-mobile-rendering");
		// This is a fallback. If anything goes wrong (JS errors, etc), or events don't fire,
		// this ensures the rendering class is removed after 5 seconds, so content is visible and accessible
		setTimeout(hideRenderingClass, 5000);
		// loading div which appears during Ajax requests
		// will not appear if $.mobile.loadingMessage is false
		var loaderClass = "ui-loader",
			$loader = $("<div class='" + loaderClass + "'><span class='ui-icon ui-icon-loading'></span><h1></h1></div>");
		// For non-fixed supportin browsers. Position at y center (if scrollTop supported), above the activeBtn (if defined), or just 100px from top


		function fakeFixLoader() {
			var activeBtn = $("." + $.mobile.activeBtnClass).first();
			$loader.css({
				top: $.support.scrollTop && $window.scrollTop() + $window.height() / 2 || activeBtn.length && activeBtn.offset().top || 100
			});
		}
		// check position of loader to see if it appears to be "fixed" to center
		// if not, use abs positioning


		function checkLoaderPosition() {
			var offset = $loader.offset(),
				scrollTop = $window.scrollTop(),
				screenHeight = $.mobile.getScreenHeight();
			if (offset.top < scrollTop || (offset.top - scrollTop) > screenHeight) {
				$loader.addClass("ui-loader-fakefix");
				fakeFixLoader();
				$window.unbind("scroll", checkLoaderPosition).bind("scroll", fakeFixLoader);
			}
		}
		//remove initial build class (only present on first pageshow)


		function hideRenderingClass() {
			$html.removeClass("ui-mobile-rendering");
		}
		$.extend($.mobile, {
			// turn on/off page loading message.
			showPageLoadingMsg: function(theme, msgText, textonly) {
				$html.addClass("ui-loading");
				if ($.mobile.loadingMessage) {
					// text visibility from argument takes priority
					var textVisible = textonly || $.mobile.loadingMessageTextVisible;
					theme = theme || $.mobile.loadingMessageTheme, $loader.attr("class", loaderClass + " ui-corner-all ui-body-" + (theme || "a") + " ui-loader-" + (textVisible ? "verbose" : "default") + (textonly ? " ui-loader-textonly" : "")).find("h1").text(msgText || $.mobile.loadingMessage).end().appendTo($.mobile.pageContainer);
					checkLoaderPosition();
					$window.bind("scroll", checkLoaderPosition);
				}
			},
			hidePageLoadingMsg: function() {
				$html.removeClass("ui-loading");
				if ($.mobile.loadingMessage) {
					$loader.removeClass("ui-loader-fakefix");
				}
				$(window).unbind("scroll", fakeFixLoader);
				$(window).unbind("scroll", checkLoaderPosition);
			},
			// find and enhance the pages in the dom and transition to the first page.
			initializePage: function() {
				// find present pages
				var $pages = $(":jqmData(role='page'), :jqmData(role='dialog')");
				// if no pages are found, create one with body's inner html
				if (!$pages.length) {
					$pages = $("body").wrapInner("<div data-" + $.mobile.ns + "role='page'></div>").children(0);
				}
				// add dialogs, set data-url attrs
				$pages.each(function() {
					var $this = $(this);
					// unless the data url is already set set it to the pathname
					if (!$this.jqmData("url")) {
						$this.attr("data-" + $.mobile.ns + "url", $this.attr("id") || location.pathname + location.search);
					}
				});
				// define first page in dom case one backs out to the directory root (not always the first page visited, but defined as fallback)
				$.mobile.firstPage = $pages.first();
				// define page container
				$.mobile.pageContainer = $pages.first().parent().addClass("ui-mobile-viewport");
				// alert listeners that the pagecontainer has been determined for binding
				// to events triggered on it
				$window.trigger("pagecontainercreate");
				// cue page loading message
				$.mobile.showPageLoadingMsg();
				//remove initial build class (only present on first pageshow)
				hideRenderingClass();
				// if hashchange listening is disabled or there's no hash deeplink, change to the first page in the DOM
				if (!$.mobile.hashListeningEnabled || !$.mobile.path.stripHash(location.hash)) {
					$.mobile.changePage($.mobile.firstPage, {
						transition: "none",
						reverse: true,
						changeHash: false,
						fromHashChange: true
					});
				}
				// otherwise, trigger a hashchange to load a deeplink
				else {
					$window.trigger("hashchange", [true]);
				}
			}
		});
		// initialize events now, after mobileinit has occurred
		$.mobile._registerInternalEvents();
		// check which scrollTop value should be used by scrolling to 1 immediately at domready
		// then check what the scroll top is. Android will report 0... others 1
		// note that this initial scroll won't hide the address bar. It's just for the check.
		$(function() {
			window.scrollTo(0, 1);
			// if defaultHomeScroll hasn't been set yet, see if scrollTop is 1
			// it should be 1 in most browsers, but android treats 1 as 0 (for hiding addr bar)
			// so if it's 1, use 0 from now on
			$.mobile.defaultHomeScroll = (!$.support.scrollTop || $(window).scrollTop() === 1) ? 0 : 1;
			// TODO: Implement a proper registration mechanism with dependency handling in order to not have exceptions like the one below
			//auto self-init widgets for those widgets that have a soft dependency on others
			if ($.fn.controlgroup) {
				$(document).bind("pagecreate create", function(e) {
					$(":jqmData(role='controlgroup')", e.target).jqmEnhanceable().controlgroup({
						excludeInvisible: false
					});
				});
			}
			//dom-ready inits
			if ($.mobile.autoInitializePage) {
				$.mobile.initializePage();
			}
			// window load event
			// hide iOS browser chrome on load
			$window.load($.mobile.silentScroll);
		});
	}(jQuery, this));
}));
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/
// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
	def: 'easeOutQuad',
	swing: function(x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function(x, t, b, c, d) {
		return c * (t /= d) * t + b;
	},
	easeOutQuad: function(x, t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	},
	easeInOutQuad: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	},
	easeInCubic: function(x, t, b, c, d) {
		return c * (t /= d) * t * t + b;
	},
	easeOutCubic: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	},
	easeInOutCubic: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t + 2) + b;
	},
	easeInQuart: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t + b;
	},
	easeOutQuart: function(x, t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	},
	easeInOutQuart: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	},
	easeInQuint: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t * t + b;
	},
	easeOutQuint: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	},
	easeInOutQuint: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	},
	easeInSine: function(x, t, b, c, d) {
		return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	},
	easeOutSine: function(x, t, b, c, d) {
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
	},
	easeInOutSine: function(x, t, b, c, d) {
		return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	},
	easeInExpo: function(x, t, b, c, d) {
		return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	},
	easeOutExpo: function(x, t, b, c, d) {
		return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	},
	easeInOutExpo: function(x, t, b, c, d) {
		if (t == 0) return b;
		if (t == d) return b + c;
		if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function(x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	},
	easeOutCirc: function(x, t, b, c, d) {
		return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	},
	easeInOutCirc: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
		return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	},
	easeInElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		}
		else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	easeOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		}
		else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},
	easeInOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d / 2) == 2) return b + c;
		if (!p) p = d * (.3 * 1.5);
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		}
		else var s = p / (2 * Math.PI) * Math.asin(c / a);
		if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	},
	easeInBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},
	easeOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},
	easeInOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
		return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	},
	easeInBounce: function(x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
	},
	easeOutBounce: function(x, t, b, c, d) {
		if ((t /= d) < (1 / 2.75)) {
			return c * (7.5625 * t * t) + b;
		} else if (t < (2 / 2.75)) {
			return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
		} else if (t < (2.5 / 2.75)) {
			return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
		} else {
			return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
		}
	},
	easeInOutBounce: function(x, t, b, c, d) {
		if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
	}
});
/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
/*

 ### jQuery XML to JSON Plugin v1.1 - 2008-07-01 ###

 * http://www.fyneworks.com/ - diego@fyneworks.com

 * Dual licensed under the MIT and GPL licenses:

 *   http://www.opensource.org/licenses/mit-license.php

 *   http://www.gnu.org/licenses/gpl.html

 ###

 Website: http://www.fyneworks.com/jquery/xml-to-json/

 */
/*

 # INSPIRED BY: http://www.terracoder.com/

           AND: http://www.thomasfrank.se/xml_to_json.html

											AND: http://www.kawa.net/works/js/xml/objtree-e.html

 */
/*

 This simple script converts XML (document of code) into a JSON object. It is the combination of 2

 'xml to json' great parsers (see below) which allows for both 'simple' and 'extended' parsing modes.

 */
// Avoid collisions
;
if (window.jQuery)(function($) {
	// Add function to jQuery namespace
	$.extend({
		// converts xml documents and xml text to json object
		xml2json: function(xml, extended) {
			if (!xml) return {}; // quick fail
			// ### PARSER LIBRARY
			// Core function


			function parseXML(node, simple) {
				if (!node) return null;
				var txt = '',
					obj = null,
					att = null;
				var nt = node.nodeType,
					nn = jsVar(node.localName || node.nodeName);
				var nv = node.text || node.nodeValue || ''; /* DBG */
				// if(window.console) console.log(['x2j',nn,nt,nv.length+' bytes']);
				if (node.childNodes) {
					if (node.childNodes.length > 0) { /* DBG */
						// if(window.console)
						// console.log(['x2j',nn,'CHILDREN',node.childNodes]);
						$.each(node.childNodes, function(n, cn) {
							var cnt = cn.nodeType,
								cnn = jsVar(cn.localName || cn.nodeName);
							var cnv = cn.text || cn.nodeValue || ''; /* DBG */
							// if(window.console)
							// console.log(['x2j',nn,'node>a',cnn,cnt,cnv]);
							if (cnt == 8) { /* DBG */
								// if(window.console)
								// console.log(['x2j',nn,'node>b',cnn,'COMMENT
								// (ignore)']);
								return; // ignore comment node
							}
							else if (cnt == 3 || cnt == 4 || !cnn) {
								// ignore white-space in between tags
								if (cnv.match(/^\s+$/)) { /* DBG */
									// if(window.console)
									// console.log(['x2j',nn,'node>c',cnn,'WHITE-SPACE
									// (ignore)']);
									return;
								}; /* DBG */
								// if(window.console)
								// console.log(['x2j',nn,'node>d',cnn,'TEXT']);
								txt += cnv.replace(/^\s+/, '').replace(/\s+$/, '');
								// make sure we ditch trailing spaces from markup
							}
							else { /* DBG */
								// if(window.console)
								// console.log(['x2j',nn,'node>e',cnn,'OBJECT']);
								obj = obj || {};
								if (obj[cnn]) { /* DBG */
									// if(window.console)
									// console.log(['x2j',nn,'node>f',cnn,'ARRAY']);
									// http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
									if (!obj[cnn].length) obj[cnn] = myArr(obj[cnn]);
									obj[cnn] = myArr(obj[cnn]);
									obj[cnn][obj[cnn].length] = parseXML(cn, true /* simple */ );
									obj[cnn].length = obj[cnn].length;
								}
								else { /* DBG */
									// if(window.console)
									// console.log(['x2j',nn,'node>g',cnn,'dig
									// deeper...']);
									obj[cnn] = parseXML(cn);
								};
							};
						});
					}; // node.childNodes.length>0
				}; // node.childNodes
				if (node.attributes) {
					if (node.attributes.length > 0) { /* DBG */
						// if(window.console)
						// console.log(['x2j',nn,'ATTRIBUTES',node.attributes])
						att = {};
						obj = obj || {};
						$.each(node.attributes, function(a, at) {
							var atn = jsVar(at.name),
								atv = at.value;
							att[atn] = atv;
							if (obj[atn]) { /* DBG */
								// if(window.console)
								// console.log(['x2j',nn,'attr>',atn,'ARRAY']);
								// http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
								// if(!obj[atn].length) obj[atn] = myArr(obj[atn]);//[ obj[
								// atn ] ];
								obj[cnn] = myArr(obj[cnn]);
								obj[atn][obj[atn].length] = atv;
								obj[atn].length = obj[atn].length;
							}
							else { /* DBG */
								// if(window.console)
								// console.log(['x2j',nn,'attr>',atn,'TEXT']);
								obj[atn] = atv;
							};
						});
						// obj['attributes'] = att;
					}; // node.attributes.length>0
				}; // node.attributes
				if (obj) {
					obj = $.extend((txt != '' ? new String(txt) : {}), /* {text:txt}, */ obj || {}
/*

																										 * ,

																										 * att || {}

																										 */
					);
					txt = (obj.text) ? (typeof(obj.text) == 'object' ? obj.text : [obj.text || '']).concat([txt]) : txt;
					if (txt) obj.text = txt;
					txt = '';
				};
				var out = obj || txt;
				// console.log([extended, simple, out]);
				if (extended) {
					if (txt) out = {}; // new String(out);
					txt = out.text || txt || '';
					if (txt) out.text = txt;
					if (!simple) out = myArr(out);
				};
				return out;
			}; // parseXML
			// Core Function End
			// Utility functions
			var jsVar = function(s) {
				return String(s || '').replace(/-/g, "_");
			};
			// NEW isNum function: 01/09/2010
			// Thanks to Emile Grau, GigaTecnologies S.L., www.gigatransfer.com,
			// www.mygigamail.com


			function isNum(s) {
				// based on utility function isNum from xml2json plugin
				// (http://www.fyneworks.com/ - diego@fyneworks.com)
				// few bugs corrected from original function :
				// - syntax error : regexp.test(string) instead of string.test(reg)
				// - regexp modified to accept comma as decimal mark (latin syntax : 25,24 )
				// - regexp modified to reject if no number before decimal mark : ".7" is
				// not accepted
				// - string is "trimmed", allowing to accept space at the beginning and end
				// of string
				var regexp = /^((-)?([0-9]+)(([\.\,]{0,1})([0-9]+))?$)/
				return (typeof s == "number") || regexp.test(String((s && typeof s == "string") ? jQuery.trim(s) : ''));
			};
			// OLD isNum function: (for reference only)
			// var isNum = function(s){ return (typeof s == "number") || String((s && typeof
			// s == "string") ? s : '').test(/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/); };
			var myArr = function(o) {
				// http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
				// if(!o.length) o = [ o ]; o.length=o.length;
				if (!$.isArray(o)) o = [o];
				o.length = o.length;
				// here is where you can attach additional functionality, such as searching
				// and sorting...
				return o;
			};
			// Utility functions End
			// ### PARSER LIBRARY END
			// Convert plain text to xml
			if (typeof xml == 'string') xml = $.text2xml(xml);
			// Quick fail if not xml (or if this is a node)
			if (!xml.nodeType) return;
			if (xml.nodeType == 3 || xml.nodeType == 4) return xml.nodeValue;
			// Find xml root node
			var root = (xml.nodeType == 9) ? xml.documentElement : xml;
			// Convert xml to json
			var out = parseXML(root, true /* simple */ );
			// Clean-up memory
			xml = null;
			root = null;
			// Send output
			return out;
		},
		// Convert text to XML DOM
		text2xml: function(str) {
			// NOTE: I'd like to use jQuery for this, but jQuery makes all tags uppercase
			// return $(xml)[0];
			var out;
			try {
				var xml = ($.browser.msie) ? new ActiveXObject("Microsoft.XMLDOM") : new DOMParser();
				xml.async = false;
			}
			catch (e) {
				throw new Error("XML Parser could not be instantiated")
			};
			try {
				if ($.browser.msie) out = (xml.loadXML(str)) ? xml : false;
				else out = xml.parseFromString(str, "text/xml");
			}
			catch (e) {
				throw new Error("Error parsing XML string")
			};
			return out;
		}
	}); // extend $
})(jQuery);
(function($, undefined) {
	$.widget("mobile.page", $.mobile.widget, {
		options: {
			theme: "a",
			/* default page theme is "a" in davinci. - ysjung (2012/06/09) */
			domCache: false,
			keepNativeDefault: ":jqmData(role='none'), :jqmData(role='nojs'), :jqmData(role^='dvc')" /*add selector for davinci. - ysjung (2012/06/09)*/
		},
		// add method for getting id  - ysjung (2012-06-07)
		getId: function() {
			return this.element[0].id;
		},
		_create: function() {
			var self = this;
			// if false is returned by the callbacks do not create the page
			if (self._trigger("beforecreate") === false) {
				return false;
			}
			self.element.attr("tabindex", "0").addClass("ui-page ui-body-" + self.options.theme).bind("pagebeforehide", function() {
				self.removeContainerBackground();
			}).bind("pagebeforeshow", function() {
				self.setContainerBackground();
			});
			self.element.bind("DOMAttrModified", function(event) {
				if ('attrChange' in event) {
					if (event.attrChange == MutationEvent.MODIFICATION) {
						var $target = $(event.target);
						var inst = $target.data("page");
						if (inst) {
							setTimeout(function() {
								inst._designRefresh();
							}, 100);
						}
					}
					return false;
				}
			});
		},
		_designRefresh: function() {
			var theme = this.element.attr("data-theme") || "a";
			this.element.removeClass("ui-page-" + this.options.theme).removeClass("ui-body-" + this.options.theme);
			this.options.theme = theme;
			this.element.addClass("ui-page-" + this.options.theme).addClass("ui-body-" + this.options.theme);
			// 하위로 내려가면서 changeTheme()를 호출한다.
			this.element.find("div:jqmData(role^='dvc')").each(function() {
				var $this = $(this);
				var role = $this.jqmData("role");
				var instance = $this.data(role);
				if (instance) {
					instance._changeTheme();
				}
			});
		},
		removeContainerBackground: function() {
			$.mobile.pageContainer.removeClass("ui-overlay-" + $.mobile.getInheritedTheme(this.element.parent()));
		},
		// set the page container background to the page theme
		setContainerBackground: function(theme) {
			if (this.options.theme) {
				$.mobile.pageContainer.addClass("ui-overlay-" + (theme || this.options.theme));
			}
		},
		keepNativeSelector: function() {
			var options = this.options,
				keepNativeDefined = options.keepNative && $.trim(options.keepNative);
			if (keepNativeDefined && options.keepNative !== options.keepNativeDefault) {
				return [options.keepNative, options.keepNativeDefault].join(", ");
			}
			return options.keepNativeDefault;
		}
	});
})(jQuery);
/*!
 * Da Vinci Component
 * 
 * Component name : utils
 * js version : 1.0.0
 * 
 */
(function($, undefined) {
	$.davinci = $.extend($.davinci, {
		deviceReady: false,
		/**
		 * 페이지를 전환 한다.
		 * 
		 * @param {String} to 전환 할 page의 id
		 * @param {Object} options
		 *		transition: 				{String}	전환 효과 "none" | "slide" | "slideup" | "slidedown" | "fade" | "pop" | "flip"<br>
		 *		reverse: 					{Boolean}	true면 전환 효과의 반대, false면 전환 효과를 그대로 적용한다.<br>
		 *		changeHash: 				{Boolean}	true,<br>
		 *		fromHashChange: 			{Boolean}	false,<br>
		 *		role: 						{String}	By default we rely on the role defined by the @data-role attribute.<br>
		 *		duplicateCachedPage: 		undefined,
		 *		pageContainer: 				undefined,
		 *		showLoadMsg: 				{Boolean}	loading message shows by default when pages are being fetched during changePage<br>
		 *		dataUrl: 					undefined,
		 *		fromPage: 					{String}	이미 보여지고 있었던 페이지의 pageid<br>
		 *		allowSamePageTransition:	{Boolean}	같은 페이지로의 전환을 허용하는지의 여부
		 */
		changePage: function(to, options) {
			if (typeof to === "string") {
				if (to.length > 0 && to[0] != "#") {
					to = "#" + to;
				}
			}
			var $to = $(to);
			options = options || {};
			if ($to.length) {
				var transition = $to.jqmData("transition");
				if (transition) {
					if (!options.transition) {
						options.transition = transition;
					}
				}
			}
			// android의 경우에는 transition을 "none"으로 설정한다.
			if ($.davinci.getOSName() == "Android") {
				options.transition = "none";
			}
			$.mobile.changePage(to, options);
		},
		/**
		 * 상위 tag의 테마를 가져온다.
		 * 가장 가까운 Tag부터 검색 하고, 없을경우 "a"를 반환 한다.
		 * 
		 * @param {Object} el 해당 widget의 jQuery Object
		 * @param {String} defaultTheme
		 * @returns {String} Theme 값
		 */
		getInheritedTheme: function(el, defaultTheme) {
			var e = el[0],
				theme = "";
			while (e) {
				if (e.getAttribute == undefined) {
					break;
				}
				var theme = e.getAttribute("data-theme");
				if (theme) {
					break;
				}
				e = e.parentNode;
			}
			return theme || defaultTheme || "a";
		},
		/**
		 * Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getInstance: function(id, subid, lineIndex) {
			var $el, role, query_id, query_subid;
			if (typeof id === "string") {
				if (id.length > 0 && id[0] != "#") {
					id = "#" + id;
				}
			}
			if (subid === undefined) { // View Widget
				if (typeof id === "string") {
					$el = $(id);
				}
				else if (id instanceof $) {
					$el = id;
				}
				else if (id instanceof $.mobile.widget) {
					return id;
				}
			}
			else if (lineIndex === undefined) { // basic widget in container without listitem
				query_id = "[id='" + subid + "']";
				query_subid = "[subid='" + subid + "']";
				if (typeof id === "string") {
					$el = $(id + " " + query_id);
					if ($el.length == 0) {
						$el = $(id + " " + query_subid);
					}
				}
				else if (id instanceof $) {
					$el = id.find(query_id);
					if ($el.length == 0) {
						$el = id.find(query_subid);
					}
				}
				else if (id instanceof $.mobile.widget) {
					$el = id.element.find(query_id);
					if ($el.length == 0) {
						$el = id.element.find(query_subid);
					}
				}
			}
			else { // basic widget in listitem
				query_id = ".dvc-listitem-item-indexable:eq(" + lineIndex + ") [id='" + subid + "']";
				query_subid = ".dvc-listitem-item-indexable:eq(" + lineIndex + ") [subid='" + subid + "']";
				if (typeof id === "string") {
					$el = $(id + " " + query_id);
					if ($el.length == 0) {
						$el = $(id + " " + query_subid);
					}
				}
				else if (id instanceof $) {
					$el = id.find(query_id);
					if ($el.length == 0) {
						$el = id.find(query_subid);
					}
				}
				else if (id instanceof $.mobile.widget) {
					$el = id.element.find(query_id);
					if ($el.length == 0) {
						$el = id.element.find(query_subid);
					}
				}
			}
			if ($el.length == 0) {
				console.log("!!!ERROR!!! $.davinci.getInstance(" + id + ", " + subid + ", " + lineIndex + ") : Instance not found!");
				return false;
			}
			role = $el.jqmData('role');
			return $el.data(role);
		},
		/**
		 * dvcAudio Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getAudio: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcAudio") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcButton Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getButton: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcButton") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcCarousel Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getCarousel: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcCarousel") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcCheckbox Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getCheckbox: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcCheckbox") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcCollapseview Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getCollapseview: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcCollapseview") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcContent Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getContent: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcContent") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcDivision Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getDivision: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcDivision") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcFooter Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getFooter: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcFooter") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcGrid Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getGrid: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcGrid") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcHeader Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getHeader: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcHeader") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcImage Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getImage: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcImage") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcImageButton Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getImageButton: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcImageButton") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcLabel Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getLabel: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcLabel") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcLayoutview Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 */
		getLayoutview: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcLayoutview") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcListitem Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getListitem: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcListitem") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcPagebox Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getPagebox: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcPagebox") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcPicker Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getPicker: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcPicker") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcPopup Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getPopup: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcPopup") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcProgress Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getProgress: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcProgress") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcRadio Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getRadio: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcRadio") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcScrollview Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getScrollview: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcScrollview") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcSlider Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getSlider: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcSlider") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcSwitch Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getSwitch: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcSwitch") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcTextarea Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getTextarea: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcTextarea") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcTextfield Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getTextfield: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcTextfield") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcTreeview Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getTreeview: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcTreeview") {
				return ret;
			}
			return null;
		},
		/**
		 * dvcVideo Widget의 instance를 가져온다.
		 * 
		 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
		 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자산의 subid를 넣는다.
		 * @param {Number|undefined} lineIndex : Listitem의 경우에만 사용 한다. Listitem의 lineIndex를 넣는다.
		 */
		getVideo: function(id, subid, lineIndex) {
			var ret = this.getInstance(id, subid, lineIndex);
			if (ret.widgetName === "dvcVideo") {
				return ret;
			}
			return null;
		},
		/**
		 * body의 child인 page중에서 현재 활성화된 page jQuery Object를 가지고 온다.
		 * 
		 * @returns {Object} page의 Object, 없으면 null
		 */
		getActivePage: function() {
			var $ap = $("body>.ui-page-active");
			if ($ap && $ap.length) {
				return $ap.data("page");
			}
			return null;
		},
		/**
		 * OS의 name을 get한다.
		 * @return {String} "Android" | "iOS" | "Other" 중 하나를 리턴한다.
		 */
		getOSName: function() {
			return $.davinci.osName;
		},
		/**
		 * OS의 version을 get한다.
		 * @return {String} OS의 versione을 리턴한다.
		 */
		getOSVersion: function() {
			return $.davinci.osVersion;
		},
		/**
		 * device의 type을 get한다.
		 * @return {String} "Phone" | "Tablet" 중 하나를 리턴한다.
		 */
		getDeviceType: function() {
			return $.davinci.deviceType;
		},
		/**
		 * loading 창을 띄운다.
		 * @param {String} theme :  원하는 theme를 넣을 수 있다 (default:'a') 생략 시 현재 페이지에 적용된 theme를 받아서 처리한다.
		 * @param {String} msgTxt : 원하는 message를 넣어 보여 줄수 있다 (생략가능)
		 */
		showPageLoadingMsg: function(theme, msgTxt) {
			var activePage = $.davinci.getActivePage();
			var activePageTheme;
			activePageTheme = theme ? theme : activePage.options.theme;
			$('.ui-icon-loading').addClass('spin');
			return $.mobile.showPageLoadingMsg(activePageTheme, msgTxt);
		},
		/**
		 * loading 창을 닫는다.
		 */
		hidePageLoadingMsg: function() {
			$('.ui-icon-loading').removeClass('spin');
			return $.mobile.hidePageLoadingMsg();
		}
	});
})(jQuery);
Element.prototype._setAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function(name, val, atevent) {
	this._setAttribute(name, val);
	if (atevent) {
		var e = document.createEvent("MutationEvents");
		var prev = this.getAttribute(name);
		e.initMutationEvent("DOMAttrModified", true, true, null, prev, val, name, MutationEvent.MODIFICATION);
		this.dispatchEvent(e);
	}
};
(function($, undefined) {
	$.widget("davinci.dvcBase", $.mobile.widget, {
		options: {
			visible: true,
			enable: true,
			customStyle: false,
			theme: null,
			eventNames: []
		},
		classes: {
			CLS_DESIGN_DEFAULT: "dvc-design-default",
			CLS_HIDDEN: "dvc-base-hidden",
			CLS_DISABLED: "dvc-base-disabled",
			CLS_CHECKED: "dvc-base-checked",
			CLS_ABSOLUTE: "dvc-base-absolute",
			CLS_WIDGET: "",
			CLS_THEME: null
		},
		// _init은 _create후에 호출된다.
		_init: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// event 등록
			var eventNames = o.eventNames;
			if (eventNames.length) {
				$el._eventRegs(eventNames);
			}
		},
		_create: function() {
			var $el = this.element,
				self = this,
				o = self.options;
			// widget에 화면에 보여지기 전에 처리할 수 있는 코드
			self._initWidget();
			self._appendChildElements();
			// widget이 화면에 보여진 후에 처리할 수 있는 코드
			var widgetCreate = function() {
				var widgetInit = function() {
					self._initVars();
					self._addDOMAttrModifiedEventListener();
					self.refresh();
				};
				var $parentPage = $el.closest(".ui-page");
				// widget이 속한 page가 active상태일 때 create한다.
				if ($parentPage.hasClass($.mobile.activePageClass)) {
					widgetInit();
				}
				else {
					// widget이 속한 page가 active상태가 아니면, pageshow가 발생할 때 create한다.
					$parentPage.one("ev_pageshow", function() {
						widgetInit();
					});
				}
			};
			// DOM에 widget이 있으면 바로 widget 초기화
			if (self._isElementInDocument($el)) {
				widgetCreate();
			}
			else {
				// DOM에 widget이 없으면 DOM에 삽입될 때 widget 초기화
				$el.one("DOMNodeInsertedIntoDocument", function() {
					// Android Phone 단말일 경우에 바로 보여지지 않는 문제가 있어 100ms의 여유를 줌.
					setTimeout(function() {
						widgetCreate();
					}, 100);
				});
			}
		},
		_addDOMAttrModifiedEventListener: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$el.bind("DOMAttrModified", function(event) {
				if ('attrChange' in event) {
					if (event.attrChange == MutationEvent.MODIFICATION) {
						var $target = $(event.target);
						var role = $target.jqmData("role");
						var inst = $target.data(role);
						if (inst) {
							setTimeout(function() {
								inst._designRefresh();
							}, 100);
						}
					}
					return false;
				}
			});
		},
		_designRefresh: function() {
			var $el = this.element,
				self = this,
				cls = this.classes;
			//원래 초기값을 options에 설정한다.
			for (var o in $.davinci[this.widgetName].prototype.options) {
				self.options[o] = $.davinci[this.widgetName].prototype.options[o];
			}
			// data-* attribute를 다시 읽어온다.
			for (var o in self.element[0].dataset) {
				self.options[o] = self.element[0].dataset[o];
				if (self.options[o].toLowerCase() == "true") {
					self.options[o] = true;
				}
				else if (self.options[o].toLowerCase() == "false") {
					self.options[o] = false;
				}
			}
			self._removeClasses();
			self._removeDesignDefault();
			self._empty();
			self._initWidget();
			self._appendChildElements();
			self._initVars();
			self.refresh();
		},
		_designDefault: function(label) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var $c = $("<div class='" + cls.CLS_DESIGN_DEFAULT + "' waper_focus='false' waper_dontsave='true' style='font-family:Tahoma; font-size:12px;' >" + label + "</div>");
			$el.append($c);
		},
		_addAttrDontSaveNDontFocus: function($el) {
			return $el.attr('waper_focus', 'false').attr('waper_dontsave', 'true');
		},
		_removeClasses: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				classes = this.classes;
			var classNames = [];
			for (var cls in classes) {
				classNames.push(classes[cls]);
			}
			$el.removeClass(classNames.join(" "));
		},
		_removeDesignDefault: function() {
			var $el = this.element;
			$el.children(".dvc-design-default").remove();
		},
		_empty: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				classes = this.classes;
			$el.empty();
		},
		_changeTheme: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var theme = $el.attr("data-theme");
			if (!theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			$el.removeClass(cls.CLS_WIDGET + "-a " + cls.CLS_WIDGET + "-b " + cls.CLS_WIDGET + "-c");
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			$el.addClass(cls.CLS_THEME);
		},
		_initWidget: function() {},
		_appendChildElements: function() {},
		_initVars: function() {},
		enable: function(enable) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (arguments[0] != undefined) {
				o.enable = enable;
				if (enable == true) {
					this.element.removeClass(cls.CLS_DISABLED);
				}
				else {
					this.element.addClass(cls.CLS_DISABLED);
				}
			}
			else {
				return o.enable;
			}
		},
		visible: function(visible) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (arguments[0] != undefined) {
				o.visible = visible;
				if (visible == true) {
					this.element.removeClass(cls.CLS_HIDDEN);
				}
				else {
					this.element.addClass(cls.CLS_HIDDEN);
				}
			}
			else {
				return o.visible;
			}
		},
		refresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var e = this.enable();
			this.enable(e);
			var v = this.visible();
			this.visible(v);
		},
		// scrollview가 Drag 되었는 지를 확인한다.
		scrollviewDragged: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (this.scrollview === undefined) {
				if (!this._findScrollview()) {
					this.scrollview = 0;
				}
			}
			if (this.scrollview && this.scrollview._didDrag) {
				return true;
			}
			return false;
		},
		_isElementInDocument: function($el) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var element = $el[0];
			while (element != document && element.parentNode) {
				element = element.parentNode;
			}
			return element == document;
		},
		_getAncestorEnable: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var ret = true;
			$el.parents(":jqmData(role^='dvc'), .dvc-listitem-item").each(function() {
				if ($(this).hasClass(cls.CLS_DISABLED)) {
					ret = false;
					return false;
				}
			});
			return ret;
		},
		_findScrollview: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var $scrollview = $el.closest(":jqmData(role='dvcScrollview')");
			if ($scrollview.length > 0) {
				this.scrollview = $scrollview.data('dvcScrollview');
				return true;
			}
		},
		_getNativeEvent: function(e) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			while (e && typeof e.originalEvent !== "undefined") {
				e = e.originalEvent;
			}
			return e;
		},
		/**
		 * subid 또는 id를 얻어온다. subid와 id가 함께 있을 경우에는 subid가 우선이다.
		 */
		getId: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var id = $el.attr("subid");
			if (!id) {
				id = $el[0].id;
			}
			return id;
		},
		_prevmousedown: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			this._vmouseStatus = 1;
		},
		_prevmouseup: function(e) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (e.type == "vmousecancel") {
				return false;
			}
			if (this._vmouseStatus != 1) {
				return true;
			}
			this._vmouseStatus = 2;
			return false;
		},
		_prevclick: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (this._vmouseStatus != 2) {
				return true;
			}
			this._vmouseStatus = 3;
			return false;
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcButton", $.davinci.dvcBase, {
		options: {
			text: "",
			textAlign: "center",
			type: "default",
			iconPos: "left",
			eventNames: ["ev_click"],
			initSelector: ":jqmData(role='dvcButton')"
		},
		classes: {
			CLS_WIDGET: "dvc-button",
			CLS_BUTTON_UP: "dvc-button-up",
			CLS_BUTTON_DOWN: "dvc-button-down",
			CLS_BUTTON_BACK: "dvc-button-back",
			CLS_BUTTON_CANCEL: "dvc-button-cancel",
			CLS_BUTTON_OK: "dvc-button-ok",
			CLS_BUTTON_TEXT: "dvc-button-text",
			CLS_BUTTON_ICON: "dvc-button-icon",
			CLS_BUTTON_ICON_LEFT: "dvc-button-icon-left",
			CLS_BUTTON_ICON_TOP: "dvc-button-icon-top",
			CLS_BUTTON_ICON_RIGHT: "dvc-button-icon-right",
			CLS_BUTTON_ICON_BOTTOM: "dvc-button-icon-bottom"
		},
		_initType: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			switch (o.type) {
			case "back":
				$el.addClass(cls.CLS_BUTTON_BACK);
				break;
			case "cancel":
				$el.addClass(cls.CLS_BUTTON_CANCEL);
				break;
			case "ok":
				$el.addClass(cls.CLS_BUTTON_OK);
				break;
			}
		},
		_initIconPos: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			switch (o.iconPos) {
			case "top":
				$el.addClass(cls.CLS_BUTTON_ICON_TOP);
				break;
			case "right":
				$el.addClass(cls.CLS_BUTTON_ICON_RIGHT);
				break;
			case "bottom":
				$el.addClass(cls.CLS_BUTTON_ICON_BOTTOM);
				break;
			default:
				$el.addClass(cls.CLS_BUTTON_ICON_LEFT);
				break;
			}
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// if not, try to find closest theme container	
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			// theme관련 class를 cls에 추가하여 저작도구에서 class를 지우는 리스트에 포함한다.
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_BUTTON_UP + ' ' + cls.CLS_THEME);
			// 상위에 listitem가 있으면, 
			var $listitem = $el.closest(".dvc-listitem");
			if ($listitem && $listitem.length) {
				var $item = $el.closest(".dvc-listitem-item-indexable");
				if ($item && $item.length) {
					self.$listitem = $listitem;
					self.$item = $item;
				}
			} /* flexbox가 적용되면 제거될 예정임 */
			var display = $el.css("display");
			if (display == "block") {
				$el.css("display", "-webkit-box");
			}
			else if (display == "inline" || display == "inline-block") {
				$el.css("display", "-webkit-inline-box");
			}
			self._initType();
			self._initIconPos();
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			self.$icon = $("<img class='" + cls.CLS_BUTTON_ICON + "'>");
			self.$text = $("<div class='" + cls.CLS_BUTTON_TEXT + "' ></div>");
			$el.append(self.$icon);
			$el.append(self.$text);
			self._addAttrDontSaveNDontFocus($el.find("*"));
		},
		refresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype.refresh.call(this);
			self.textAlign(o.textAlign);
			self.text(o.text);
		},
		textAlign: function(ta) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var $divText = self.$text;
			if (arguments[0] != undefined) {
				o.textAlign = ta;
				$divText.css({
					"text-align": ta
				});
				return this;
			}
			else {
				return o.textAlign;
			}
		},
		text: function(t) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (arguments.length) {
				o.text = t;
				self.$text[0].innerHTML = t;
				return this;
			}
			else {
				return o.text;
			}
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcCheckbox", $.davinci.dvcButton, {
		options: {
			checked: false,
			textAlign: "left",
			eventNames: ["ev_change"],
			initSelector: ":jqmData(role='dvcCheckbox')"
		},
		classes: {
			CLS_WIDGET: "dvc-checkbox",
			CLS_BUTTON_UP: "dvc-checkbox-up",
			CLS_BUTTON_DOWN: "dvc-checkbox-down"
		},
		refresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype.refresh.call(this);
			// background-image가 있으면 content:"" 를 추가하여, 기본 icon을 보이지 않게 한다.
			if ($el.css("background-image") != "none") {
				self.$icon.css("content", "\"\"");
			}
			else {
				// 없으면, content:""를 지운다.
				self.$icon.css("content", "");
			}
			self.textAlign(o.textAlign);
			self.text(o.text);
			self._checked(o.checked);
		},
		_checked: function(v) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (v) {
				$el.addClass(cls.CLS_CHECKED);
			}
			else {
				$el.removeClass(cls.CLS_CHECKED);
			}
			o.checked = v;
		},
		checked: function(v) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (arguments.length) {
				self._checked(v);
				return this;
			}
			else {
				return o.checked;
			}
		},
		toggle: function() {
			this.checked(!this.checked());
			return this;
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcRadio", $.davinci.dvcCheckbox, {
		options: {
			groupName: "",
			radioEvent: "up",
			// radio일때 event 발생하는 시점
			allowDepress: false,
			initSelector: ":jqmData(role='dvcRadio')"
		},
		classes: {
			CLS_WIDGET: "dvc-radio",
			CLS_BUTTON_UP: "dvc-radio-up",
			CLS_BUTTON_DOWN: "dvc-radio-down"
		},
		checked: function(v) {
			var $el = this.element,
				self = this,
				o = this.options;
			if (arguments.length) {
				var oldChecked = o.checked;
				self._checked(v);
				if (oldChecked == false) {
					// id가 있는 parent를 찾는다.
					var $ancestorWithID = null;
					$el.parents().each(function() {
						if (this.id && $(this).jqmData("role") != "GridItem") {
							$ancestorWithID = $(this);
							return false;
						}
					});
					if ($ancestorWithID) {
						$ancestorWithID.find(":jqmData(group-name=" + o.groupName + ")").each(function() {
							if (this !== $el[0]) {
								var $this = $(this);
								var role = $this.jqmData("role");
								var inst = $this.data(role);
								if (inst) {
									inst._checked(false);
								}
							}
						});
					}
				}
				return this;
			}
			else {
				return o.checked;
			}
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcImage", $.davinci.dvcBase, {
		options: {
			src: "",
			type: "normal",
			initSelector: ":jqmData(role='dvcImage')"
		},
		classes: {
			CLS_WIDGET: "dvc-image",
			CLS_IMAGE_TILE: "dvc-image-tile",
			CLS_IMAGE_STRETCH: "dvc-image-stretch",
			CLS_IMAGE_ZOOM: "dvc-image-zoom",
			CLS_IMAGE_CENTER: "dvc-image-center"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$el.addClass(cls.CLS_WIDGET);
		},
		refresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype.refresh.call(this);
			this.src(o.src);
			this.type(o.type);
		},
		src: function(url) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (arguments.length) {
				if (url) {
					var $defaultDesign = $el.find('.' + cls.CLS_DESIGN_DEFAULT);
					if ($defaultDesign.length > 0) {
						$defaultDesign.remove();
					}
					this.element.css("background-image", "url('" + url + "')");
				}
				else {
					this.element.css("background-image", "none");
					self._designDefault($el.jqmData("role").slice(3));
				}
			} else {
				var ret = this.element.css("background-image");
				if (ret.length > 5 && ret.indexOf("url(") === 0) {
					return ret.slice(4, -1);
				}
				return ret;
			}
		},
		type: function(t) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (arguments.length) {
				$el.removeClass(cls.CLS_IMAGE_TILE + ' ' + cls.CLS_IMAGE_STRETCH + ' ' + cls.CLS_IMAGE_ZOOM + ' ' + cls.CLS_IMAGE_CENTER);
				switch (t) {
				case "tile":
					$el.addClass(cls.CLS_IMAGE_TILE);
					break;
				case "stretch":
					$el.addClass(cls.CLS_IMAGE_STRETCH);
					break;
				case "zoom":
					$el.addClass(cls.CLS_IMAGE_ZOOM);
					break;
				case "center":
					$el.addClass(cls.CLS_IMAGE_CENTER);
					break;
				}
			} else {
				t = o.type;
				return t;
			}
		}
	});
})(jQuery);
// dependency : dvcImage, dvcButton
(function($, undefined) {
	$.widget("davinci.dvcImageButton", $.davinci.dvcBase, {
		options: {
			text: "",
			type: "normal",
			eventNames: ["ev_click"],
			initSelector: ":jqmData(role='dvcImageButton')"
		},
		classes: {
			CLS_WIDGET: "dvc-imagebutton",
			CLS_IMGBTN_UP: "dvc-imagebutton-up",
			CLS_IMGBTN_DOWN: "dvc-imagebutton-down",
			CLS_IMGBTN_TEXT: "dvc-button-text",
			CLS_IMGBTN_TILE: "dvc-imagebutton-tile",
			CLS_IMGBTN_STRETCH: "dvc-imagebutton-stretch",
			CLS_IMGBTN_ZOOM: "dvc-imagebutton-zoom",
			CLS_IMGBTN_CENTER: "dvc-imagebutton-center"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// 상위에 listitem가 있으면, 
			var $listitem = $el.closest(".dvc-listitem");
			if ($listitem && $listitem.length) {
				var $item = $el.closest(".dvc-listitem-item-indexable");
				if ($item && $item.length) {
					self.$listitem = $listitem;
					self.$item = $item;
				}
			}
			$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_IMGBTN_UP);
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			self.$buttonText = $("<div class='" + cls.CLS_IMGBTN_TEXT + "'></div>");
			self.$buttonText.attr('waper_focus', 'false').attr('waper_dontsave', 'true');
			$el.append(self.$buttonText);
		},
		refresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype.refresh.call(this);
			self.type(o.type);
			self.text(o.text);
		},
		type: function(t) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (arguments.length) {
				$el.removeClass(cls.CLS_IMGBTN_TILE + ' ' + cls.CLS_IMGBTN_STRETCH + ' ' + cls.CLS_IMGBTN_ZOOM + ' ' + cls.CLS_IMGBTN_CENTER);
				switch (t) {
				case "tile":
					$el.addClass(cls.CLS_IMGBTN_TILE);
					break;
				case "stretch":
					$el.addClass(cls.CLS_IMGBTN_STRETCH);
					break;
				case "zoom":
					$el.addClass(cls.CLS_IMGBTN_ZOOM);
					break;
				case "center":
					$el.addClass(cls.CLS_IMGBTN_CENTER);
					break;
				}
			} else {
				t = o.type;
				return t;
			}
		},
		text: function(t) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (arguments.length) {
				o.text = t;
				self.$buttonText[0].innerHTML = t;
			}
			else {
				return o.text;
			}
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcLabel", $.davinci.dvcBase, {
		options: {
			text: "",
			textAlign: "left",
			multiline: false,
			enable: false,
			eventNames: ["ev_click"],
			initSelector: ":jqmData(role='dvcLabel')"
		},
		classes: {
			CLS_WIDGET: "dvc-label",
			CLS_LABEL_UP: "dvc-label-up",
			CLS_LABEL_DOWN: "dvc-label-down",
			CLS_LABEL_TEXT: "dvc-label-text",
			CLS_LABEL_MULTIPLE: "dvc-label-multiple",
			CLS_LABEL_SINGLE: "dvc-label-single",
			CLS_LABEL_DEFAULT_DESIGN_TEXT: "dvc-label-default-design-text"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// if not, try to find closest theme container	
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_LABEL_UP + ' ' + cls.CLS_THEME);
			// 상위에 listitem가 있으면, 
			var $listitem = $el.closest(".dvc-listitem");
			if ($listitem && $listitem.length) {
				var $item = $el.closest(".dvc-listitem-item-indexable");
				if ($item && $item.length) {
					self.$listitem = $listitem;
					self.$item = $item;
				}
			}
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			self.$labelText = $("<div class='" + cls.CLS_LABEL_TEXT + "'></div>").appendTo($el);
			self._addAttrDontSaveNDontFocus($el.find("*"));
		},
		refresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype.refresh.call(this);
			if (!o.text) {
				o.text = "Label";
				$el.addClass(cls.CLS_LABEL_DEFAULT_DESIGN_TEXT);
			}
			else {
				$el.removeClass(cls.CLS_LABEL_DEFAULT_DESIGN_TEXT);
			}
			self.textAlign(o.textAlign);
			self.text(o.text);
		},
		textAlign: function(ta) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var $divText = self.$labelText;
			if (arguments[0] != undefined) {
				o.textAlign = ta;
				$divText.css({
					"text-align": ta
				});
				return this;
			}
			else {
				return o.textAlign;
			}
		},
		text: function(t) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (arguments.length) {
				var $divText = self.$labelText;
				o.text = t;
				$divText[0].innerHTML = t;
				if (o.multiline) {
					$divText.addClass(cls.CLS_LABEL_MULTIPLE);
				}
				else {
					$divText.addClass(cls.CLS_LABEL_SINGLE);
				}
				return this;
			}
			else {
				return o.text;
			}
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcProgress", $.davinci.dvcBase, {
		options: {
			min: 0,
			max: 100,
			value: 0,
			initSelector: ":jqmData(role='dvcProgress')"
		},
		classes: {
			CLS_WIDGET: "dvc-progress",
			CLS_PROGRESS_BODY: "dvc-progress-body",
			CLS_PROGRESS_BAR: "dvc-progress-bar"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// if not, try to find closest theme container	
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_THEME);
		},
		_appendChildElements: function() {
			var self = this,
				$el = this.element,
				o = this.options,
				cls = this.classes;
			var $progressBody = $("<div class='" + cls.CLS_PROGRESS_BODY + "'></div>");
			var $progressBar = $("<div class='" + cls.CLS_PROGRESS_BAR + "'></div>");
			$progressBody.append($progressBar);
			self.$progressBody = $progressBody;
			self.$progressBar = $progressBar;
			$el.append($progressBody);
			self._addAttrDontSaveNDontFocus($el.find("*"));
		},
		_getAverage: function() {
			var $el = this.element,
				self = this,
				o = self.options;
			var average = self.$progressBody.width() / (o.max - o.min);
			return average;
		},
		_draw: function() {
			var self = this,
				$el = this.element,
				o = this.options;
			var average = this._getAverage();
			var position = parseInt((o.value - o.min) * average);
			var $progressBar = self.$progressBar;
			$progressBar[0].style.width = position + "px";
			if (position == 0) {
				$progressBar.hide();
			}
			else {
				$progressBar.show();
			}
		},
		refresh: function() {
			var self = this,
				$el = this.element,
				o = this.options;
			$.davinci.dvcBase.prototype.refresh.call(this);
			self.value(o.value);
			return this;
		},
		min: function(v) {
			var self = this,
				o = self.options;
			if (arguments.length) {
				o.min = parseInt(v, 10);
				self.value(o.value);
				return this;
			} else {
				var min = o.min
				return min;
			}
		},
		max: function(v) {
			var self = this,
				o = self.options;
			if (arguments.length) {
				o.max = parseInt(v, 10);
				self.value(o.value);
				return this;
			} else {
				var max = o.max;
				return max;
			}
		},
		value: function(v) {
			var self = this,
				$el = this.element,
				o = this.options;
			if (arguments.length) {
				// 어떤값이 상한 하한을 벗어날 경우 보정함
				v = Math.max(v, o.min);
				v = Math.min(v, o.max);
				o.value = v;
				this._draw();
				return this;
			} else {
				var val = o.value;
				return val;
			}
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcSlider", $.davinci.dvcProgress, {
		options: {
			eventNames: ["ev_change"],
			initSelector: ":jqmData(role='dvcSlider')"
		},
		classes: {
			CLS_WIDGET: "dvc-slider",
			CLS_SLIDER_BODY: "dvc-slider-body",
			CLS_SLIDER_BAR: "dvc-slider-bar",
			CLS_SLIDER_HANDLE: "dvc-slider-handle",
			CLS_SLIDER_HANDLE_UP: "dvc-slider-handle-up",
			CLS_SLIDER_HANDLE_DOWN: "dvc-slider-handle-down"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// if not, try to find closest theme container	
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_THEME);
			// 상위에 listitem가 있으면, 
			var $listitem = $el.closest(".dvc-listitem");
			if ($listitem && $listitem.length) {
				var $item = $el.closest(".dvc-listitem-item-indexable");
				if ($item && $item.length) {
					self.$listitem = $listitem;
					self.$item = $item;
				}
			}
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = self.options,
				cls = this.classes;
			var $sliderBody = $("<div class='" + cls.CLS_SLIDER_BODY + "'></div>");
			var $sliderBar = $("<div class='" + cls.CLS_SLIDER_BAR + "'></div>");
			var $sliderHandle = $("<div class='" + cls.CLS_SLIDER_HANDLE + ' ' + cls.CLS_SLIDER_HANDLE_UP + "'></div>");
			self.$sliderBody = $sliderBody;
			self.$sliderBar = $sliderBar;
			self.$sliderHandle = $sliderHandle;
			$sliderBody.append($sliderBar);
			$el.append($sliderBody);
			$el.append($sliderHandle);
			self._addAttrDontSaveNDontFocus($el.find("*"));
		},
		_getAverage: function() {
			var $el = this.element,
				self = this,
				o = self.options;
			var average = self.$sliderBody.width() / (o.max - o.min);
			return average;
		},
		_draw: function() {
			var $el = this.element,
				self = this,
				o = self.options;
			var $sliderBar = self.$sliderBar;
			var $sliderHandle = self.$sliderHandle;
			var average = this._getAverage();
			var position = parseInt((o.value - o.min) * average);
			$sliderHandle[0].style.left = position + "px";
			$sliderBar[0].style.width = position + "px";
			if (position == 0) {
				$sliderBar.hide();
			}
			else {
				$sliderBar.show();
			}
		},
		_pageX2Value: function(pos) {
			var $el = this.element,
				self = this,
				o = self.options;
			var average = this._getAverage();
			var bgLeftInPage = $el.offset().left; //background left- 페이지 전체에서의 위치				
			var position = (pos - bgLeftInPage); //선택한 위치px값 (선택위치- background의 left값)
			var elBgWidth = $el.width();
			// 상한 하한 보정
			if (position < 0) {
				position = 0;
			} else if (position > elBgWidth) {
				position = elBgWidth;
			}
			var v = Math.round(position / average) + o.min;
			return v;
		}
	});
})(jQuery);
/* 
	- 전제 조건
		1. Switch 위젯의 handle중 left와 right의 width는 같아야 한다.
*/
(function($, undefined) {
	$.widget("davinci.dvcSwitch", $.davinci.dvcBase, {
		options: {
			checkedLabel: "ON",
			uncheckedLabel: "OFF",
			checked: false,
			minWidth: 20,
			eventNames: ["ev_change"],
			initSelector: ":jqmData(role='dvcSwitch')"
		},
		classes: {
			CLS_WIDGET: "dvc-switch",
			CLS_SWITCH_HANDLE: "dvc-switch-handle",
			CLS_SWITCH_HANDLE_LEFT: "dvc-switch-handle-l",
			CLS_SWITCH_HANDLE_CENTER: "dvc-switch-handle-c",
			CLS_SWITCH_HANDLE_RIGHT: "dvc-switch-handle-r",
			CLS_SWITCH_TEXT: "dvc-switch-text",
			CLS_SWITCH_ON_TEXT: "dvc-switch-on-text",
			CLS_SWITCH_OFF_TEXT: "dvc-switch-off-text",
			CLS_SWITCH_ON_IMAGE: "dvc-switch-on-image",
			CLS_SWITCH_OFF_IMAGE: "dvc-switch-off-image"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// if not, try to find closest theme container	
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_THEME);
			// 상위에 listitem가 있으면, 
			var $listitem = $el.closest(".dvc-listitem");
			if ($listitem && $listitem.length) {
				var $item = $el.closest(".dvc-listitem-item-indexable");
				if ($item && $item.length) {
					self.$listitem = $listitem;
					self.$item = $item;
				}
			}
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var $text = $("<div class='" + cls.CLS_SWITCH_TEXT + "'></div>");
			var $onText = $("<div class='" + cls.CLS_SWITCH_ON_TEXT + "'>" + o.checkedLabel + "</div>");
			var $offText = $("<div class='" + cls.CLS_SWITCH_OFF_TEXT + "'>" + o.uncheckedLabel + "</div>");
			$text.attr('waper_focus', 'false').attr('waper_dontsave', 'true');
			$onText.attr('waper_focus', 'false').attr('waper_dontsave', 'true');
			$offText.attr('waper_focus', 'false').attr('waper_dontsave', 'true');
			$text.append($onText);
			$text.append($offText);
			var $handle = $("<div class='" + cls.CLS_SWITCH_HANDLE + "'><div class='" + cls.CLS_SWITCH_HANDLE_LEFT + "'></div><div class='" + cls.CLS_SWITCH_HANDLE_CENTER + "'></div><div class='" + cls.CLS_SWITCH_HANDLE_RIGHT + "'></div></div>");
			var $onImage = $("<div class='" + cls.CLS_SWITCH_ON_IMAGE + "'></div>");
			var $offImage = $("<div class='" + cls.CLS_SWITCH_OFF_IMAGE + "'></div>");
			$el.append($text);
			$el.append($handle);
			$el.append($onImage);
			$el.append($offImage);
			this.$text = $text;
			this.$onText = $onText;
			this.$offText = $offText;
			this.$handle = $handle;
			this.$onImage = $onImage;
			this.$offImage = $offImage;
			self._addAttrDontSaveNDontFocus($el.find("*"));
		},
		_animation: function(start) {
			var $el = this.element,
				self = this,
				o = this.options;
			var plus;
			var checked = self.checked();
			if (checked) {
				plus = true;
			}
			else {
				plus = false;
			}
			var animation = function() {
				start = (plus) ? start + 10 : start - 10;
				start = Math.min(self.maxRange, start);
				start = Math.max(0, start);
				self._draw(start);
				if (plus) {
					if (start < self.maxRange) {
						setTimeout(function() {
							animation();
						}, 50);
						return;
					}
				}
				else {
					if (start > 0) {
						setTimeout(function() {
							animation();
						}, 50);
						return;
					}
				}
				// animation이 종료될 때 event를 날린다.
				if (self.oldChecked != checked) {
					var index = -1;
					if (self.$listitem) {
						index = self.$listitem.find(".dvc-listitem-item-indexable").index(self.$item);
					}
					$el.trigger("ev_change", [self, checked, index]);
					self.oldChecked = checked;
				}
			};
			setTimeout(function() {
				animation();
			}, 50);
		},
		refresh: function() {
			var $el = this.element,
				self = this,
				o = this.options;
			$.davinci.dvcBase.prototype.refresh.call(this);
			this.checked(o.checked);
		},
		_setChecked: function(c) {
			var $el = this.element,
				self = this,
				o = this.options;
			o.checked = c;
		},
		checked: function(c) {
			var $el = this.element,
				self = this,
				o = this.options;
			if (arguments[0] != undefined) {
				self._setChecked(c);
				var currentPos;
				if (o.checked == false) {
					currentPos = 0;
				}
				else {
					currentPos = self.maxRange;
				}
				self._draw(currentPos);
				self.oldChecked = c;
				return this;
			}
			else {
				return o.checked;
			}
		},
		_initVars: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			self.handleLeftWidth = self.$handle.find('.' + cls.CLS_SWITCH_HANDLE_LEFT).width();
			self.$text.css({
				"left": self.handleLeftWidth,
				"right": self.handleLeftWidth
			});
			// checkedLabel이나, uncheckedLabel의 textWidth에 따라 switch의 width를 결정한다.
			var onTextWidth = self.$onText.outerWidth(true);
			var offTextWidth = self.$offText.outerWidth(true);
			var maxTextWidth = Math.max(onTextWidth, o.minWidth);
			maxTextWidth = Math.max(offTextWidth, maxTextWidth);
			maxTextWidth += self.handleLeftWidth;
			self.$onText.width(maxTextWidth);
			self.$offText.width(maxTextWidth);
			// Text의 최대넓이
			self.maxTextWidth = maxTextWidth;
			var maxRange = self.maxTextWidth + self.handleLeftWidth;
			self.maxRange = maxRange;
			// handle의 center값을 어떻게 처리할 것인가? 일단은 고정형으로 한다.
			// handle_width를 구한다.
			self.handleWidth = self.$handle.outerWidth(true);
		},
		_draw: function(currentPos) {
			var $el = this.element,
				self = this,
				o = this.options;
			var maxRange = self.maxRange,
				handleWidth = self.handleWidth,
				maxTextWidth = self.maxTextWidth,
				handleLeftWidth = self.handleLeftWidth;
			// 해당 상태에 대해 widget을 그린다.
			Math.max(currentPos, 0);
			Math.min(currentPos, maxRange);
			var onTextRange = maxRange - currentPos;
			// onImage의 경우
			// currentPos가 0일때 handleWidth + maxTextWidth - handleLeftWidth
			// currentPos가 maxRange일때 handleWidth/2
			// Image는 이렇게 됨. 
			// 
			var imageMinWidth = handleWidth / 2;
			var imageMaxWidth = maxTextWidth + handleLeftWidth + handleWidth / 2;
			var imageRange = imageMaxWidth - imageMinWidth;
			// imageRange : x = maxRange : currentPos
			var offImageWidth = parseInt((currentPos * imageRange) / maxRange);
			var onImageWidth = imageRange - offImageWidth;
			self.$onImage.width(imageMinWidth + offImageWidth);
			self.$offImage.width(imageMinWidth + onImageWidth);
			self.$offText.css("left", handleWidth + maxTextWidth - onTextRange);
			self.$onText.css("left", -onTextRange);
			self.$handle.css("left", currentPos);
			// width를 _draw()시에 계속 변경할 경우 iPad에서 Rendering이 깨지는 문제가 발생한다.
			//self.element.width(imageMinWidth + offImageWidth + imageMinWidth + onImageWidth);
		}
	});
})(jQuery);
/*!
 * Da Vinci Component
 * 
 * Component name : textarea
 * js version : 1.0.0
 * 
 */
(function($, undefined) {
	$.widget("davinci.dvcTextarea", $.davinci.dvcBase, {
		options: {
			text: "",
			eventNames: ["ev_click"],
			initSelector: ":jqmData(role='dvcTextarea')"
		},
		classes: {
			CLS_WIDGET: "dvc-textarea"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// if not, try to find closest theme container	
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_THEME);
			// 상위에 listitem가 있으면, 
			var $listitem = $el.closest(".dvc-listitem");
			if ($listitem && $listitem.length) {
				var $item = $el.closest(".dvc-listitem-item-indexable");
				if ($item && $item.length) {
					self.$listitem = $listitem;
					self.$item = $item;
				}
			}
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options;
			var $input = $("<textarea></textarea>");
			if (o.text) {
				$input.val(o.text);
			}
			$el.append($input);
			this.$input = $input;
			self.enable(o.enable);
			self.visible(o.visible);
			self._addAttrDontSaveNDontFocus($el.find("*"));
		},
		enable: function(e) {
			var input = this.element.find("textarea");
			if (arguments[0] != undefined) {
				this.options.enable = e;
				if (e == true) {
					this.element.removeClass("dvc-disabled");
					input.removeAttr("disabled");
				}
				else {
					this.element.addClass("dvc-disabled");
					input.attr('disabled', 'disabled');
				}
			}
			else {
				return this.options.enable;
			}
		},
		text: function(value) {
			var $input = this.element.find('textarea');
			if (arguments.length) {
				$input.val(value);
				return this;
			}
			else {
				var value = $input.val();
				return value;
			}
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcTextfield", $.davinci.dvcBase, {
		options: {
			type: "text",
			text: "",
			placeholder: "",
			clearButton: true,
			eventNames: ["ev_click", "ev_keyup", "ev_focus", "ev_blur"],
			initSelector: ":jqmData(role='dvcTextfield')"
		},
		classes: {
			CLS_WIDGET: "dvc-textfield",
			CLS_TEXTFIELD_BTN_CLEAR: "dvc-textfield-btn-clear"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// if not, try to find closest theme container	
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_THEME);
			// 상위에 listitem가 있으면, 
			var $listitem = $el.closest(".dvc-listitem");
			if ($listitem && $listitem.length) {
				var $item = $el.closest(".dvc-listitem-item-indexable");
				if ($item && $item.length) {
					self.$listitem = $listitem;
					self.$item = $item;
				}
			}
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (o.type == "search") {
				$el.addClass("dvc-textfield-corner-all dvc-textfield-search");
				o.type = "text";
			}
			var $input = $("<input data-role='none' style='position:absolute; left:0; right:0' type='" + o.type + "'></input>");
			this.$input = $input;
			if (o.text) {
				$input.val(o.text);
			}
			if (o.placeholder) {
				$input.attr("placeholder", o.placeholder);
			}
			$el.append($input);
			$el.append($("<div class='" + cls.CLS_TEXTFIELD_BTN_CLEAR + "'></div>"));
			if (o.clearButton) {
				var $btnClear = $el.find('.' + cls.CLS_TEXTFIELD_BTN_CLEAR);
				this.$btnClear = $btnClear;
				if ($btnClear) {
					$btnClear.dvcButton();
					$btnClear.hide();
				}
			}
			self.enable(o.enable);
			self.visible(o.visible);
			self._addAttrDontSaveNDontFocus($el.find("*"));
		},
		focus: function() {
			var input = this.element.find("input");
			input.focus();
			return this;
		},
		text: function(value) {
			var $input = this.element.find('input');
			if (arguments.length) {
				$input.val(value);
				return this;
			}
			else {
				var value = $input.val();
				return value;
			}
		},
		enable: function(e) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var input = this.element.find("input");
			if (arguments[0] != undefined) {
				this.options.enable = e;
				if (e == true) {
					this.element.removeClass(cls.CLS_DISABLED);
					input.removeAttr("disabled");
				}
				else {
					this.element.addClass(cls.CLS_DISABLED);
					input.attr('disabled', 'disabled');
				}
			}
			else {
				return this.options.enable;
			}
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcAudio", $.davinci.dvcBase, {
		options: {
			loop: false,
			controls: false,
			autoplay: false,
			src: "",
			playing: false,
			eventNames: ["ev_ended"],
			initSelector: ":jqmData(role='dvcAudio')"
		},
		classes: {
			CLS_WIDGET: "dvc-audio"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$el.addClass(cls.CLS_WIDGET);
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			self._designDefault($el.jqmData("role").slice(3));
		},
		audio: function() {
			return this._audio;
		},
		play: function() {
			this.playing = true;
			this._audio.play();
		},
		isPlaying: function() {
			return this.playing;
		},
		pause: function() {
			this.playing = false;
			this._audio.pause();
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcVideo", $.davinci.dvcBase, {
		options: {
			loop: false,
			controls: true,
			autoplay: false,
			src: "",
			playing: false,
			poster: "",
			initSelector: ":jqmData(role='dvcVideo')"
		},
		classes: {
			CLS_WIDGET: "dvc-video",
			CLS_VIDEO_POSTER: "dvc-video-poster"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_THEME);
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var $video = $("<video style='display: none !important;'>").appendTo($el);
			$video[0].id = $el[0].id + "_video";
			var $poster;
			if (o.poster) {
				$poster = $("<div class='" + cls.CLS_VIDEO_POSTER + "' style='background-image:url(" + o.poster + ")'></div>");
			}
			else {
				$poster = $("<div class='" + cls.CLS_VIDEO_POSTER + "'></div>");
			}
			$el.append($poster);
			self.$poster = $poster;
			if (o.loop) {
				$video.attr("loop", "");
			}
			if (o.controls) {
				$video.attr("controls", "");
			}
			if (o.autoplay) {
				$video.attr("autoplay", "");
			}
			if (o.src) {
				$video.attr("src", o.src);
			}
			this.element.css({
				"position": "absolute",
				"left": "0",
				"top": "0",
				"width": "100%",
				"height": "100%",
				"background-color": "black"
			});
			var video = $video[0];
			self._video = video;
			self.$video = $video;
			self._addAttrDontSaveNDontFocus($el.find("*"));
		},
		play: function() {
			this.$poster.hide();
			var video = this.video();
			var width = this.element.width();
			var $video = this.element.children();
			if (width) {
				$video.attr("width", width);
			}
			var height = this.element.height();
			if (height) {
				$video.attr("height", height);
			}
			video.play();
			setTimeout(function() {
				video.play();
			}, 10);
			this.playing = true;
		},
		isPlaying: function() {
			return this.playing;
		},
		pause: function() {
			this.playing = false;
			this._audio.pause();
		},
		video: function() {
			return this._video;
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcContent", $.davinci.dvcBase, {
		options: {
			initSelector: ":jqmData(role='dvcContent')"
		},
		classes: {
			CLS_WIDGET: "dvc-content"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$el.addClass(cls.CLS_WIDGET);
		},
		_empty: function() {},
		_designRefresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype._designRefresh.call(this);
			// 하위로 내려가면서 changeTheme()를 호출한다.
			$el.find("div:jqmData(role^='dvc')").each(function() {
				var $this = $(this);
				var role = $this.jqmData("role");
				var instance = $this.data(role);
				if (instance) {
					instance._changeTheme();
				}
			});
		},
		refresh: function() {}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcHeader", $.davinci.dvcBase, {
		options: {
			eventNames: ["ev_click", "ev_change", "ev_keyup", "ev_swipeleft", "ev_swiperight", "ev_focus", "ev_blur"],
			initSelector: ":jqmData(role='dvcHeader')"
		},
		classes: {
			CLS_WIDGET: "dvc-header",
			CLS_HEADER_UITITLE: "ui-title"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// if not, try to find closest theme container	
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_HEADER_UITITLE + ' ' + cls.CLS_THEME);
			// content에 붙이는 계산이 보이기 전에 되어야 해서 미리 호출함.
			self.refresh();
		},
		_empty: function() {},
		_designRefresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype._designRefresh.call(this);
			// 하위로 내려가면서 changeTheme()를 호출한다.
			$el.find("div:jqmData(role^='dvc')").each(function() {
				var $this = $(this);
				var role = $this.jqmData("role");
				var instance = $this.data(role);
				if (instance) {
					instance._changeTheme();
				}
			});
		},
		_attachEvent: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$el.bind({
				'swipeleft': function(e, ui) {
					if (self.enable() && self._getAncestorEnable()) {
						$el.trigger("ev_swipeleft", [self]);
						e.stopPropagation();
					}
				},
				'swiperight': function(e, ui) {
					if (self.enable() && self._getAncestorEnable()) {
						$el.trigger("ev_swiperight", [self]);
						e.stopPropagation();
					}
				}
			});
		},
		refresh: function() {
			$.davinci.dvcBase.prototype.refresh.call(this);
			var $el = this.element;
			var $siblings = $el.siblings();
			var $content = $siblings.filter(":jqmData(role='dvcContent')");
			$content.css("top", $el.height() + "px");
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcFooter", $.davinci.dvcBase, {
		options: {
			eventNames: ["ev_click", "ev_change", "ev_keyup", "ev_swipeleft", "ev_swiperight", "ev_focus", "ev_blur"],
			initSelector: ":jqmData(role='dvcFooter')"
		},
		classes: {
			CLS_WIDGET: "dvc-footer"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// if not, try to find closest theme container	
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_THEME);
			// content에 붙이는 계산이 보이기 전에 되어야 해서 미리 호출함.
			self.refresh();
		},
		_empty: function() {},
		_designRefresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype._designRefresh.call(this);
			// 하위로 내려가면서 changeTheme()를 호출한다.
			$el.find("div:jqmData(role^='dvc')").each(function() {
				var $this = $(this);
				var role = $this.jqmData("role");
				var instance = $this.data(role);
				if (instance) {
					instance._changeTheme();
				}
			});
		},
		_attachEvent: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$el.bind({
				'swipeleft': function(e, ui) {
					if (self.enable() && self._getAncestorEnable()) {
						$el.trigger("ev_swipeleft", [self]);
						e.stopPropagation();
					}
				},
				'swiperight': function(e, ui) {
					if (self.enable() && self._getAncestorEnable()) {
						$el.trigger("ev_swiperight", [self]);
						e.stopPropagation();
					}
				}
			});
		},
		refresh: function() {
			$.davinci.dvcBase.prototype.refresh.call(this);
			var $el = this.element;
			var $siblings = $el.siblings();
			var $content = $siblings.filter(":jqmData(role='dvcContent')");
			$content.css("bottom", $el.height() + "px");
		}
	});
})(jQuery);
// jQuery Mobile의 experiment에 있는 mobile.scrollview의 코드를 사용했음.
(function($, window, document, undefined) {
	$.widget("davinci.dvcScrollview", $.davinci.dvcBase, {
		options: {
			fps: 60,
			// Frames per second in msecs.
			direction: null,
			// "x", "y", or null for both.
			scrollDuration: 2000,
			// Duration of the scrolling animation in msecs.
			overshootDuration: 250,
			// Duration of the overshoot animation in msecs.
			snapbackDuration: 500,
			// Duration of the snapback animation in msecs.
			moveThreshold: 10,
			// User must move this many pixels in any direction to trigger a scroll.
			moveIntervalThreshold: 300,
			// Time between mousemoves must not exceed this threshold.
			scrollMethod: "translate",
			// "translate", "position", "scroll"
			eventType: $.support.touch ? "touch" : "mouse",
			showScrollBars: true,
			pagingEnabled: false,
			directionLock: true,
			delayedClickSelector: ".dvc-treeview-node-background *, textarea, input, .dvc-listitem-item, .dvc-layoutview, .dvc-label, .dvc-button, .dvc-imagebutton, .dvc-switch, .dvc-radio, .dvc-checkbox, .dvc-slider, .dvc-video-poster, video",
			delayedClickEnabled: true,
			bounceOff: false,
			scrollBodyWidth: 0,
			nextLoadingBarHeight: 0,
			// listitem 상단에 표시되는 LoadingBar의 높이
			eventNames: ["ev_change", "ev_scrollstart", "ev_scrollupdate", "ev_scrollstop", "ev_dragstart", "ev_dragmove", "ev_dragstop"],
			initSelector: ":jqmData(role='dvcScrollview')"
		},
		classes: {
			CLS_SCROLLVIEW_VIEW: "ui-scrollview-view",
			CLS_SCROLLVIEW_CLIP: "ui-scrollview-clip",
			CLS_WIDGET: "dvc-scrollview"
		},
		/**
		 * scrollview의 $view 높이가 변경 되는 경우 각각의 widget에서 반드시 호출 해야 한다.
		 */
		optimizeInit: function() {
			if (!this.isOptimization) {
				return;
			}
			var i, j;
			this.scrollclipHeight = this._$clip[0].offsetHeight + this.options.nextLoadingBarHeight;
			this.scrollviewHeight = this._$view.height();
			this.$listItems = $('');
			this.parentsOffsetTops = [];
			var $listviews = this._$view.find(".dvc-listitem");
			var listviewsLen = $listviews.length;
			var parentsOffsetTopsIndex = 0;
			for (i = 0; i < listviewsLen; i++) {
				var $listview = $listviews.eq(i);
				var h = $listview.height();
				if (h) {
					var $items = $listview.find(".dvc-listitem-item");
					if ($items.length) {
						this.$listItems = this.$listItems.add($items);
						var offTop = this._getParentsOffsetTop($items[0]);
						for (j = 0; j < $items.length; j++, parentsOffsetTopsIndex++) {
							this.parentsOffsetTops.push(offTop);
						}
						parentsOffsetTopsIndex += $items.length;
					}
				}
			}
			this.listLen = this.$listItems.length;
			this.topIndex = 0;
			this.bottomIndex = 0;
			this._optimizeInitIndex(0, 0);
		},
		_getParentsOffsetTop: function(el) {
			if (!this.isOptimization) {
				return;
			}
			var ptop = 0;
			while (el) {
				ptop += el.offsetTop;
				el = el.offsetParent;
				if (el.className.match(/dvc-scrollview/)) {
					break;
				}
			}
			return ptop;
		},
		/**
		 * this.topIndex, bottomIndex값을 설정한다.
		 * @param posY	scroll position y
		 * @param start	값을 setting할 처음 listItems의 index
		 * @param dir	값 setting 할 방향 false:음수 값, true:양수 값
		 */
		_optimizeInitIndex: function(posY, start) {
			if (!this.isOptimization) {
				return;
			}
			var i, ret, isSetBottomIndex = false;
			var posY = this.getScrollPosition().y;
			var offsetTopFromScrollview = 0;
			for (i = start; i < this.listLen; i++) {
				var item = this.$listItems[i];
				offsetTopFromScrollview = this.parentsOffsetTops[i];
				ret = this._optimizeCheckRange(posY, item.offsetTop + offsetTopFromScrollview, item.offsetHeight);
				if (ret == -1) {
					this.topIndex = i;
					item.style.visibility = "hidden";
				}
				else if (ret == 1) {
					if (isSetBottomIndex == false) {
						this.bottomIndex = i;
						isSetBottomIndex = true;
					}
					item.style.visibility = "hidden";
				}
				else {
					item.style.visibility = "visible";
				}
			}
		},
		/**
		 * item이 scrollview의 보이는 영역에 있는지 채크 한다.
		 * @returns 
		 * 		-1 : item이 scrollview 위쪽에 있음
		 * 		 0 : item이 scrollview의 보이는 영역에 위치
		 * 		 1 : item이 scrollview 아래쪽에 있음
		 */
		_optimizeCheckRange: function(scrollPos, itemTop, itemHeight) {
			if (!this.isOptimization) {
				return;
			}
			if (scrollPos > itemTop + itemHeight) {
				return -1;
			} else if (scrollPos + this.scrollclipHeight < itemTop) {
				return 1;
			}
			return 0;
		},
		/**
		 * this.topIndex, bottomIndex값을 hidden으로 한다.
		 * @param posY	scroll position y
		 * @param start	값을 setting할 처음 listItems의 index
		 * @param dir	값 setting 할 방향 false:음수 값, true:양수 값
		 */
		_optimizeClearIndex: function() {
			if (!this.isOptimization) {
				return;
			}
			var i;
			var end = this.bottomIndex;
			for (i = this.topIndex; i <= end; i++) {
				this.$listItems[i].style.visibility = "hidden";
			}
		},
		/**
		 * this.topIndex, bottomIndex값을 설정한다.
		 * @param posY	scroll position y
		 * @param start	값을 setting할 처음 listItems의 index
		 * @param dir	값 setting 할 방향 false:음수 값, true:양수 값
		 */
		_optimizeSetIndex: function(posY, start, dir) {
			if (!this.isOptimization) {
				return;
			}
			var i, ret;
			var offsetTopFromScrollview = 0;
			if (dir) {
				for (i = start; i < this.listLen; i++) {
					var item = this.$listItems[i];
					offsetTopFromScrollview = this.parentsOffsetTops[i];
					ret = this._optimizeCheckRange(posY, item.offsetTop + offsetTopFromScrollview, item.offsetHeight);
					if (ret == -1) {
						this.topIndex = i;
						item.style.visibility = "hidden";
					}
					else if (ret == 1) {
						this.bottomIndex = i;
						item.style.visibility = "hidden";
						break;
					}
					else {
						item.style.visibility = "visible";
					}
				}
			}
			else {
				for (i = start; i >= 0; i--) {
					var item = this.$listItems[i];
					offsetTopFromScrollview = this.parentsOffsetTops[i];
					ret = this._optimizeCheckRange(posY, item.offsetTop + offsetTopFromScrollview, item.offsetHeight);
					if (ret == 1) {
						this.bottomIndex = i;
						item.style.visibility = "hidden";
					}
					else if (ret == -1) {
						this.topIndex = i;
						item.style.visibility = "hidden";
						break;
					}
					else {
						item.style.visibility = "visible";
					}
				}
			}
		},
		_optimizeChangeVisiblility: function(posY) {
			if (!this.isOptimization || !this.listLen) {
				return;
			}
			var tempTopIndex = this.topIndex;
			var i, item, ret;
			var offsetTopFromScrollview = 0;
			if (posY < 0 || posY > this.scrollviewHeight) {
				return;
			}
			i = tempTopIndex;
			item = this.$listItems[i];
			offsetTopFromScrollview = this.parentsOffsetTops[i];
			ret = this._optimizeCheckRange(posY, item.offsetTop + offsetTopFromScrollview, item.offsetHeight);
			if (ret == -1) {
				item.style.visibility = "hidden";
				do {
					i++;
					if (i < 0 || i >= this.listLen) {
						break;
					}
					item = this.$listItems[i];
					offsetTopFromScrollview = this.parentsOffsetTops[i];
					ret = this._optimizeCheckRange(posY, item.offsetTop + offsetTopFromScrollview, item.offsetHeight);
					if (ret == -1) {
						item.style.visibility = "hidden";
					} else if (ret == 1) {
						console.log("topIndex error -1");
					} else {
						tempTopIndex = i;
						item.style.visibility = "visible";
					}
				} while (ret == -1);
			} else if (ret == 1) {
				this._optimizeClearIndex();
				this._optimizeSetIndex(posY, i, false);
				return;
			} else {
				tempTopIndex = i
				item.style.visibility = "visible";
				do {
					i--;
					if (i < 0 || i >= this.listLen) {
						break;
					}
					item = this.$listItems[i];
					offsetTopFromScrollview = this.parentsOffsetTops[i];
					ret = this._optimizeCheckRange(posY, item.offsetTop + offsetTopFromScrollview, item.offsetHeight);
					if (ret == -1) {
						item.style.visibility = "hidden";
					} else if (ret == 1) {
						console.log("topIndex error 0");
					} else {
						tempTopIndex = i;
						item.style.visibility = "visible";
					}
				} while (ret == 0);
			}
			this.topIndex = tempTopIndex;
			i = this.bottomIndex;
			item = this.$listItems[i];
			offsetTopFromScrollview = this.parentsOffsetTops[i];
			ret = this._optimizeCheckRange(posY, item.offsetTop + offsetTopFromScrollview, item.offsetHeight);
			if (ret == 1) {
				item.style.visibility = "hidden";
				do {
					i--;
					if (i < 0 || i >= this.listLen) {
						break;
					}
					item = this.$listItems[i];
					offsetTopFromScrollview = this.parentsOffsetTops[i];
					ret = this._optimizeCheckRange(posY, item.offsetTop + offsetTopFromScrollview, item.offsetHeight);
					if (ret == 1) {
						item.style.visibility = "hidden";
					} else if (ret == -1) {
						console.log("bottomIndex error 1");
					} else {
						this.bottomIndex = i;
						item.style.visibility = "visible";
					}
				} while (ret == 1);
			} else if (ret == -1) {
				this._optimizeClearIndex();
				this._optimizeSetIndex(posY, i, true);
				return;
			} else {
				this.bottomIndex = i
				item.style.visibility = "visible";
				do {
					i++;
					if (i < 0 || i >= this.listLen) {
						break;
					}
					item = this.$listItems[i];
					offsetTopFromScrollview = this.parentsOffsetTops[i];
					ret = this._optimizeCheckRange(posY, item.offsetTop + offsetTopFromScrollview, item.offsetHeight);
					if (ret == 1) {
						item.style.visibility = "hidden";
					} else if (ret == -1) {
						console.log("bottomIndex error 0");
					} else {
						this.bottomIndex = i;
						item.style.visibility = "visible";
					}
				} while (ret == 0);
			}
		},
		_getClipHeight: function() {
			return this._$clip.height();
		},
		_getViewHeight: function() {
			return this._$view.height();
		},
		_getClipWidth: function() {
			return this._$clip.width();
		},
		_getViewWidth: function() {
			return this._$view.width();
		},
		_makePositioned: function($ele) {
			if ($ele.css("position") == "static") $ele.css("position", "relative");
		},
		delayedClickSelector: function(d) {
			if (arguments[0] != undefined) {
				this.options.delayedClickSelector = d;
			}
			else {
				return this.options.delayedClickSelector;
			}
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				classes = this.classes;
			// if not, try to find closest theme container	
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			classes.CLS_THEME = classes.CLS_WIDGET + "-" + o.theme;
			this._$clip = $el.addClass(classes.CLS_SCROLLVIEW_CLIP + ' ' + classes.CLS_WIDGET + ' ' + classes.CLS_THEME);
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				classes = this.classes;
			if ($el.children().length == 0) {
				self._designDefault($el.jqmData("role").slice(3));
			}
		},
		_initVars: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				classes = this.classes;
		},
		_initMomentumTracker: function() {
			var direction = this.options.direction;
			this._hTracker = (direction !== "y") ? new MomentumTracker(this.options) : null;
			this._vTracker = (direction !== "x") ? new MomentumTracker(this.options) : null;
			this._timerInterval = 1000 / this.options.fps;
			this._timerID = 0;
			var self = this;
			this._timerCB = function() {
				self._handleMomentumScroll();
			};
			this._setScrollPosition(0, -this.options.nextLoadingBarHeight);
		},
		_startMScroll: function(speedX, speedY) {
			this._stopMScroll();
			this._showScrollBars();
			var keepGoing = false;
			var duration = this.options.scrollDuration;
			this._$clip.trigger("ev_scrollstart", this);
			var ht = this._hTracker;
			if (ht && this._hTrackerShow) {
				var c = this._getClipWidth();
				var v = this._getViewWidth();
				ht.start(this._sx, speedX, duration, (v > c) ? -(v - c) : 0, 0);
				keepGoing = !ht.done();
			}
			var vt = this._vTracker;
			if (vt && this._vTrackerShow) {
				var c = this._getClipHeight();
				var v = this._getViewHeight();
				vt.start(this._sy, speedY, duration, (v > (c + this.options.nextLoadingBarHeight)) ? -(v - c) : -this.options.nextLoadingBarHeight, -this.options.nextLoadingBarHeight);
				keepGoing = keepGoing || !vt.done();
			}
			if (keepGoing) this._timerID = setTimeout(this._timerCB, this._timerInterval);
			else this._stopMScroll();
		},
		_setScrollPosition: function(x, y) {
			var htShow = this._hTrackerShow;
			var vtShow = this._vTrackerShow;
			if (!htShow) {
				x = 0;
			}
			if (!vtShow) {
				y = 0;
			}
			if (this.options.bounceOff) {
				var maxPos = this.getScrollMax();
				x = Math.min(x, 0);
				x = Math.max(x, -maxPos.x);
				y = Math.min(y, 0);
				y = Math.max(y, -maxPos.y);
			}
			this._sx = x;
			this._sy = y;
			var $v = this._$view;
			var $vsb = this._$vScrollBar;
			var $hsb = this._$hScrollBar;
			var sm = this.options.scrollMethod;
			var vheight = this._viewHeight;
			var vwidth = this._viewWidth;
			var yyy = -y / vheight * this.vsbtHeight;
			var xxx = -x / vwidth * this.hsbtWidth;
			switch (sm) {
			case "translate":
				//setElementTransform($v, x + "px", y + "px");
				$v[0].style['webkitTransform'] = 'translate3d(' + x + 'px,' + y + 'px' + ',0)';
				break;
			case "position":
				$v.css({
					left: x + "px",
					top: y + "px"
				});
				break;
			case "scroll":
				var c = this._$clip[0];
				c.scrollLeft = -x;
				c.scrollTop = -y;
				break;
			}
			if ($vsb && vtShow) {
				if (sm === "translate") {
					//				//setElementTransform($sbt, "0px", -y/$v.height() * $sbt.parent().height() + "px");
					this.$vsbt[0].style['webkitTransform'] = 'translate3d(0px,' + yyy + 'px' + ',0)';
				}
				else {
					this.$vsbt.css("top", -y / $v.height() * 100 + "%");
				}
			}
			if ($hsb && htShow) {
				if (sm === "translate") {
					//setElementTransform($sbt,  -x/$v.width() * $sbt.parent().width() + "px", "0px");
					this.$hsbt[0].style['webkitTransform'] = 'translate3d(' + xxx + 'px, 0, 0)';
				}
				else {
					this.$hsbt.css("left", -x / $v.width() * 100 + "%");
				}
			}
		},
		_stopMScroll: function(skip) {
			if (this._timerID) {
				this._$clip.trigger("ev_scrollstop", this);
				clearTimeout(this._timerID);
			}
			this._timerID = 0;
			if (this._vTracker && this._vTrackerShow) this._vTracker.reset();
			if (this._hTracker && this._hTrackerShow) this._hTracker.reset();
			if (!skip) {
				this._hideScrollBars();
			}
		},
		_getScrollHierarchy: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var svh = [];
			this._$clip.parents('.' + cls.CLS_SCROLLVIEW_CLIP).each(function() {
				var role = $(this).jqmData("role");
				var d = $(this).jqmData(role);
				if (d) svh.unshift(d);
			});
			return svh;
		},
		_getAncestorByDirection: function(dir) {
			var svh = this._getScrollHierarchy();
			var n = svh.length;
			while (0 < n--) {
				var sv = svh[n];
				var svdir = sv.options.direction;
				if (!svdir || svdir == dir) return sv;
			}
			return null;
		},
		_empty: function() {},
		_designRefresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype._designRefresh.call(this);
			// 하위로 내려가면서 changeTheme()를 호출한다.
			$el.find("div:jqmData(role^='dvc')").each(function() {
				var $this = $(this);
				var role = $this.jqmData("role");
				var instance = $this.data(role);
				if (instance) {
					instance._changeTheme();
				}
			});
		},
		_handleDragStart: function(e, ex, ey) {
			if (this.enable() == false) {
				return;
			}
			// Stop any scrolling of elements in our parent hierarcy.
			$.each(this._getScrollHierarchy(), function(i, sv) {
				sv._stopMScroll();
				sv._didDrag = false;
			});
			this._stopMScroll();
			var c = this._$clip;
			var v = this._$view;
			this._viewHeight = v.height();
			this._viewWidth = v.width();
			this.sendVMoustdown = false;
			var maxPos = this.getScrollMax();
			if (maxPos.x > 0) {
				this._hTrackerShow = true;
			}
			else {
				this._hTrackerShow = false;
			}
/*
		if(maxPos.y	> 0) {
			this._vTrackerShow = true;
		}
		else {
			this._vTrackerShow = false;
		}
		*/
			if (this.options.delayedClickEnabled) {
				this._$clickEle = $(e.target).closest(this.options.delayedClickSelector);
				if (this._$clickEle.length > 0) {
					if (this._$clickEle[0].nodeName != "INPUT" && this._$clickEle[0].nodeName != "TEXTAREA") {
						var self = this;
						var ev = new $.Event("vmousedown");
						ev.originalEvent = e.originalEvent;
						ev.pageX = ex;
						ev.pageY = ey;
						// slider나 switch 처럼 vmousemove를 받아야 하는 애들한테는 직접 넘겨줘야 한다.
						if (this._$clickEle.hasClass("dvc-switch") || this._$clickEle.hasClass("dvc-slider")) {
							this._$clickEle.trigger(ev);
						}
						else {
							// 50ms후에 vmousedown을 보낼 것을 예약한다.
							this.timerID = setTimeout(function(ev) {
								self._$clickEle.trigger(ev);
								self.timerID = 0;
								self.sendVMoustdown = true;
							}, 50, ev);
						}
					}
					else {
						// input이면, event를 전달하도록 한다.
						return;
					}
				}
			}
			this._lastX = ex;
			this._lastY = ey;
			this._doSnapBackX = false;
			this._doSnapBackY = false;
			this._speedX = 0;
			this._speedY = 0;
			this._directionLock = "";
			this._didDrag = false;
			if (this._hTracker && this._hTrackerShow) {
				var cw = parseInt(c.css("width"), 10);
				var vw = parseInt(v.css("width"), 10);
				this._maxX = cw - vw;
				if (this._maxX > 0) this._maxX = 0;
				if (this._$hScrollBar) {
					this.$hsbt.css("width", (cw >= vw ? "100%" : Math.floor(cw / vw * 100) + "%"));
					if (this.$hsbt.width() < 5) {
						this.$hsbt.width(5);
					}
					this.hsbtWidth = this.$hsbt.parent().width();
				}
			}
			if (this._vTracker && this._vTrackerShow) {
				var ch = parseInt(c.css("height"), 10);
				var vh = parseInt(v.css("height"), 10);
				this._maxY = ch - vh;
				if (this._maxY > 0) this._maxY = 0;
				if (this._$vScrollBar) {
					this.$vsbt.css("height", (ch >= vh ? "100%" : Math.floor(ch / vh * 100) + "%"));
					if (this.$vsbt.height() < 5) {
						this.$vsbt.height(5);
					}
					this.vsbtHeight = this.$vsbt.parent().height();
				}
			}
			var svdir = this.options.direction;
			this._pageDelta = 0;
			this._pageSize = 0;
			this._pagePos = 0;
			if (this.options.pagingEnabled && (svdir === "x" || svdir === "y")) {
				this._pageSize = svdir === "x" ? cw : ch;
				this._initPagePos = svdir === "x" ? this._sx : this._sy;
				this._pagePos = this._initPagePos - (this._initPagePos % this._pageSize);
			}
			this._lastMove = 0;
			this._enableTracking();
			// If we're using mouse events, we need to prevent the default
			// behavior to suppress accidental selection of text, etc. We
			// can't do this on touch devices because it will disable the
			// generation of "click" events.
			//
			// XXX: We should test if this has an effect on links! - kin
			if (this.options.eventType == "mouse" || this.options.delayedClickEnabled) e.preventDefault();
			e.stopPropagation();
		},
		_propagateDragMove: function(sv, e, ex, ey, dir) {
			this._hideScrollBars();
			this._disableTracking();
			sv._handleDragStart(e, ex, ey);
			sv._directionLock = dir;
			sv._didDrag = this._didDrag;
		},
		_handleDragMove: function(e, ex, ey) {
			if (this.enable() == false) {
				return;
			}
			this._lastMove = getCurrentTime();
			var v = this._$view;
			var dx = ex - this._lastX;
			var dy = ey - this._lastY;
			var svdir = this.options.direction;
			if (this._didDrag == false && this.options.delayedClickEnabled) {
				if (this._$clickEle.length > 0) {
					if (this._$clickEle.hasClass("dvc-switch") || this._$clickEle.hasClass("dvc-slider")) {
						var ev = new $.Event("vmousemove");
						ev.originalEvent = e.originalEvent;
						ev.pageX = ex;
						ev.pageY = ey;
						this._$clickEle.trigger(ev);
						return false;
					}
				}
			}
			if (!this._directionLock) {
				var x = Math.abs(dx);
				var y = Math.abs(dy);
				var mt = this.options.moveThreshold;
				if (x < mt && y < mt) {
					return false;
				}
				var dir = null;
				var r = 0;
				if (x < y && (x / y) < 0.5) {
					dir = "y";
				}
				else if (x > y && (y / x) < 0.5) {
					dir = "x";
				}
				if (svdir && dir && svdir != dir) {
					// This scrollview can't handle the direction the user
					// is attempting to scroll. Find an ancestor scrollview
					// that can handle the request.
					var sv = this._getAncestorByDirection(dir);
					if (sv) {
						this._propagateDragMove(sv, e, ex, ey, dir);
						return false;
					}
				}
				this._directionLock = svdir ? svdir : (dir ? dir : "none");
			}
			var newX = this._sx;
			var newY = this._sy;
			if (this._directionLock !== "y" && this._hTracker) {
				var x = this._sx;
				this._speedX = dx;
				newX = x + dx;
				// Simulate resistance.
				this._doSnapBackX = false;
				if (newX > 0 || newX < this._maxX) {
					if (this.options.directionLock && this._directionLock === "x") {
						var sv = this._getAncestorByDirection("x");
						if (sv) {
							this._setScrollPosition(newX > 0 ? 0 : this._maxX, newY);
							this._propagateDragMove(sv, e, ex, ey, dir);
							return false;
						}
					}
					newX = x + (dx / 2);
					this._doSnapBackX = true;
				}
			}
			if (this._directionLock !== "x" && this._vTracker && this._vTrackerShow) {
				var y = this._sy;
				this._speedY = dy;
				newY = y + dy;
				// Simulate resistance.
				this._doSnapBackY = false;
				if (newY > -this.options.nextLoadingBarHeight || newY < this._maxY) {
					if (this.options.directionLock && this._directionLock === "y") {
						var sv = this._getAncestorByDirection("y");
						if (sv) {
							this._setScrollPosition(newX, newY > 0 ? 0 : this._maxY);
							this._propagateDragMove(sv, e, ex, ey, dir);
							return false;
						}
					}
					newY = y + (dy / 2);
					this._doSnapBackY = true;
				}
			}
			if (this.options.pagingEnabled && (svdir === "x" || svdir === "y")) {
				if (this._doSnapBackX || this._doSnapBackY) this._pageDelta = 0;
				else {
					// _pagePos는 touchstart가 아닌, touchmove시에 방향을 확인한 후에 추출해야 한다.
					var cpos = svdir === "x" ? newX : newY;
					var delta = svdir === "x" ? dx : dy;
					if (delta < 0) { // 오른쪽 또는 아래
						this._pagePos = this._initPagePos - this._pageSize;
					}
					else {
						this._pagePos = this._initPagePos;
					}
					this._pagePos -= (this._initPagePos % this._pageSize);
					var opos = this._pagePos;
					this._pageDelta = (opos > cpos && delta < 0) ? this._pageSize : ((opos < cpos && delta > 0) ? -this._pageSize : 0);
				}
			}
			if (this._didDrag == false) {
				// vmousedown이 예약되어 있으면...
				if (this.timerID) {
					clearTimeout(this.timerID);
					this.timerID = 0;
				}
				var ev = new $.Event("vmousecancel");
				ev.originalEvent = e.originalEvent;
				ev.pageX = e.pageX;
				ev.pageY = e.pageY;
				this._$clickEle.trigger(ev);
				this._$clip.trigger("ev_dragstart", [this, this.getScrollPosition()]);
			}
			else {
				this._$clip.trigger("ev_dragmove", [this, this.getScrollPosition()]);
				this._optimizeChangeVisiblility(this.getScrollPosition().y);
			}
			if (this.options.nextLoadingBarHeight > 0 || this.oldNextLoadingBarHeight) {
				if (newY > 0) {
					if (!this._toggleRefresh) {
						this._toggleRefresh = true;
						this.oldNextLoadingBarHeight = this.options.nextLoadingBarHeight;
						this.options.nextLoadingBarHeight = 0;
						this._$clip.trigger("ev_change", [this, "refresh-pulldown"]);
					}
				}
				else {
					if (this._toggleRefresh) {
						this._toggleRefresh = false;
						this.options.nextLoadingBarHeight = this.oldNextLoadingBarHeight;
						this.oldNextLoadingBarHeight = 0;
						this._$clip.trigger("ev_change", [this, "refresh-pushup"]);
					}
				}
				var c = this._getClipHeight();
				var v = this._getViewHeight();
				if (v > (c + this.options.nextLoadingBarHeight)) {
					if (!this._toggleMore) {
						// 이때, 이전페이지가 보였는 지를 검사한다.
						if ((v - c) < -(newY)) {
							this._toggleMore = true;
							this._$clip.trigger("ev_change", [this, "more-pullup"]);
						}
					}
					else {
						// 이때, 이전페이지가 보였는 지를 검사한다.
						if ((v - c) > -(newY)) {
							this._toggleMore = false;
							this._$clip.trigger("ev_change", [this, "more-pushdown"]);
						}
					}
				}
			}
			this._didDrag = true;
			this._lastX = ex;
			this._lastY = ey;
			this._setScrollPosition(newX, newY);
			this._showScrollBars();
			// Call preventDefault() to prevent touch devices from
			// scrolling the main window.
			// e.preventDefault();
			return false;
		},
		_handleMomentumScroll: function() {
			var keepGoing = false;
			var v = this._$view;
			var x = 0,
				y = 0;
			var maxPos = this.getScrollMax();
			var outofClip = true;
			var vt = this._vTracker;
			if (vt && this._vTrackerShow) {
				vt.update();
				y = vt.getPosition();
				keepGoing = !vt.done();
				outofClip = (-y < 0 || -y > maxPos.y);
			}
			var ht = this._hTracker;
			if (ht) {
				ht.update();
				x = ht.getPosition();
				keepGoing = keepGoing || !ht.done();
				outofClip = outofClip && (-x < 0 || -x > maxPos.x);
			}
			if (this.options.bounceOff && outofClip) {
				keepGoing = false;
			}
			this._setScrollPosition(x, y);
			this._$clip.trigger("ev_scrollupdate", [this,
			{
				x: -x,
				y: -y
			}]);
			this._optimizeChangeVisiblility(this.getScrollPosition().y);
			if (keepGoing) this._timerID = setTimeout(this._timerCB, this._timerInterval);
			else {
				if (this._toggleRefresh) {
					this._toggleRefresh = false;
					this.options.nextLoadingBarHeight = this.oldNextLoadingBarHeight;
					this.oldNextLoadingBarHeight = 0;
					this._$clip.trigger("ev_change", [this, "refresh-release"]);
				}
				if (this._toggleMore) {
					this._toggleMore = false;
					this._$clip.trigger("ev_change", [this, "more-release"]);
				}
				this._stopMScroll();
			}
		},
		scrollTo: function(x, y, duration) {
			this._stopMScroll();
			var v = this._getViewHeight();
			var c = this._getClipHeight();
			if (!duration) {
				if ((v - c - this.options.nextLoadingBarHeight) > 0) {
					if (y < -(v - c - this.options.nextLoadingBarHeight)) {
						y = -(v - c - this.options.nextLoadingBarHeight);
					}
				}
				return this._setScrollPosition(-x, -(this.options.nextLoadingBarHeight - y));
			}
			if ((v - c - this.options.nextLoadingBarHeight) > 0) {
				if (y > (v - c - this.options.nextLoadingBarHeight)) {
					y = (v - c - this.options.nextLoadingBarHeight);
				}
			}
			y = y + this.options.nextLoadingBarHeight;
			x = -x;
			y = -y;
			var self = this;
			var start = getCurrentTime();
			var efunc = $.easing["easeOutQuad"];
			var sx = this._sx;
			var sy = this._sy;
			var dx = x - sx;
			var dy = y - sy;
			var tfunc = function() {
				var elapsed = getCurrentTime() - start;
				if (elapsed >= duration) {
					self._timerID = 0;
					self._setScrollPosition(x, y);
				}
				else {
					var ec = efunc(elapsed / duration, elapsed, 0, 1, duration);
					self._setScrollPosition(sx + (dx * ec), sy + (dy * ec));
					self._timerID = setTimeout(tfunc, self._timerInterval);
				}
			};
			this._timerID = setTimeout(tfunc, this._timerInterval);
			return this;
		},
		getScrollPosition: function() {
			return {
				x: parseInt(-this._sx, 10),
				y: parseInt(-(this._sy + this.options.nextLoadingBarHeight), 10)
			};
		},
		getScrollMax: function() {
			return {
				x: parseInt(this._getViewWidth() - this._getClipWidth(), 10),
				y: parseInt(this._getViewHeight() - this._getClipHeight(), 10)
			};
		},
		setScrollBodyWidth: function(scrollBodyWidth) {
			this._$view.css("min-width", scrollBodyWidth);
			return this;
		},
		refresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype.refresh.call(this);
			self.optimizeInit();
			return this;
		},
		_handleDragStop: function(e) {
			if (this.enable() == false) {
				return;
			}
			var l = this._lastMove;
			var t = getCurrentTime();
			var doScroll = l && (t - l) <= this.options.moveIntervalThreshold;
			// scrollview가 멈춰있어야 할 곳을 넘어가 있으면... 강제로 this._doSnapBackY = true로 하여 위나 아래로 붙도록 한다.
			var v = this._getViewHeight();
			var c = this._getClipHeight();
			var posY = this.getScrollPosition().y;
			if ((v - c - this.options.nextLoadingBarHeight) > 0) {
				if (posY < 0 || posY > (v - c - this.options.nextLoadingBarHeight)) {
					this._doSnapBackY = true;
				}
			}
			else {
				if (posY != 0) {
					this._doSnapBackY = true;
				}
			}
			var sx = (this._hTracker && this._hTrackerShow && this._speedX && doScroll) ? this._speedX : (this._doSnapBackX ? 1 : 0);
			var sy = (this._vTracker && this._vTrackerShow && this._speedY && doScroll) ? this._speedY : (this._doSnapBackY ? 1 : 0);
			var svdir = this.options.direction;
			if (this.options.pagingEnabled && (svdir === "x" || svdir === "y") && !this._doSnapBackX && !this._doSnapBackY) {
				var x = this._sx;
				var y = this._sy;
				if (svdir === "x") x = -this._pagePos + this._pageDelta;
				else y = -this._pagePos + this._pageDelta;
				this.scrollTo(x, y, this.options.snapbackDuration);
			}
			else if (sx || sy) this._startMScroll(sx, sy);
			else this._hideScrollBars();
			this._disableTracking();
			if (!this._didDrag && this.options.delayedClickEnabled && this._$clickEle.length) {
				if (this.timerID) {
					clearTimeout(this.timerID);
					this.timerID = 0;
				}
				var ev = new $.Event("vmouseup");
				ev.originalEvent = e.originalEvent;
				ev.pageX = e.pageX;
				ev.pageY = e.pageY;
				if (this._$clickEle.hasClass("dvc-switch")) {
					$(document).trigger(ev);
				}
				else {
					this._$clickEle.trigger(ev);
				}
				if (this.options.eventType == "touch") {
					this._$clickEle.trigger("vclick");
				}
			}
			this._$clip.trigger("ev_dragstop", [this, this.getScrollPosition()]);
			return false;
		},
		_enableTracking: function() {
			$(document).bind(this._dragMoveEvt, this._dragMoveCB);
			$(document).bind(this._dragStopEvt, this._dragStopCB);
		},
		_disableTracking: function() {
			$(document).unbind(this._dragMoveEvt, this._dragMoveCB);
			$(document).unbind(this._dragStopEvt, this._dragStopCB);
		},
		_showScrollBars: function() {
			var vclass = "ui-scrollbar-visible";
			if (this._$vScrollBar && this._vTrackerShow) this._$vScrollBar.addClass(vclass);
			if (this._$hScrollBar && this._hTrackerShow) this._$hScrollBar.addClass(vclass);
		},
		_hideScrollBars: function() {
			var vclass = "ui-scrollbar-visible";
			if (this._$vScrollBar && this._vTrackerShow) this._$vScrollBar.removeClass(vclass);
			if (this._$hScrollBar && this._hTrackerShow) this._$hScrollBar.removeClass(vclass);
		}
	});

	function setElementTransform($ele, x, y) {
		var v = "translate3d(" + x + "," + y + ", 0px)";
		$ele.css({
			"-moz-transform": v,
			"-webkit-transform": v,
			"transform": v
		});
	}

	function MomentumTracker(options) {
		this.options = $.extend({}, options);
		this.easing = "easeOutQuad";
		this.reset();
	}
	var tstates = {
		scrolling: 0,
		overshot: 1,
		snapback: 2,
		done: 3
	};

	function getCurrentTime() {
		return (new Date()).getTime();
	}
	$.extend(MomentumTracker.prototype, {
		start: function(pos, speed, duration, minPos, maxPos) {
			this.state = (speed != 0) ? ((pos < minPos || pos > maxPos) ? tstates.snapback : tstates.scrolling) : tstates.done;
			this.pos = pos;
			this.speed = speed;
			this.duration = (this.state == tstates.snapback) ? this.options.snapbackDuration : duration;
			this.minPos = minPos;
			this.maxPos = maxPos;
			this.fromPos = (this.state == tstates.snapback) ? this.pos : 0;
			this.toPos = (this.state == tstates.snapback) ? ((this.pos < this.minPos) ? this.minPos : this.maxPos) : 0;
			this.startTime = getCurrentTime();
		},
		reset: function() {
			this.state = tstates.done;
			this.pos = 0;
			this.speed = 0;
			this.minPos = 0;
			this.maxPos = 0;
			this.duration = 0;
		},
		update: function() {
			var state = this.state;
			if (state == tstates.done) return this.pos;
			var duration = this.duration;
			var elapsed = getCurrentTime() - this.startTime;
			elapsed = elapsed > duration ? duration : elapsed;
			if (state == tstates.scrolling || state == tstates.overshot) {
				var dx = this.speed * (1 - $.easing[this.easing](elapsed / duration, elapsed, 0, 1, duration));
				var x = this.pos + dx;
				var didOverShoot = (state == tstates.scrolling) && (x < this.minPos || x > this.maxPos);
				if (didOverShoot) x = (x < this.minPos) ? this.minPos : this.maxPos;
				this.pos = x;
				if (state == tstates.overshot) {
					if (elapsed >= duration) {
						this.state = tstates.snapback;
						this.fromPos = this.pos;
						this.toPos = (x < this.minPos) ? this.minPos : this.maxPos;
						this.duration = this.options.snapbackDuration;
						this.startTime = getCurrentTime();
						elapsed = 0;
					}
				}
				else if (state == tstates.scrolling) {
					if (didOverShoot) {
						this.state = tstates.overshot;
						this.speed = dx / 2;
						this.duration = this.options.overshootDuration;
						this.startTime = getCurrentTime();
					}
					else if (elapsed >= duration) this.state = tstates.done;
				}
			}
			else if (state == tstates.snapback) {
				if (elapsed >= duration) {
					this.pos = this.toPos;
					this.state = tstates.done;
				}
				else this.pos = this.fromPos + ((this.toPos - this.fromPos) * $.easing[this.easing](elapsed / duration, elapsed, 0, 1, duration));
			}
			return this.pos;
		},
		done: function() {
			return this.state == tstates.done;
		},
		getPosition: function() {
			return this.pos;
		}
	});
})(jQuery, window, document); // End Component
(function($, undefined) {
	$.widget("davinci.dvcPicker", $.davinci.dvcScrollview, {
		options: {
			showScrollBars: false,
			direction: "y",
			type: "none",
			// "none", "left", "right", "both"
			initSelector: ":jqmData(role='dvcPicker')"
		},
		classes: {
			CLS_WIDGET: "dvc-picker",
			CLS_PICKER_FRAME: "dvc-picker-frame",
			CLS_PICKER_FRAME_BASE: "dvc-picker-frame-base",
			CLS_PICKER_SPLIT: "dvc-picker-split",
			CLS_PICKER_BORDER_BOTH: "dvc-picker-border-both",
			CLS_PICKER_BORDER_LEFT: "dvc-picker-border-left",
			CLS_PICKER_BORDER_RIGHT: "dvc-picker-border-right",
			CLS_PICKER_BAR: "dvc-picker-bar",
			CLS_PICKER_BAR_BODY: "dvc-picker-bar-body"
		},
		_getBorderHeight: function() {
			var $pickerFrameBase = this.$pickerFrameBase;
			var borderTopWidth = parseInt($pickerFrameBase.css("border-top-width"), 10);
			var borderBottomWidth = parseInt($pickerFrameBase.css("border-bottom-width"), 10);
			return borderTopWidth + borderBottomWidth;
		},
		_getClipHeight: function() {
			return this._$clip.height() - this._getBorderHeight();
		},
		_getViewHeight: function() {
			return this._$view.outerHeight(true);
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcScrollview.prototype._initWidget.call(this);
			// if not, try to find closest theme container	
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_THEME);
		},
		_initVars: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcScrollview.prototype._initVars.call(this);
			this._index = -1;
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var $pickerFrame = $("<div class='" + cls.CLS_PICKER_FRAME + "'></div>");
			var $pickerFrameBase = $("<div class='" + cls.CLS_PICKER_FRAME_BASE + "'><ul class='" + cls.CLS_SCROLLVIEW_VIEW + "'></ul></div>");
			var $pickerSplit = $("<div class='" + cls.CLS_PICKER_SPLIT + "'></div>");
			switch (o.type) {
			case "left":
				$pickerFrameBase.addClass(cls.CLS_PICKER_BORDER_LEFT);
				break;
			case "both":
				$pickerFrameBase.addClass(cls.CLS_PICKER_BORDER_BOTH);
				break;
			case "right":
				$pickerFrameBase.addClass(cls.CLS_PICKER_BORDER_RIGHT);
				break;
			}
			self.$pickerFrameBase = $pickerFrameBase;
			$pickerFrame.append($pickerFrameBase);
			$pickerFrame.append($pickerSplit);
			var $pickerBarBody = $("<div class='" + cls.CLS_PICKER_BAR_BODY + "'><div class='" + cls.CLS_PICKER_BAR + "'></div></div>");
			$el.append($pickerFrame);
			$el.append($pickerBarBody);
			this._$view = this._$clip.find('.' + cls.CLS_SCROLLVIEW_VIEW);
			self._addAttrDontSaveNDontFocus($el.find("*"));
		},
		_empty: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				classes = this.classes;
			$el.empty();
		},
		refresh: function() {
			$.davinci.dvcScrollview.prototype.refresh.call(this);
			// <ul>에 대해 padding을 조정한다.
			var $ul = this.$pickerFrameBase.find("ul");
			var padding = (this.element.height() - this.itemHeight - this._getBorderHeight()) / 2;
			$ul.css({
				"padding-top": padding + "px",
				"padding-bottom": padding + "px"
			});
			var index = this.getIndex();
			if (index >= 0) {
				this.setIndex(index);
			}
		},
		_handleMomentumScroll: function() {
			var keepGoing = false;
			var v = this._$view;
			var y = 0;
			var vt = this._vTracker;
			if (vt) {
				vt.update();
				y = vt.getPosition();
				keepGoing = !vt.done();
			}
			this._setScrollPosition(0, y);
			this._$clip.trigger("ev_scrollupdate", [this,
			{
				x: 0,
				y: -y
			}]);
			if (keepGoing) this._timerID = setTimeout(this._timerCB, this._timerInterval);
			else {
				// 여기가 drag시 마지막 멈추는 시점임.
				// 36px은 한 라인의 height이고, 이 값을 기준으로 라인에 맞게 pixel을 보정한다.
				this._pixelCorrection(y);
			}
		},
		items: function(items) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// 보여지기 전에 items가 호출되면, height계산이 잘못되는 문제가 존재함.
			// 이 때문에 차후에는 
			// 1. 보여진 후에 초기화 할 것 정리
			// 2. 보여진 후에 초기화 후 widgetshow(가칭) event trigger 추가
			// 3. method 호출시 보여진 후에 동작해야 할 것은 Console로 경고처리하고 event 받은 후 method 호출하도록 가이드하도록 수정해야함.
			if (arguments[0] != undefined) {
				var $ul = this.element.find("ul");
				if (items.constructor == String) {
					// items가 String이면, 
					$(items).appendTo($ul);
					this._items = [];
					$ul.children().each(function() {
						self._items.push(this.innerHTML);
					});
				}
				else if (items.constructor == Array) {
					// items가 String array면,
					var li = [];
					this._items = items;
					for (var i = 0; i < items.length; i++) {
						li.push("<li>" + items[i] + "</li>");
					}
					$ul.append(li.join(""));
				}
				else {
					console.log("error");
					return this;
				}
				if (!this.itemHeight) {
					var $child = $ul.children().eq(0);
					this.itemHeight = $child.height();
				}
				this.refresh();
				return this;
			}
			else {
				return this._items;
			}
		},
		selectedItem: function() {
			return this._items[this._index];
		},
		clear: function() {
			var $ul = this.element.find("ul");
			$ul.children().remove();
			this.scrollTo(0, 0);
			this.itemHeight = 0;
			this._items = [];
			return this;
		},
		getCount: function() {
			if (!this._items) return -1;
			return this._items.length;
		},
		_handleDragStop: function(e) {
			var l = this._lastMove;
			//var t = getCurrentTime();
			var t = (new Date()).getTime();
			var doScroll = l && (t - l) <= this.options.moveIntervalThreshold;
			// scrollview가 멈춰있어야 할 곳을 넘어가 있으면... 강제로 this._doSnapBackY = true로 하여 위나 아래로 붙도록 한다.
			var v = this._getViewHeight();
			var c = this._getClipHeight();
			var posY = this.getScrollPosition().y;
			if ((v - c - this.options.nextLoadingBarHeight) > 0) {
				if (posY < 0 || posY > (v - c - this.options.nextLoadingBarHeight)) {
					this._doSnapBackY = true;
				}
			}
			else {
				if (posY != 0) {
					this._doSnapBackY = true;
				}
			}
			var sx = (this._hTracker && this._speedX && doScroll) ? this._speedX : (this._doSnapBackX ? 1 : 0);
			var sy = (this._vTracker && this._speedY && doScroll) ? this._speedY : (this._doSnapBackY ? 1 : 0);
			var svdir = this.options.direction;
			if (this.options.pagingEnabled && (svdir === "x" || svdir === "y") && !this._doSnapBackX && !this._doSnapBackY) {
				var x = this._sx;
				var y = this._sy;
				if (svdir === "x") x = -this._pagePos + this._pageDelta;
				else y = -this._pagePos + this._pageDelta;
				this.scrollTo(x, y, this.options.snapbackDuration);
			}
			else if (sx || sy) this._startMScroll(sx, sy);
			else {
				var y = this._sy;
				this._pixelCorrection(y, e);
			}
			this._disableTracking();
			if (!this._didDrag && this.options.delayedClickEnabled && this._$clickEle.length) {
				if (this.timerID) {
					clearTimeout(this.timerID);
					this.timerID = 0;
				}
				if (this.sendVMoustdown == true) {
					var ev = new $.Event("vmouseup");
					ev.originalEvent = e.originalEvent;
					ev.pageX = e.pageX;
					ev.pageY = e.pageY;
					this._$clickEle.trigger(ev);
					if (this.options.eventType == "touch") {
						this._$clickEle.trigger("vclick");
					}
				}
			}
			this._$clip.trigger("ev_dragstop", [this, this.getScrollPosition()]);
			return false;
		},
		// 한line의 높이에 맞게 pixel을 보정한다.
		_pixelCorrection: function(y, e) {
			var o = this.options,
				$el = this.element;
			if (!this.itemHeight) return;
			var itemHeight = this.itemHeight;
			y = -y;
			var index = parseInt(y / itemHeight);
			var mod = y % itemHeight;
			if (mod > (itemHeight / 2)) {
				index++;
			}
			y = (index * itemHeight);
			if (this.getScrollPosition().y == y) {
				// drag하지 않고 클릭만 했을 경우
				if (e != undefined) {
					var el = $el[0],
						offsetTop = 0;
					while (el.offsetParent.nodeName != "BODY") {
						offsetTop += el.offsetTop;
						el = el.offsetParent;
					}
					// popup이면...
					if (/dvc-popup/.test(el.className)) {
						offsetTop += el.offsetTop;
					}
					var borderTopWidth = parseInt(this.$pickerFrameBase.css("border-top-width"), 10);;
					var offsetY = (this._lastY - offsetTop) - borderTopWidth;
					var add = Math.floor(offsetY / itemHeight) - 1;
					index += add;
					var count = this.getCount();
					if (index < 0) {
						index = 0;
					}
					else if (index > count - 1) {
						index = count - 1;
					}
					y = (index * itemHeight);
					this.scrollTo(0, y, o.snapbackDuration);
					$el.trigger("ev_change", [this, index]);
				}
				else {
					this.scrollTo(0, y, o.overshootDuration);
					$el.trigger("ev_change", [this, index]);
				}
			}
			else {
				this.scrollTo(0, y, o.overshootDuration);
				$el.trigger("ev_change", [this, index]);
			}
			this._index = index;
		},
		getIndex: function() {
			return this._index;
		},
		setIndex: function(index) {
			if (!this.itemHeight) return;
			var itemHeight = this.itemHeight;
			var y = -(index * itemHeight);
			this.scrollTo(0, y, 0);
			index = Math.max(index, 0);
			index = Math.min(index, this._items.length);
			this._index = index;
			return this;
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcCarousel", $.davinci.dvcScrollview, {
		options: {
			showScrollBars: false,
			pagingEnabled: true,
			infinite: false,
			direction: "x",
			indicatorVisible: false,
			indicatorSize: 40,
			pageGap: 0,
			initSelector: ":jqmData(role='dvcCarousel')"
		},
		classes: {
			CLS_WIDGET: "dvc-carousel",
			CLS_CAROUSEL_PAGE: "dvc-carousel-page",
			CLS_CAROUSEL_DYNAMIC_PAGE: "dvc-carousel-dynamic-page"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$el.addClass(cls.CLS_WIDGET);
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			self._designDefault($el.jqmData("role").slice(3));
			// Indicator를 append하고, 위젯 생성을 한다.
			var $indicator = $("<div></div>");
			$indicator.attr('waper_focus', 'false');
			$indicator.attr('waper_dontsave', 'true');
			$el.append($indicator);
			$indicator.dvcCarouselIndicator({
				"direction": o.direction,
				"size": o.indicatorSize
			});
			self.indicator = $indicator.data("dvcCarouselIndicator");
			self.indicator.setCount(5);
			if (o.indicatorVisible) {
				self.indicator.visible(true);
			}
			else {
				self.indicator.visible(false);
			}
			self._addAttrDontSaveNDontFocus($indicator.find("*"));
		},
		_initVars: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
		},
		_empty: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				classes = this.classes;
			$el.empty();
		},
		add: function(html, dynamicPage) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			this.totalPages++;
			var $carouselPage = $("<div class='" + cls.CLS_CAROUSEL_PAGE + "'>");
			$carouselPage.attr("page-index", this.totalPages);
			// html이 jQuery Object이면 바로 append, string이면 $("")로 변환
			if (typeof html == "string") {
				$(html).appendTo($carouselPage);
			}
			else if (html instanceof $) {
				if (dynamicPage) {
					html.addClass(cls.CLS_CAROUSEL_DYNAMIC_PAGE);
				}
				$carouselPage.append(html);
			}
			else {
				console.log("addPage Error");
				return;
			}
			this._$view.append($carouselPage);
			return this;
		},
		getCount: function() {
			return this.totalPages;
		},
		getIndex: function() {
			return this.nowPage;
		},
		// 이벤트를 보낸 page면 보내지 않고, skipEvent일 경우에도 보내지 않는다.
		_triggerEvent: function($pageContainer, pageNumber, skipEvent) {
			if (this.sentPage == pageNumber) {
				return;
			}
			var sentPage = this.sentPage;
			this.sentPage = pageNumber;
			this.indicator.setIndex(this.getIndex());
			if (!skipEvent) {
				var slideDirection = "";
				var totalPages = this.totalPages;
				// sentPage와 pageNumber의 관계를 알면 <-인지 ->인지 알수 있다.
				if (this.options.infinite) {
					if (sentPage == totalPages && pageNumber == 1) {
						slideDirection = "next";
					}
					else if (sentPage == 1 && pageNumber == totalPages) {
						slideDirection = "prev";
					}
					else if (sentPage > pageNumber) {
						slideDirection = "prev";
					}
					else {
						slideDirection = "next";
					}
				}
				else {
					if (sentPage > pageNumber) {
						slideDirection = "prev";
					}
					else {
						slideDirection = "next";
					}
				}
				this.element.trigger("ev_change", [this, $pageContainer, pageNumber, slideDirection]);
			}
		},
		next: function(skipEvent) {
			var duration = this.options.snapbackDuration;
			var pageNumber = this.nowPage + 1;
			var totalPages = this.totalPages;
			if (this.options.infinite) {
				if (totalPages < pageNumber) {
					pageNumber = 1;
				}
			}
			else {
				if (totalPages < pageNumber) {
					return;
				}
			}
			this.setIndex(pageNumber, duration, skipEvent);
		},
		prev: function(skipEvent) {
			var duration = this.options.snapbackDuration;
			var pageNumber = this.nowPage - 1;
			var totalPages = this.totalPages;
			if (this.options.infinite) {
				if (1 > pageNumber) {
					pageNumber = totalPages;
				}
			}
			else {
				if (1 > pageNumber) {
					return;
				}
			}
			this.setIndex(pageNumber, duration, skipEvent);
		},
		refresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype.refresh.call(this);
			return this;
		},
		setIndex: function(pageNumber, duration, skipEvent) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var pageElem = self._$view.children('.' + cls.CLS_CAROUSEL_PAGE);
			var $pageContainer;
			var matchedPageIndex;
			// pageNumber에 해당하느 page Element를 찾는다.
			pageElem.each(function(index) {
				var $ele = $(this);
				if (parseInt($ele.attr("page-index")) == pageNumber) {
					$pageContainer = $(this);
					matchedPageIndex = index;
					return false;
				}
			});
			if (!$pageContainer) {
				console.log("pageContainer is not found.");
			}
			if (o.infinite == false) {
				self.nowPage = pageNumber;
				this._setCurPage(pageNumber, duration);
				this._triggerEvent($pageContainer, pageNumber, skipEvent);
			}
			else {
				var totalPages = this.totalPages;
				var centerPage = Math.ceil(totalPages / 2);
				self.nowPage = pageNumber;
				pageNumber = matchedPageIndex + 1;
				this._setCurPage(pageNumber, duration);
				if (duration) {
					this.element.unbind(".carousel");
					this.element.bind("ysScrollTo.carousel", function(e, pos) {
						if (o.infinite && totalPages >= 3) {
							if (self._infiniteAdjust(pageNumber, totalPages)) {
								self._triggerEvent($pageContainer, self.nowPage, skipEvent);
							}
						}
						$(this).unbind(".carousel");
					});
				}
				else {
					if (o.infinite && totalPages >= 3) {
						if (self._infiniteAdjust(pageNumber, totalPages)) {
							self._triggerEvent($pageContainer, self.nowPage, skipEvent);
						}
					}
				}
			}
			return this;
		},
		_setCurPage: function(page, duration) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (o.direction == "y") {
				var pos = $el.height() * (page - 1);
				pos = (duration) ? pos : -pos;
				this.scrollTo(0, pos, duration);
			}
			else {
				var pos = $el.width() * (page - 1);
				pos = (duration) ? pos : -pos;
				this.scrollTo(pos, 0, duration);
			}
			return this;
		},
		clear: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			self._$view.children().find(":jqmData(role='page')").not('.' + cls.CLS_CAROUSEL_DYNAMIC_PAGE).appendTo($("body"));
			self._$view.children().remove();
			this.totalPages = 0;
			this.nowPage = -1;
			this.scrollTo(0, 0);
			self.refresh();
			return this;
		},
		_changePageElement: function(pageNumber, oldPage) {
			var ahead, behind, handler = this._$view;
			for (var i = 1; i <= Math.abs(oldPage - pageNumber); i++) {
				ahead = handler.children(':first');
				behind = handler.children(':last');
				if (oldPage - pageNumber > 0) {
					ahead.before(behind);
				} else if (oldPage - pageNumber < 0) {
					behind.after(ahead);
				}
			}
		},
		_infiniteAdjust: function(pageNumber, totalPages) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var centerPage = Math.ceil(totalPages / 2);
			if (pageNumber != centerPage) {
				if (o.direction == "y") {
					var pos = $el.height() * (centerPage - 1);
					this._setScrollPosition(0, -pos);
				}
				else {
					var pos = $el.width() * (centerPage - 1);
					this._setScrollPosition(-pos, 0);
				}
				self._changePageElement(pageNumber, centerPage);
				return true;
			}
			return false;
		},
		_handleDragStop: function(e) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			this.element.unbind(".carousel");
			this.element.bind("ysScrollTo.carousel", function(e, pos) {
				self._slideCallback(pos);
				$(this).unbind(".carousel");
			});
			$.davinci.dvcScrollview.prototype._handleDragStop.call(this, e);
		},
		_handleMomentumScroll: function() {
			var keepGoing = false;
			var v = this._$view;
			var x = 0,
				y = 0;
			var vt = this._vTracker;
			if (vt) {
				vt.update();
				y = vt.getPosition();
				keepGoing = !vt.done();
			}
			var ht = this._hTracker;
			if (ht) {
				ht.update();
				x = ht.getPosition();
				keepGoing = keepGoing || !ht.done();
			}
			this._setScrollPosition(x, y);
			this._$clip.trigger("ev_scrollupdate", [this,
			{
				x: -x,
				y: -y
			}]);
			if (keepGoing) {
				this._timerID = setTimeout(this._timerCB, this._timerInterval);
			}
			else {
				this.element.triggerHandler("ysScrollTo", {
					"x": x,
					"y": y
				});
				this._stopMScroll();
			}
		},
		scrollTo: function(x, y, duration) {
			function getCurrentTime() {
				return (new Date()).getTime();
			}
			this._stopMScroll();
			var v = this._getViewHeight();
			var c = this._getClipHeight();
			if (!duration) {
				if ((v - c) > 0) {
					if (y < -(v - c)) {
						y = -(v - c);
					}
				}
				this._setScrollPosition(x, y);
				this.element.triggerHandler("ysScrollTo", {
					"x": x,
					"y": y
				});
				return;
			}
			if ((v - c) > 0) {
				if (y > (v - c)) {
					y = (v - c);
				}
			}
			x = -x;
			y = -y;
			var self = this;
			var start = getCurrentTime();
			var efunc = $.easing["easeOutQuad"];
			var sx = this._sx;
			var sy = this._sy;
			var dx = x - sx;
			var dy = y - sy;
			var tfunc = function() {
				var elapsed = getCurrentTime() - start;
				if (elapsed >= duration) {
					self._timerID = 0;
					self._setScrollPosition(x, y);
					self.element.triggerHandler("ysScrollTo", {
						"x": x,
						"y": y
					});
				}
				else {
					var ec = efunc(elapsed / duration, elapsed, 0, 1, duration);
					self._setScrollPosition(sx + (dx * ec), sy + (dy * ec));
					self._timerID = setTimeout(tfunc, self._timerInterval);
				}
			};
			this._timerID = setTimeout(tfunc, this._timerInterval);
		},
		_slideCallback: function(pos) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// nowPage를 계산해서 알아낸다.
			// 전체 width에서 현재 transition을 알아내고,
			var pageWidth = $el.width();
			var pageHeight = $el.height();
			if (o.direction == "y") {
				var nowPage = -parseInt(pos.y / pageHeight) + 1;
			}
			else {
				var nowPage = -parseInt(pos.x / pageWidth) + 1;
			}
			var $pageContainer;
			var page = nowPage;
			var totalPages = this.totalPages;
			$pageContainer = self._$view.children('.' + cls.CLS_CAROUSEL_PAGE).eq(page - 1);
			if (o.infinite && totalPages >= 3) {
				self._infiniteAdjust(page, totalPages);
				nowPage = parseInt($pageContainer.attr("page-index"));
			}
			this.nowPage = nowPage;
			this._triggerEvent($pageContainer, nowPage);
		}
	});
	$.widget("davinci.dvcCarouselIndicator", $.davinci.dvcBase, {
		options: {
			gap: 10,
			direction: "x",
			size: 40
		},
		classes: {
			CLS_WIDGET: "dvc-carousel-indicator",
			CLS_CAROUSEL_INDICATOR_ON: "dvc-carousel-indicator-on",
			CLS_CAROUSEL_INDICATOR_ITEM: "dvc-carousel-indicator-item",
			CLS_CAROUSEL_INDICATOR_X: "dvc-carousel-indicator-x",
			CLS_CAROUSEL_INDICATOR_Y: "dvc-carousel-indicator-y"
		},
		_create: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_THEME);
			this.totalPage = 0;
			this.nowPage = 1;
			this.refresh();
		},
		setCount: function(p) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (p < 0) return;
			this.totalPage = p;
			this.refresh();
			return this;
		},
		setIndex: function(p) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (this.totalpage <= 0) return;
			this.nowPage = p;
			$el.find('.' + cls.CLS_CAROUSEL_INDICATOR_ON).removeClass(cls.CLS_CAROUSEL_INDICATOR_ON);
			$el.find('.' + cls.CLS_CAROUSEL_INDICATOR_ITEM).eq(p - 1).addClass(cls.CLS_CAROUSEL_INDICATOR_ON);
			return this;
		},
		clear: function() {
			this.setIndex(1);
			this.setCount(0);
			return this;
		},
		refresh: function() {
			$.davinci.dvcBase.prototype.refresh.call(this);
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$el.find('.' + cls.CLS_CAROUSEL_INDICATOR_ITEM).remove();
			if (this.totalPage <= 0) return;
			if (o.direction == "x") {
				$el.addClass(cls.CLS_CAROUSEL_INDICATOR_X).removeClass(cls.CLS_CAROUSEL_INDICATOR_Y);
				$el.height(o.size);
			}
			else {
				$el.addClass(cls.CLS_CAROUSEL_INDICATOR_Y).removeClass(cls.CLS_CAROUSEL_INDICATOR_X);
				$el.width(o.size);
			}
			var $item = $("<div class='" + cls.CLS_CAROUSEL_INDICATOR_ITEM + "'></div>");
			for (var i = 0; i < this.totalPage; i++) {
				var itemclone = $item.clone().appendTo($el);
				if (this.nowPage == i + 1) {
					itemclone.addClass(cls.CLS_CAROUSEL_INDICATOR_ON);
				}
			}
			return this;
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcLayoutview", $.davinci.dvcBase, {
		options: {
			type: "none",
			checked: false,
			groupName: "",
			eventNames: ["ev_click", "ev_change", "ev_keyup", "ev_swipeleft", "ev_swiperight", "ev_focus", "ev_blur"],
			initSelector: ":jqmData(role='dvcLayoutview')"
		},
		classes: {
			CLS_WIDGET: "dvc-layoutview",
			CLS_LAYOUTVIEW_UP: "dvc-layoutview-up",
			CLS_LAYOUTVIEW_DOWN: "dvc-layoutview-down",
			CLS_LAYOUTVIEW_NONE: "dvc-layoutview-none",
			CLS_LAYOUTVIEW_LINK: "dvc-layoutview-link",
			CLS_LAYOUTVIEW_LINK_ICON: "dvc-layoutview-link-icon",
			CLS_LAYOUTVIEW_BTN: "dvc-layoutview-button",
			CLS_LAYOUTVIEW_CHK: "dvc-layoutview-checkbox",
			CLS_LAYOUTVIEW_CHK_ICON: "dvc-layoutview-checkbox-icon",
			CLS_LAYOUTVIEW_RDO: "dvc-layoutview-radio",
			CLS_LAYOUTVIEW_CHKRDO: "dvc-layoutview-checkboxradio"
		},
		_initType: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			switch (o.type) {
			case "link":
				$el.addClass(cls.CLS_LAYOUTVIEW_LINK);
				break;
			case "button":
				$el.addClass(cls.CLS_LAYOUTVIEW_BTN);
				break;
			case "checkbox":
				$el.addClass(cls.CLS_LAYOUTVIEW_CHK);
				break;
			case "radio":
				$el.addClass(cls.CLS_LAYOUTVIEW_RDO);
				break;
			case "checkboxradio":
				$el.addClass(cls.CLS_LAYOUTVIEW_CHKRDO);
				break;
			default:
				$el.addClass(cls.CLS_LAYOUTVIEW_NONE).removeClass(cls.CLS_LAYOUTVIEW_UP);
				break;
			}
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// if not, try to find closest theme container	
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			if ($el.children().length == 0) {
				$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_THEME);
			}
			else {
				$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_LAYOUTVIEW_UP + ' ' + cls.CLS_THEME);
				this._initType();
			}
			self._findScrollview();
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if ($el.children().length == 0) {
				self._designDefault($el.jqmData("role").slice(3));
			}
			else {
				switch (o.type) {
				case "link":
					var $link = $("<div class='" + cls.CLS_LAYOUTVIEW_LINK_ICON + "'></div>");
					$link.appendTo($el);
					break;
				case "checkbox":
				case "checkboxradio":
					var $checkbox = $("<div class='" + cls.CLS_LAYOUTVIEW_CHK_ICON + "'></div>");
					$checkbox.appendTo($el);
					self.$checkbox = $checkbox;
					break;
				}
				if ($link) {
					self._addAttrDontSaveNDontFocus($link);
				}
				if ($checkbox) {
					self._addAttrDontSaveNDontFocus($checkbox);
				}
				$el.find("div:jqmData(role^='dvc')").each(function() {
					var self = this,
						$this = $(this);
					var role = $this.jqmData('role');
					var id = this.id;
					if (!id) {
						id = $this.attr("subid");
					}
					if (role) {
						if ($this.data(role)) {
							return true;
						}
						$this[role]();
					}
				});
			}
		},
		_empty: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// 하위 element 제거
			$el.children('.' + cls.CLS_LAYOUTVIEW_LINK_ICON + ", ." + cls.CLS_LAYOUTVIEW_CHK_ICON).remove();
		},
		_designRefresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype._designRefresh.call(this);
			// 하위로 내려가면서 changeTheme()를 호출한다.
			$el.find("div:jqmData(role^='dvc')").each(function() {
				var $this = $(this);
				var role = $this.jqmData("role");
				var instance = $this.data(role);
				if (instance) {
					instance._changeTheme();
				}
			});
		},
		toggle: function() {
			this.checked(!this.checked());
		},
		_checked: function(isChecked) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			o.checked = isChecked;
			if (o.type == "checkbox" || o.type == "checkboxradio") {
				if (o.checked) {
					$el.addClass(cls.CLS_CHECKED);
				} else {
					$el.removeClass(cls.CLS_CHECKED);
				}
			} else if (o.type == "radio") {
				if (o.checked) {
					$el.addClass(cls.CLS_CHECKED);
				} else {
					$el.removeClass(cls.CLS_CHECKED);
				}
			}
		},
		checked: function(isChecked) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (arguments[0] != undefined) {
				if (o.type == "radio" || o.type == "checkboxradio") {
					if (o.checked == false) {
						var $ancestorWithID = null;
						$el.parents().each(function() {
							if (this.id) {
								$ancestorWithID = $(this);
								return false;
							}
						});
						if ($ancestorWithID) {
							$ancestorWithID.find(":jqmData(group-name=" + o.groupName + ")").each(function() {
								if (this !== $el[0]) {
									var $this = $(this);
									var role = $this.jqmData("role");
									$this.data(role)._checked(false);
								}
							});
						}
						self._checked(true);
					}
				} else {
					self._checked(isChecked);
				}
				return this;
			} else {
				return o.checked;
			}
		},
		visible: function(visible) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype.visible.call(this, visible);
			if (arguments[0] != undefined) {
				if (self.scrollview) {
					self.scrollview.refresh();
				}
			}
			else {
				return o.visible;
			}
		},
		refresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype.refresh.call(this);
			if (o.type == "checkbox" || o.type == "radio" || o.type == "checkboxradio") {
				self._checked(o.checked);
			}
			return this;
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcListitem", $.davinci.dvcBase, {
		options: {
			type: "none",
			eventNames: ["ev_click", "ev_change", "ev_keyup", "ev_swipeleft", "ev_swiperight", "ev_focus", "ev_blur"],
			initSelector: ":jqmData(role='dvcListitem')"
		},
		classes: {
			CLS_WIDGET: "dvc-listitem",
			CLS_LISTITEM_NONE: "dvc-listitem-none",
			CLS_LISTITEM_LINK: "dvc-listitem-link",
			CLS_LISTITEM_LINK_ICON: "dvc-listitem-link-icon",
			CLS_LISTITEM_BTN: "dvc-listitem-button",
			CLS_LISTITEM_CHK: "dvc-listitem-checkbox",
			CLS_LISTITEM_CHK_ICON: "dvc-listitem-checkbox-icon",
			CLS_LISTITEM_RDO: "dvc-listitem-radio",
			CLS_LISTITEM_CHKRDO: "dvc-listitem-checkboxradio",
			CLS_LISTITEM_ITEM_DESIGN: "dvc-listitem-item-design",
			CLS_LISTITEM_ITEM_UP_DESIGN: "dvc-listitem-item-up-design",
			CLS_LISTITEM_ITEM_INDEXABLE_DESIGN: "dvc-listitem-item-indexable-design",
			CLS_LISTITEM_ITEM: "dvc-listitem-item",
			CLS_LISTITEM_ITEM_UP: "dvc-listitem-item-up",
			CLS_LISTITEM_ITEM_DOWN: "dvc-listitem-item-down",
			CLS_LISTITEM_ITEM_INDEXABLE: "dvc-listitem-item-indexable",
			CLS_LISTITEM_ITEMS: "dvc-listitem-items"
		},
		_initType: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			switch (o.type) {
			case "none":
				$el.addClass(cls.CLS_LISTITEM_NONE);
				break;
			case "link":
				$el.addClass(cls.CLS_LISTITEM_LINK);
				break;
			case "button":
				$el.addClass(cls.CLS_LISTITEM_BTN);
				break;
			case "checkbox":
				$el.addClass(cls.CLS_LISTITEM_CHK);
				break;
			case "radio":
				$el.addClass(cls.CLS_LISTITEM_RDO);
				break;
			case "checkboxradio":
				$el.addClass(cls.CLS_LISTITEM_CHKRDO);
				break;
			}
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// if not, try to find closest theme container	
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_THEME);
			self._items = [];
			self._initType();
			self._findScrollview();
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var $designItem = $el.find("." + cls.CLS_LISTITEM_ITEM);
			var $items = $("<div class='" + cls.CLS_LISTITEM_ITEMS + "'></div>");
			self.$designItem = $designItem;
			self.$items = $items;
			// 하위 widget 중 subid가 없을 경우에는 id를 subid로 변경한다.
			$el.find("[id]").not("[subid]").each(function() {
				this.outerHTML = this.outerHTML.replace(/\sid/g, " subid");
			});
			if ($designItem.length == 0) {
				var designItem = "<div class='" + cls.CLS_LISTITEM_ITEM + ' ' + cls.CLS_LISTITEM_ITEM_INDEXABLE + ' ' + cls.CLS_THEME + ' ' + cls.CLS_LISTITEM_ITEM_UP + "'></div>";
				var $children = $el.children("*");
				if ($children.length) {
					$children.wrapAll(designItem);
					$designItem = $el.children("." + cls.CLS_LISTITEM_ITEM);
					self.$designItem = $designItem;
				}
				else {
					$el.append(designItem);
					self.$designItem = $el.find("." + cls.CLS_LISTITEM_ITEM);
				}
			}
			self.$designItem.attr('waper_focus', 'false').attr('waper_savechildrenonly', 'true');
			if (self.$designItem.children().length == 0) {
				var $c = $("<div class='" + cls.CLS_DESIGN_DEFAULT + " " + cls.CLS_LISTITEM_ITEM_INDEXABLE + "' waper_focus='false' waper_dontsave='true' style='font-family:Tahoma; font-size:12px;' >" + $el.jqmData("role").slice(3) + "</div>");
				self.$designItem.append($c);
			}
			else {
				self.$designItem.children("." + cls.CLS_DESIGN_DEFAULT).remove();
				switch (o.type) {
				case "link":
					var $link = $("<div class='" + cls.CLS_LISTITEM_LINK_ICON + "'></div>");
					self._addAttrDontSaveNDontFocus($link);
					$link.appendTo(self.$designItem);
					break;
				case "checkbox":
				case "checkboxradio":
					var $checkbox = $("<div class='" + cls.CLS_LISTITEM_CHK_ICON + "'></div>");
					self._addAttrDontSaveNDontFocus($checkbox);
					$checkbox.appendTo(self.$designItem);
					self.$checkbox = $checkbox;
					break;
				}
			}
		},
		update: function(items, index) {
			var $el = this.element,
				self = this,
				cls = this.classes;
			if (index == undefined) {
				index = 0;
			}
			for (var i = 0; i < items.length; ++i) {
				var item = items[i];
				var $posItem = $el.find('.' + cls.CLS_LISTITEM_ITEM_INDEXABLE).eq(index);
				if ($posItem.length == 0) {
					return;
				}
				self._items[index] = item;
				index++;
				$posItem.find("div:jqmData(role^='dvc')").each(function() {
					var role = $(this).jqmData('role');
					if (role) {
						var $this = $(this);
						var subid = $this.attr("subid");
						var instance = $this.data(role);
						if (item[subid]) {
							if (role == "dvcImage") {
								instance.src(item[subid]);
							}
							else if (role == "dvcLabel" || role == "dvcButton" || role == "dvcImageButton" || role == "dvcTextfield") {
								instance.text(item[subid]);
							}
							else if (role == "dvcRadioButton" || role == "dvcCheckbox" || role == "dvcSwitch") {
								instance.checked(item[subid]);
							}
							else if (role == "dvcProgress" || role == "dvcSlider") {
								instance.value(item[subid]);
							}
							else if (item["userClass"]) {
								instance.element.addClass(item["userClass"]);
							}
							else if (item["userData"]) {
								instance.element.data("userData", item["userData"]);
							}
						}
					}
				});
			}
			if (self.scrollview) {
				self.scrollview.refresh();
			}
		},
		add: function(items, index) {
			var $el = this.element,
				self = this,
				cls = this.classes;
			// 현재 item이 몇개있는 지를 알아온다.
			var html = this.$designItem[0].outerHTML;
			// 2. 이 문자열에서 -design을 제거한다.
			html = html.replace(/-design/g, "");
			var $html = $(html);
			var $newItem;
			// item은 아래와 같은 형식이다.
/*
			{
				[subid의 실제이름]: "",
				userClass: "",		// item에 추가할 class
				userData: null		// item에 추가할 data
			}
		
		*/
			if (index != undefined) {
				var i, len, pos;
				len = items.length;
				for (i = 0, pos = index; i < len; i++, pos++) {
					self._items.splice(pos, 0, items[i]);
				}
			}
			else {
				self._items = self._items.concat(items);
			}
			for (var i = 0; i < items.length; ++i) {
				var item = items[i];
				if (typeof item == "string") {
					item = item.replace(/\sid/g, " subid");
					$newItem = $(item);
				}
				else {
					$newItem = $html.clone();
					if (item["userClass"]) {
						$newItem.addClass(item["userClass"]);
					}
					if (item["userData"]) {
						$newItem.data("userData", item["userData"]);
					}
				}
				if (index != undefined) {
					var $posItem = $el.find('.' + cls.CLS_LISTITEM_ITEM_INDEXABLE).eq(index);
					if ($posItem.length == 0) {
						self.$items.append($newItem);
					}
					else {
						$newItem.insertBefore($posItem);
					}
					index++;
				}
				else {
					self.$items.append($newItem);
				}
				$newItem.find("div:jqmData(role^='dvc')").each(function() {
					var role = $(this).jqmData('role');
					if (role) {
						var $this = $(this);
						var subid = $this.attr("subid");
						var options = {};
						if (item[subid]) {
							if (role == "dvcImage") {
								options.src = item[subid];
							}
							else if (role == "dvcLabel" || role == "dvcButton" || role == "dvcImageButton" || role == "dvcTextfield") {
								options.text = item[subid];
							}
							else if (role == "dvcRadioButton" || role == "dvcCheckbox" || role == "dvcSwitch") {
								options.checked = item[subid];
							}
							else if (role == "dvcProgress" || role == "dvcSlider") {
								options.value = item[subid];
							}
						}
						if ($this.data(role)) {
							//	console.log("duplicate skip role = " + role + ", id = " + subid);
							return true;
						}
						$this[role](options);
					}
				});
			}
			if (self.scrollview) {
				self.scrollview.refresh();
			}
			return this;
		},
		remove: function(index) {
			var $el = this.element,
				self = this,
				cls = this.classes;
			self._items.splice(index, 1);
			$el.find('.' + cls.CLS_LISTITEM_ITEM_INDEXABLE).eq(index).remove();
			if (self.scrollview) {
				self.scrollview.scrollTo(0, 0);
				self.scrollview.refresh();
			}
			return this;
		},
		clear: function() {
			var $el = this.element,
				self = this,
				cls = this.classes;
			self._items = [];
			$el.find('.' + cls.CLS_LISTITEM_ITEMS).children().remove();
			if (self.scrollview) {
				self.scrollview.scrollTo(0, 0);
				self.scrollview.refresh();
			}
			return this;
		},
		items: function(items) {
			if (arguments.length) {
				this.clear();
				this.add(items);
				return this;
			}
			else {
				return this._items;
			}
		},
		getCount: function() {
			var $el = this.element,
				self = this,
				cls = this.classes;
			return $el.find('.' + cls.CLS_LISTITEM_ITEM_INDEXABLE).length;
		},
		_empty: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// 하위 element 제거
			$el.find('.' + cls.CLS_LISTITEM_LINK_ICON + ", ." + cls.CLS_LISTITEM_CHK_ICON).remove();
		},
		_designRefresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype._designRefresh.call(this);
			// 하위로 내려가면서 changeTheme()를 호출한다.
			$el.find("div:jqmData(role^='dvc')").each(function() {
				var $this = $(this);
				var role = $this.jqmData("role");
				var instance = $this.data(role);
				if (instance) {
					instance._changeTheme();
				}
			});
		},
		toggle: function(index) {
			this.checked(index, !this.checked(index));
		},
		visible: function(visible) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype.visible.call(this, visible);
			if (arguments[0] != undefined) {
				if (self.scrollview) {
					self.scrollview.refresh();
				}
			}
			else {
				return o.visible;
			}
		},
		refresh: function() {
			var $el = this.element,
				self = this,
				o = this.options;
			this.enable(-1, this.enable(-1));
			this.visible(this.visible());
			return this;
		},
		// jquery 1.6.1이후부터 disabled에 대해 적용되지 않아 수정하였음.
		enable: function(lineIndex, e) {
			var $el = this.element,
				self = this,
				cls = this.classes;
			if (arguments.length == 2) {
				if (lineIndex < 0) {
					$.davinci.dvcBase.prototype.enable.call(this, e);
				}
				else {
					var $item = $el.find('.' + cls.CLS_LISTITEM_ITEM_INDEXABLE).eq(lineIndex);
					if (e) {
						$item.removeClass(cls.CLS_DISABLED);
					}
					else {
						$item.addClass(cls.CLS_DISABLED);
					}
				}
			}
			else {
				if (lineIndex < 0) {
					return $.davinci.dvcBase.prototype.enable.call(this);
				}
				else {
					var $item = $el.find('.' + cls.CLS_LISTITEM_ITEM_INDEXABLE).eq(lineIndex);
					return !$item.hasClass(cls.CLS_DISABLED);
				}
			}
			return this;
		},
		checked: function(lineIndex, v) {
			var $el = this.element,
				cls = this.classes;
			if (arguments.length == 2) {
				if (this.options.type == "checkboxradio" || this.options.type == "radio") {
					$el.find('.' + cls.CLS_LISTITEM_ITEM_INDEXABLE).each(function(index) {
						if (index == lineIndex) {
							$(this).addClass(cls.CLS_CHECKED);
						}
						else {
							$(this).removeClass(cls.CLS_CHECKED);
						}
					});
				}
				else if (this.options.type == "checkbox") {
					var $item = $el.find('.' + cls.CLS_LISTITEM_ITEM_INDEXABLE).eq(lineIndex);
					if (v) {
						$item.addClass(cls.CLS_CHECKED);
					}
					else {
						$item.removeClass(cls.CLS_CHECKED);
					}
				}
				return this;
			}
			else {
				var $item = $el.find('.' + cls.CLS_LISTITEM_ITEM_INDEXABLE).eq(lineIndex);
				if ($item.length) {
					switch (this.options.type) {
					case "checkboxradio":
					case "radio":
					case "checkbox":
						return $item.hasClass(cls.CLS_CHECKED);
					}
				}
				return false;
			}
		},
		userData: function(lineIndex, d) {
			var $el = this.element,
				cls = this.classes;
			var $item = $el.find('.' + cls.CLS_LISTITEM_ITEM_INDEXABLE).eq(lineIndex);
			if (arguments.length == 2) {
				$item.data("userData", d);
				return this;
			}
			else {
				return $item.data("userData");
			}
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcCollapseview", $.davinci.dvcBase, {
		options: {
			collapsed: false,
			initSelector: ":jqmData(role='dvcCollapseview')"
		},
		classes: {
			CLS_WIDGET: "dvc-collapseview",
			CLS_COLLAPSEVIEW_COLLAPSED: "dvc-collapseview-collapsed"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$el.addClass(cls.CLS_WIDGET);
			this._findScrollview();
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$el.addClass("dvc-collapseview dvc-collapseview-corner-bottom");
			$el.append($('<div  waper_focus="false" waper_dontsave="true" class="dvc-collapseview-bottom">Collapseview</div>'));
		},
		_empty: function() {},
		_designRefresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype._designRefresh.call(this);
			// 하위로 내려가면서 changeTheme()를 호출한다.
			$el.find("div:jqmData(role^='dvc')").each(function() {
				var $this = $(this);
				var role = $this.jqmData("role");
				var instance = $this.data(role);
				if (instance) {
					instance._changeTheme();
				}
			});
		},
		collapsed: function(c, duration, complete) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (arguments.length) {
				o.collapsed = c;
				var animationCompleted = function() {
					if (complete) {
						complete();
					}
					if (c) {
						$el.addClass(cls.CLS_COLLAPSEVIEW_COLLAPSED);
					}
					else {
						$el.removeClass(cls.CLS_COLLAPSEVIEW_COLLAPSED);
					}
				};
				if (c) {
					if (duration) {
						$el.slideUp(duration, function() {
							animationCompleted();
						});
					}
					else {
						$el.hide();
						animationCompleted();
					}
				}
				else {
					if (duration) {
						$el.slideDown(duration, function() {
							animationCompleted();
						});
					}
					else {
						$el.show();
						animationCompleted();
					}
				}
				if (self.scrollview) {
					self.scrollview.refresh();
				}
				return this;
			}
			else {
				return o.collapsed;
			}
		},
		refresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype.refresh.call(this);
			self.collapsed(o.collapsed);
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcDivision", $.davinci.dvcBase, {
		options: {
			eventNames: ["ev_divisioninit"],
			initSelector: ":jqmData(role='dvcDivision')"
		},
		classes: {
			CLS_WIDGET: "dvc-division"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$el.addClass(cls.CLS_WIDGET);
			this._findScrollview();
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			self._designDefault($el.jqmData("role").slice(3));
		},
		_init: function() {
			var $el = this.element,
				self = this;
			$.davinci.dvcBase.prototype._init.call(this);
			$el.trigger("ev_divisioninit", this);
		},
		html: function(value) {
			var $el = this.element,
				self = this;
			if (arguments.length) {
				$el.html(value);
				$el.find("link,style").remove();
			}
			else {
				var value = $el.html();
				return value;
			}
			if (this.scrollview) {
				this.scrollview.refresh();
			}
		},
		visible: function(visible) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype.visible.call(this, visible);
			if (arguments[0] != undefined) {
				if (self.scrollview) {
					self.scrollview.refresh();
				}
			}
			else {
				return o.visible;
			}
		},
		clear: function() {
			var $el = this.element,
				self = this;
			this.html("");
			if (this.scrollview === undefined) {
				if (!this._findScrollview()) {
					this.scrollview = 0;
				}
			}
			if (this.scrollview) {
				this.scrollview.scrollTo(0, 0);
				this.scrollview.refresh();
			}
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcGrid", $.davinci.dvcBase, {
		options: {
			initSelector: ":jqmData(role='dvcGrid')"
		},
		classes: {
			CLS_WIDGET: "dvc-grid",
			CLS_GRID_ITEM: "dvc-grid-item"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$el.addClass(cls.CLS_WIDGET);
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			o.itemCount = parseInt($el.attr("data-item-count"), 10) || 2;
			var $items = $el.find(".dvc-grid-item");
			var curItemCount = $items.length;
			if (o.itemCount < curItemCount) {
				var removeCount = curItemCount - o.itemCount;
				for (i = curItemCount; i > o.itemCount; i--) {
					$items.eq(i - 1).remove();
				}
			}
			else if (o.itemCount > curItemCount) {
				var addCount = o.itemCount - curItemCount;
				var $item = $('<div data-role="GridItem" class="dvc-grid-item"></div>');
				for (i = 0; i < addCount; i++) {
					$item.clone().appendTo($el);
				}
			}
		},
		_empty: function() {},
		_designRefresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype._designRefresh.call(this);
			// 하위로 내려가면서 changeTheme()를 호출한다.
			$el.find("div:jqmData(role^='dvc')").each(function() {
				var $this = $(this);
				var role = $this.jqmData("role");
				var instance = $this.data(role);
				if (instance) {
					instance._changeTheme();
				}
			});
		},
		refresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var $items = $el.find("." + cls.CLS_GRID_ITEM);
			var count = $items.length;
			var width = 100 / count;
			var strWidth = width.toString();
			$items.each(function(i) {
				var strLeft = (i * width).toString() + "%";
				if (i == count - 1) { // 마지막이면,
					$(this).css({
						left: strLeft,
						right: "0px"
					});
				}
				else {
					$(this).css({
						left: strLeft,
						width: strWidth + "%"
					});
				}
			});
		}
	});
})(jQuery);
(function($, undefined) {
	var _selftree = null;
	$.widget("davinci.dvcTreeview", $.davinci.dvcBase, {
		options: {
			data: null,
			treeType: "basic",
			//basic(use expandIcon, line, text), 
			//check(use checkbox), 
			//depticon(use dept icon(root/haschild/nohaschild)), 
			//all(use expandIcon, checkbox, depticon)
			iconWidth: "23",
			eventNames: ["ev_click", "ev_change", "ev_ecclick"],
			initSelector: ":jqmData(role='dvcTreeview')"
		},
		classes: {
			CLS_WIDGET: "dvc-treeview",
			CLS_TREEVIEW_NODE_BODY: "dvc-treeview-node-body",
			CLS_TREEVIEW_NODE_NAME_BACK: "dvc-treeview-node-name-back",
			CLS_TREEVIEW_SELECTED_NODE: "dvc-treeview-selected-node",
			CLS_TREEVIEW_LINE_GROUP: "dvc-treeview-line-group"
		},
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$el.addClass(cls.CLS_WIDGET);
			self._findScrollview();
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var $treenodebody = $("<div class='" + cls.CLS_TREEVIEW_NODE_BODY + "' style='position:relative;'></div>");
			$treenodebody.attr('waper_focus', 'false').attr('waper_dontsave', 'true');
			$el.prepend($treenodebody);
		},
		refresh: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$.davinci.dvcBase.prototype.refresh.call(this);
			_selftree = self;
			setTimeout(self._drawDesignTreeview, 10);
			return this;
		},
		_drawDesignTreeview: function() {
			var $el = _selftree.element,
				self = _selftree;
			//o.data = $el.attr("data-data") || null;
			//o.treeType = $el.attr("data-tree-type") || "basic";
			_selftree.removeAll();
			var childnode = [];
			childnode.push({
				"id": "001",
				"text": "node 1",
				"isexpand": true,
				"hasChildren": true,
				"childnodes": [{
					"id": "002",
					"text": "node 1-1"
				}]
			});
			childnode.push({
				"id": "010",
				"text": "node 2"
			});
			var rootnode = [];
			rootnode.push({
				"id": "id1",
				"text": "root",
				"selected": "false",
				"isexpand": true,
				// childnode가 펼쳐져 있는 상태
				"childnodes": childnode // childnode
			});
			if (_selftree.element.width() > 0) {
				_selftree._drawTreeview(rootnode);
				_selftree._addAttrDontSaveNDontFocus($el.find("*"));
			}
			else {
				setTimeout(_selftree._drawDesignTreeview, 10);
			}
		},
		setIconWidth: function(w) {
			var self = this,
				o = this.options;
			o.iconWidth = w;
			self._drawTreeview(o.data);
			//		self.refresh();
			return this;
		},
		_drawTreeview: function(_datas) {
			var $el = this.element,
				self = this,
				o = this.options;
			var rootDataLen = _datas.length;
			var path = [0];
			var html = [];
			o.data = _datas;
			self.removeAll();
			html.push("<ul class='dvc-treeview-node-container'>");
			var treeviewWidth = $el.css("width");
			for (var i = 0; i < rootDataLen; i++) {
				var isLast = false;
				path[0] = i;
				if (i + 1 == rootDataLen) {
					isLast = true;
				}
				self._drawLi(parseInt(treeviewWidth.replace("px", ""), 10), _datas[i], html, 0, "" + path[0], isLast);
			} //for
			html.push("</ul>");
			//screen draw
			var $html = $(html.join(""));
			$el.prepend($html);
			return this;
		},
		_drawLi: function(treeviewWidth, liData, html, deep, path, isLast) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var iconWidth = 23;
			var liClass = "";
			var isChildren = false;
			var hasChildClass = "dvc-treeview-nohaschild-icon";
			var middleClass = "";
			var lineClass = "dvc-treeview-middle-line";
			var leftStyle = "margin-left:" + (deep * iconWidth) + "px;";
			var target = [];
			var iconCnt = 0;
			if (isLast) {
				lineClass = " ";
				liClass = lineClass;
			}
			html.push("<li id='" + liData.id + "' deep='" + deep + "' path='" + path + "' class='" + liClass + "'>");
			html.push("<div class='dvc-treeview-node-background dvc-treeview-li-back-style'>");
			//draw line
			html.push("<span class='dvc-treeview-line-group'>");
			var lastCheckSet = (path.indexOf(".")) ? self._isLastParent(path) : [0];
			for (var idx = 0; idx < deep; idx++) {
				var idxStyle = "";
				//상위 부모가 그 상위 부모의 마지막 노드일 경우
				if (lastCheckSet[idx]) {
					idxStyle = "visibility:hidden;";
				}
				html.push("<span class='dvc-treeview-line-icon dvc-treeview-basic-line' style='" + idxStyle + "'></span>");
				iconCnt++;
			}
			//current line
			if (isLast) {
				html.push("<span class='dvc-treeview-line-icon dvc-treeview-last-line' style=''></span>");
			}
			else {
				html.push("<span class='dvc-treeview-line-icon " + lineClass + "' style='" + middleClass + "'></span>");
			}
			iconCnt++;
			//
			if (liData.childnodes != undefined || liData.hasChildren) {
				isChildren = true;
			}
			else {
				html.push("<span class='dvc-treeview-line-icon dvc-treeview-horizontal-line'></span>");
				iconCnt++;
			}
			html.push("</span>");
			//end draw line
			if (isChildren) {
				var expandIcon = "dvc-treeview-open-icon";
				hasChildClass = "dvc-treeview-haschild-icon";
				if (!liData.isexpand) {
					expandIcon = "dvc-treeview-close-icon";
				}
				html.push("<span class='dvc-treeview-expend-icon " + expandIcon + "'></span>");
				iconCnt++;
			}
			if (path == "0") {
				hasChildClass = "dvc-treeview-root-icon";
			}
			if (o.treeType == "depticon" || o.treeType == "all") {
				html.push("<span class='" + hasChildClass + "'></span>");
				iconCnt++;
			}
			var selectedStyle = " ";
			if (liData.selected) {
				selectedStyle = " dvc-treeview-selected-node";
			}
			var nameBackStyle = "";
			if (o.treeType == "check" || o.treeType == "all") {
				nameBackStyle = "width:" + (treeviewWidth - (iconWidth * iconCnt) - 25) + "px;"; //treeview width-(icon width*icon cnt)-(check area/2)
			}
			else {
				nameBackStyle = "width:" + (treeviewWidth - (iconWidth * iconCnt) - 5) + "px;";
			}
			if (nameBackStyle.indexOf("-") >= 0) {
				nameBackStyle = "width:" + iconCnt + "px;";
			}
			html.push("<span class='dvc-treeview-node-name-back " + selectedStyle + "' style='" + nameBackStyle + "'><span class='dvc-treeview-node-name'>" + liData.text + "</span></span>");
			if (o.treeType == "check" || o.treeType == "all") {
				html.push("<span class='dvc-treeview-ischeck-back'><span class='dvc-treeview-ischeck-icon dvc-treeview-check-up'></span></span>");
			}
			html.push("</div>");
			if (isChildren && liData.childnodes != undefined) {
				var childrenLen = liData.childnodes.length;
				var children = liData.childnodes;
				var ulStyle = "";
				var arrPath = ("" + path).split(".");
				if (isLast) {
					ulStyle = "background-image:none;";
				}
				arrPath.push(0);
				if (!liData.isexpand) {
					ulStyle += "display:none;";
				}
				html.push("<ul style='" + ulStyle + "' >");
				deep++;
				for (var i = 0; i < childrenLen; i++) {
					var isParentLast = false;
					arrPath[arrPath.length - 1] = i;
					if (i == childrenLen - 1) {
						isParentLast = true;
					}
					self._drawLi(treeviewWidth, children[i], html, deep, arrPath.join("."), isParentLast);
				}
				html.push("</ul>");
			}
			html.push("</li>");
		},
		_isLastParent: function(path) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var result = [];
			var nodeData = this.options.data;
			var arrPt = path.split(".");
			var arrPtLen = arrPt.length;
			for (var i = 0; i < arrPtLen; i++) {
				var idx = arrPt[i];
				var len = 0;
				if (i == 0) {
					len = nodeData.length - 1;
					nodeData = nodeData[idx];
				}
				else {
					len = nodeData.childnodes.length - 1;
					nodeData = nodeData.childnodes[idx];
				}
				result.push(len == idx ? true : false);
			}
			return result;
		},
		addNode: function(target, data, type) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var html = [];
			if (target) {
				if (!type) {
					type = "after";
				}
				self._setItems(target, data, type);
				self._drawTreeview(o.data);
			} else {
				self._drawTreeview(data);
			}
			return this;
		},
		removeNode: function(target, isunwrap) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			self._removeItems(target.attr("path"), isunwrap);
			self._drawTreeview(o.data);
			return this;
		},
		removeAll: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$(this.element).find(".dvc-treeview-node-container").remove();
			//		this.refresh();
			return this;
		},
		getSelectedNode: function(type) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var selectedNode = $(this.element).find('.' + cls.CLS_TREEVIEW_SELECTED_NODE).parent().parent(); //li
			if (selectedNode[0]) {
				if (selectedNode[0].nodeName == "DIV") {
					selectedNode = selectedNode.parent();
				}
				if (type == "id") {
					return selectedNode.length ? selectedNode.id : null;
				}
				else if (type == "path") {
					return selectedNode.length ? selectedNode.attr("path") : null;
				}
				else {
					return selectedNode.length ? selectedNode : null;
				}
				return -1;
			} else {
				return null;
			}
		},
		getCheckedNodes: function(type) {
			var self = this,
				cls = this.classes;
			var checkedNode = $(this.element).find(".dvc-treeview-checked").parent().parent().parent(); //li
			var checkedItems = [];
			var checkedLen = checkedNode.length;
			if (type == "data") {
				for (var i = 0; i < checkedLen; i++) {
					checkedItems.push(self.getItems(checkedNode.attr("path")));
				}
				return checkedItems;
			}
			else //target
			{
				return (checkedLen) ? checkedNode : null;
			}
			return null;
		},
		getItems: function(path) {
			var nodeData = this.options.data;
			var arrPt = path.split(".");
			var arrPtLen = arrPt.length;
			for (var i = 0; i < arrPtLen; i++) {
				if (i == 0) {
					nodeData = nodeData[arrPt[i]];
				}
				else {
					nodeData = nodeData.childnodes[arrPt[i]];
				}
			}
			return nodeData;
		},
		_removeItems: function(path, isunwrap) {
			var self = this;
			var nodeData = this.options.data;
			var arrPt = path.split(".");
			var arrPtLen = arrPt.length;
			for (var i = 0; i < arrPtLen; i++) {
				if (i == arrPtLen - 1) {
					var at = arrPt[i];
					if (i == 0) {
						nodeData.splice(at, 1);
					}
					else {
						var deleteNode = nodeData.childnodes[at];
						//at remove
						nodeData.childnodes.splice(at, 1);
						if (isunwrap && deleteNode.childnodes != undefined) { //삭제한 노드의 child를 상위로 add
							nodeData.childnodes = self._atJoinArray(nodeData.childnodes, deleteNode.childnodes, at);
						}
						if (!nodeData.childnodes.length) {
							nodeData.childnodes = null;
							nodeData.isexpand = false;
						}
					}
				}
				else {
					if (i == 0) {
						nodeData = nodeData[arrPt[i]];
					}
					else {
						nodeData = nodeData.childnodes[arrPt[i]];
					}
				}
			}
		},
		_setItems: function(target, data, type) {
			var self = this;
			var nodeData = this.options.data;
			var arrPt = target.attr("path").split(".");
			var arrPtLen = arrPt.length;
			for (var i = 0; i < arrPtLen; i++) {
				if (i == arrPtLen - 1) {
					var at = arrPt[i];
					if (i == 0) {
						if (type == "after") {
							this.options.data = nodeData.concat(data);
						}
						else if (type == "child") {
							nodeData[arrPt[i]].childnodes = data;
						}
						else //before
						{
							this.options.data = data.concat(nodeData);
						}
					}
					else {
						if (type == "child") {
							nodeData[arrPt[i]].childnodes = data;
						}
						else {
							nodeData.childnodes = self._atJoinArray(nodeData.childnodes, data, at, (type == "after") ? true : false);
						}
					}
				}
				else {
					if (i == 0) {
						nodeData = nodeData[arrPt[i]];
					}
					else {
						nodeData = nodeData.childnodes[arrPt[i]];
					}
				}
			}
		},
/*
	when inner is true and index is 0, target[0] start addArray.
	when inner is false and index is 0, target[0] start target.
	*/
		_atJoinArray: function(target, addArray, index, inner) {
			var targetLen = target.length;
			var joinArray = [];
			index = parseInt(index, 10);
			if (targetLen > index + 1) {
				var firstIdx = inner ? index + 1 : index;
				if (firstIdx) {
					joinArray = target.slice(0, firstIdx);
				}
				joinArray = joinArray.concat(addArray);
				joinArray = joinArray.concat(target.slice(firstIdx, targetLen));
				return joinArray;
			}
			return target.concat(addArray);
		}
	});
})(jQuery);
(function($, undefined) {
	$.widget("davinci.dvcPagebox", $.davinci.dvcBase, {
		options: {
			pageId: "",
			initSelector: ":jqmData(role='dvcPagebox')"
		},
		defaults: {
			transition: "none",
			reverse: false,
			changeHash: true,
			fromHashChange: false,
			pageContainer: undefined,
			fromPage: undefined,
			allowSamePageTransition: false
		},
		classes: {
			CLS_WIDGET: "dvc-pagebox",
			CLS_PAGEBOX_ITEM: "dvc-pagebox-item",
			CLS_PAGEBOX_ACTIVEPAGE: "dvc-pagebox-activepage"
		},
		isPageTransitioning: false,
		_initWidget: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			$el.addClass(cls.CLS_WIDGET);
		},
		_appendChildElements: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			self._designDefault($el.jqmData("role").slice(3));
		},
		// function _initialize()
		// dvcPagebox 가 생성될 때에 초기화해주는 작업을 하는 함수로 최초 1회만 호출된다.
		//  1. pageContainer 생성
		//  2. firstPage, pageContainer 정보 저장
		//  3. changePage() 호출( 초기 pageId 값이 없을 경우에는 빈 페이지를 생성 )
		_initialize: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			self.pageContainer = $el.find(">." + cls.CLS_PAGEBOX_ITEM);
			if (o.pageId.length) {
				var pid = o.pageId;
				if (pid[0] != "#") {
					pid = "#" + pid;
				}
				var $page = $(pid);
				var pageId = $page[0].id;
				self.pageContainer.append($page);
				$page.addClass(cls.CLS_PAGEBOX_ACTIVEPAGE);
				self._enhancePage($page);
				self.$activePage = $page;
			} else {
				self._createEmptyPage();
			}
		},
		_createEmptyPage: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var $page = $("<div data-" + $.mobile.ns + "role='page' class='" + cls.CLS_PAGEBOX_ACTIVEPAGE + "'></div>");
			this.pageContainer.append($page);
			this._enhancePage($page);
			this.$activePage = $page;
		},
		_checkPageId: function(_pageid) {
			var pageId = "";
			if (_pageid[0] == '#') {
				pageId = _pageid;
			} else {
				pageId = '#' + _pageid;
			}
			return pageId;
		},
		_enhancePage: function($page, role) {
			//run page plugin
			$page.page();
			$page.css("min-height", 0); // jQueryMobile이 변경하는 min-height를 0으로 없애버림.
		},
		_reFocus: function(page) {
			var pageTitle = page.find(".ui-title:eq(0)");
			if (pageTitle.length) {
				pageTitle.focus();
			}
			else {
				page.focus();
			}
		},
		_releasePageTransitionLock: function() {
			this.isPageTransitioning = false;
		},
		_noneTransitionHandler: function(name, reverse, $toPage, $fromPage) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if ($fromPage) {
				$fromPage.removeClass(cls.CLS_PAGEBOX_ACTIVEPAGE);
			}
			$toPage.addClass(cls.CLS_PAGEBOX_ACTIVEPAGE);
			return $.Deferred().resolve(name, reverse, $toPage, $fromPage).promise();
		},
		_css3TransitionHandler: function(name, reverse, $to, $from) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			var deferred = new $.Deferred(),
				reverseClass = reverse ? " reverse" : "",
				viewportClass = "ui-mobile-viewport-transitioning viewport-" + name,
				doneFunc = function() {
					$to.add($from).removeClass("out in reverse " + name);
					if ($from && $from[0] !== $to[0]) {
						$from.removeClass(cls.CLS_PAGEBOX_ACTIVEPAGE);
					}
					$to.parent().removeClass(viewportClass);
					deferred.resolve(name, reverse, $to, $from);
				};
			$to.animationComplete(doneFunc);
			$to.parent().addClass(viewportClass);
			if ($from) {
				$from.addClass(name + " out" + reverseClass);
			}
			$to.addClass(cls.CLS_PAGEBOX_ACTIVEPAGE + " " + name + " in" + reverseClass);
			return deferred.promise();
		},
		//function for transitioning between two existing pages
		_transitionPages: function(toPage, fromPage, transition, reverse) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (fromPage) {
				//trigger before show/hide events
				fromPage.data("page")._trigger("beforehide", null, {
					nextPage: toPage
				});
			}
			toPage.data("page")._trigger("beforeshow", null, {
				prevPage: fromPage || $("")
			});
			var promise = {};
			if (transition == "none") {
				promise = self._noneTransitionHandler(transition, reverse, toPage, fromPage);
			} else {
				promise = self._css3TransitionHandler(transition, reverse, toPage, fromPage);
			}
			promise.done(function() {
				//trigger show/hide events
				if (fromPage) {
					fromPage.data("page")._trigger("hide", null, {
						nextPage: toPage
					});
				}
				//trigger pageshow, define prevPage as either fromPage or empty jQuery obj
				toPage.data("page")._trigger("show", null, {
					prevPage: fromPage || $("")
				});
			});
			return promise;
		},
		changePage: function(_pageid, options) {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (self.isPageTransitioning) {
				return;
			}
			var pageId = self._checkPageId(_pageid);
			var toPage = $(pageId);
			if (toPage.length == 0) {
				return;
			}
			options = options || {};
			if (toPage.length) {
				var transition = toPage.jqmData("transition");
				if (transition) {
					if (!options.transition) {
						options.transition = transition;
					}
				}
			}
			// android의 경우에는 transition을 "none"으로 설정한다.
			if ($.davinci.getOSName() == "Android") {
				options.transition = "none";
			}
			if (self.pageContainer.find(pageId).length == 0) {
				var fromView = undefined;
				var $fromView = toPage.closest('.' + cls.CLS_WIDGET).first();
				if ($fromView) {
					fromView = $fromView.data("dvcPagebox");
				}
				var fromIsActive = toPage.hasClass(cls.CLS_PAGEBOX_ACTIVEPAGE);
				self.pageContainer.prepend(toPage);
				if (fromView) {
					var fromPages = $fromView.find(":jqmData(role='page')");
					if (fromPages.length > 0) {
						if (fromIsActive) {
							var firstPage = fromPages.first();
							firstPage.addClass(cls.CLS_PAGEBOX_ACTIVEPAGE);
							fromView.$activePage = firstPage;
						}
					} else {
						fromView._createEmptyPage();
					}
				}
			}
			var settings = $.extend({}, self.defaults, options);
			settings.pageContainer = settings.pageContainer || self.pageContainer;
			settings.fromPage = settings.fromPage || self.$activePage;
			var fromPage = settings.fromPage;
			if (fromPage && fromPage[0] === toPage[0] && !settings.allowSamePageTransition) {
				self.isPageTransitioning = false;
				return;
			}
			self._enhancePage(toPage);
			self.$activePage = toPage;
			self._transitionPages(toPage, fromPage, settings.transition, settings.reverse).done(function() {
				self._releasePageTransitionLock();
			});
		},
		getActivePage: function() {
			var $ap = this.$activePage;
			if ($ap && $ap.length) {
				return $ap.data("page");
			}
			return null;
		}
	});
})(jQuery);
(function($, undefined) {
	$.davinci.popup = {};
	$.davinci.popup.zIndex = 3000;
	$.davinci.popup.open = function(id, options) {
		if (id[0] == '#') {
			id = id.replace('#', '');
		}
		var popupInstance = $('#' + id).data("dvcPopup");
		if (popupInstance) {
			var $popup = popupInstance.element;
		}
		else {
			if (options.pageId[0] == '#') {
				options.pageId.replace('#', '');
			}
			var $page = $('#' + options.pageId);
			if ($page.length == 0) {
				//해당 page가 없다.
				return;
			}
			var theme = $page.jqmData("theme") || "a";
			var $popup = $("<div data-" + $.mobile.ns + "role='dvcPopup'></div>");
			$popup[0].id = id;
			$popup.jqmData("theme", theme);
			$("body").append($popup);
			$popup.dvcPopup();
			var popupInstance = $popup.data("dvcPopup");
		}
		popupInstance.open(options);
		return popupInstance;
	};
	$.davinci.popup.close = function(id) {
		if (id[0] == '#') {
			id = id.replace('#', '');
		}
		var popupInstance = $('#' + id).data("dvcPopup");
		if (popupInstance) {
			popupInstance.close();
		}
	};
	$.davinci.popup.isShown = function(id) {
		if (id[0] == '#') {
			id = id.replace('#', '');
		}
		var popupInstance = $('#' + id).data("dvcPopup");
		if (popupInstance) {
			return popupInstance.isShown();
		}
		return false;
	};
	$.davinci.popup.reposition = function(id, popupPos) {
		if (id[0] == '#') {
			id = id.replace('#', '');
		}
		var popupInstance = $('#' + id).data("dvcPopup");
		if (popupInstance) {
			return popupInstance.reposition(popupPos);
		}
	};
	$.davinci.popup.adjustPopupPos = function($el, popupWidth, popupHeight, popupType) {
		var ARROW_HEIGHT = 16,
			ARROW_WIDTH = 30,
			POPUP_LEFT_MIN = 10;
		var pos = {
			left: 0,
			top: 0
		};
		var el = $el[0];
		var buttonWidth = el.clientWidth,
			buttonHeight = el.offsetHeight;
		var buttonBorderLeftWidth = parseInt($el.css("border-left-width"));
		while (el) {
			pos.left += el.offsetLeft;
			pos.top += el.offsetTop;
			el = el.offsetParent;
		}
		pos.left = (pos.left + (buttonWidth + buttonBorderLeftWidth) / 2) - (popupWidth / 2);
		var anchorPos = 0;
		if (popupType == "top") {
			pos.top += (buttonHeight + ARROW_HEIGHT);
			anchorPos = (popupWidth - ARROW_WIDTH) / 2;
		}
		else { // bottom
			pos.top -= (popupHeight + buttonHeight);
			anchorPos = (popupWidth - ARROW_WIDTH) / 2;
		}
		// Popup이 화면 바깥으로 나갈 경우 보정한다.
		if (pos.left < POPUP_LEFT_MIN) {
			anchorPos -= (POPUP_LEFT_MIN - pos.left);
			pos.left = POPUP_LEFT_MIN;
		}
		return {
			left: pos.left,
			top: pos.top,
			width: popupWidth,
			height: popupHeight,
			anchorPos: anchorPos,
			type: popupType
		};
	};
	////////////////////////////////////////////////////////////////
	$.widget("davinci.dvcPopup", $.davinci.dvcPagebox, {
		options: {
			modal: false,
			transition: "pop",
			overlay: 0,
			onbeforeshow: undefined,
			onshow: undefined,
			onbeforehide: undefined,
			onhide: undefined
		},
		classes: {
			CLS_WIDGET: "dvc-popup",
			CLS_POPUP_OVERLAY: "dvc-popup-overlay",
			CLS_POPUP_ANCHOR: "dvc-popup-anchor",
			CLS_POPUP_ANCHOR_LEFT: "dvc-popup-anchor-left",
			CLS_POPUP_ANCHOR_TOP: "dvc-popup-anchor-top",
			CLS_POPUP_ANCHOR_RIGHT: "dvc-popup-anchor-right",
			CLS_POPUP_ANCHOR_BOTTOM: "dvc-popup-anchor-bottom"
		},
		_create: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// if not, try to find closest theme container	
			if (!o.theme) {
				o.theme = $.davinci.getInheritedTheme($el, "a");
			}
			cls.CLS_THEME = cls.CLS_WIDGET + "-" + o.theme;
			$el.addClass(cls.CLS_WIDGET + ' ' + cls.CLS_THEME);
			self.pageContainer = $("<div class='" + cls.CLS_PAGEBOX_ITEM + "'></div>");
			self.anchor = $("<div class='" + cls.CLS_POPUP_ANCHOR + "'></div>");
			$el.append(self.pageContainer);
			$el.append(self.anchor);
			self._isShown = false;
		},
		isShown: function() {
			return this._isShown;
		},
		reposition: function(PopupPos) {
			var $el = this.element,
				self = this,
				o = this.options;
			if (o.anchor && o.anchor.pos) {
				if (PopupPos.anchorPos < 0) {
					PopupPos.anchorPos = 0;
				}
				o.anchor.pos = PopupPos.anchorPos;
				switch (o.anchor.type) {
				case "left":
					self.anchor.css("bottom", o.anchor.pos);
					break;
				case "top":
					self.anchor.css("left", o.anchor.pos);
					break;
				case "right":
					self.anchor.css("top", o.anchor.pos);
					break;
				case "bottom":
					self.anchor.css("right", o.anchor.pos);
					break;
				}
			}
			$el.css({
				"left": PopupPos.left,
				"top": PopupPos.top,
				"width": PopupPos.width,
				"height": PopupPos.height
			});
		},
		open: function(options) {
			var $el = this.element,
				self = this,
				cls = this.classes;
			var o = $.extend(this.options, options, true);
			if (!o.pageId) {
				// 보여줄 page가 없음.
				return;
			}
			if (self._isShown) {
				return;
			}
			// options.pageId를 open시 표시한다.
			if (o.pageId[0] == '#') {
				o.pageId.replace('#', '');
			}
			var $page = $("#" + o.pageId);
			if ($page.length == 0) {
				//해당 page가 없다.
				return;
			}
			$.davinci.popup.zIndex += 2;
			if (o.css) {
				$el.css(o.css);
			}
			self.anchor.removeClass(cls.CLS_POPUP_ANCHOR_LEFT + ' ' + cls.CLS_POPUP_ANCHOR_TOP + ' ' + cls.CLS_POPUP_ANCHOR_RIGHT + ' ' + cls.CLS_POPUP_ANCHOR_BOTTOM);
			if (o.anchor && o.anchor.type) {
				if (o.anchor.pos < 0) {
					o.anchor.pos = 0;
				}
				switch (o.anchor.type) {
				case "left":
					self.anchor.addClass(cls.CLS_POPUP_ANCHOR_LEFT);
					self.anchor.css("bottom", o.anchor.pos);
					break;
				case "top":
					self.anchor.addClass(cls.CLS_POPUP_ANCHOR_TOP);
					self.anchor.css("left", o.anchor.pos);
					break;
				case "right":
					self.anchor.addClass(cls.CLS_POPUP_ANCHOR_RIGHT);
					self.anchor.css("top", o.anchor.pos);
					break;
				case "bottom":
					self.anchor.addClass(cls.CLS_POPUP_ANCHOR_BOTTOM);
					self.anchor.css("right", o.anchor.pos);
					break;
				}
			}
			var pageId = $page[0].id;
			if (!o.overlay) {
				o.overlay = 0;
			}
			var obj = $('<div></div>').css({
				height: '100%',
				width: '100%',
				position: 'absolute',
				left: 0,
				top: 0,
				'z-index': $.davinci.popup.zIndex - 1,
				opacity: o.overlay / 100
			});
			$el.css('z-index', $.davinci.popup.zIndex);
			if (o.modal) {
				obj.css('cursor', 'wait');
			}
			else if (o.overlay > 0) {
				// 바탕화면을 찍으면 종료되도록 event를 bind해둔다.
				obj.bind("vclick", function(e) {
					self.close();
				});
			}
			else {
				obj = false;
			}
			self.obj = (obj) ? obj.addClass(cls.CLS_POPUP_OVERLAY).prependTo('body') : false;
			// $page를 append할때 이전에 pageBox내에 있었으면..
			var fromView;
			var $fromView = $page.closest(".dvc-pagebox");
			if ($fromView.length) {
				fromView = $fromView.data("dvcPagebox");
			}
			var fromIsActive = $page.hasClass(self.activePageClass);
			self.pageContainer.append($page);
			if (fromView) {
				var fromPages = $fromView.find(":jqmData(role='page')");
				if (fromPages.length) {
					if (fromIsActive) {
						var firstPage = fromPages.first();
						firstPage.addClass(self.activePageClass);
						fromView.activePage = firstPage;
					}
				} else {
					fromView._createEmptyPage();
				}
			}
			$page.addClass(cls.CLS_PAGEBOX_ACTIVEPAGE);
			self._enhancePage($page);
			self.activePage = $page;
			if (o.onbeforeshow) {
				o.onbeforeshow();
			}
			$._fnFindActivePagesInPagebox($page).each(function() {
				$._fnSubpageEventGenerate(this, "ev_pagebeforeshow");
			});
			var pageInstance = $page.data("page");
			$page._pageTrigger("ev_pagebeforeshow", [pageInstance]);
			// show
			$el.show();
			var _fnShow = function() {
				$._fnFindActivePagesInPagebox($page).each(function() {
					$._fnSubpageEventGenerate(this, "ev_pageshow");
				});
				$page._pageTrigger("ev_pageshow", [pageInstance]);
				if (o.onshow) {
					o.onshow();
				}
			};
			self._isShown = true;
			if (o.transition != "none") {
				$el.addClass(o.transition + " in").animationComplete(function() {
					_fnShow();
				});
			}
			else {
				_fnShow();
			}
		},
		close: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			if (self._isShown == false) {
				return;
			}
			if (o.onbeforehide) {
				o.onbeforehide();
			}
			var $page = self.pageContainer.find(">." + cls.CLS_PAGEBOX_ACTIVEPAGE);
			// 하위의 subpage위젯의 _onhide를 호출한다.
			$._fnFindActivePagesInPagebox($page).each(function() {
				$._fnSubpageEventGenerate(this, "ev_pagebeforehide");
			});
			var pageInstance = $page.data("page");
			$page._pageTrigger("ev_pagebeforehide", [pageInstance]);
			var _fnHide = function() {
				if (o.transition != "none") {
					$el.removeClass("out in reverse " + o.transition);
				}
				if (self.obj) {
					self.obj.remove();
				}
				$el.hide();
				$page.removeClass(cls.CLS_PAGEBOX_ACTIVEPAGE);
				// 하위의 subpage위젯의 _onhide를 호출한다.
				$._fnFindActivePagesInPagebox($page).each(function() {
					$._fnSubpageEventGenerate(this, "ev_pagehide");
				});
				$page._pageTrigger("ev_pagehide", [pageInstance]);
				$.davinci.popup.zIndex -= 2;
				if (o.onhide) {
					o.onhide();
				}
			};
			self._isShown = false;
			if (o.transition != "none") {
				$el.removeClass("in").addClass(o.transition + " out reverse").animationComplete(function() {
					_fnHide();
				});
			}
			else {
				_fnHide();
			}
		}
	});
})(jQuery);
(function($, undefined) {
	/**
	 * dvcDataSource Widget
	 * @class dvcDataSource
	 */
	$.widget("davinci.dvcDataSource", $.davinci.dvcBase, {
		options: {
			bindonload: false,
			autobind: true,
			proxy: "ajax",
			// ajax(default), jsonp, localstorage, sessionstorage
			sourcetype: "json",
			// json, xml
			url: "",
			method: "GET",
			// GET , POST
			query: "",
			timeout: 2000,
			key: "",
			action: "",
			value: "",
			schedule: 0,
			eventNames: ["ev_load", "ev_error", "ev_store", "ev_apply", "ev_complete"]
		},
		classes: {
			CLS_WIDGET: "dvc-datasource"
		},
		/**
		 * Binding 데이터에 대한 Json Object를 set/get 한다.
		 */
		data: function(jsonObjParam) {
			if (arguments.length === 0) {
				return this.jsonObject;
			}
			else {
				this.jsonObject = jsonObjParam;
			}
			return this;
		},
		apply: function() {
			var $el = this.element;
			// cwdoh; call applyBinding automatically.
			if (typeof ko !== "undefined") {
				var bindingObject = {};
				bindingObject[this._widgetId] = this.jsonObject;
				try {
					ko.applyBindings(bindingObject, this.element[0].parentNode);
				}
				catch (e) {
					this._error({
						code: 1001,
						name: "DataBindingError",
						message: "Knockout.js applybindings run error."
					});
				}
			}
			$el.trigger("ev_complete", this);
			return this;
		},
		_create: function() {
			var $el = this.element,
				self = this,
				o = this.options,
				cls = this.classes;
			// option을 get/set function을 만들어 준다.
			for (var option in o) {
				(function() {
					var opt = option;
					self[opt] = function(v) {
						if (arguments.length === 0) {
							return o[opt];
						}
						else {
							o[opt] = v;
							return self;
						}
					};
				})();
			}
			// cwdoh; store id. (temporary. this code will be changed to Widget method)
			self._widgetId = this.element[0].id;
			if (o.bindonload) {
				setTimeout(function() {
					self.load();
				}, 1);
			}
			self.element.addClass(cls.CLS_WIDGET);
		},
		_success: function(recvData) {
			var opt = this.options,
				$el = this.element;
			if (opt.sourcetype === 'xml') { // ajax dataType
				try {
					recvData = $.xml2json(recvData);
				}
				catch (e) {
					this._error({
						code: 1002,
						name: "XmlParsingError",
						message: "Xml2JSON Parsing Error."
					});
				}
			}
			if (recvData == null || recvData === "") {
				this._error({
					code: 1003,
					name: "NullData",
					message: "Received Data is empty."
				});
			}
			this.data(recvData);
			var result = $el.triggerHandler("ev_load", this);
			// data() 를 이용해서 수정하거나, event에 따른 저장여부를 확인하여 data() 함수를 수행.
			if (result !== undefined && !result) {
				return;
			}
			this.data(this.jsonObject);
			if (!opt.autobind) {
				return;
			}
			var isApply = $el.triggerHandler("ev_apply", this);
			if (isApply || isApply === undefined) {
				this.apply();
			}
		},
		_error: function(error) {
			var $el = this.element;
			var returnObj = {
				datasource: this,
				error: error
			};
			$el.trigger("ev_error", returnObj);
		},
		load: function() {
			this._run();
			return this;
		},
		store: function() {
			var opt = this.options;
			if (this._isStorage()) {
				this._storage();
			}
			else {
				this.data(opt.value);
			}
			return this;
		},
		_run: function() {
			var opt = this.options,
				self = this;
			if (opt.schedule === 0 && self._runSchedule !== undefined) {
				// Stop Schedule !
				clearInterval(self._runSchedule);
				self._runSchedule = undefined;
				return;
			}
			if (this._isStorage() && opt.key !== undefined) { // Proxy type is Web Storage
				this._storage();
				if (opt.schedule && self._runSchedule === undefined) {
					this._startSchedule();
				}
			}
			else if (this._isAjax() && opt.url !== undefined && opt.sourcetype !== undefined) {
				this._request();
				if (opt.schedule && self._runSchedule === undefined) {
					this._startSchedule();
				}
			}
			else {
				this._error({
					code: 1000,
					name: "DataSourceOptionError",
					message: "DataSource properties is not defined."
				});
			}
		},
		_request: function() {
			var opt = this.options,
				self = this;
			if (opt.url !== undefined) {
				$.ajax({
					type: opt.method || 'GET',
					url: opt.url,
					data: opt.query || {},
					dataType: opt.proxy === 'jsonp' ? "jsonp" : opt.sourcetype,
					timeout: opt.timeout,
					success: function(recvData) {
						self._success(recvData);
					},
					error: function(xhr, ajaxOptions, thrownError) {
						self._error({
							code: 1004,
							name: "ResponseError",
							message: "jQuery Ajax Response Error.",
							xhr: xhr,
							ajaxOptions: ajaxOptions,
							thrownError: thrownError
						});
					}
				});
			}
		},
		_storage: function() {
			var opt = this.options,
				$el = this.element;
			if (!this._setStorage()) {
				this._error({
					code: 1005,
					name: "StorageNotSupport",
					message: opt.proxy + " is not support."
				});
			}
			else {
				try {
					if (opt.action === 'load') {
						this._success(this.webStorage[opt.key]);
					}
					else if (opt.action === 'store') {
						if (opt.key === undefined || opt.value === undefined) {
							this._error({
								code: 1006,
								name: "StoreError",
								message: "Key value undefined or Data value undefined."
							});
						}
						else {
							this.webStorage.setItem(opt.key, JSON.stringify(opt.value));
							// storage에 저장 후 data에 저장하고 datasource 객체를 이벤트 trigger 시킨다.
							this.data(JSON.parse(this.webStorage[opt.key]));
							$el.trigger("ev_store", this);
						}
					}
				}
				catch (e) {
					this._error({
						code: 1007,
						name: "WebStorageException",
						message: e.name + " , " + e.message
					});
				}
			}
		},
		_setStorage: function() {
			var opt = this.options;
			if (('localStorage' in window && window['localStorage'] !== null) && ('sessionStorage' in window && window['sessionStorage'] !== null)) {
				if (opt.proxy === 'localStorage') {
					this.webStorage = window.localStorage;
				}
				else if (opt.proxy === 'sessionStorage') {
					this.webStorage = window.sessionStorage;
				}
				return true;
			}
			else {
				return false;
			}
		},
		_startSchedule: function() {
			var opt = this.options,
				self = this;
			self._runSchedule = setInterval(function() {
				self._run();
			}, opt.schedule);
		},
		_isStorage: function() {
			return this.options.proxy === 'localStorage' || this.options.proxy === 'sessionStorage';
		},
		_isAjax: function() {
			return this.options.proxy === 'ajax' || this.options.proxy === 'jsonp';
		}
	});
})(jQuery);
// DaVinci Data Binding Module
//
// Author : Changwook Doh - changwook.doh@gmail.com
// Version : 0.5
//
// this module combines DaVinci UI with Knockout JavaScript library.
//
// DaVinci - http://www.davincisdk.com
// Incross CO.LTD. - http://www.incross.com
//
// CAUTION :
//	this code should be loaded after knockout.js.
//	so, insert this script after knockout.js include.
//
// This module is tested with ...
//	Knockout JavaScript library v2.1.0rc2
//	(c) Steven Sanderson - http://knockoutjs.com/
//	License: MIT (http://www.opensource.org/licenses/mit-license.php)
//
(function($, undefined) {
	var DataBindings = function() {
		var thiz = this;
		var waitQueue = [];
		var getWidgetInstance = function(element) {
			var widget = null,
				role = $(element).jqmData('role');
			if (role) {
				widget = $(element).data(role);
			}
			return widget;
		};
		var isKoInitialized = function() {
			// cwdoh: need to implement
			if (typeof ko !== "undefined" && ko.bindingHandlers) return true;
			return false;
		};
		var addBindingHandlerInternal = function(binding, handler) {
			waitQueue.push(arguments);
			if (!waitQueue.timer) {
				waitQueue.timer = setTimeout(addBindingsFromWaitQueue, 10);
			}
		};
		var addBindingsFromWaitQueue = function() {
			if (!isKoInitialized()) return;
			waitQueue.timer = undefined;
			// change addBindingHandler function
			// this function makes call-chain for DaVinci binding and for old binding, also.
			addBindingHandlerInternal = function(binding, handler) {
				var newHandler, oldHandler;
				var chainBindingHandler = function(element) {
					var params = Array.prototype.slice.call(arguments);
					var funkName = params.pop();
					if (!element) {
						console.error("element is undefined or null");
						return;
					}
					// try to get widget instance
					var widget = getWidgetInstance(element);
					// if widget exists...
					if (widget && funkName in newHandler) {
						// replace 1st arg(element) to widget
						params[0] = widget;
						newHandler[funkName].apply(null, params);
						return;
					}
					// if element isn't widget and binding will be executed by old handler.
					else if (oldHandler && funkName in oldHandler) {
						oldHandler[funkName].apply(null, params);
					}
				};
				// after complete KO initialization.
				//	add handler directly.
				ko.bindingHandlers[binding] = new(function(nH, oH) {
					this.init = function() {
						var params = Array.prototype.slice.call(arguments);
						params.push("init");
						newHandler = nH;
						oldHandler = oH;
						chainBindingHandler.apply(null, params);
					};
					this.update = function() {
						var params = Array.prototype.slice.call(arguments);
						params.push("update");
						newHandler = nH;
						oldHandler = oH;
						chainBindingHandler.apply(null, params);
					};
				})(handler, ko.bindingHandlers[binding]);
			};
			// initialize bindings from wait-queue
			while (waitQueue.length > 0) {
				addBindingHandlerInternal.apply(null, waitQueue.shift());
			}
			// cwdoh; to ignore unmatched binding exception.
			(function() {
				ko.bindingProvider.prototype._parseBindingsString = ko.bindingProvider.prototype.parseBindingsString;
				ko.bindingProvider.prototype.parseBindingsString = function(bindingsString, bindingContext) {
					try {
						return this._parseBindingsString(bindingsString, bindingContext);
					}
					catch (e) {
						//console.warn( e.message );
					}
				};
			})();
		};
		thiz.add = function(binding, handler) {
			addBindingHandlerInternal(binding, handler);
		};
		thiz.has = function(object, funk) {
			if (typeof object != undefined) {
				if (funk in object) return true;
			}
			return false;
		};
		// cwdoh; this function returns json array that is generate from source json data with item-design
		// so, this function will be only adoptable to dvcListitem, ...
		thiz.createJsonFromDesign = function(element, data) {
			if (typeof data === "undefined") return;
			// get root node of item design
			//<div class="dvc-listitem-item-design dvc-listitem-item-indexable-design" ...>
			var $root = $(element).find('.dvc-listitem-item-design');
			var items = [];
			var structure;
			// cwdoh; need to optimize code, that generate json from sub-dom-tree(item-design)
			// but, i think that work will make a little bit faster than below code now.
			for (var index = 0; index < data.length; index++) {
				structure = {};
				// generate a array of items with 'item-design' tree.
				// support nested component
				source = data[index];
				for (key in source) {
					$root.find("div:jqmData(role^='dvc')").each(function() {
						var role = $(this).jqmData('role');
						if (role) {
							var $this = $(this);
							var field = $this.attr("data-field");
							if (field) {
								// cwdoh; extract field to components by '.'
								// cwdoh: supports computed field
								try {
									with(data[index]) {
										result = eval(field);
									}
								}
								catch (e) {
									console.warn("dvcDataBinding caught unmatched field : " + field);
								}
								if (data) {
									structure[$this.attr("subid")] = result;
								}
							}
						}
					});
				}
				// cwdoh; set source to userdata. further work - designable userdata on Authoring Tool.
				structure.userData = source;
				items.push(structure);
			}
			// return json data for apply
			return items;
		};
	};
	//----------------------------------------------------------------------------------------
	var dataBindings = new DataBindings();
	$.davinci.dataBindings = dataBindings;
	//----------------------------------------------------
	// DaVinci Default Bindings...
	//----------------------------------------------------
	// cwdoh; common bindings for dvcWidget
	dataBindings.add("enable", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			widget.enable(value);
		}
	});
	dataBindings.add("visible", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			widget.visible(value);
		}
	});
	// cwdoh; 'log', "warn", "error" binding for debugging log.
	dataBindings.add("log", {
		update: function(widget, valueAccessor) {
			console.log(ko.utils.unwrapObservable(valueAccessor()));
		}
	});
	dataBindings.add("warn", {
		update: function(widget, valueAccessor) {
			console.warn(ko.utils.unwrapObservable(valueAccessor()));
		}
	});
	dataBindings.add("error", {
		update: function(widget, valueAccessor) {
			console.error(ko.utils.unwrapObservable(valueAccessor()));
		}
	});
	// cwdoh; 'javascript' binding for just call a javascript function and javascript code
	dataBindings.add("javascript", {
		update: function(widget, valueAccessor) {
			var script = ko.utils.unwrapObservable(valueAccessor());
			switch (typeof(script)) {
			case "function":
				script.call();
				break;
			case "string":
				eval(script);
				break;
			}
		}
	});
	// cwdoh; 'text' binding for
	// 	dvcButton, dvcCheckbox, dvcImageButton, dvcLabel, dvcRadioButton, dvcTextArea, dvcTextField
	//	issue : dvcHtmlView????
	dataBindings.add("text", {
		update: function(widget, valueAccessor) {
			if (dataBindings.has(widget, "text")) {
				var value = ko.utils.unwrapObservable(valueAccessor());
				widget.text(value);
			}
		}
	});
	// cwdoh; 'check' binding for
	// 	dvcCheckbox, dvcRadioButton, dvcLayoutview
	dataBindings.add("checked", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			widget.checked(value);
		}
	});
	// cwdoh; 'toggle' binding for
	// 	dvcCheckbox
	dataBindings.add("toggle", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			if (value) widget.toggle();
		}
	});
	// cwdoh; 'source' binding for dvcImage
	dataBindings.add("src", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			if (value) widget.src(value);
		}
	});
	// cwdoh; 'imagetype' binding for
	// 	dvcImage
	dataBindings.add("type", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			if (value) widget.type(value);
		}
	});
	// cwdoh; 'refresh' binding for
	// 	dvcGrid
	dataBindings.add("refresh", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			if (value) widget.refresh();
		}
	});
	// cwdoh; 'textalign' binding for
	// 	dvcLabel
	dataBindings.add("textalign", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			if (value) widget.textAlign(value);
		}
	});
	// cwdoh; 'minimum' binding for
	// 	dvcSlider
	dataBindings.add("min", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			if (value) widget.min(value);
		}
	});
	// cwdoh; 'maximum' binding for
	// 	dvcSlider
	dataBindings.add("max", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			if (value) widget.max(value);
		}
	});
	// cwdoh; 'value' binding for
	// 	dvcProgress, dvcSlider
	dataBindings.add("value", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			if (value) widget.value(value);
		}
	});
	// cwdoh; 'focus' binding for
	// 	dvcTextfield
	dataBindings.add("focus", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			if (value) widget.focus();
		}
	});
	// cwdoh; 'play', 'pause' binding for
	// 	dvcAudio, dvcVideo
	dataBindings.add("play", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			if (value) widget.play();
		}
	});
	// cwdoh; 'play', 'pause' binding for
	// 	dvcAudio
	dataBindings.add("pause", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			if (value) widget.pause();
		}
	});
	// cwdoh; 'clear' binding for
	// 	dvcHtmlview
	dataBindings.add("clear", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			if (value) widget.clear();
		}
	});
	// TODO : append & prepend 두 bind 메서드에 대해서 추후에 통합이 되어야 한다.
	// cwdoh; 'additems', 'setitems', 'removeallitems' binding for
	// 	dvcListitem
	dataBindings.add("append", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			var items = dataBindings.createJsonFromDesign(widget.element, value);
			if (items) widget.add(items);
		}
	});
	dataBindings.add("prepend", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			var items = dataBindings.createJsonFromDesign(widget.element, value);
			if (items) {
				if (widget.widgetName == "dvcListitem") {
					var oldListitemHeight = widget.element.outerHeight();
					widget.add(items, 0);
					var addHeight = widget.element.outerHeight() - oldListitemHeight;
					widget.scrollview.scrollTo(0, -addHeight);
				}
			}
		}
	});
	dataBindings.add("items", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			var items = dataBindings.createJsonFromDesign(widget.element, value);
			if (items) widget.items(items);
		}
	});
	dataBindings.add("load", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			if (value) widget.load();
		}
	});
/*dataBindings.add("interval", {
	update: function(widget, valueAccessor) {
		var value = ko.utils.unwrapObservable(valueAccessor());
		if (value) widget.load();
	}
});*/
	dataBindings.add("query", {
		update: function(widget, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			widget.query(value);
		}
	});
/*
dataBindings.add("scrollto", {
	update: function(widget, valueAccessor) {
		var value = ko.utils.unwrapObservable(valueAccessor());
		widget.scrollTo(value);
	}
});*/
})(jQuery);
(function($, undefined) {
	// page관련 event를 trigger한다.
	// page는 id가 없으면 trigger하지 않는다.
	$.fn._pageTrigger = function(evtName, params) {
		if (this[0].id) {
			this.trigger(evtName, params);
		}
	};
	$.fn._eventRegs = function(evtNames) {
		var self = this;
		var eventReg = function(evtname) {
			var splt = evtname.split("_");
			if (splt.length != 2) {
				return;
			}
			var evt_attName = splt[0] + "-on" + splt[1];
			var evtfunction = self.attr(evt_attName);
			if (evtfunction) {
				var splt = evtfunction.split(".");
				if (splt.length == 1) {
					if (typeof window[evtfunction] == "function") {
						self.live(evtname, function(e, obj, param1, param2, param3) {
							var ret = window[evtfunction](e, obj, param1, param2, param3);
							// DataBinding에서 apply 이벤트 후에 사용자의 리턴 값을 받기 위해 추가.
							if (evtname === "ev_load" || evtname === "ev_apply") {
								return ret;
							}
							return false; // event bubbling이 되지 않도록 차단함.
						});
					}
					else {
						console.log(evtfunction + " function not found.");
					}
				}
				else {
					// namespace로 분리되어 있는 function을 호출할 경우 처리
					var thiz = window;
					for (var i = 0; i < splt.length - 1; i++) {
						thiz = thiz[splt[i]];
						if (!thiz) {
							return;
						}
					}
					var fn = thiz[splt[i]];
					if (typeof fn == "function") {
						self.live(evtname, function(e, obj, param1, param2, param3) {
							thiz[splt[i]].call(thiz, e, obj, param1, param2, param3);
							return false; // event bubbling이 되지 않도록 차단함.
						});
					}
					else {
						console.log(evtfunction + " function not found.");
					}
				}
			}
			else {
				// page이벤트 + ev_orientationchange + ev_back 일 경우 bubble up 되지 않도록 추가.
				if (/ev_page\w+/.test(evtname) || evtname == "ev_orientationchange" || evtname == "ev_back") {
					self.live(evtname, function(e, obj, param1, param2, param3) {
						return false;
					});
				}
			}
		};
		var len = evtNames.length;
		for (var i = 0; i < len; i++) {
			eventReg(evtNames[i]);
		}
	};
	$._fnFindActivePagesInPagebox = function($page) {
		var id = $page[0].id;
		return $page.find(".dvc-pagebox-activepage").filter(function() {
			var $childPage = $(this);
			var $closetPage = $childPage.parent().closest(".ui-page");
			if ($closetPage[0].id == id) {
				if ($childPage.parent().parent().hasClass("dvc-pagebox")) {
					return true;
				}
			}
			return false;
		});
	};
	$._fnSubpageEventGenerate = function(thiz, evtname) {
		var $page = $(thiz);
		var pageid = thiz.id;
		// 이 page가 instance가 생성된 것인지를 확인하여 생성되지 않았으면 skip
		var pageInstance = $page.data("page");
		if (!pageInstance) return;
		if (evtname == "ev_orientationchange") {
			var mode = $.event.special.orientationchange.orientation();
			$page._pageTrigger(evtname, [pageInstance, mode]);
		}
		else {
			$page._pageTrigger(evtname, [pageInstance]);
		}
		$._fnFindActivePagesInPagebox($page).each(function() {
			$._fnSubpageEventGenerate(this, evtname);
		});
	};
	$._fnPageInitialize = function($page) {
		// item의 하위에 type이 dvc로 시작하는 것을 모두 찾아서 new instance한다.
		$page.find("div:jqmData(role^='dvc')").filter(function() {
			//상위에 listitem가 있으면.. false;
			return true;
		}).each(function() {
			var self = this,
				$this = $(this);
			var role = $this.jqmData('role');
			var id = this.id;
			if (!id) {
				id = $this.attr("subid");
			}
			if (role) {
				if ($this.data(role)) {
					//console.log("duplicate skip role = " + role + ", id = " + id);
					return true;
				}
				//console.log("role = " + role + ", id = " + id);
				$this[role]();
			}
		});
		var eventNames = ['ev_pageinit', 'ev_pagebeforehide', 'ev_pagehide', 'ev_pagebeforeshow', 'ev_pageshow', 'ev_orientationchange', 'ev_back'];
		if ($page[0].id) {
			$page._eventRegs(eventNames);
		}
	};
	// jQuery Mobile의 pageContainer가 생성될 때가 실제 entry point
	$(window).one("pagecontainercreate", function() {
		var deviceType = $.davinci.getDeviceType();
		var osName = $.davinci.getOSName();
		var $body = $("body");
		switch (deviceType) {
		case "Desktop":
			$body.addClass("dvc-desktop");
			break;
		case "Tablet":
			$body.addClass("dvc-tablet");
			break;
		case "Phone":
			$body.addClass("dvc-phone");
			break;
		}
		switch (osName) {
		case "Android":
			$body.addClass("dvc-android");
			break;
		case "iOS":
			$body.addClass("dvc-ios");
			break;
		}
	});
	$(".ui-page").live("pageinit", function() {
		var $page = $(this);
		var pageid = this.id;
		$._fnPageInitialize($page);
		var pageInstance = $page.data("page");
		$page._pageTrigger("ev_pageinit", [pageInstance]);
		// 이벤트가 상위로 올라가는 것을 막는다.
		return false;
	});
	$(".ui-page").live("pagebeforeshow", function() {
		var $page = $(this);
		var pageid = this.id;
		$._fnFindActivePagesInPagebox($page).each(function() {
			$._fnSubpageEventGenerate(this, "ev_pagebeforeshow");
		});
		var pageInstance = $page.data("page");
		$page._pageTrigger("ev_pagebeforeshow", [pageInstance]);
		// 이벤트가 상위로 올라가는 것을 막는다.
		return false;
	});
	$(".ui-page").live("pageshow", function() {
		var $page = $(this);
		var pageid = this.id;
		$._fnFindActivePagesInPagebox($page).each(function() {
			$._fnSubpageEventGenerate(this, "ev_pageshow");
		});
		var pageInstance = $page.data("page");
		$page._pageTrigger("ev_pageshow", [pageInstance]);
		// 이벤트가 상위로 올라가는 것을 막는다.
		return false;
	});
	$(".ui-page").live("pagebeforehide", function() {
		var $page = $(this);
		var pageid = this.id;
		$._fnFindActivePagesInPagebox($page).each(function() {
			$._fnSubpageEventGenerate(this, "ev_pagebeforehide");
		});
		var pageInstance = $page.data("page");
		$page._pageTrigger("ev_pagebeforehide", [pageInstance]);
		// 이벤트가 상위로 올라가는 것을 막는다.
		return false;
	});
	$(".ui-page").live("pagehide", function() {
		var $page = $(this);
		var pageid = this.id;
		$._fnFindActivePagesInPagebox($page).each(function() {
			$._fnSubpageEventGenerate(this, "ev_pagehide");
		});
		var pageInstance = $page.data("page");
		$page._pageTrigger("ev_pagehide", [pageInstance]);
		// 이벤트가 상위로 올라가는 것을 막는다.
		return false;
	});
})(jQuery);