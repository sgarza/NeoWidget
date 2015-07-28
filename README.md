# Virtual DOM based Widget for [Neon.js](http://azendal.github.io/neon/)

## Requirements

NeoWidget uses JSX to define DOM Trees, so you will need [jsx-transform-loader](https://www.npmjs.com/package/jsx-transform-loader) for webpack, [jsxtransformify](https://www.npmjs.com/package/jsxtransformify) for Browserify or something based on [jsx-transform](https://www.npmjs.com/package/jsx-transform) to preprocess JSX.

## Setup:

```
npm install -save neowidget
```

### Webpack Example

webpack.config.js
```js
{..., loader: 'jsx-transform-loader'}
```


### Browserify Example

```
npm install -save jsxtransformify

browserify -t jsxtransformify file.js -o output.js
```

### Usage Example

You need to specify the @docblock in the files where you use JSX: /** @jsx NeoWidget.h */

```js
/** @jsx NeoWidget.h */

var Heading = Class('Heading').inherits(NeoWidget)({
  data : {
    title : 'Heading Title'
  }

  template : function() {
    return <div>
            <h2>{this.data.title}</h2>
          </div>
  }
});

Class('Button').inherits(NeoWidget)({
  prototype : {
    data : {
      title : 'Click Me!',
      count : 0
    },
    template : function() {
      return  <div>
                {new <Heading />.virtualNode}
                <button onclick={this.clickHandler.bind(this)}>{this.data.title}</button>
                <p>{'Clicks: ' + this.data.count}</p>
              </div>
    },

    clickHandler : function() {
      this.data.count++
      this.update(this.data);
    }
  }
});

var widget = new Button()
widget.render(document.body);
```
