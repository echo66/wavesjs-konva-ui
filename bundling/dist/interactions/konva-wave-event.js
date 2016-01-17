'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _waveEvent = require('./wave-event');

var _waveEvent2 = _interopRequireDefault(_waveEvent);

/**
 * Object template for all events. Event sources should use this event template
 * in order to keep consistency with existing sources.
 */

var KonvaWaveEvent = (function (_WaveEvent) {
  _inherits(KonvaWaveEvent, _WaveEvent);

  /**
   * @param {String} source - The name of the source (`keyboard`, `surface`, ...).
   * @param {String} type - The type of the source (`mousedown`, `keyup`, ...).
   * @param {Event} originalEvent - The original event as emitted by the browser.
   */

  function KonvaWaveEvent(source, type, originalEvent) {
    _classCallCheck(this, KonvaWaveEvent);

    _get(Object.getPrototypeOf(KonvaWaveEvent.prototype), 'constructor', this).call(this, source, type, originalEvent);
    if (!(originalEvent instanceof MouseEvent)) {
      this.originalEvent = originalEvent.evt;
      this.currentTarget = originalEvent.evt.currentTarget;
    }
  }

  return KonvaWaveEvent;
})(_waveEvent2['default']);

exports['default'] = KonvaWaveEvent;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pbnRlcmFjdGlvbnMva29udmEtd2F2ZS1ldmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozt5QkFBc0IsY0FBYzs7Ozs7Ozs7O0lBTWYsY0FBYztZQUFkLGNBQWM7Ozs7Ozs7O0FBTXRCLFdBTlEsY0FBYyxDQU1yQixNQUFNLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRTswQkFOdEIsY0FBYzs7QUFPL0IsK0JBUGlCLGNBQWMsNkNBT3pCLE1BQU0sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFO0FBQ25DLFFBQUksRUFBRSxhQUFhLFlBQVksVUFBVSxDQUFBLEFBQUMsRUFBRTtBQUMxQyxVQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUM7QUFDdkMsVUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztLQUN0RDtHQUNGOztTQVprQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiJzcmMvaW50ZXJhY3Rpb25zL2tvbnZhLXdhdmUtZXZlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgV2F2ZUV2ZW50IGZyb20gJy4vd2F2ZS1ldmVudCc7XG5cbi8qKlxuICogT2JqZWN0IHRlbXBsYXRlIGZvciBhbGwgZXZlbnRzLiBFdmVudCBzb3VyY2VzIHNob3VsZCB1c2UgdGhpcyBldmVudCB0ZW1wbGF0ZVxuICogaW4gb3JkZXIgdG8ga2VlcCBjb25zaXN0ZW5jeSB3aXRoIGV4aXN0aW5nIHNvdXJjZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtvbnZhV2F2ZUV2ZW50IGV4dGVuZHMgV2F2ZUV2ZW50e1xuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNvdXJjZSAtIFRoZSBuYW1lIG9mIHRoZSBzb3VyY2UgKGBrZXlib2FyZGAsIGBzdXJmYWNlYCwgLi4uKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBUaGUgdHlwZSBvZiB0aGUgc291cmNlIChgbW91c2Vkb3duYCwgYGtleXVwYCwgLi4uKS5cbiAgICogQHBhcmFtIHtFdmVudH0gb3JpZ2luYWxFdmVudCAtIFRoZSBvcmlnaW5hbCBldmVudCBhcyBlbWl0dGVkIGJ5IHRoZSBicm93c2VyLlxuICAgKi9cbiAgY29uc3RydWN0b3Ioc291cmNlLCB0eXBlLCBvcmlnaW5hbEV2ZW50KSB7XG4gICAgc3VwZXIoc291cmNlLCB0eXBlLCBvcmlnaW5hbEV2ZW50KTtcbiAgICBpZiAoIShvcmlnaW5hbEV2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCkpIHtcbiAgICAgIHRoaXMub3JpZ2luYWxFdmVudCA9IG9yaWdpbmFsRXZlbnQuZXZ0O1xuICAgICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gb3JpZ2luYWxFdmVudC5ldnQuY3VycmVudFRhcmdldDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==