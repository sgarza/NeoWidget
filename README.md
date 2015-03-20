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
  state : {
    title : 'Heading Title'
  }

  build : function() {
    return <div>
            <h2>{this.state.title}</h2>
          </div>
  }
});

Class('Button').inherits(NeoWidget)({
  prototype : {
    state : {
      title : 'Click Me!',
      count : 0
    },
    build : function() {
      return  <div>
                {new <Heading />.vDom}
                <button onclick={this.clickHandler.bind(this)}>{this.state.title}</button>
                <p>{'Clicks: ' + this.state.count}</p>
              </div>
    },

    clickHandler : function() {
      this.state.count++
      this.update(this.state);
    }
  }
});

var widget = new Button()
widget.render(document.body);
```
