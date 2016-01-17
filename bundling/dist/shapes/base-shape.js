'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var BaseShape = (function () {
  /**
   * @param {Object} options - override default configuration
   */

  function BaseShape(options) {
    _classCallCheck(this, BaseShape);

    if (options === undefined) options = {};
    /** @type {Element} - Konva.Group to be returned by the `render` method. */
    this.$el = null;
    /** @type {Object} - Object containing the global parameters of the shape */
    this.params = _Object$assign({}, this._getDefaults(), options);

    this.layer = null;

    this._visible = true;
    this._highlight = false;
    this._datum = null;

    // create accessors methods and set default accessor functions
    var accessors = this._getAccessorList();
    this._createAccessors(accessors);
    this._setDefaultAccessors(accessors);
  }

  /**
   * Destroy the shape and clean references. Interface method called from the `layer`.
   */

  _createClass(BaseShape, [{
    key: 'destroy',
    value: function destroy() {
      if (this.$el instanceof Array) {
        for (var i = 0; i < this.$el.length; i++) {
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
     * used as a export default class in the element group (defaults to `'shape'`).
     *
     * @return {String}
     */
  }, {
    key: 'getClassName',
    value: function getClassName() {
      return 'shape';
    }

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
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
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
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return {};
    }

    /**
     * Interface method called by Layer when creating a shape. Install the
     * given accessors on the shape, overriding the default accessors.
     *
     * @param {Object<String, function>} accessors
     */
  }, {
    key: 'install',
    value: function install(accessors) {
      for (var key in accessors) {
        this[key] = accessors[key];
      }
    }

    /**
     * Generic method to create accessors. Adds getters en setters to the
     * prototype if not already present.
     */
  }, {
    key: '_createAccessors',
    value: function _createAccessors(accessors) {
      this._accessors = {};
      // add it to the prototype
      var proto = Object.getPrototypeOf(this);
      // create a getter / setter for each accessors
      // setter : `this.x = callback`
      // getter : `this.x(datum)`
      _Object$keys(accessors).forEach(function (name) {
        if (proto.hasOwnProperty(name)) {
          return;
        }

        _Object$defineProperty(proto, name, {
          get: function get() {
            return this._accessors[name];
          },
          set: function set(func) {
            this._accessors[name] = func;
          }
        });
      });
    }

    /**
     * Create a function to be used as a default accessor for each accesors
     */
  }, {
    key: '_setDefaultAccessors',
    value: function _setDefaultAccessors(accessors) {
      var _this = this;

      _Object$keys(accessors).forEach(function (name) {
        var defaultValue = accessors[name];
        var accessor = function accessor(d, v) {
          if (v === undefined) v = null;
          if (v === null) {
            return d[name] || defaultValue;
          }
          d[name] = v;
        };
        // set accessor as the default one
        _this[name] = accessor;
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
  }, {
    key: 'render',
    value: function render(renderingContext) {}

    /**
     * Interface method called by `Layer~update`. Updates the DOM structure of the shape.
     *
     * @param {Object} renderingContext - The `renderingContext` of the layer
     *    which owns this shape.
     * @param {Object|Array} datum - The datum associated to the shape.
     */
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {}

    /**
     *  TODO
     */
  }, {
    key: 'draw',
    value: function draw() {
      if (this.$el instanceof Array) {
        for (var i = 0; i < this.$el.length; i++) this.$el[i].draw();
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
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {}

    /*
     * TODO
     */
  }, {
    key: 'minimize',
    value: function minimize() {}
  }, {
    key: 'maximize',
    value: function maximize() {}

    /*
     * TODO
     */
  }, {
    key: 'startDrag',
    value: function startDrag() {
      if (this.$el instanceof Array) {
        this.$el.forEach(function (el) {
          return el.startDrag();
        });
      } else {
        this.$el.startDrag();
      }
    }
  }, {
    key: 'stopDrag',
    value: function stopDrag() {
      if (this.$el instanceof Array) {
        this.$el.forEach(function (el) {
          return el.stopDrag();
        });
      } else {
        this.$el.stopDrag();
      }
    }
  }, {
    key: 'visible',
    get: function get() {
      return this._visible;
    },
    set: function set(isVisible) {
      this._visible = isVisible;
    }

    /*
     * TODO
     */
  }, {
    key: 'datum',
    get: function get() {
      return this._datum;
    },
    set: function set(datum) {
      this._datum = datum;
    }
  }]);

  return BaseShape;
})();

exports['default'] = BaseShape;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvYmFzZS1zaGFwZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBQXFCLFNBQVM7Ozs7O0FBSWpCLFdBSlEsU0FBUyxDQUloQixPQUFPLEVBQUU7MEJBSkYsU0FBUzs7QUFLMUIsUUFBSSxPQUFPLEtBQUssU0FBUyxFQUN2QixPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVmLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDOztBQUVoQixRQUFJLENBQUMsTUFBTSxHQUFHLGVBQWMsRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFOUQsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOzs7QUFHbkIsUUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFDMUMsUUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUN0Qzs7Ozs7O2VBdEJrQixTQUFTOztXQTJCckIsbUJBQUc7QUFDUixVQUFJLElBQUksQ0FBQyxHQUFHLFlBQVksS0FBSyxFQUFFO0FBQzdCLGFBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNwQyxjQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDMUI7QUFDRCxZQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7T0FDckIsTUFBTSxJQUFJLElB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QUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOzs7Ozs7O1dBSzFDLG9CQUFHLEVBQUU7OztXQUVMLG9CQUFHLEVBQUU7Ozs7Ozs7V0F5QkoscUJBQUc7QUFDVixVQUFJLElBQUksQ0FBQyxHQUFHLFlBQVksS0FBSyxFQUFFO0FBQzdCLFlBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRTtpQkFBSyxFQUFFLENBQUMsU0FBUyxFQUFFO1NBQUEsQ0FBQyxDQUFDO09BQzFDLE1BQU07QUFDTCxZQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO09BQ3RCO0tBQ0Y7OztXQUVPLG9CQUFHO0FBQ1QsVUFBSSxJQUFJLENBQUMsR0FBRyxZQUFZLEtBQUssRUFBRTtBQUM3QixZQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQUU7aUJBQUssRUFBRSxDQUFDLFFBQVEsRUFBRTtTQUFBLENBQUMsQ0FBQztPQUN6QyxNQUFNO0FBQ0wsWUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztPQUNyQjtLQUNGOzs7U0FsQ1UsZUFBRztBQUNaLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztLQUN0QjtTQUVVLGFBQUMsU0FBUyxFQUFFO0FBQ3JCLFVBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO0tBQzNCOzs7Ozs7O1NBS1EsZUFBRztBQUNWLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUNwQjtTQUVRLGFBQUMsS0FBSyxFQUFFO0FBQ2YsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7S0FDckI7OztTQXhNa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoic3JjL3NoYXBlcy9iYXNlLXNoYXBlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVNoYXBlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gb3ZlcnJpZGUgZGVmYXVsdCBjb25maWd1cmF0aW9uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCkgXG4gICAgICBvcHRpb25zID0ge307XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAtIEtvbnZhLkdyb3VwIHRvIGJlIHJldHVybmVkIGJ5IHRoZSBgcmVuZGVyYCBtZXRob2QuICovXG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7T2JqZWN0fSAtIE9iamVjdCBjb250YWluaW5nIHRoZSBnbG9iYWwgcGFyYW1ldGVycyBvZiB0aGUgc2hhcGUgKi9cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2dldERlZmF1bHRzKCksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5sYXllciA9IG51bGw7XG5cbiAgICB0aGlzLl92aXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLl9oaWdobGlnaHQgPSBmYWxzZTtcbiAgICB0aGlzLl9kYXR1bSA9IG51bGw7XG5cbiAgICAvLyBjcmVhdGUgYWNjZXNzb3JzIG1ldGhvZHMgYW5kIHNldCBkZWZhdWx0IGFjY2Vzc29yIGZ1bmN0aW9uc1xuICAgIGNvbnN0IGFjY2Vzc29ycyA9IHRoaXMuX2dldEFjY2Vzc29yTGlzdCgpO1xuICAgIHRoaXMuX2NyZWF0ZUFjY2Vzc29ycyhhY2Nlc3NvcnMpO1xuICAgIHRoaXMuX3NldERlZmF1bHRBY2Nlc3NvcnMoYWNjZXNzb3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBzaGFwZSBhbmQgY2xlYW4gcmVmZXJlbmNlcy4gSW50ZXJmYWNlIG1ldGhvZCBjYWxsZWQgZnJvbSB0aGUgYGxheWVyYC5cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuJGVsIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLiRlbC5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLiRlbFtpXS5zaGFwZSA9IG51bGw7XG4gICAgICB9XG4gICAgICB0aGlzLiRlbC5sZW5ndGggPSAwO1xuICAgIH0gZWxzZSBpZiAodGhpcy4kZWwpIHtcbiAgICAgIHRoaXMuJGVsLnNoYXBlID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICAgIHRoaXMuJHBhcmFtcyA9IG51bGw7XG4gICAgdGhpcy5fYWNjZXNzb3JzID0gbnVsbDtcbiAgICB0aGlzLl9kYXR1bSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBvdmVycmlkZSB3aGVuIGV4dGVuZGluZyB0aGlzIGJhc2UgY2xhc3MuIFRoZSBtZXRob2RcbiAgICogaXMgY2FsbGVkIGJ5IHRoZSBgTGF5ZXJ+cmVuZGVyYCBtZXRob2QuIFJldHVybnMgdGhlIG5hbWUgb2YgdGhlIHNoYXBlLFxuICAgKiB1c2VkIGFzIGEgZXhwb3J0IGRlZmF1bHQgY2xhc3MgaW4gdGhlIGVsZW1lbnQgZ3JvdXAgKGRlZmF1bHRzIHRvIGAnc2hhcGUnYCkuXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdzaGFwZSc7IH1cblxuICAvKipcbiAgICogQHRvZG8gbm90IGltcGxlbWVudGVkXG4gICAqIGFsbG93IHRvIGluc3RhbGwgZGVmcyBpbiB0aGUgdHJhY2sgc3ZnIGVsZW1lbnQuIFNob3VsZCBiZSBjYWxsZWQgd2hlblxuICAgKiBhZGRpbmcgdGhlIGBMYXllcmAgdG8gdGhlIGBUcmFja2AuXG4gICAqL1xuICAvLyBzZXRTdmdEZWZpbml0aW9uKGRlZnMpIHt9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRlZmF1bHRzIGZvciBnbG9iYWwgY29uZmlndXJhdGlvbiBvZiB0aGUgc2hhcGUuXG4gICAqIEBwcm90ZWN0ZWRcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCB3aGVyZSBrZXlzIGFyZSB0aGUgYWNjZXNzb3JzIG1ldGhvZHMgbmFtZXMgdG8gY3JlYXRlXG4gICAqIGFuZCB2YWx1ZXMgYXJlIHRoZSBkZWZhdWx0IHZhbHVlcyBmb3IgZWFjaCBnaXZlbiBhY2Nlc3Nvci5cbiAgICpcbiAgICogQHByb3RlY3RlZFxuICAgKiBAdG9kbyByZW5hbWUgP1xuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBfZ2V0QWNjZXNzb3JMaXN0KCkgeyByZXR1cm4ge307IH1cblxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIGNhbGxlZCBieSBMYXllciB3aGVuIGNyZWF0aW5nIGEgc2hhcGUuIEluc3RhbGwgdGhlXG4gICAqIGdpdmVuIGFjY2Vzc29ycyBvbiB0aGUgc2hhcGUsIG92ZXJyaWRpbmcgdGhlIGRlZmF1bHQgYWNjZXNzb3JzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdDxTdHJpbmcsIGZ1bmN0aW9uPn0gYWNjZXNzb3JzXG4gICAqL1xuICBpbnN0YWxsKGFjY2Vzc29ycykge1xuICAgIGZvciAobGV0IGtleSBpbiBhY2Nlc3NvcnMpIHsgdGhpc1trZXldID0gYWNjZXNzb3JzW2tleV07IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmljIG1ldGhvZCB0byBjcmVhdGUgYWNjZXNzb3JzLiBBZGRzIGdldHRlcnMgZW4gc2V0dGVycyB0byB0aGVcbiAgICogcHJvdG90eXBlIGlmIG5vdCBhbHJlYWR5IHByZXNlbnQuXG4gICAqL1xuICBfY3JlYXRlQWNjZXNzb3JzKGFjY2Vzc29ycykge1xuICAgIHRoaXMuX2FjY2Vzc29ycyA9IHt9O1xuICAgIC8vIGFkZCBpdCB0byB0aGUgcHJvdG90eXBlXG4gICAgY29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcyk7XG4gICAgLy8gY3JlYXRlIGEgZ2V0dGVyIC8gc2V0dGVyIGZvciBlYWNoIGFjY2Vzc29yc1xuICAgIC8vIHNldHRlciA6IGB0aGlzLnggPSBjYWxsYmFja2BcbiAgICAvLyBnZXR0ZXIgOiBgdGhpcy54KGRhdHVtKWBcbiAgICBPYmplY3Qua2V5cyhhY2Nlc3NvcnMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGlmIChwcm90by5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgeyByZXR1cm47IH1cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBuYW1lLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9hY2Nlc3NvcnNbbmFtZV07IH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgIHRoaXMuX2FjY2Vzc29yc1tuYW1lXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGZ1bmN0aW9uIHRvIGJlIHVzZWQgYXMgYSBkZWZhdWx0IGFjY2Vzc29yIGZvciBlYWNoIGFjY2Vzb3JzXG4gICAqL1xuICBfc2V0RGVmYXVsdEFjY2Vzc29ycyhhY2Nlc3NvcnMpIHtcbiAgICBPYmplY3Qua2V5cyhhY2Nlc3NvcnMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGFjY2Vzc29yc1tuYW1lXTtcbiAgICAgIGxldCBhY2Nlc3NvciA9IGZ1bmN0aW9uKGQsIHYpIHtcbiAgICAgICAgaWYgKHYgPT09IHVuZGVmaW5lZCkgdiA9IG51bGw7XG4gICAgICAgIGlmICh2ID09PSBudWxsKSB7IHJldHVybiBkW25hbWVdIHx8IGRlZmF1bHRWYWx1ZTsgfVxuICAgICAgICBkW25hbWVdID0gdjtcbiAgICAgIH07XG4gICAgICAvLyBzZXQgYWNjZXNzb3IgYXMgdGhlIGRlZmF1bHQgb25lXG4gICAgICB0aGlzW25hbWVdID0gYWNjZXNzb3I7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCBjYWxsZWQgYnkgYExheWVyfnJlbmRlcmAuIENyZWF0ZXMgdGhlIERPTSBzdHJ1Y3R1cmUgb2ZcbiAgICogdGhlIHNoYXBlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyaW5nQ29udGV4dCAtIHRoZSByZW5kZXJpbmdDb250ZXh0IG9mIHRoZSBsYXllclxuICAgKiAgICB3aGljaCBvd25zIHRoaXMgc2hhcGUuXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9IC0gdGhlIERPTSBlbGVtZW50IHRvIGluc2VydCBpbiB0aGUgaXRlbSdzIGdyb3VwLlxuICAgKi9cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHt9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgY2FsbGVkIGJ5IGBMYXllcn51cGRhdGVgLiBVcGRhdGVzIHRoZSBET00gc3RydWN0dXJlIG9mIHRoZSBzaGFwZS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmluZ0NvbnRleHQgLSBUaGUgYHJlbmRlcmluZ0NvbnRleHRgIG9mIHRoZSBsYXllclxuICAgKiAgICB3aGljaCBvd25zIHRoaXMgc2hhcGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBkYXR1bSAtIFRoZSBkYXR1bSBhc3NvY2lhdGVkIHRvIHRoZSBzaGFwZS5cbiAgICovXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge31cblxuICAvKipcbiAgICogIFRPRE9cbiAgICovXG4gIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMuJGVsIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLiRlbC5sZW5ndGg7IGkrKykgXG4gICAgICAgIHRoaXMuJGVsW2ldLmRyYXcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kZWwuZHJhdygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIG92ZXJyaWRlIGNhbGxlZCBieSBgTGF5ZXJ+Z2V0SXRlbXNJbkFyZWFgLiBEZWZpbmVzIGlmXG4gICAqIHRoZSBzaGFwZSBpcyBjb25zaWRlcmVkIHRvIGJlIHRoZSBnaXZlbiBhcmVhLiBBcmd1bWVudHMgYXJlIHBhc3NlZCBpbiBwaXhlbCBkb21haW4uXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJpbmdDb250ZXh0IC0gdGhlIHJlbmRlcmluZ0NvbnRleHQgb2YgdGhlIGxheWVyIHdoaWNoXG4gICAqICAgIG93bnMgdGhpcyBzaGFwZS5cbiAgICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGRhdHVtIC0gVGhlIGRhdHVtIGFzc29jaWF0ZWQgdG8gdGhlIHNoYXBlLlxuICAgKiBAcGFyYW0ge051bWJlcn0geDEgLSBUaGUgeCBjb21wb25lbnQgb2YgdGhlIHRvcC1sZWZ0IGNvcm5lciBvZiB0aGUgYXJlYSB0byB0ZXN0LlxuICAgKiBAcGFyYW0ge051bWJlcn0geTEgLSBUaGUgeSBjb21wb25lbnQgb2YgdGhlIHRvcC1sZWZ0IGNvcm5lciBvZiB0aGUgYXJlYSB0byB0ZXN0LlxuICAgKiBAcGFyYW0ge051bWJlcn0geDIgLSBUaGUgeCBjb21wb25lbnQgb2YgdGhlIGJvdHRvbS1yaWdodCBjb3JuZXIgb2YgdGhlIGFyZWEgdG8gdGVzdC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkyIC0gVGhlIHkgY29tcG9uZW50IG9mIHRoZSBib3R0b20tcmlnaHQgY29ybmVyIG9mIHRoZSBhcmVhIHRvIHRlc3QuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IC0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGlzIGNvbnNpZGVyZWQgdG8gYmUgaW4gdGhlIGdpdmVuIGFyZWEsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge31cblxuICAvKlxuICAgKiBUT0RPXG4gICAqL1xuICBtaW5pbWl6ZSgpIHt9XG5cbiAgbWF4aW1pemUoKSB7fVxuXG4gIC8qXG4gICAqIFRPRE9cbiAgICovXG4gIGdldCB2aXNpYmxlKCkge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmxlO1xuICB9XG5cbiAgc2V0IHZpc2libGUoaXNWaXNpYmxlKSB7XG4gICAgdGhpcy5fdmlzaWJsZSA9IGlzVmlzaWJsZTtcbiAgfVxuXG4gIC8qXG4gICAqIFRPRE9cbiAgICovXG4gIGdldCBkYXR1bSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0dW07XG4gIH1cblxuICBzZXQgZGF0dW0oZGF0dW0pIHtcbiAgICB0aGlzLl9kYXR1bSA9IGRhdHVtO1xuICB9XG5cblxuICBzdGFydERyYWcoKSB7XG4gICAgaWYgKHRoaXMuJGVsIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHRoaXMuJGVsLmZvckVhY2goKGVsKSA9PiBlbC5zdGFydERyYWcoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJGVsLnN0YXJ0RHJhZygpO1xuICAgIH1cbiAgfVxuXG4gIHN0b3BEcmFnKCkge1xuICAgIGlmICh0aGlzLiRlbCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICB0aGlzLiRlbC5mb3JFYWNoKChlbCkgPT4gZWwuc3RvcERyYWcoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJGVsLnN0b3BEcmFnKCk7XG4gICAgfVxuICB9XG59Il19