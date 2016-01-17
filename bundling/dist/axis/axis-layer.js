'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

/**
 * Simplified Layer for Axis. The main difference with a regular layer is that
 * an axis layer use the `Timeline~timeContext` attributes to render it's layout
 * and stay synchronized with the tracks visible area. All getters and setters
 * to the `TimelineTimeContext` attributes are bypassed.
 *
 * It also handle it's own data and its updates. The `_generateData` method is
 * responsible to create some usefull data to visualize
 *
 * [example usage of the layer-axis](./examples/layer-axis.html)
 */

var AxisLayer = (function (_Layer) {
  _inherits(AxisLayer, _Layer);

  /**
   * @param {Function} generator - A function to create data according to
   *    the `Timeline~timeContext`.
   * @param {Object} options - Layer options, cf. Layer for available options.
   */

  function AxisLayer(generator, options) {
    var _this = this;

    _classCallCheck(this, AxisLayer);

    _get(Object.getPrototypeOf(AxisLayer.prototype), 'constructor', this).call(this, 'entity', [], options);
    this._generator = generator;

    this._contextShape = new Segment({});
    this._contextShape.install({
      opacity: function opacity() {
        return 1;
      },
      color: function color() {
        return _this.params.context.color;
      },
      width: function width() {
        return _this.timeContext.visibleDuration;
      },
      height: function height() {
        return _this._renderingContext.valueToPixel.domain()[1];
      },
      y: function y() {
        return _this._renderingContext.valueToPixel.domain()[0];
      },
      x: function x() {
        return -_this.timeContext.offset;
      }
    });
    this._contextShape.params.handlerWidth = this.params.context.handlerWidth;
    this._contextShape.render(this._renderingContext);
    this._contextShape.layer = this;
    for (var i = 0; i < this._contextShape.$el.length; i++) {
      this._contextLayer.add(this._contextShape.$el[i]);
    }
  }

  /** @private */

  _createClass(AxisLayer, [{
    key: '_generateData',

    /**
     * This method is the main difference with a classical layer. An `AxisLayer`
     * instance generates and maintains it's own data.
     */
    value: function _generateData() {
      var that = this;
      this.contentLayers.forEach(function (l) {
        // Hacked this to make it work.
        l.destroy();
        that.contentLayers['delete'](l);
      });
      var data = this._generator(this.timeContext);
      // this.remove(this.data);
      this.set([data]);
    }

    /**
     * Generates the data and update the layer.
     */
  }, {
    key: 'update',
    value: function update() {
      this._generateData();
      _get(Object.getPrototypeOf(AxisLayer.prototype), 'update', this).call(this);
    }
  }, {
    key: 'updateContainer',
    value: function updateContainer() {
      this._updateRenderingContext();
    }
  }, {
    key: 'updateShapes',
    value: function updateShapes() {
      var changedContentLayers = new _Set();
      var that = this;

      this._allocateShapesToLayers(this._stage, this.data, 'datums', true).forEach(function (changedContentLayer) {
        changedContentLayers.add(changedContentLayer);
      });

      changedContentLayers.forEach(function (changedContentLayer) {
        changedContentLayer.y(that.params.top).offsetX(0).clear().batchDraw();
      });

      this._contextShape.update(this._renderingContext, this.timeContext);

      this._contextLayer.y(that.params.top).batchDraw().moveToBottom();
    }

    /**
     * Updates the rendering context for the shapes.
     */
  }, {
    key: '_updateRenderingContext',
    value: function _updateRenderingContext() {
      this._renderingContext.timeToPixel = this.timeContext.timeToPixel;
      this._renderingContext.valueToPixel = this._valueToPixel;

      this._renderingContext.height = this.params.height;
      this._renderingContext.width = this.timeContext.timeToPixel(this.timeContext.visibleDuration);

      // for foreign object issue in chrome
      this._renderingContext.offsetX = this.timeContext.timeToPixel(this.timeContext.offset);

      // expose some timeline attributes - allow to improve perf in some cases - cf. Waveform
      this._renderingContext.trackOffsetX = this.timeContext.timeToPixel(this.timeContext.offset);
      this._renderingContext.visibleWidth = this.timeContext.visibleWidth;
    }
  }, {
    key: 'visible_data',
    value: function visible_data(timeContext, data) {
      return undefined;
    }
  }, {
    key: 'sort_data',
    value: function sort_data(data) {}
  }, {
    key: 'stretchRatio',
    set: function set(value) {
      return;
    },

    /** @private */

    /** @private */
    get: function get() {
      return;
    }

    /** @private */
  }, {
    key: 'offset',
    set: function set(value) {
      return;
    },

    /** @private */
    get: function get() {
      return;
    }

    /** @private */
  }, {
    key: 'start',
    set: function set(value) {
      return;
    },

    /** @private */
    get: function get() {
      return;
    }

    /** @private */
  }, {
    key: 'duration',
    set: function set(value) {
      return;
    },
    get: function get() {
      return;
    }

    /**
     * The generator that creates the data to be rendered to display the axis.
     *
     * @type {Function}
     */
  }, {
    key: 'generator',
    set: function set(func) {
      this._generator = func;
    },

    /**
     * The generator that creates the data to be rendered to display the axis.
     *
     * @type {Function}
     */
    get: function get() {
      return this._generator;
    }
  }]);

  return AxisLayer;
})(_coreLayer2['default']);

