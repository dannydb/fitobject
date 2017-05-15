/**
 * @preserve fitobject - v0.4.0 - 2017-05-11
 * Size and position an object to fit its container.
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

	var fitObject = function (params) {
    var $els = $(this);

    $els.each(function(index, el) {
      var $object = $(this);
      var $container = null;
      var $objectWrapper = null;
      var objectRatio = null;
      var containerRatio = null;
      var isShallowObject = null;
      var fullObject = {};
      var offset = {};
      var cropped = {};
      var newCss = null;

      var options = {
        container: null,
        fit: 'cover',
        safeArea: {
          'top': 0,
          'right': 0,
          'bottom': 0,
          'left': 0
        }
      }

      $objectWrapper = $object.parents('.fit-object-wrapper');

      if ($object.data('safe-area')) {
        options['safeArea'] = $object.data('safe-area');
      }

      if ($object.data('object-fit')) {
        options['fit'] = $object.data('fit');
      }

      if ($object.data('fit-container')) {
        options['container'] = $object.data('fit-container');
      }

      if (params) {
        options = $.extend(options, params);
      }

      if ($objectWrapper.length === 0 && options['container'] === null) {
        $container = $object.parent();
      } else if (options['container'] === null) {
        $container = $objectWrapper.parent();
      } else {
        $container = $(options['container']);
      }

      // Make sure the container has dimensions before starting calculations.
      $container.css({
        'display': 'block',
        'visibility': 'visible'
      });

      // Calculate object and container aspect ratios
      objectRatio = $object.innerHeight() / $object.width();
      containerRatio = $container.height() / $container.width();
      isShallowObject = objectRatio < containerRatio;

      // Calculate full object dimensions to be cropped
      fullObject['height'] = $container.width() * objectRatio;
      fullObject['width'] = $container.height() / objectRatio;

      // Calculate the pixels hidden by the cover fit crop
      cropped['x'] = fullObject['width'] - $container.width();
      cropped['y'] = fullObject['height'] - $container.height();

      // Calculate the centering offset
      offset['x'] = ($container.width() - fullObject['width']) / 2;
      offset['y'] = ($container.height() - fullObject['height']) / 2;

      // Cover image cropped horizontally
      if (options['fit'] === 'cover' && isShallowObject){
        newCss = {
          height: $container.height(),
          width: fullObject['width'],
          left: getSafeOffset('horizontal', offset['x'], cropped['x'], options),
          top: 0
        }
      }

      // Cover image cropped vertically
      if (options['fit'] === 'cover' && !isShallowObject){
        newCss = {
          height: fullObject['height'],
          width: $container.width(),
          left: 0,
          top: getSafeOffset('vertical', offset['y'], cropped['y'], options)
        }
      }

      // Contained image compressed horizontally
      if (options['fit'] === 'contain' && isShallowObject){
        newCss = {
          height: fullObject['height'],
          width: $container.width(),
          left: 0,
          top: offset['y']
        }
      }

      // Contained image compressed vertically
      if (options['fit'] === 'contain' && !isShallowObject){
        newCss = {
          height: $container.height(),
          width: fullObject['width'],
          left: offset['x'],
          top: 0
        }
      }

      // Remove the inline style applied before calculations.
      $container.attr('style', null);

      updatePosition($object, $objectWrapper, $container, newCss);
    })
	}

  /**
   * Apply the new position CSS to the object
   * @param  {Object} $object        The object
   * @param  {Object} $objectWrapper The object fit wrapper
   * @param  {Object} $container     The object's container
   * @param  {Object} newCss         The new object position styles
   */
  var updatePosition = function($object, $objectWrapper, $container, newCss) {
    $.extend(newCss, {
      'position': 'absolute'
    })

    // Wrap the object in our positioning wrapper and apply the new size and
    // position CSS values.
    if ($objectWrapper.length < 1) {
      $objectWrapper = $('<div class="fit-object-wrapper"></div>');
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
   * @param  {String} direction Either 'vertical' or 'horizontal'
   * @param  {Number} offset    The centering offset for the overflow dimension
   * @param  {Number} cropped   The pixels cropped on the overflow dimension
   * @param  {Object} options   The fitObject params
   * @return {Number}           The modified offset
   */
  var getSafeOffset = function (direction, offset, cropped, options) {
    var safeArea = options['safeArea'];
    var verticalBias = (safeArea['bottom'] - safeArea['top']) / 100;
    var horizontalBias = (safeArea['right'] - safeArea['left']) / 100;

    if (direction === 'horizontal') {
      offset += cropped * horizontalBias;
    }

    if (direction === 'vertical') {
      offset += cropped * verticalBias;
    }

    // Make sure the biased offset covers the top and left
    if (offset > 0) {
      offset = 0;
    }

    // Make sure the biased offset covers the right and bottom
    if (offset < -cropped) {
      offset = -cropped
    }

    return offset;
  };

  $.fn.fitObject = fitObject;

  // return fitObject;
}));
