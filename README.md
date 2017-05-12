# fitobject

Size and position an object to fit its container.

[Codepen Example](http://codepen.io/dannydb/pen/Qvmrme)

## Install
```
npm install fitobject
```

## Usage

To do a simple cover fit of an object to a container, call `fitObject` with two arguments:

- A selector or jQuery wrapped DOM element for the object.
- A selector or jQuery wrapped DOM element for the container.

```html
<div class="container">
  <img class="object" src="http://placehold.it/400x300" />
</div>

<script>
  fitObject('.object', '.container');
</script>
```

You can also size and position the object to be totally contained inside the container, as with the CSS property `background-size: contain`.

```js
fitObject('.object', '.container', {
  'fit': 'contain'
});

```

Finally, `fitObject` also accepts a `safeArea` parameter to define a region of the object to avoid cropping into when the object fit method is set to `'cover'`.

<img src="https://cloud.githubusercontent.com/assets/419297/25910766/8b30a470-357f-11e7-850e-d11e7889f4ed.png" width="400" />

```js
fitObject('.object', '.container', {
  'fit': 'cover',
  'safeArea': {
    'top': 25,   // 25% of the vertical dimension from the top
    'right': 0,  // 0% of the horizontal dimension from the right
    'bottom': 0, // 0% of the vertical dimension from the bottom
    'left': 50   // 50% of the horizontal dimension from the left
  }
});
```
