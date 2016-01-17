'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utilsScales = require('../utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

var LayerTimeContext = (function () {
  /**
   * @param {TimelineTimeContext} parent - The `TimelineTimeContext` instance of the timeline.
   */

  function LayerTimeContext(parent) {
    _classCallCheck(this, LayerTimeContext);

    if (!parent) {
      throw new Error('LayerTimeContext must have a parent');
    }

    /**
     * The `TimelineTimeContext` instance of the timeline.
     *
     * @type {TimelineTimeContext}
     */
    this.parent = parent;
    this._lockedToParentInterval = false;

    this._timeToPixel = null;
    this._start = 0;
    this._duration = parent.visibleDuration;
    this._offset = 0;
    this._stretchRatio = 1;
    // register into the timeline's TimeContext
    this.parent._children.push(this);
  }

  /**
   * Creates a clone of the current time context.
   *
   * @return {LayerTimeContext}
   */

  _createClass(LayerTimeContext, [{
    key: 'clone',
    value: function clone() {
      var ctx = new this();

      ctx.parent = this.parent;
      ctx.start = this.start;
      ctx.duration = this.duration;
      ctx.offset = this.offset;
      ctx.stretchRatio = this.stretchRatio; // creates the local scale if needed

      return ctx;
    }

    /**
     * Returns the start position of the time context (in seconds).
     *
     * @type {Number}
     */
  }, {
    key: 'pixelToTime',

    /**
     * Helper function to convert pixel to time.
     *
     * @param {Number} px
     * @return {Number}
     */
    value: function pixelToTime(px) {
      if (!this._timeToPixel) {
        return this.parent.timeToPixel.invert(px);
      }

      return this._timeToPixel.invert(px);
    }

    /**
     * Returns the time interval of the visible area in the timeline.
     *
     * @type {Object} 
     */
  }, {
    key: 'start',
    get: function get() {
      return !this._lockedToParentInterval ? this._start : -this.parent.offset;
    },

    /**
     * Sets the start position of the time context (in seconds).
     *
     * @type {Number}
     */
    set: function set(value) {
      this._start = value;
    }

    /**
     * Returns the duration of the time context (in seconds).
     *
     * @type {Number}
     */
  }, {
    key: 'duration',
    get: function get() {
      return !this._lockedToParentInterval ? this._duration : this.parent.visibleDuration;
    },

    /**
     * Sets the duration of the time context (in seconds).
     *
     * @type {Number}
     */
    set: function set(value) {
      this._duration = value;
    }

    /**
     * Returns the offset of the time context (in seconds).
     *
     * @type {Number}
     */
  }, {
    key: 'offset',
    get: function get() {
      return !this._lockedToParentInterval ? this._offset : this.parent.offset;
    },

    /**
     * Sets the offset of the time context (in seconds).
     *
     * @type {Number}
     */
    set: function set(value) {
      this._offset = value;
    }

    /**
     * Returns the stretch ratio of the time context.
     *
     * @type {Number}
     */
  }, {
    key: 'stretchRatio',
    get: function get() {
      return this._stretchRatio;
    },

    /**
     * Sets the stretch ratio of the time context.
     *
     * @type {Number}
     */
    set: function set(value) {
      // remove local scale if ratio = 1
      if (value === 1) {
        this._timeToPixel = null;
        return;
      }
      // reuse previsously created local scale if exists
      var timeToPixel = this._timeToPixel ? this._timeToPixel : _utilsScales2['default'].linear().domain([0, 1]);

      timeToPixel.range([0, this.parent.computedPixelsPerSecond * value]);

      this._timeToPixel = timeToPixel;
      this._stretchRatio = value;
    }

    /**
     * Returns the time to pixel transfert function of the time context. If
     * the `stretchRatio` attribute is equal to 1, this function is the global
     * one from the `TimelineTimeContext` instance.
     *
     * @type {Function}
     */
  }, {
    key: 'timeToPixel',
    get: function get() {
      if (!this._timeToPixel) {
        return this.parent.timeToPixel;
      }

      return this._timeToPixel;
    }
  }, {
    key: 'visibleInterval',
    get: function get() {
      var interval = {};
      interval.start = -this.offset;
      interval.duration = this.duration;
      return interval;
    },

    /**
     * Focus the timeline visible area in the provided time interval.
     *
     * @type {Object} 
     */
    set: function set(value) {
      this.offset = -value.start;
      this.duration = value.duration;
    }

    /**
     *  TODO
     */
  }, {
    key: 'lockedToParentInterval',
    get: function get() {
      return this._lockedToParentInterval;
    },
    set: function set(value) {
      this._lockedToParentInterval = value;
    }
  }]);

  return LayerTimeContext;
})();

