/**
 * @preserve fitobject - v0.2.3 - 2017-05-11
 * Fit an object to cover or be contained by its container.
 * https://github.com/dannydb/fitobject
 * Copyright (c) 2017 Danny DeBelius; Licensed MIT
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(['jquery'], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(require("jquery"));
  } else {
    root.fitObject = factory(root.jQuery);
  }
}(this, function($) {
  var $object = null;
  var $container = null;
  var $objectWrapper = null;
  var objectRatio = null;
  var containerRatio = null;
  var isShallowObject = null;
  var fullObjectHeight = null;
  var fullObjectWidth = null;
  var horizontalOffset = null;
  var verticalOffset = null;

  /**
   * Given an object and its container, size and position the object to fit
   * the container based on the fit parameter according to the behavior of the
   * 'cover' and 'contain' values of the CSS background-size property.
   * @author: Danny DeBelius
   * @param  {Object} object    A jQuery-wrapped DOM element
   * @param  {Object} container A jQuery-wrapped DOM element
   * @param  {String} fit       The fit behavior - either 'cover' or 'contain'.
   * @param  {Object} safeArea  Area to avoid cropping into (optional)
   */
	var fitObject = function (object, container, fit, safeArea) {
    var newCss = null;

    safeArea = safeArea || {
      'top': 0,
      'right': 0,
      'bottom': 0,
      'left': 0
    };

    $object = $(object);
    $container = $(container);
    $objectWrapper = $container.find('.object-fit-wrapper');

    objectRatio = $object.innerHeight() / $object.width();
    containerRatio = $container.height() / $container.width();
    isShallowObject = objectRatio < containerRatio;

    fullObjectHeight = $container.width() * objectRatio;
    fullObjectWidth = $container.height() / objectRatio;

    horizontalOffset = ($container.width() - fullObjectWidth) / 2;
    verticalOffset = ($container.height() - fullObjectHeight) / 2;

    if (fit === 'cover' && isShallowObject){
      newCss = {
        height: $container.height(),
        width: fullObjectWidth,
        left: handleCropBias(horizontalOffset, 'horizontal', safeArea),
        top: 0
      }
    }

    if (fit === 'cover' && !isShallowObject){
      newCss = {
        height: fullObjectHeight,
        width: $container.width(),
        left: 0,
        top: handleCropBias(verticalOffset, 'vertical', safeArea)
      }
    }

    if (fit === 'contain' && isShallowObject){
      newCss = {
        height: fullObjectHeight,
        width: $container.width(),
        left: 0,
        top: verticalOffset
      }
    }

    if (fit === 'contain' && !isShallowObject){
      newCss = {
        height: $container.height(),
        width: fullObjectWidth,
        left: horizontalOffset,
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

    // Make sure the container overflow is hidden
    if ($container.css('overflow') !== 'hidden') {
      $container.css('overflow', 'hidden');
    }
	}

  /**
   * Modify the offset to avoid cropping into a safe area
   * Adapted from NYT5-foundation's responsive-image.js
   * @param  {Number} offset    The original centering offset
   * @param  {String} direction Either 'vertical' or 'horizontal'
   * @param  {Object} safeArea  Area to avoid cropping into
   * @return {Number}           The modified offset
   */
  var handleCropBias = function (offset, direction, safeArea) {
    var verticalBias = (safeArea['bottom'] - safeArea['top']) / 100;
    var horizontalBias = (safeArea['right'] - safeArea['left']) / 100;
    var pixelsCropped = null;

    if (direction === 'horizontal') {
      pixelsCropped = fullObjectWidth - $container.width();
      offset += pixelsCropped * horizontalBias;
    }

    if (direction === 'vertical') {
      pixelsCropped = fullObjectHeight - $container.height();
      offset += pixelsCropped * verticalBias;
    }

    // Make sure the biased offset covers the top and left
    if (offset > 0) {
      offset = 0;
    }

    // Make sure the biased offset covers the right and bottom
    if (offset < -pixelsCropped) {
      offset = -pixelsCropped
    }

    return offset;
  };

  return fitObject;

}));
