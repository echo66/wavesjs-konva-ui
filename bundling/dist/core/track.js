'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Symbol$iterator = require('babel-runtime/core-js/symbol/iterator')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var Track = (function (_events$EventEmitter) {
  _inherits(Track, _events$EventEmitter);

  /**
   * @param {DOMElement} $el
   * @param {Number} [height = 100]
   */

  function Track($el, height) {
    _classCallCheck(this, Track);

    _get(Object.getPrototypeOf(Track.prototype), 'constructor', this).call(this);

    if (!height) height = 100;

    this._height = height;

    /**
     * The DOM element in which the track is created.
     * @type {Element}
     */
    this.$el = $el;

    this.$stage = null;

    this.$dragLayer = null;

    this.$interactionsLayer = null;

    this.$backgroundLayer = null;

    /**
     * A set of all the layers belonging to the track.
     * @type {Set<Layer>}
     */
    this.layers = new _Set();
    /**
     * The context used to maintain the DOM structure of the track.
     * @type {TimelineTimeContext}
     */
    this.renderingContext = null;

    this._createContainer();
  }

  /**
   * Returns the height of the track.
   *
   * @type {Number}
   */

  _createClass(Track, [{
    key: 'configure',

    /**
     * This method is called when the track is added to the timeline. The
     * track cannot be updated without being added to a timeline.
     *
     * @private
     * @param {TimelineTimeContext} renderingContext
     */
    value: function configure(renderingContext) {
      this.renderingContext = renderingContext;
    }

    /**
     * Destroy the track and its layers.
     */
  }, {
    key: 'destroy',
    value: function destroy() {
      this.layers.forEach(function (layer) {
        return layer.destroy();
      });
      this.layers.clear();

      this.$stage.destroy();
      this.$interactionsLayer.destroy();
      this.$backgroundLayer.destroy();

      this._height = null;
      this.$el = null;
      this.$stage = null;
      this.$interactionsLayer = null;
      this.$backgroundLayer = null;
      this.renderingContext = null;
    }

    /**
     * Creates the basic Konva structure of the track.
     */
  }, {
    key: '_createContainer',
    value: function _createContainer() {
      this.$stage = new Konva.Stage({
        height: this.height,
        container: this.$el
      });
      this.$stage.addName('track-stage');

      this.$interactionsLayer = new Konva.Layer({});
      this.$interactionsLayer.addName('track-interactions');

      this.$backgroundLayer = new Konva.Layer({});
      this.$backgroundLayer.addName('track-background');
      this.$backgroundLayer.add(new Konva.Rect({}));
      // this.$backgroundLayer.children[0].shape = { layer: { track: this } }; // Shame!!! ..... Shame!!! .... Shame!!!

      this.$dragLayer = new Konva.Layer({});
      this.$dragLayer.addName('track-drag-layer');

      this.$stage.add(this.$dragLayer);
      this.$stage.add(this.$interactionsLayer);
      this.$stage.add(this.$backgroundLayer);
    }

    /**
     * Adds a layer to the track.
     *
     * @param {Layer} layer - the layer to add to the track.
     */
  }, {
    key: 'add',
    value: function add(layer) {
      if (!this.layers.has(layer)) {
        layer.createContainer(this.$stage);
        this.layers.add(layer);
        this.moveToTop(layer);
        this.emit('add', layer);
      }
    }

    /**
     * Removes a layer from the track and destroys that alyer
     *
     * @param {Layer} layer - the layer to remove from the track.
     */
  }, {
    key: 'remove',
    value: function remove(layer) {
      // TODO
      if (this.layers.has(layer)) {
        this.layers['delete'](layer);
        layer.destroy();
        this.emit('remove', layer);
      } else {
        throw new Error('Layer not found');
      }
    }

    /**
     * Tests if a given element belongs to the track.
     *
     * @param {Element} $el
     * @return {bool}
     */
  }, {
    key: 'hasElement',
    value: function hasElement($el) {
      throw new Error("deprecated");
    }

    /**
     * Render all the layers added to the track.
     */
  }, {
    key: 'render',
    value: function render() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(this), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var layer = _step.value;
          layer.render();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Updates the track Konva structure and updates the layers.
     *
     * @param {Array<Layer>} [layers=null] - if not null, a subset of the layers to update.
     */
  }, {
    key: 'update',
    value: function update(layers) {
      if (layers === undefined) layers = null;

      this.updateContainer();
      this.updateLayers(layers);
    }

    /**
     * Updates the track Konva structure.
     */
  }, {
    key: 'updateContainer',
    value: function updateContainer() {
      // Should be in some update layout
      var renderingContext = this.renderingContext;
      var height = this.height;
      var width = Math.round(renderingContext.visibleWidth);
      var offsetX = -Math.round(renderingContext.timeToPixel(renderingContext.offset));

      this.$stage.width(width).height(this.height).offsetX(offsetX);
      this.$interactionsLayer.offsetX(-offsetX);
      this.$backgroundLayer.offsetX(-offsetX);
      this.$backgroundLayer.children[0].x(0).y(0).width(width).height(this.height).opacity(0).moveToBottom();
      this.$backgroundLayer.batchDraw();

      /*
       * Change the layer stack order according to Layer.zIndex.
       */
      // var zIndexCounter = 0;
      // var maxZIndex = -Infinity;
      // this.$backgroundLayer.setZIndex(zIndexCounter++);
      // this.layers.forEach((layer) => {
      //   layer._contextLayer.setZIndex(layer.zIndex + zIndexCounter++);
      //   layer._commonShapeLayer.setZIndex(layer.zIndex + zIndexCounter++);
      //   layer.contentLayers.forEach((konvaLayer) => konvaLayer.setZIndex(layer.zIndex + zIndexCounter++));
      //   layer._dragLayer.setZIndex(layer.zIndex + zIndexCounter++);
      //   maxZIndex = Math.max(maxZIndex, layer.zIndex);
      // })
      // this.$interactionsLayer.setZIndex(maxZIndex + zIndexCounter);
    }

    /**
     * Updates the layers.
     *
     * @param {Array<Layer>} [layers=null] - if not null, a subset of the layers to update.
     */
  }, {
    key: 'updateLayers',
    value: function updateLayers(layers) {
      var _this = this;

      if (layers === undefined) layers = null;

      layers = layers === null ? this.layers : layers;

      layers.forEach(function (layer) {
        if (!_this.layers.has(layer)) {
          return;
        }
        layer.update();
      });
      this.$backgroundLayer.moveToBottom();
    }
  }, {
    key: 'minimize',
    value: function minimize() {
      // TODO
    }
  }, {
    key: 'maximize',
    value: function maximize() {
      // TODO
    }
  }, {
    key: 'moveToTop',
    value: function moveToTop(layer) {
      layer._contextLayer.moveToTop();
      layer._commonShapeLayer.moveToTop();
      layer.contentLayers.forEach(function (konvaLayer) {
        return konvaLayer.moveToTop();
      });

      this.$interactionsLayer.moveToTop();
      this.$backgroundLayer.moveToBottom();
    }
  }, {
    key: 'moveToBottom',
    value: function moveToBottom(layer) {
      this.$interactionsLayer.moveToTop();

      layer.contentLayers.forEach(function (konvaLayer) {
        return konvaLayer.moveToBottom();
      });
      layer._commonShapeLayer.moveToBottom();
      layer._contextLayer.moveToBottom();

      this.$backgroundLayer.moveToBottom();
    }

    /**
     * Iterates through the added layers.
     */
  }, {
    key: _Symbol$iterator,
    value: _regeneratorRuntime.mark(function value() {
      return _regeneratorRuntime.wrap(function value$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.delegateYield(_getIterator(this.layers), 't0', 1);

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, value, this);
    })
  }, {
    key: 'height',
    get: function get() {
      return this._height;
    },

    /**
     * Sets the height of the track.
     *
     * @todo propagate to layers, keeping ratio? could be handy for vertical
     *    resize. This is why a set/get is implemented here.
     * @type {Number}
     */
    set: function set(value) {
      this._height = value;
    }
  }]);

  return Track;
})(_events2['default'].EventEmitter);

