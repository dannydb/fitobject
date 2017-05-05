/**
 * @preserve fitobject - v0.1.1 - 2017-05-05
 * Fit an object to cover or be contained by its container.
 * https://github.com/dannydb/fitobject
 * Copyright (c) 2017 Danny DeBelius; Licensed MIT
 */

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }
}(function($) {

  /**
   * Given an object and its container, size and position the object to fit
   * the container based on the fit parameter according to the behavior of the
   * 'cover' and 'contain' values of the CSS background-size property.
   * @author: Danny DeBelius
   * @param  {Object} object    A jQuery-wrapped DOM element
   * @param  {Object} container A jQuery-wrapped DOM element
   * @param  {[type]} fit       The fit behavior - either 'cover' or 'contain'.
   */
	return function fitObject(object, container, fit) {
    var $object = $(object);
    var $container = $(container);
    var $objectWrapper = $container.find('.object-fit-wrapper');
    var containerRatio = $container.height() / $container.width();
    var objectRatio = $object.innerHeight() / $object.width();
    var shallowObject = objectRatio < containerRatio;
    var newCss = null;

    if (fit === 'cover' && shallowObject){
      newCss = {
        height: $container.height(),
        width: $container.height() / objectRatio,
        left: ($container.width() - $container.height() / objectRatio) / 2,
        top: 0
      }
    }

    if (fit === 'cover' && !shallowObject){
      newCss = {
        height: $container.width() * objectRatio,
        width: $container.width(),
        left: 0,
        top: ($container.height() - $container.width() * objectRatio) / 2
      }
    }

    if (fit === 'contain' && shallowObject){
      newCss = {
        height: $container.width() * objectRatio,
        width: $container.width(),
        left: 0,
        top: ($container.height() - $container.width() * objectRatio) / 2
      }
    }

    if (fit === 'contain' && !shallowObject){
      newCss = {
        height: $container.height(),
        width: $container.height() / objectRatio,
        left: ($container.width() - $container.height() / objectRatio) / 2,
        top: 0
      }
    }

    $.extend(newCss, {
      'position': 'absolute'
    })

    // Wrap the object in our positioning wrapper and apply the new size and
    // position CSS values.
    if ($objectWrapper.length < 1) {
      $objectWrapper = $('<div class="object-fit-wrapper"></div>');
      $objectWrapper.css(newCss);
      $object.wrap($objectWrapper);
    } else {
      $objectWrapper.css(newCss);
    }

    // Make sure object will be positioned relative to its container
    if ($container.css('position') === 'static') {
      $container.css('position', 'relative');
    }
	}

}));