exports['default'] = AxisLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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LENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUYsVUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQztLQUNyRTs7O1dBRVcsc0JBQUMsV0FBVyxFQUFFLElBQUksRUFBRTtBQUM5QixhQUFPLFNBQVMsQ0FBQztLQUNsQjs7O1dBRVEsbUJBQUMsSUFBSSxFQUFFLEVBQUc7OztTQTVHSCxhQUFDLEtBQUssRUFBRTtBQUFFLGFBQU87S0FBRTs7Ozs7U0FRbkIsZUFBRztBQUFFLGFBQU87S0FBRTs7Ozs7U0FOcEIsYUFBQyxLQUFLLEVBQUU7QUFBRSxhQUFPO0tBQUU7OztTQVFuQixlQUFHO0FBQUUsYUFBTztLQUFFOzs7OztTQU5mLGFBQUMsS0FBSyxFQUFFO0FBQUUsYUFBTztLQUFFOzs7U0FRbkIsZUFBRztBQUFFLGFBQU87S0FBRTs7Ozs7U0FOWCxhQUFDLEtBQUssRUFBRTtBQUFFLGFBQU87S0FBRTtTQVFuQixlQUFHO0FBQUUsYUFBTztLQUFFOzs7Ozs7Ozs7U0FRYixhQUFDLElBQUksRUFBRTtBQUNsQixVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztLQUN4Qjs7Ozs7OztTQU9ZLGVBQUc7QUFDZCxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7S0FDeEI7OztTQTdEa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoic3JjL2F4aXMvYXhpcy1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcblxuXG4vKipcbiAqIFNpbXBsaWZpZWQgTGF5ZXIgZm9yIEF4aXMuIFRoZSBtYWluIGRpZmZlcmVuY2Ugd2l0aCBhIHJlZ3VsYXIgbGF5ZXIgaXMgdGhhdFxuICogYW4gYXhpcyBsYXllciB1c2UgdGhlIGBUaW1lbGluZX50aW1lQ29udGV4dGAgYXR0cmlidXRlcyB0byByZW5kZXIgaXQncyBsYXlvdXRcbiAqIGFuZCBzdGF5IHN5bmNocm9uaXplZCB3aXRoIHRoZSB0cmFja3MgdmlzaWJsZSBhcmVhLiBBbGwgZ2V0dGVycyBhbmQgc2V0dGVyc1xuICogdG8gdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCBhdHRyaWJ1dGVzIGFyZSBieXBhc3NlZC5cbiAqXG4gKiBJdCBhbHNvIGhhbmRsZSBpdCdzIG93biBkYXRhIGFuZCBpdHMgdXBkYXRlcy4gVGhlIGBfZ2VuZXJhdGVEYXRhYCBtZXRob2QgaXNcbiAqIHJlc3BvbnNpYmxlIHRvIGNyZWF0ZSBzb21lIHVzZWZ1bGwgZGF0YSB0byB2aXN1YWxpemVcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZSBvZiB0aGUgbGF5ZXItYXhpc10oLi9leGFtcGxlcy9sYXllci1heGlzLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF4aXNMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGdlbmVyYXRvciAtIEEgZnVuY3Rpb24gdG8gY3JlYXRlIGRhdGEgYWNjb3JkaW5nIHRvXG4gICAqICAgIHRoZSBgVGltZWxpbmV+dGltZUNvbnRleHRgLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIExheWVyIG9wdGlvbnMsIGNmLiBMYXllciBmb3IgYXZhaWxhYmxlIG9wdGlvbnMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihnZW5lcmF0b3IsIG9wdGlvbnMpIHtcbiAgICBzdXBlcignZW50aXR5JywgW10sIG9wdGlvbnMpO1xuICAgIHRoaXMuX2dlbmVyYXRvciA9IGdlbmVyYXRvcjtcblxuICAgIHRoaXMuX2NvbnRleHRTaGFwZSA9IG5ldyBTZWdtZW50KHt9KTtcbiAgICB0aGlzLl9jb250ZXh0U2hhcGUuaW5zdGFsbCh7XG4gICAgICBvcGFjaXR5IDogKCkgPT4gMSwgXG4gICAgICBjb2xvciA6ICgpID0+IHRoaXMucGFyYW1zLmNvbnRleHQuY29sb3IsIFxuICAgICAgd2lkdGggOiAoKSA9PiB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbixcbiAgICAgIGhlaWdodCAgOiAoKSA9PiB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5kb21haW4oKVsxXSxcbiAgICAgIHkgICA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmRvbWFpbigpWzBdLFxuICAgICAgeCAgIDogKCkgPT4gLXRoaXMudGltZUNvbnRleHQub2Zmc2V0XG4gICAgfSk7IFxuICAgIHRoaXMuX2NvbnRleHRTaGFwZS5wYXJhbXMuaGFuZGxlcldpZHRoID0gdGhpcy5wYXJhbXMuY29udGV4dC5oYW5kbGVyV2lkdGg7XG4gICAgdGhpcy5fY29udGV4dFNoYXBlLnJlbmRlcih0aGlzLl9yZW5kZXJpbmdDb250ZXh0KTtcbiAgICB0aGlzLl9jb250ZXh0U2hhcGUubGF5ZXIgPSB0aGlzO1xuICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLl9jb250ZXh0U2hhcGUuJGVsLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLl9jb250ZXh0TGF5ZXIuYWRkKHRoaXMuX2NvbnRleHRTaGFwZS4kZWxbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzZXQgc3RyZXRjaFJhdGlvKHZhbHVlKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgc2V0IG9mZnNldCh2YWx1ZSkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIHNldCBzdGFydCh2YWx1ZSkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIHNldCBkdXJhdGlvbih2YWx1ZSkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0IG9mZnNldCgpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBnZXQgc3RhcnQoKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0IGR1cmF0aW9uKCkgeyByZXR1cm47IH1cblxuXG4gIC8qKlxuICAgKiBUaGUgZ2VuZXJhdG9yIHRoYXQgY3JlYXRlcyB0aGUgZGF0YSB0byBiZSByZW5kZXJlZCB0byBkaXNwbGF5IHRoZSBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBzZXQgZ2VuZXJhdG9yKGZ1bmMpIHtcbiAgICB0aGlzLl9nZW5lcmF0b3IgPSBmdW5jO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBnZW5lcmF0b3IgdGhhdCBjcmVhdGVzIHRoZSBkYXRhIHRvIGJlIHJlbmRlcmVkIHRvIGRpc3BsYXkgdGhlIGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIGdldCBnZW5lcmF0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dlbmVyYXRvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyB0aGUgbWFpbiBkaWZmZXJlbmNlIHdpdGggYSBjbGFzc2ljYWwgbGF5ZXIuIEFuIGBBeGlzTGF5ZXJgXG4gICAqIGluc3RhbmNlIGdlbmVyYXRlcyBhbmQgbWFpbnRhaW5zIGl0J3Mgb3duIGRhdGEuXG4gICAqL1xuICBfZ2VuZXJhdGVEYXRhKCkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuY29udGVudExheWVycy5mb3JFYWNoKChsKSA9PiB7IC8vIEhhY2tlZCB0aGlzIHRvIG1ha2UgaXQgd29yay5cbiAgICAgIGwuZGVzdHJveSgpO1xuICAgICAgdGhhdC5jb250ZW50TGF5ZXJzLmRlbGV0ZShsKTtcbiAgICB9KTtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5fZ2VuZXJhdG9yKHRoaXMudGltZUNvbnRleHQpO1xuICAgIC8vIHRoaXMucmVtb3ZlKHRoaXMuZGF0YSk7XG4gICAgdGhpcy5zZXQoW2RhdGFdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgdGhlIGRhdGEgYW5kIHVwZGF0ZSB0aGUgbGF5ZXIuXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5fZ2VuZXJhdGVEYXRhKCk7XG4gICAgc3VwZXIudXBkYXRlKCk7XG4gIH1cblxuICB1cGRhdGVDb250YWluZXIoKSB7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuICB9XG5cbiAgdXBkYXRlU2hhcGVzKCkge1xuICAgIGNvbnN0IGNoYW5nZWRDb250ZW50TGF5ZXJzID0gbmV3IFNldCgpO1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuXG4gICAgdGhpcy5fYWxsb2NhdGVTaGFwZXNUb0xheWVycyh0aGlzLl9zdGFnZSwgdGhpcy5kYXRhLCAnZGF0dW1zJywgdHJ1ZSkuZm9yRWFjaCgoY2hhbmdlZENvbnRlbnRMYXllcikgPT4ge1xuICAgICAgY2hhbmdlZENvbnRlbnRMYXllcnMuYWRkKGNoYW5nZWRDb250ZW50TGF5ZXIpO1xuICAgIH0pO1xuXG4gICAgY2hhbmdlZENvbnRlbnRMYXllcnMuZm9yRWFjaCgoY2hhbmdlZENvbnRlbnRMYXllcikgPT4ge1xuICAgICAgY2hhbmdlZENvbnRlbnRMYXllclxuICAgICAgICAueSh0aGF0LnBhcmFtcy50b3ApXG4gICAgICAgIC5vZmZzZXRYKDApXG4gICAgICAgIC5jbGVhcigpXG4gICAgICAgIC5iYXRjaERyYXcoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NvbnRleHRTaGFwZS51cGRhdGUodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgdGhpcy50aW1lQ29udGV4dCk7XG5cbiAgICB0aGlzLl9jb250ZXh0TGF5ZXJcbiAgICAgICAgLnkodGhhdC5wYXJhbXMudG9wKVxuICAgICAgICAuYmF0Y2hEcmF3KClcbiAgICAgICAgLm1vdmVUb0JvdHRvbSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHJlbmRlcmluZyBjb250ZXh0IGZvciB0aGUgc2hhcGVzLlxuICAgKi9cbiAgX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKSB7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWw7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwgPSB0aGlzLl92YWx1ZVRvUGl4ZWw7XG5cbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LmhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LndpZHRoICA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb24pO1xuXG4gICAgLy8gZm9yIGZvcmVpZ24gb2JqZWN0IGlzc3VlIGluIGNocm9tZVxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5vZmZzZXQpO1xuXG4gICAgLy8gZXhwb3NlIHNvbWUgdGltZWxpbmUgYXR0cmlidXRlcyAtIGFsbG93IHRvIGltcHJvdmUgcGVyZiBpbiBzb21lIGNhc2VzIC0gY2YuIFdhdmVmb3JtXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC50cmFja09mZnNldFggPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aCA9IHRoaXMudGltZUNvbnRleHQudmlzaWJsZVdpZHRoO1xuICB9XG5cbiAgdmlzaWJsZV9kYXRhKHRpbWVDb250ZXh0LCBkYXRhKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHNvcnRfZGF0YShkYXRhKSB7IH1cbn1cbiJdfQ==