exports['default'] = Track;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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YUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFVBQVU7ZUFBSyxVQUFVLENBQUMsWUFBWSxFQUFFO09BQUEsQ0FBQyxDQUFDO0FBQ3ZFLFdBQUssQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUN2QyxXQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDOztBQUVuQyxVQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLENBQUM7S0FDdEM7Ozs7Ozs7b0NBT2lCOzs7OzBEQUNULElBQUksQ0FBQyxNQUFNOzs7Ozs7O0tBQ25COzs7U0F2TlMsZUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjs7Ozs7Ozs7O1NBU1MsYUFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7S0FDdEI7OztTQTVEa0IsS0FBSztHQUFTLG9CQUFPLFlBQVk7O3FCQUFqQyxLQUFLIiwiZmlsZSI6InNyYy9jb3JlL3RyYWNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2sgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gJGVsXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbaGVpZ2h0ID0gMTAwXVxuICAgKi9cbiAgY29uc3RydWN0b3IoJGVsLCBoZWlnaHQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKCFoZWlnaHQpXG4gICAgICBoZWlnaHQgPSAxMDA7XG5cbiAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgRE9NIGVsZW1lbnQgaW4gd2hpY2ggdGhlIHRyYWNrIGlzIGNyZWF0ZWQuXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kZWwgPSAkZWw7XG5cbiAgICB0aGlzLiRzdGFnZSA9IG51bGw7XG5cbiAgICB0aGlzLiRkcmFnTGF5ZXIgPSBudWxsO1xuICAgIFxuICAgIHRoaXMuJGludGVyYWN0aW9uc0xheWVyID0gbnVsbDtcblxuICAgIHRoaXMuJGJhY2tncm91bmRMYXllciA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBBIHNldCBvZiBhbGwgdGhlIGxheWVycyBiZWxvbmdpbmcgdG8gdGhlIHRyYWNrLlxuICAgICAqIEB0eXBlIHtTZXQ8TGF5ZXI+fVxuICAgICAqL1xuICAgIHRoaXMubGF5ZXJzID0gbmV3IFNldCgpO1xuICAgIC8qKlxuICAgICAqIFRoZSBjb250ZXh0IHVzZWQgdG8gbWFpbnRhaW4gdGhlIERPTSBzdHJ1Y3R1cmUgb2YgdGhlIHRyYWNrLlxuICAgICAqIEB0eXBlIHtUaW1lbGluZVRpbWVDb250ZXh0fVxuICAgICAqL1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IG51bGw7XG5cbiAgICB0aGlzLl9jcmVhdGVDb250YWluZXIoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiB0aGUgdHJhY2suXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgaGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgaGVpZ2h0IG9mIHRoZSB0cmFjay5cbiAgICpcbiAgICogQHRvZG8gcHJvcGFnYXRlIHRvIGxheWVycywga2VlcGluZyByYXRpbz8gY291bGQgYmUgaGFuZHkgZm9yIHZlcnRpY2FsXG4gICAqICAgIHJlc2l6ZS4gVGhpcyBpcyB3aHkgYSBzZXQvZ2V0IGlzIGltcGxlbWVudGVkIGhlcmUuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHdoZW4gdGhlIHRyYWNrIGlzIGFkZGVkIHRvIHRoZSB0aW1lbGluZS4gVGhlXG4gICAqIHRyYWNrIGNhbm5vdCBiZSB1cGRhdGVkIHdpdGhvdXQgYmVpbmcgYWRkZWQgdG8gYSB0aW1lbGluZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtUaW1lbGluZVRpbWVDb250ZXh0fSByZW5kZXJpbmdDb250ZXh0XG4gICAqL1xuICBjb25maWd1cmUocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IHJlbmRlcmluZ0NvbnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgdHJhY2sgYW5kIGl0cyBsYXllcnMuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiBsYXllci5kZXN0cm95KCkpO1xuICAgIHRoaXMubGF5ZXJzLmNsZWFyKCk7XG5cbiAgICB0aGlzLiRzdGFnZS5kZXN0cm95KCk7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zTGF5ZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuJGJhY2tncm91bmRMYXllci5kZXN0cm95KCk7XG5cbiAgICB0aGlzLl9oZWlnaHQgPSBudWxsO1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICB0aGlzLiRzdGFnZSA9IG51bGw7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMuJGJhY2tncm91bmRMYXllciA9IG51bGw7XG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBiYXNpYyBLb252YSBzdHJ1Y3R1cmUgb2YgdGhlIHRyYWNrLlxuICAgKi9cbiAgX2NyZWF0ZUNvbnRhaW5lcigpIHtcbiAgICB0aGlzLiRzdGFnZSA9IG5ldyBLb252YS5TdGFnZSh7XG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LCBcbiAgICAgIGNvbnRhaW5lcjogdGhpcy4kZWxcbiAgICB9KTtcbiAgICB0aGlzLiRzdGFnZS5hZGROYW1lKCd0cmFjay1zdGFnZScpO1xuXG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zTGF5ZXIgPSBuZXcgS29udmEuTGF5ZXIoe30pO1xuICAgIHRoaXMuJGludGVyYWN0aW9uc0xheWVyLmFkZE5hbWUoJ3RyYWNrLWludGVyYWN0aW9ucycpO1xuXG4gICAgdGhpcy4kYmFja2dyb3VuZExheWVyID0gbmV3IEtvbnZhLkxheWVyKHt9KTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kTGF5ZXIuYWRkTmFtZSgndHJhY2stYmFja2dyb3VuZCcpO1xuICAgIHRoaXMuJGJhY2tncm91bmRMYXllci5hZGQobmV3IEtvbnZhLlJlY3Qoe30pKTtcbiAgICAvLyB0aGlzLiRiYWNrZ3JvdW5kTGF5ZXIuY2hpbGRyZW5bMF0uc2hhcGUgPSB7IGxheWVyOiB7IHRyYWNrOiB0aGlzIH0gfTsgLy8gU2hhbWUhISEgLi4uLi4gU2hhbWUhISEgLi4uLiBTaGFtZSEhIVxuXG4gICAgdGhpcy4kZHJhZ0xheWVyID0gbmV3IEtvbnZhLkxheWVyKHt9KTtcbiAgICB0aGlzLiRkcmFnTGF5ZXIuYWRkTmFtZSgndHJhY2stZHJhZy1sYXllcicpO1xuXG4gICAgdGhpcy4kc3RhZ2UuYWRkKHRoaXMuJGRyYWdMYXllcik7XG4gICAgdGhpcy4kc3RhZ2UuYWRkKHRoaXMuJGludGVyYWN0aW9uc0xheWVyKTtcbiAgICB0aGlzLiRzdGFnZS5hZGQodGhpcy4kYmFja2dyb3VuZExheWVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGF5ZXIgdG8gdGhlIHRyYWNrLlxuICAgKlxuICAgKiBAcGFyYW0ge0xheWVyfSBsYXllciAtIHRoZSBsYXllciB0byBhZGQgdG8gdGhlIHRyYWNrLlxuICAgKi9cbiAgYWRkKGxheWVyKSB7XG4gICAgaWYgKCF0aGlzLmxheWVycy5oYXMobGF5ZXIpKSB7XG4gICAgICBsYXllci5jcmVhdGVDb250YWluZXIodGhpcy4kc3RhZ2UpO1xuICAgICAgdGhpcy5sYXllcnMuYWRkKGxheWVyKTtcbiAgICAgIHRoaXMubW92ZVRvVG9wKGxheWVyKTtcbiAgICAgIHRoaXMuZW1pdCgnYWRkJywgbGF5ZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGF5ZXIgZnJvbSB0aGUgdHJhY2sgYW5kIGRlc3Ryb3lzIHRoYXQgYWx5ZXJcbiAgICpcbiAgICogQHBhcmFtIHtMYXllcn0gbGF5ZXIgLSB0aGUgbGF5ZXIgdG8gcmVtb3ZlIGZyb20gdGhlIHRyYWNrLlxuICAgKi9cbiAgcmVtb3ZlKGxheWVyKSB7XG4gICAgLy8gVE9ET1xuICAgIGlmICh0aGlzLmxheWVycy5oYXMobGF5ZXIpKSB7XG4gICAgICB0aGlzLmxheWVycy5kZWxldGUobGF5ZXIpO1xuICAgICAgbGF5ZXIuZGVzdHJveSgpO1xuICAgICAgdGhpcy5lbWl0KCdyZW1vdmUnLCBsYXllcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTGF5ZXIgbm90IGZvdW5kJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRlc3RzIGlmIGEgZ2l2ZW4gZWxlbWVudCBiZWxvbmdzIHRvIHRoZSB0cmFjay5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWxcbiAgICogQHJldHVybiB7Ym9vbH1cbiAgICovXG4gIGhhc0VsZW1lbnQoJGVsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZGVwcmVjYXRlZFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYWxsIHRoZSBsYXllcnMgYWRkZWQgdG8gdGhlIHRyYWNrLlxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMpIHsgbGF5ZXIucmVuZGVyKCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB0cmFjayBLb252YSBzdHJ1Y3R1cmUgYW5kIHVwZGF0ZXMgdGhlIGxheWVycy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxMYXllcj59IFtsYXllcnM9bnVsbF0gLSBpZiBub3QgbnVsbCwgYSBzdWJzZXQgb2YgdGhlIGxheWVycyB0byB1cGRhdGUuXG4gICAqL1xuICB1cGRhdGUobGF5ZXJzKSB7XG4gICAgaWYgKGxheWVycyA9PT0gdW5kZWZpbmVkKVxuICAgICAgbGF5ZXJzID0gbnVsbDtcblxuICAgIHRoaXMudXBkYXRlQ29udGFpbmVyKCk7XG4gICAgdGhpcy51cGRhdGVMYXllcnMobGF5ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB0cmFjayBLb252YSBzdHJ1Y3R1cmUuXG4gICAqL1xuICB1cGRhdGVDb250YWluZXIoKSB7XG4gICAgLy8gU2hvdWxkIGJlIGluIHNvbWUgdXBkYXRlIGxheW91dFxuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLnJlbmRlcmluZ0NvbnRleHQ7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgY29uc3Qgd2lkdGggPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoKTtcbiAgICBjb25zdCBvZmZzZXRYID0gLU1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChyZW5kZXJpbmdDb250ZXh0Lm9mZnNldCkpO1xuXG4gICAgdGhpcy4kc3RhZ2Uud2lkdGgod2lkdGgpLmhlaWdodCh0aGlzLmhlaWdodCkub2Zmc2V0WChvZmZzZXRYKTtcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnNMYXllci5vZmZzZXRYKC1vZmZzZXRYKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kTGF5ZXIub2Zmc2V0WCgtb2Zmc2V0WCk7XG4gICAgdGhpcy4kYmFja2dyb3VuZExheWVyLmNoaWxkcmVuWzBdLngoMCkueSgwKS53aWR0aCh3aWR0aCkuaGVpZ2h0KHRoaXMuaGVpZ2h0KS5vcGFjaXR5KDApLm1vdmVUb0JvdHRvbSgpO1xuICAgIHRoaXMuJGJhY2tncm91bmRMYXllci5iYXRjaERyYXcoKTtcblxuICAgIC8qXG4gICAgICogQ2hhbmdlIHRoZSBsYXllciBzdGFjayBvcmRlciBhY2NvcmRpbmcgdG8gTGF5ZXIuekluZGV4LlxuICAgICAqL1xuICAgIC8vIHZhciB6SW5kZXhDb3VudGVyID0gMDtcbiAgICAvLyB2YXIgbWF4WkluZGV4ID0gLUluZmluaXR5O1xuICAgIC8vIHRoaXMuJGJhY2tncm91bmRMYXllci5zZXRaSW5kZXgoekluZGV4Q291bnRlcisrKTtcbiAgICAvLyB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgIC8vICAgbGF5ZXIuX2NvbnRleHRMYXllci5zZXRaSW5kZXgobGF5ZXIuekluZGV4ICsgekluZGV4Q291bnRlcisrKTtcbiAgICAvLyAgIGxheWVyLl9jb21tb25TaGFwZUxheWVyLnNldFpJbmRleChsYXllci56SW5kZXggKyB6SW5kZXhDb3VudGVyKyspO1xuICAgIC8vICAgbGF5ZXIuY29udGVudExheWVycy5mb3JFYWNoKChrb252YUxheWVyKSA9PiBrb252YUxheWVyLnNldFpJbmRleChsYXllci56SW5kZXggKyB6SW5kZXhDb3VudGVyKyspKTtcbiAgICAvLyAgIGxheWVyLl9kcmFnTGF5ZXIuc2V0WkluZGV4KGxheWVyLnpJbmRleCArIHpJbmRleENvdW50ZXIrKyk7XG4gICAgLy8gICBtYXhaSW5kZXggPSBNYXRoLm1heChtYXhaSW5kZXgsIGxheWVyLnpJbmRleCk7XG4gICAgLy8gfSlcbiAgICAvLyB0aGlzLiRpbnRlcmFjdGlvbnNMYXllci5zZXRaSW5kZXgobWF4WkluZGV4ICsgekluZGV4Q291bnRlcik7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgbGF5ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PExheWVyPn0gW2xheWVycz1udWxsXSAtIGlmIG5vdCBudWxsLCBhIHN1YnNldCBvZiB0aGUgbGF5ZXJzIHRvIHVwZGF0ZS5cbiAgICovXG4gIHVwZGF0ZUxheWVycyhsYXllcnMpIHtcbiAgICBpZiAobGF5ZXJzID09PSB1bmRlZmluZWQpIFxuICAgICAgbGF5ZXJzID0gbnVsbDtcblxuICAgIGxheWVycyA9IChsYXllcnMgPT09IG51bGwpID8gdGhpcy5sYXllcnMgOiBsYXllcnM7XG5cbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGlmICghdGhpcy5sYXllcnMuaGFzKGxheWVyKSkgeyByZXR1cm47IH1cbiAgICAgIGxheWVyLnVwZGF0ZSgpO1xuICAgIH0pO1xuICAgIHRoaXMuJGJhY2tncm91bmRMYXllci5tb3ZlVG9Cb3R0b20oKTtcbiAgfVxuXG4gIG1pbmltaXplKCkge1xuICAgIC8vIFRPRE9cbiAgfVxuXG4gIG1heGltaXplKCkge1xuICAgIC8vIFRPRE9cbiAgfVxuXG4gIG1vdmVUb1RvcChsYXllcikge1xuICAgIGxheWVyLl9jb250ZXh0TGF5ZXIubW92ZVRvVG9wKCk7XG4gICAgbGF5ZXIuX2NvbW1vblNoYXBlTGF5ZXIubW92ZVRvVG9wKCk7XG4gICAgbGF5ZXIuY29udGVudExheWVycy5mb3JFYWNoKChrb252YUxheWVyKSA9PiBrb252YUxheWVyLm1vdmVUb1RvcCgpKTtcblxuICAgIHRoaXMuJGludGVyYWN0aW9uc0xheWVyLm1vdmVUb1RvcCgpO1xuICAgIHRoaXMuJGJhY2tncm91bmRMYXllci5tb3ZlVG9Cb3R0b20oKTtcbiAgfVxuXG4gIG1vdmVUb0JvdHRvbShsYXllcikge1xuICAgIHRoaXMuJGludGVyYWN0aW9uc0xheWVyLm1vdmVUb1RvcCgpO1xuICAgIFxuICAgIGxheWVyLmNvbnRlbnRMYXllcnMuZm9yRWFjaCgoa29udmFMYXllcikgPT4ga29udmFMYXllci5tb3ZlVG9Cb3R0b20oKSk7XG4gICAgbGF5ZXIuX2NvbW1vblNoYXBlTGF5ZXIubW92ZVRvQm90dG9tKCk7XG4gICAgbGF5ZXIuX2NvbnRleHRMYXllci5tb3ZlVG9Cb3R0b20oKTtcbiAgICBcbiAgICB0aGlzLiRiYWNrZ3JvdW5kTGF5ZXIubW92ZVRvQm90dG9tKCk7XG4gIH1cblxuXG5cbiAgLyoqXG4gICAqIEl0ZXJhdGVzIHRocm91Z2ggdGhlIGFkZGVkIGxheWVycy5cbiAgICovXG4gICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICB5aWVsZCogdGhpcy5sYXllcnNbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICB9XG59XG4iXX0=