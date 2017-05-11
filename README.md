# fitobject

Given an object and its container, size and position the object to fit the container based on the fit parameter according to the behavior of the 'cover' and 'contain' values of the CSS background-size property.

[Codepen Example](http://codepen.io/dannydb/pen/Qvmrme)

## Install
```
npm install fitobject
```

## Usage

```html
<div class="container">
  <img class="object" src="http://placehold.it/400x300" />
</div>

<script>
  var fitObject = require('fitobject');
  fitObject('.object', '.container', 'cover');
</script>
```

The third argument specifies how the object should be fit to its container. Specify either `'cover'` or `'contain'`.

The `fitObject` function also accepts a "safe area" as a fourth, optional argument an object. When the object fit method is set to `'cover'`, the safe area can define a region of the object to avoid cropping into.

<img src="https://cloud.githubusercontent.com/assets/419297/25910766/8b30a470-357f-11e7-850e-d11e7889f4ed.png" width="400" />

Here is the above example again with a safe area defined:

```js
var safeArea = {
  'top': 25,   // 25% of the vertical dimension from the top
  'right': 0,  // 0% of the horizontal dimension from the right
  'bottom': 0, // 0% of the vertical dimension from the bottom
  'left': 50   // 50% of the horizontal dimension from the left
}

fitObject('.object', '.container', 'cover', safeArea);
```
