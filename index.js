/** @jsx h */

require('neon');
require('neon/stdlib');

var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

/**
Features of the widget system
* A custom and easy to handle event binding, dispatching and manipulation, with some sort of bubbling support
* A module system which we can use to include specific behaviour to any widget and reuse the code where needed
* A tree structure support for the widgets that the event system could bubble, and that also serves as
* A navigation system.
* The widgets must be able to be grouped to form more complex widgets
* Remove the complexity of DOM manipulation and handling
* A way to wrap widgets at our convenience to reuse widgets avaliable and make them comly to our needs
without the need to hack those widgets, that would force us to maintain the new versions of those widgets
and that is a very complex task when widgets become so complex.
* A widget system that would allow us to start wrapping some widgets for a fast start and later code our own widgets
at will.
* expose a consistent API that allow us to choose the use of widgets by API calls and user interaction at will and with the same
clearance and capacity
* an easy way to allow subclasing widgets
* an easy way to provide new html, class, and css for a specific instance of a widget that would remove us the need
to create complex inheritance structures that are hard to maintain.

Usage Example.

The most basic usage of a widget is to simply create an instance and render it at a target element
in this case body

var myWidgetInstance = new NeoWidget();
myWidgetInstance.render(document.body);

like this widget does renders does not display anything so lets give it something to display first

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

var myWidgetInstance = new Heading();
myWidgetInstance.render(document.body);

Now to update the widget state:

myWidgetInstance.update({title : 'Some other Heading Title'});

Now with compositon:

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

NeoWidget uses a paradigm much like ReactJS but with a much simpler API


@class NeoWidget
@namespace undefined
@inlcudes CustomEvent
@inlcudes CustomEventSupport
@includes NodeSupport
@dependency Neon
@dependency CustomEventSupport
@dependency NodeSupport
@dependency virtual-dom
**/
var NeoWidget = Class('NeoWidget').includes(CustomEvent, CustomEventSupport, NodeSupport)({
  /**
   an interface for generating VNodes from simple data structures.
  @name h
  */
  h : h,

  /**
   It is used for imitating diff operations between two vnode structures that imitate the structure
    of the active DOM node structure in the browser.
  @name diff
  */
  diff : diff,

  /**
   Given a vtree structure representing a DOM structure, we would like to either render the structure t
   o a DOM node using vdom/create-element or we would like to update the DOM using the results of vtree/diff
   by patching the DOM with vdom/patch
  @name patch
  */
  patch : patch,

  /**
   Given a vtree structure representing a DOM structure, we would like to either render the structure t
   o a DOM node using vdom/create-element or we would like to update the DOM using the results of vtree/diff
   by patching the DOM with vdom/patch
  @name createElement
  */
  createElement : createElement,

  /**
  @property prototype
  @type Object
  **/
  prototype : {
    /**
    Holds the active current state of the widget
    @property state <public> [String || Number || Array || Object] (null)
    **/
    state : null,

    /**
    virtual-dom exposes a set of objects designed for representing DOM nodes.
    A "Document Object Model Model" might seem like a strange term, but it is exactly that.
    It's a native JavaScript tree structure that represents a native DOM node tree. We call this a vDom
    @property vDom <public> [Instance] (null)
    **/
    vDom  : null,

    /**

    @property element <public> [HTMLElement] (null)
    **/
    element : null,


    init : function init(config){

      Object.keys(config || {}).forEach(function (propertyName) {
          this[propertyName] = config[propertyName];
      }, this);

      this.vDom = this.build();
      this.element = createElement(this.vDom);

      return this
    },

    /**
    Public build method.
    You must override this method .
    @property build <public> [Function]
    @method
    @return this [NeoWidget]
    **/
    build : function build() {
      return  <div>
              </div>
    },

    /**
    Public update method, this method should not be
    overriden.
    @property update <public> [Function]
    @method
    @argument state <required> [this.state] (undefined) This is the new state for the widget
    @return this [NeoWidget]
    **/
    update : function(state) {
      this.dispatch('beforeUpdate');

      if (state.constructor === Object) {
        for (var property in state) {
          this.state[property] = state[propery];
        }
      } else if (state.constructor === Array) {
        this.state = this.state.concat(state);
      } else {
        this.state = state;
      }

      var newTree = this.build();
      var patches = this.constructor.diff(this.vDom, newTree);
      this.element = this.constructor.patch(this.element, patches);
      this.vDom = newTree;

      this.dispatch('update');

      return this;
    },

    /**
    The render method is the mechanism by which you pass a widget from
    living only on memory to get into the DOM.
    @property render <public> [Function]
    @method
    @argument element <required> [HTMLElement] (undefined) This is the element
    into which the widget will be appended.
    @return this [NeoWidget]
    **/
    render : function(element) {
      this.dispatch('beforeRender', {
        element : element
      });

      element.appendChild(this.element);

      this.dispatch('render');
      return this;
    }
  }
});

module.exports = NeoWidget;
