'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _eventSource = require('./event-source');

var _eventSource2 = _interopRequireDefault(_eventSource);

var _waveEvent = require('./wave-event');

var _waveEvent2 = _interopRequireDefault(_waveEvent);

/**
 * Normalizes mouse user interactions with the timeline upon the DOM
 * container element of `Track` instances. As soon as a `track` is added to a
 * `timeline`, its attached `Surface` instance will emit the mouse events.
 */

var KonvaMouseSurface = (function (_EventSource) {
  _inherits(KonvaMouseSurface, _EventSource);

  /**
   * @param {DOMElement} el - The DOM element to listen.
   * @todo - Add some padding to the surface.
   */

  function KonvaMouseSurface($el) {
    _classCallCheck(this, KonvaMouseSurface);

    _get(Object.getPrototypeOf(KonvaMouseSurface.prototype), 'constructor', this).call(this, $el);

    /**
     * The name of the event source.
     * @type {String}
     */
    this.sourceName = 'surface';
    this._mouseDownEvent = null;
    this._lastEvent = null;
  }

  /**
   * Factory method for `Event` class
   */

  _createClass(KonvaMouseSurface, [{
    key: '_createEvent',
    value: function _createEvent(type, e) {
      var event = new _waveEvent2['default'](this.sourceName, type, e);

      var pos = this._getRelativePosition(e);
      event.x = pos.x;
      event.y = pos.y;

      return event;
    }

    /**
     * Returns the x, y coordinates coordinates relative to the surface element.
     *
     * @param {Event} e - Raw event from listener.
     * @return {Object}
     * @todo - handle padding.
     */
  }, {
    key: '_getRelativePosition',
    value: function _getRelativePosition(e) {
      if (e instanceof MouseEvent) {
        var x = e.offsetX;
        var y = e.offsetY;
        return { x: x, y: y };
      } else {
        var x = e.evt.offsetX;
        var y = e.evt.offsetY;
        return { x: x, y: y };
      }
    }
  }, {
    key: '_defineArea',
    value: function _defineArea(e, mouseDownEvent, lastEvent) {
      if (!mouseDownEvent || !lastEvent) {
        return;
      }
      e.dx = e.x - lastEvent.x;
      e.dy = e.y - lastEvent.y;

      var left = mouseDownEvent.x < e.x ? mouseDownEvent.x : e.x;
      var top = mouseDownEvent.y < e.y ? mouseDownEvent.y : e.y;
      var width = Math.abs(Math.round(e.x - mouseDownEvent.x));
      var height = Math.abs(Math.round(e.y - mouseDownEvent.y));

      e.area = { left: left, top: top, width: width, height: height };
    }

    /**
     * Keep this private to avoid double event binding. Main logic of the surface
     * is here. Should be extended with needed events (mouseenter, mouseleave,
     * wheel ...).
     */
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this = this;

      var onMouseDown = function onMouseDown(e) {
        // By removing the previous selection we prevent bypassing the mousemove events coming from SVG in Firefox.
        window.getSelection().removeAllRanges();
        var event = _this._createEvent('mousedown', e);

        _this._mouseDownEvent = event;
        _this._lastEvent = event;
        // Register mousemove and mouseup listeners on window
        window.addEventListener('mousemove', onMouseDrag, false);
        window.addEventListener('mouseup', onMouseUp, false);

        event.cancelBubble = true;

        _this.emit('event', event);
      };

      var onMouseDrag = function onMouseDrag(e) {

        var event = _this._createEvent('mousemove', e);
        _this._defineArea(event, _this._mouseDownEvent, _this._lastEvent);
        // Update `lastEvent` for next call
        _this._lastEvent = event;

        _this.emit('event', event);
      };

      var onMouseUp = function onMouseUp(e) {

        if (_this._lastEvent.type == 'mousemove') {

          var _event = _this._createEvent('mouseup', e);
          _this._defineArea(_event, _this._mouseDownEvent, _this._lastEvent);

          _this._mouseDownEvent = null;
          _this._lastEvent = null;
          // Remove mousemove and mouseup listeners on window
          window.removeEventListener('mousemove', onMouseDrag);
          window.removeEventListener('mouseup', onMouseUp);

          _this.emit('event', _event);
        } else if (_this._lastEvent.type == 'mousedown') {

          var event1 = _this._createEvent('mouseup', e);
          var event2 = _this._createEvent('click', e);
          event2.target = _this._mouseDownEvent.target;

          _this._mouseDownEvent = null;
          _this._lastEvent = null;

          // Remove mousemove and mouseup listeners on window
          window.removeEventListener('mousemove', onMouseDrag);
          window.removeEventListener('mouseup', onMouseUp);

          _this.emit('event', event1);
          _this.emit('event', event2);
        }
      };

      var onClick = function onClick(e) {
        var event = _this._createEvent('click', e);
        _this.emit('event', event);
      };

      var onDblClick = function onDblClick(e) {
        var event = _this._createEvent('dblclick', e);
        _this.emit('event', event);
      };

      var onMouseOver = function onMouseOver(e) {
        var event = _this._createEvent('mouseover', e);
        _this.emit('event', event);
      };

      var onMouseOut = function onMouseOut(e) {
        var event = _this._createEvent('mouseout', e);
        _this.emit('event', event);
      };

      var onMouseDownTimeline = function onMouseDownTimeline(e) {
        var event = _this._createEvent('mousedown', e);
        _this.emit('event', event);
      };

      /*
       * When I listen for the 'click' event, there is the following issue for 'drag' sequences:
       *
       * (1) [mousedown -> mousemove -> click -> mouseup] 
       *  instead of 
       * (2) [mousedown -> mousemove -> mouseup]
       * 
       * For this reason, instead of directly listening for 'click', I adapted the 'mouseup' 
       * listener to enforce the sequence (2) and [mousedown -> mouseup -> click] .
       */

      // Bind callbacks
      // this.$el.$stage.on('contentMousedown', onMouseDownTimeline);
      this.$el.$stage.on('mousedown', onMouseDown);
      // this.$el.$stage.on('click', onClick);
      this.$el.$stage.on('dblclick', onDblClick);
      this.$el.$stage.on('mouseover', onMouseOver);
      this.$el.$stage.on('mouseout', onMouseOut);
      this.$el.$stage.on('mouseover', onMouseOver);
    }
  }]);

  return KonvaMouseSurface;
})(_eventSource2['default']);

