# fitobject

Size and position an object to fit its container.

[Codepen Example](http://codepen.io/dannydb/pen/Qvmrme)

## Install
```
npm install fitobject
```

## Usage

For simple cover fitting of an object to a container:

```html
<div class="container">
  <img class="object" src="http://placehold.it/400x300" />
</div>

<script>
  $('.object').fitObject();
</script>
```

You can size and position the object to be totally contained inside the container, as with the CSS property `background-size: contain`:

```js
$('.object').fitObject({
  'fit': 'contain'
});
```

### Cover fit safe area
Specify a `safeArea` parameter to define a region of the object to avoid cropping into when the object fit method is set to `'cover'`.

<img src="https://cloud.githubusercontent.com/assets/419297/25910766/8b30a470-357f-11e7-850e-d11e7889f4ed.png" width="400" />

```js
$('.object').fitObject({
  'safeArea': {
    'top': 25,   // 25% of the vertical dimension from the top
    'right': 0,  // 0% of the horizontal dimension from the right
    'bottom': 0, // 0% of the vertical dimension from the bottom
    'left': 50   // 50% of the horizontal dimension from the left
  }
});
```

### Non-immediate ancestor fit container
By default, `fitObject` will fit your object to its immediate parent, but can fit to ancestors further up the DOM tree by setting the `container` parameter:

```html
<div class="container-wrapper">
  <div class="container">
    <img class="object" src="http://placehold.it/400x300" />
  </div>
</div>

<script>
  $('.object').fitObject({
    'container': '.container-wrapper'
  });
</script>
```

### Object data attributes

Each of the `fitObject` parameters can be set via HTML data attributes on the object to fit:

```html
<div class="container">
  <img class="object" src="http://placehold.it/400x300"
    data-object-fit="cover"
    data-fit-container=".container"
    data-safe-area="{'top':0,'right':21.23,'bottom':0,'left':19.33}"
  />
</div>

<script>
  $('.object').fitObject();
</script>
```

Object data attributes will supercede parameters passed into the `fitObject` method.

## List of parameters

|Parameter | Data Attribute | Type | Default | Description |
|---|---|---|---|---|
| `container` | `fit-container` | String, DOM Node, jQuery DOM element | First parent not classed `.fit-object-wrapper` | The container to fit the object to |
| `fit` | `object-fit` | String | `'cover'` | The fit method – either `'cover'` or `'contain'` |
| `safeArea` | `safe-area` | Object | ` { 'top': 0, 'right': 0, 'bottom': 0, 'left': 0 }` | An area of the object to avoid cropping into. Specify a percentage of the X or Y dimension for each side. |
