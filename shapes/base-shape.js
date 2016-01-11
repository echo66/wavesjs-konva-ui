'use strict'

class BaseShape {
  /**
   * @param {Object} options - override default configuration
   */
  constructor(options) {
    if (options == undefined) 
      options = {}
    /** @type {Element} - Konva.Group to be returned by the `render` method. */
    this.$el = null;
    /** @type {Object} - Object containing the global parameters of the shape */
    this.params = Object.assign({}, this._getDefaults(), options);

    this.layer = null;

    this._visible = true;
    this._highlight = false;
    this._datum = null;

    // create accessors methods and set default accessor functions
    const accessors = this._getAccessorList();
    this._createAccessors(accessors);
    this._setDefaultAccessors(accessors);
  }

  /**
   * Destroy the shape and clean references. Interface method called from the `layer`.
   */
  destroy() {
    if (this.$el instanceof Array) {
      for (var i=0; i<this.$el.length; i++) {
        this.$el[i].shape = null;
      }
      this.$el.length = 0;
    } else if (this.$el) {
      this.$el.shape = null;
    }
    this.$el = null;
    this.$params = null;
    this._accessors = null;
    this._datum = null;
  }

  /**
   * Interface method to override when extending this base class. The method
   * is called by the `Layer~render` method. Returns the name of the shape,
   * used as a class in the element group (defaults to `'shape'`).
   *
   * @return {String}
   */
  getClassName() { return 'shape'; }

  /**
   * @todo not implemented
   * allow to install defs in the track svg element. Should be called when
   * adding the `Layer` to the `Track`.
   */
  // setSvgDefinition(defs) {}

  /**
   * Returns the defaults for global configuration of the shape.
   * @protected
   * @return {Object}
   */
  _getDefaults() {
    return {};
  }

  /**
   * Returns an object where keys are the accessors methods names to create
   * and values are the default values for each given accessor.
   *
   * @protected
   * @todo rename ?
   * @return {Object}
   */
  _getAccessorList() { return {}; }


  /**
   * Interface method called by Layer when creating a shape. Install the
   * given accessors on the shape, overriding the default accessors.
   *
   * @param {Object<String, function>} accessors
   */
  install(accessors) {
    for (let key in accessors) { this[key] = accessors[key]; }
  }

  /**
   * Generic method to create accessors. Adds getters en setters to the
   * prototype if not already present.
   */
  _createAccessors(accessors) {
    this._accessors = {};
    // add it to the prototype
    const proto = Object.getPrototypeOf(this);
    // create a getter / setter for each accessors
    // setter : `this.x = callback`
    // getter : `this.x(datum)`
    Object.keys(accessors).forEach((name) => {
      if (proto.hasOwnProperty(name)) { return; }

      Object.defineProperty(proto, name, {
        get: function() { return this._accessors[name]; },
        set: function(func) {
          this._accessors[name] = func;
        }
      });
    });
  }

  /**
   * Create a function to be used as a default accessor for each accesors
   */
  _setDefaultAccessors(accessors) {
    Object.keys(accessors).forEach((name) => {
      const defaultValue = accessors[name];
      let accessor = function(d, v) {
        if (v == undefined) v = null;
        if (v === null) { return d[name] || defaultValue; }
        d[name] = v;
      };
      // set accessor as the default one
      this[name] = accessor;
    });
  }

  /**
   * Interface method called by `Layer~render`. Creates the DOM structure of
   * the shape.
   *
   * @param {Object} renderingContext - the renderingContext of the layer
   *    which owns this shape.
   * @return {Element} - the DOM element to insert in the item's group.
   */
  render(renderingContext) {}

  /**
   * Interface method called by `Layer~update`. Updates the DOM structure of the shape.
   *
   * @param {Object} renderingContext - The `renderingContext` of the layer
   *    which owns this shape.
   * @param {Object|Array} datum - The datum associated to the shape.
   */
  update(renderingContext, datum) {}

  /**
   *
   */
  draw() {
    if (this.$el instanceof Array) {
      for (var i=0; i<this.$el.length; i++) 
        this.$el[i].draw();
    } else {
      this.$el.draw();
    }
  }

  /**
   * Interface method to override called by `Layer~getItemsInArea`. Defines if
   * the shape is considered to be the given area. Arguments are passed in pixel domain.
   *
   * @param {Object} renderingContext - the renderingContext of the layer which
   *    owns this shape.
   * @param {Object|Array} datum - The datum associated to the shape.
   * @param {Number} x1 - The x component of the top-left corner of the area to test.
   * @param {Number} y1 - The y component of the top-left corner of the area to test.
   * @param {Number} x2 - The x component of the bottom-right corner of the area to test.
   * @param {Number} y2 - The y component of the bottom-right corner of the area to test.
   * @return {Boolean} - Returns `true` if the is considered to be in the given area, `false` otherwise.
   */
  inArea(renderingContext, datum, x1, y1, x2, y2) {}

  /*
   * // TODO
   */
  minimize() {}

  maximize() {}

  /**
   * // TODO
   */
  get highlight() {
    return this._highlight;
  }

  set highlight(isHighlighted) {
    this._highlight = isHighlighted;
  }

  /*
   * // TODO
   */
  get visible() {
    return this._visible;
  }

  set visible(isVisible) {
    this._visible = isVisible;
  }

  /*
   * // TODO
   */
  get datum() {
    return this._datum;
  }

  set datum(datum) {
    this._datum = datum;
  }
}