exports['default'] = KonvaMouseSurface;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pbnRlcmFjdGlvbnMva29udmEtbW91c2Utc3VyZmFjZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzJCQUF3QixnQkFBZ0I7Ozs7eUJBQ2IsY0FBYzs7Ozs7Ozs7OztJQU9wQixpQkFBaUI7WUFBakIsaUJBQWlCOzs7Ozs7O0FBS3pCLFdBTFEsaUJBQWlCLENBS3hCLEdBQUcsRUFBRTswQkFMRSxpQkFBaUI7O0FBTWxDLCtCQU5pQixpQkFBaUIsNkNBTTVCLEdBQUcsRUFBRTs7Ozs7O0FBTVgsUUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7QUFDNUIsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDNUIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7R0FDeEI7Ozs7OztlQWZrQixpQkFBaUI7O1dBb0J4QixzQkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ3BCLFVBQU0sS0FBSyxHQUFHLDJCQUFtQixJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFM0QsVUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFdBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNoQixXQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRWhCLGFBQU8sS0FBSyxDQUFDO0tBQ2Q7Ozs7Ozs7Ozs7O1dBU21CLDhCQUFDLENBQUMsRUFBRTtBQUN0QixVQUFJLENBQUMsWUFBWSxVQUFVLEVBQUU7QUFDM0IsWUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNsQixZQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ2xCLGVBQU8sRUFBRSxDQUFDLEVBQUQsQ0FBQyxFQUFFLENBQUMsRUFBRCxDQUFDLEVBQUUsQ0FBQztPQUNqQixNQUFNO0FB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Q0FBQyxDQUFDO0FBQzNDLFVBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDN0MsVUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMzQyxVQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0tBQzlDOzs7U0E3S2tCLGlCQUFpQjs7O3FCQUFqQixpQkFBaUIiLCJmaWxlIjoic3JjL2ludGVyYWN0aW9ucy9rb252YS1tb3VzZS1zdXJmYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50U291cmNlIGZyb20gJy4vZXZlbnQtc291cmNlJztcbmltcG9ydCBLb252YVdhdmVFdmVudCBmcm9tICcuL3dhdmUtZXZlbnQnO1xuXG4vKipcbiAqIE5vcm1hbGl6ZXMgbW91c2UgdXNlciBpbnRlcmFjdGlvbnMgd2l0aCB0aGUgdGltZWxpbmUgdXBvbiB0aGUgRE9NXG4gKiBjb250YWluZXIgZWxlbWVudCBvZiBgVHJhY2tgIGluc3RhbmNlcy4gQXMgc29vbiBhcyBhIGB0cmFja2AgaXMgYWRkZWQgdG8gYVxuICogYHRpbWVsaW5lYCwgaXRzIGF0dGFjaGVkIGBTdXJmYWNlYCBpbnN0YW5jZSB3aWxsIGVtaXQgdGhlIG1vdXNlIGV2ZW50cy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgS29udmFNb3VzZVN1cmZhY2UgZXh0ZW5kcyBFdmVudFNvdXJjZXtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gZWwgLSBUaGUgRE9NIGVsZW1lbnQgdG8gbGlzdGVuLlxuICAgKiBAdG9kbyAtIEFkZCBzb21lIHBhZGRpbmcgdG8gdGhlIHN1cmZhY2UuXG4gICAqL1xuICBjb25zdHJ1Y3RvcigkZWwpIHtcbiAgICBzdXBlcigkZWwpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHNvdXJjZS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuc291cmNlTmFtZSA9ICdzdXJmYWNlJztcbiAgICB0aGlzLl9tb3VzZURvd25FdmVudCA9IG51bGw7XG4gICAgdGhpcy5fbGFzdEV2ZW50ID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGYWN0b3J5IG1ldGhvZCBmb3IgYEV2ZW50YCBjbGFzc1xuICAgKi9cbiAgX2NyZWF0ZUV2ZW50KHR5cGUsIGUpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBLb252YVdhdmVFdmVudCh0aGlzLnNvdXJjZU5hbWUsIHR5cGUsIGUpO1xuXG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0UmVsYXRpdmVQb3NpdGlvbihlKTtcbiAgICBldmVudC54ID0gcG9zLng7XG4gICAgZXZlbnQueSA9IHBvcy55O1xuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHgsIHkgY29vcmRpbmF0ZXMgY29vcmRpbmF0ZXMgcmVsYXRpdmUgdG8gdGhlIHN1cmZhY2UgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZSAtIFJhdyBldmVudCBmcm9tIGxpc3RlbmVyLlxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqIEB0b2RvIC0gaGFuZGxlIHBhZGRpbmcuXG4gICAqL1xuICBfZ2V0UmVsYXRpdmVQb3NpdGlvbihlKSB7XG4gICAgaWYgKGUgaW5zdGFuY2VvZiBNb3VzZUV2ZW50KSB7XG4gICAgICBsZXQgeCA9IGUub2Zmc2V0WDtcbiAgICAgIGxldCB5ID0gZS5vZmZzZXRZO1xuICAgICAgcmV0dXJuIHsgeCwgeSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgeCA9IGUuZXZ0Lm9mZnNldFg7XG4gICAgICBsZXQgeSA9IGUuZXZ0Lm9mZnNldFk7XG4gICAgICByZXR1cm4geyB4LCB5IH07XG4gICAgfVxuICB9XG5cbiAgX2RlZmluZUFyZWEoZSwgbW91c2VEb3duRXZlbnQsIGxhc3RFdmVudCkge1xuICAgIGlmICghbW91c2VEb3duRXZlbnQgfHwgIWxhc3RFdmVudCkgeyByZXR1cm47IH1cbiAgICBlLmR4ID0gZS54IC0gbGFzdEV2ZW50Lng7XG4gICAgZS5keSA9IGUueSAtIGxhc3RFdmVudC55O1xuXG4gICAgY29uc3QgbGVmdCA9IG1vdXNlRG93bkV2ZW50LnggPCBlLnggPyBtb3VzZURvd25FdmVudC54IDogZS54O1xuICAgIGNvbnN0IHRvcCAgPSBtb3VzZURvd25FdmVudC55IDwgZS55ID8gbW91c2VEb3duRXZlbnQueSA6IGUueTtcbiAgICBjb25zdCB3aWR0aCAgPSBNYXRoLmFicyhNYXRoLnJvdW5kKGUueCAtIG1vdXNlRG93bkV2ZW50LngpKTtcbiAgICBjb25zdCBoZWlnaHQgPSBNYXRoLmFicyhNYXRoLnJvdW5kKGUueSAtIG1vdXNlRG93bkV2ZW50LnkpKTtcblxuICAgIGUuYXJlYSA9IHsgbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cblxuICAvKipcbiAgICogS2VlcCB0aGlzIHByaXZhdGUgdG8gYXZvaWQgZG91YmxlIGV2ZW50IGJpbmRpbmcuIE1haW4gbG9naWMgb2YgdGhlIHN1cmZhY2VcbiAgICogaXMgaGVyZS4gU2hvdWxkIGJlIGV4dGVuZGVkIHdpdGggbmVlZGVkIGV2ZW50cyAobW91c2VlbnRlciwgbW91c2VsZWF2ZSxcbiAgICogd2hlZWwgLi4uKS5cbiAgICovXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IG9uTW91c2VEb3duID0gKGUpID0+IHtcbiAgICAgIC8vIEJ5IHJlbW92aW5nIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gd2UgcHJldmVudCBieXBhc3NpbmcgdGhlIG1vdXNlbW92ZSBldmVudHMgY29taW5nIGZyb20gU1ZHIGluIEZpcmVmb3guXG4gICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICBjb25zdCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdtb3VzZWRvd24nLCBlKTtcblxuXG4gICAgICB0aGlzLl9tb3VzZURvd25FdmVudCA9IGV2ZW50O1xuICAgICAgdGhpcy5fbGFzdEV2ZW50ID0gZXZlbnQ7XG4gICAgICAvLyBSZWdpc3RlciBtb3VzZW1vdmUgYW5kIG1vdXNldXAgbGlzdGVuZXJzIG9uIHdpbmRvd1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VEcmFnLCBmYWxzZSk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCwgZmFsc2UpO1xuXG4gICAgICBldmVudC5jYW5jZWxCdWJibGUgPSB0cnVlO1xuXG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbk1vdXNlRHJhZyA9IChlKSA9PiB7XG5cbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdtb3VzZW1vdmUnLCBlKTtcbiAgICAgIHRoaXMuX2RlZmluZUFyZWEoZXZlbnQsIHRoaXMuX21vdXNlRG93bkV2ZW50LCB0aGlzLl9sYXN0RXZlbnQpO1xuICAgICAgLy8gVXBkYXRlIGBsYXN0RXZlbnRgIGZvciBuZXh0IGNhbGxcbiAgICAgIHRoaXMuX2xhc3RFdmVudCA9IGV2ZW50O1xuXG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbk1vdXNlVXAgPSAoZSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5fbGFzdEV2ZW50LnR5cGUgPT0gJ21vdXNlbW92ZScpIHtcblxuICAgICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2V1cCcsIGUpO1xuICAgICAgICB0aGlzLl9kZWZpbmVBcmVhKGV2ZW50LCB0aGlzLl9tb3VzZURvd25FdmVudCwgdGhpcy5fbGFzdEV2ZW50KTtcblxuICAgICAgICB0aGlzLl9tb3VzZURvd25FdmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2xhc3RFdmVudCA9IG51bGw7XG4gICAgICAgIC8vIFJlbW92ZSBtb3VzZW1vdmUgYW5kIG1vdXNldXAgbGlzdGVuZXJzIG9uIHdpbmRvd1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZURyYWcpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG5cbiAgICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcblxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9sYXN0RXZlbnQudHlwZSA9PSAnbW91c2Vkb3duJykge1xuXG4gICAgICAgIGxldCBldmVudDEgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2V1cCcsIGUpO1xuICAgICAgICBsZXQgZXZlbnQyID0gdGhpcy5fY3JlYXRlRXZlbnQoJ2NsaWNrJywgZSk7XG4gICAgICAgIGV2ZW50Mi50YXJnZXQgPSB0aGlzLl9tb3VzZURvd25FdmVudC50YXJnZXQ7XG5cbiAgICAgICAgdGhpcy5fbW91c2VEb3duRXZlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLl9sYXN0RXZlbnQgPSBudWxsO1xuXG4gICAgICAgIC8vIFJlbW92ZSBtb3VzZW1vdmUgYW5kIG1vdXNldXAgbGlzdGVuZXJzIG9uIHdpbmRvd1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZURyYWcpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG5cbiAgICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50MSk7XG4gICAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudDIpO1xuXG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IG9uQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ2NsaWNrJywgZSk7XG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbkRibENsaWNrID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdkYmxjbGljaycsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25Nb3VzZU92ZXIgPSAoZSkgPT4ge1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ21vdXNlb3ZlcicsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25Nb3VzZU91dCA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2VvdXQnLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uTW91c2VEb3duVGltZWxpbmUgPSAoZSkgPT4ge1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ21vdXNlZG93bicsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBXaGVuIEkgbGlzdGVuIGZvciB0aGUgJ2NsaWNrJyBldmVudCwgdGhlcmUgaXMgdGhlIGZvbGxvd2luZyBpc3N1ZSBmb3IgJ2RyYWcnIHNlcXVlbmNlczpcbiAgICAgKlxuICAgICAqICgxKSBbbW91c2Vkb3duIC0+IG1vdXNlbW92ZSAtPiBjbGljayAtPiBtb3VzZXVwXSBcbiAgICAgKiAgaW5zdGVhZCBvZiBcbiAgICAgKiAoMikgW21vdXNlZG93biAtPiBtb3VzZW1vdmUgLT4gbW91c2V1cF1cbiAgICAgKiBcbiAgICAgKiBGb3IgdGhpcyByZWFzb24sIGluc3RlYWQgb2YgZGlyZWN0bHkgbGlzdGVuaW5nIGZvciAnY2xpY2snLCBJIGFkYXB0ZWQgdGhlICdtb3VzZXVwJyBcbiAgICAgKiBsaXN0ZW5lciB0byBlbmZvcmNlIHRoZSBzZXF1ZW5jZSAoMikgYW5kIFttb3VzZWRvd24gLT4gbW91c2V1cCAtPiBjbGlja10gLlxuICAgICAqL1xuXG4gICAgLy8gQmluZCBjYWxsYmFja3NcbiAgICAvLyB0aGlzLiRlbC4kc3RhZ2Uub24oJ2NvbnRlbnRNb3VzZWRvd24nLCBvbk1vdXNlRG93blRpbWVsaW5lKTtcbiAgICB0aGlzLiRlbC4kc3RhZ2Uub24oJ21vdXNlZG93bicsIG9uTW91c2VEb3duKTtcbiAgICAvLyB0aGlzLiRlbC4kc3RhZ2Uub24oJ2NsaWNrJywgb25DbGljayk7IFxuICAgIHRoaXMuJGVsLiRzdGFnZS5vbignZGJsY2xpY2snLCBvbkRibENsaWNrKTtcbiAgICB0aGlzLiRlbC4kc3RhZ2Uub24oJ21vdXNlb3ZlcicsIG9uTW91c2VPdmVyKTtcbiAgICB0aGlzLiRlbC4kc3RhZ2Uub24oJ21vdXNlb3V0Jywgb25Nb3VzZU91dCk7XG4gICAgdGhpcy4kZWwuJHN0YWdlLm9uKCdtb3VzZW92ZXInLCBvbk1vdXNlT3Zlcik7XG4gIH1cbn1cbiJdfQ==