exports['default'] = LayerTimeContext;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb3JlL2xheWVyLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7MkJBQW1CLGlCQUFpQjs7OztJQUVmLGdCQUFnQjs7Ozs7QUFJeEIsV0FKUSxnQkFBZ0IsQ0FJdkIsTUFBTSxFQUFFOzBCQUpELGdCQUFnQjs7QUFLakMsUUFBSSxDQUFDLE1BQU0sRUFBRTtBQUFFLFlBQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztLQUFFOzs7Ozs7O0FBT3hFLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUM7O0FBRXJDLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQztBQUN4QyxRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNqQixRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQzs7QUFFdkIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ2xDOzs7Ozs7OztlQXRCa0IsZ0JBQWdCOztXQTZCOUIsaUJBQUc7QUFDTixVQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDOztBQUV2QixTQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDekIsU0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZCLFNBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUM3QixTQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDekIsU0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDOztBQUVyQyxh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QUM7S0FDdEM7OztTQTFMa0IsZ0JBQWdCOzs7cUJBQWhCLGdCQUFnQiIsImZpbGUiOiJzcmMvY29yZS9sYXllci10aW1lLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2NhbGVzIGZyb20gJy4uL3V0aWxzL3NjYWxlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyVGltZUNvbnRleHQge1xuICAvKipcbiAgICogQHBhcmFtIHtUaW1lbGluZVRpbWVDb250ZXh0fSBwYXJlbnQgLSBUaGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGluc3RhbmNlIG9mIHRoZSB0aW1lbGluZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmVudCkge1xuICAgIGlmICghcGFyZW50KSB7IHRocm93IG5ldyBFcnJvcignTGF5ZXJUaW1lQ29udGV4dCBtdXN0IGhhdmUgYSBwYXJlbnQnKTsgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCBpbnN0YW5jZSBvZiB0aGUgdGltZWxpbmUuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7VGltZWxpbmVUaW1lQ29udGV4dH1cbiAgICAgKi9cbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLl9sb2NrZWRUb1BhcmVudEludGVydmFsID0gZmFsc2U7XG5cbiAgICB0aGlzLl90aW1lVG9QaXhlbCA9IG51bGw7XG4gICAgdGhpcy5fc3RhcnQgPSAwO1xuICAgIHRoaXMuX2R1cmF0aW9uID0gcGFyZW50LnZpc2libGVEdXJhdGlvbjtcbiAgICB0aGlzLl9vZmZzZXQgPSAwO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IDE7XG4gICAgLy8gcmVnaXN0ZXIgaW50byB0aGUgdGltZWxpbmUncyBUaW1lQ29udGV4dFxuICAgIHRoaXMucGFyZW50Ll9jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgY3VycmVudCB0aW1lIGNvbnRleHQuXG4gICAqXG4gICAqIEByZXR1cm4ge0xheWVyVGltZUNvbnRleHR9XG4gICAqL1xuICBjbG9uZSgpIHtcbiAgICBjb25zdCBjdHggPSBuZXcgdGhpcygpO1xuXG4gICAgY3R4LnBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgIGN0eC5zdGFydCA9IHRoaXMuc3RhcnQ7XG4gICAgY3R4LmR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbjtcbiAgICBjdHgub2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgY3R4LnN0cmV0Y2hSYXRpbyA9IHRoaXMuc3RyZXRjaFJhdGlvOyAvLyBjcmVhdGVzIHRoZSBsb2NhbCBzY2FsZSBpZiBuZWVkZWRcblxuICAgIHJldHVybiBjdHg7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3RhcnQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5fbG9ja2VkVG9QYXJlbnRJbnRlcnZhbCk/IHRoaXMuX3N0YXJ0IDogLXRoaXMucGFyZW50Lm9mZnNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgdGltZSBjb250ZXh0IChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBzdGFydCh2YWx1ZSkge1xuICAgIHRoaXMuX3N0YXJ0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZHVyYXRpb24gb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgcmV0dXJuICghdGhpcy5fbG9ja2VkVG9QYXJlbnRJbnRlcnZhbCk/IHRoaXMuX2R1cmF0aW9uIDogdGhpcy5wYXJlbnQudmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGR1cmF0aW9uIG9mIHRoZSB0aW1lIGNvbnRleHQgKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IGR1cmF0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5fZHVyYXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBvZmZzZXQgb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgb2Zmc2V0KCkge1xuICAgIHJldHVybiAoIXRoaXMuX2xvY2tlZFRvUGFyZW50SW50ZXJ2YWwpPyB0aGlzLl9vZmZzZXQgOiB0aGlzLnBhcmVudC5vZmZzZXQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgb2Zmc2V0IG9mIHRoZSB0aW1lIGNvbnRleHQgKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMuX29mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHN0cmV0Y2ggcmF0aW8gb2YgdGhlIHRpbWUgY29udGV4dC5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzdHJldGNoIHJhdGlvIG9mIHRoZSB0aW1lIGNvbnRleHQuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgc3RyZXRjaFJhdGlvKHZhbHVlKSB7XG4gICAgLy8gcmVtb3ZlIGxvY2FsIHNjYWxlIGlmIHJhdGlvID0gMVxuICAgIGlmICh2YWx1ZSA9PT0gIDEpIHtcbiAgICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gcmV1c2UgcHJldmlzb3VzbHkgY3JlYXRlZCBsb2NhbCBzY2FsZSBpZiBleGlzdHNcbiAgICBjb25zdCB0aW1lVG9QaXhlbCA9IHRoaXMuX3RpbWVUb1BpeGVsID9cbiAgICAgIHRoaXMuX3RpbWVUb1BpeGVsIDogc2NhbGVzLmxpbmVhcigpLmRvbWFpbihbMCwgMV0pO1xuXG4gICAgdGltZVRvUGl4ZWwucmFuZ2UoWzAsIHRoaXMucGFyZW50LmNvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kICogdmFsdWVdKTtcblxuICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gdGltZVRvUGl4ZWw7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdGltZSB0byBwaXhlbCB0cmFuc2ZlcnQgZnVuY3Rpb24gb2YgdGhlIHRpbWUgY29udGV4dC4gSWZcbiAgICogdGhlIGBzdHJldGNoUmF0aW9gIGF0dHJpYnV0ZSBpcyBlcXVhbCB0byAxLCB0aGlzIGZ1bmN0aW9uIGlzIHRoZSBnbG9iYWxcbiAgICogb25lIGZyb20gdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIGlmICghdGhpcy5fdGltZVRvUGl4ZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC50aW1lVG9QaXhlbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGltZVRvUGl4ZWw7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGNvbnZlcnQgcGl4ZWwgdG8gdGltZS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHB4XG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIHBpeGVsVG9UaW1lKHB4KSB7XG4gICAgaWYgKCF0aGlzLl90aW1lVG9QaXhlbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnRpbWVUb1BpeGVsLmludmVydChweCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3RpbWVUb1BpeGVsLmludmVydChweCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0aW1lIGludGVydmFsIG9mIHRoZSB2aXNpYmxlIGFyZWEgaW4gdGhlIHRpbWVsaW5lLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fSBcbiAgICovXG4gIGdldCB2aXNpYmxlSW50ZXJ2YWwoKSB7XG4gICAgdmFyIGludGVydmFsID0ge307XG4gICAgaW50ZXJ2YWwuc3RhcnQgPSAtdGhpcy5vZmZzZXQ7XG4gICAgaW50ZXJ2YWwuZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uO1xuICAgIHJldHVybiBpbnRlcnZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1cyB0aGUgdGltZWxpbmUgdmlzaWJsZSBhcmVhIGluIHRoZSBwcm92aWRlZCB0aW1lIGludGVydmFsLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fSBcbiAgICovXG4gIHNldCB2aXNpYmxlSW50ZXJ2YWwodmFsdWUpIHtcbiAgICB0aGlzLm9mZnNldCA9IC12YWx1ZS5zdGFydDtcbiAgICB0aGlzLmR1cmF0aW9uID0gdmFsdWUuZHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogIFRPRE9cbiAgICovXG4gIGdldCBsb2NrZWRUb1BhcmVudEludGVydmFsKCkge1xuICAgIHJldHVybiB0aGlzLl9sb2NrZWRUb1BhcmVudEludGVydmFsO1xuICB9XG5cbiAgc2V0IGxvY2tlZFRvUGFyZW50SW50ZXJ2YWwodmFsdWUpIHtcbiAgICB0aGlzLl9sb2NrZWRUb1BhcmVudEludGVydmFsID0gdmFsdWU7XG4gIH1cbn1cbiJdfQ==