'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _konva = require('konva');

var _konva2 = _interopRequireDefault(_konva);

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

var Marker = (function (_BaseShape) {
  _inherits(Marker, _BaseShape);

  function Marker() {
    _classCallCheck(this, Marker);

    _get(Object.getPrototypeOf(Marker.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Marker, [{
    key: 'destroy',
    value: function destroy() {
      this.$line.destroy();
      this.$line = null;
      this.$handler.destroy();
      this.$handler = null;
      _get(Object.getPrototypeOf(Marker.prototype), 'destroy', this).call(this);
    }
  }, {
    key: 'getClassName',
    value: function getClassName() {
      return 'marker';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        handlerWidth: 7,
        handlerHeight: 10,
        displayHandlers: true,
        opacity: 1,
        strokeWidth: 2,
        color: 'black',
        handlerColor: 'black'
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

      this.$el = [];

      this.$line = new _konva2['default'].Rect({});
      this.$line.addName('marker');
      this.$line.shape = this;

      this.$handler = new _konva2['default'].Rect({});
      this.$handler.addName('handler');
      this.$handler.shape = this;

      this.$el.push(this.$line);
      this.$el.push(this.$handler);

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var d = datum || this.datum;

      this.$line.visible(this.visible);
      this.$handler.visible(this.visible && this.params.displayHandlers);

      if (!this.visible) return;

      var x = renderingContext.timeToPixel(this.x(d)) - 0.5;
      var height = renderingContext.height;

      this.$line.x(x).y(0).width(this.params.strokeWidth);
      this.$line.height(height);
      this.$line.fill(this.params.color);

      this.$handler.x(x).y(0).width(this.params.handlerWidth).height(this.params.handlerHeight).fill(this.params.handlerColor);
    }
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
      var d = datum || this.datum;

      // handlers only are selectable
      var x = renderingContext.timeToPixel(this.x(d));
      var shapeX1 = x - (this.params.handlerWidth - 1) / 2;
      var shapeX2 = shapeX1 + this.params.handlerWidth;
      var shapeY1 = renderingContext.height - this.params.handlerHeight;
      var shapeY2 = renderingContext.height;

      var xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
      var yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
      var area = xOverlap * yOverlap;

      return area > 0;
    }
  }]);

  return Marker;
})(_baseShape2['default']);

exports['default'] = Marker;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QyxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM1RSxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzVFLFVBQU0sSUFBSSxHQUFHLFFBQVEsR0FBRyxRQUFRLENBQUM7O0FBRWpDLGFBQU8sSUFBSSxHQUFHLENBQUMsQ0FBQztLQUNqQjs7O1NBaEZrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJzcmMvc2hhcGVzL21hcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBLb252YSBmcm9tICdrb252YSc7XG5pbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmtlciBleHRlbmRzIEJhc2VTaGFwZSB7XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLiRsaW5lLmRlc3Ryb3koKTtcbiAgICB0aGlzLiRsaW5lID0gbnVsbDtcbiAgICB0aGlzLiRoYW5kbGVyLmRlc3Ryb3koKTtcbiAgICB0aGlzLiRoYW5kbGVyID0gbnVsbDtcbiAgICBzdXBlci5kZXN0cm95KCk7XG4gIH1cblxuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnbWFya2VyJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeDogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoYW5kbGVyV2lkdGg6IDcsXG4gICAgICBoYW5kbGVySGVpZ2h0OiAxMCxcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBzdHJva2VXaWR0aDogMiwgXG4gICAgICBjb2xvcjogJ2JsYWNrJyxcbiAgICAgIGhhbmRsZXJDb2xvcjogJ2JsYWNrJ1xuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIHRoaXMuJGVsID0gW107XG5cbiAgICB0aGlzLiRsaW5lID0gbmV3IEtvbnZhLlJlY3Qoe30pO1xuICAgIHRoaXMuJGxpbmUuYWRkTmFtZSgnbWFya2VyJyk7XG4gICAgdGhpcy4kbGluZS5zaGFwZSA9IHRoaXM7XG5cbiAgICB0aGlzLiRoYW5kbGVyID0gbmV3IEtvbnZhLlJlY3Qoe30pO1xuICAgIHRoaXMuJGhhbmRsZXIuYWRkTmFtZSgnaGFuZGxlcicpO1xuICAgIHRoaXMuJGhhbmRsZXIuc2hhcGUgPSB0aGlzO1xuXG4gICAgdGhpcy4kZWwucHVzaCh0aGlzLiRsaW5lKTtcbiAgICB0aGlzLiRlbC5wdXNoKHRoaXMuJGhhbmRsZXIpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgY29uc3QgZCA9IGRhdHVtIHx8IHRoaXMuZGF0dW07XG5cbiAgICB0aGlzLiRsaW5lLnZpc2libGUodGhpcy52aXNpYmxlKTtcbiAgICB0aGlzLiRoYW5kbGVyLnZpc2libGUodGhpcy52aXNpYmxlICYmIHRoaXMucGFyYW1zLmRpc3BsYXlIYW5kbGVycyk7XG5cbiAgICBpZiAoIXRoaXMudmlzaWJsZSkgIHJldHVybjtcblxuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkKSkgLSAwLjU7XG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICB0aGlzLiRsaW5lLngoeCkueSgwKS53aWR0aCh0aGlzLnBhcmFtcy5zdHJva2VXaWR0aCk7XG4gICAgdGhpcy4kbGluZS5oZWlnaHQoaGVpZ2h0KTtcbiAgICB0aGlzLiRsaW5lLmZpbGwodGhpcy5wYXJhbXMuY29sb3IpO1xuXG4gICAgdGhpcy4kaGFuZGxlci54KHgpLnkoMCkud2lkdGgodGhpcy5wYXJhbXMuaGFuZGxlcldpZHRoKS5oZWlnaHQodGhpcy5wYXJhbXMuaGFuZGxlckhlaWdodCkuZmlsbCh0aGlzLnBhcmFtcy5oYW5kbGVyQ29sb3IpO1xuICB9XG5cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIGNvbnN0IGQgPSBkYXR1bSB8fCB0aGlzLmRhdHVtO1xuXG4gICAgLy8gaGFuZGxlcnMgb25seSBhcmUgc2VsZWN0YWJsZVxuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkKSk7XG4gICAgY29uc3Qgc2hhcGVYMSA9IHggLSAodGhpcy5wYXJhbXMuaGFuZGxlcldpZHRoIC0gMSkgLyAyO1xuICAgIGNvbnN0IHNoYXBlWDIgPSBzaGFwZVgxICsgdGhpcy5wYXJhbXMuaGFuZGxlcldpZHRoO1xuICAgIGNvbnN0IHNoYXBlWTEgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodCAtIHRoaXMucGFyYW1zLmhhbmRsZXJIZWlnaHQ7XG4gICAgY29uc3Qgc2hhcGVZMiA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuXG4gICAgY29uc3QgeE92ZXJsYXAgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih4Miwgc2hhcGVYMikgLSBNYXRoLm1heCh4MSwgc2hhcGVYMSkpO1xuICAgIGNvbnN0IHlPdmVybGFwID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oeTIsIHNoYXBlWTIpIC0gTWF0aC5tYXgoeTEsIHNoYXBlWTEpKTtcbiAgICBjb25zdCBhcmVhID0geE92ZXJsYXAgKiB5T3ZlcmxhcDtcblxuICAgIHJldHVybiBhcmVhID4gMDtcbiAgfVxufVxuIl19