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

var TraceDots = (function (_BaseShape) {
  _inherits(TraceDots, _BaseShape);

  function TraceDots() {
    _classCallCheck(this, TraceDots);

    _get(Object.getPrototypeOf(TraceDots.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TraceDots, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'trace-dots';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0, mean: 0, range: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        meanRadius: 3,
        rangeRadius: 3,
        meanColor: '#232323',
        rangeColor: 'steelblue'
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }
      // container
      this.$el = [];
      // draw mean dot
      this.$mean = new _konva2['default'].Circle({});
      this.$mean.shape = this;

      // range dots (0 => top, 1 => bottom)
      this.$max = new _konva2['default'].Circle({});
      this.$max.shape = this;

      this.$min = new _konva2['default'].Circle({});
      this.$min.shape = this;

      this.$el.push(this.$mean);
      this.$el.push(this.$max);
      this.$el.push(this.$min);

      return this.$el;
    }

    // @TODO use accessors
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var mean = this.mean(datum);
      var range = this.range(datum);
      var x = this.x(datum);
      var meanPos = renderingContext.valueToPixel(mean);
      var halfRange = range / 2;
      var max = renderingContext.valueToPixel(mean + halfRange);
      var min = renderingContext.valueToPixel(mean - halfRange);
      var xPos = renderingContext.timeToPixel(x);

      this.$mean.x(xPos).y(meanPos).radius(this.params.meanRadius).stroke(this.params.rangeColor).fill('transparent').addName('mean');

      this.$max.x(xPos).y(max).radius(this.params.meanRadius).stroke(this.params.rangeColor).fill('transparent').addName('max');

      this.$min.x(xPos).y(min).radius(this.params.meanRadius).stroke(this.params.rangeColor).fill('transparent').addName('min');
    }
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
      var x = renderingContext.timeToPixel(this.x(datum));
      var mean = renderingContext.valueToPixel(this.mean(datum));
      var range = renderingContext.valueToPixel(this.range(datum));
      var min = mean - range / 2;
      var max = mean + range / 2;

      if (x > x1 && x < x2 && (min > y1 || max < y2)) {
        return true;
      }

      return false;
    }
  }]);

  return TraceDots;
})(_baseShape2['default']);

exports['default'] = TraceDots;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvdHJhY2UtZG90cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3FCQUFrQixPQUFPOzs7O3lCQUNILGNBQWM7Ozs7SUFFZixTQUFTO1lBQVQsU0FBUzs7V0FBVCxTQUFTOzBCQUFULFNBQVM7OytCQUFULFNBQVM7OztlQUFULFNBQVM7O1dBQ2hCLHdCQUFHO0FBQUUsYUFBTyxZQUFZLENBQUM7S0FBRTs7O1dBRXZCLDRCQUFHO0FBQ2pCLGFBQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDO0tBQ3BDOzs7V0FFVyx3QkFBRztBQUNiLGFBQU87QUFDTCxrQkFBVSxFQUFFLENBQUM7QUFDYixtQkFBVyxFQUFFLENBQUM7QUFDZCxpQkFBUyxFQUFFLFNBQVM7QUFDcEIsa0JBQVUsRUFBRSxXQUFXO09BQ3hCLENBQUM7S0FDSDs7O1dBRUssZ0JBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsVUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO09BQUU7O0FBRWxDLFVBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDOztBQUVkLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxtQkFBTSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEMsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOzs7QUFHeEIsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLG1CQUFNLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqQyxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRXZCLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxtQkFBTSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakMsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxD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LEtBQUssR0FBRyxDQUFDLEFBQUMsQ0FBQzs7QUFFL0IsVUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssR0FBRyxHQUFHLEVBQUUsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFBLEFBQUMsRUFBRTtBQUM5QyxlQUFPLElBQUksQ0FBQztPQUNiOztBQUVELGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztTQXJGa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoic3JjL3NoYXBlcy90cmFjZS1kb3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEtvbnZhIGZyb20gJ2tvbnZhJztcbmltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2VEb3RzIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3RyYWNlLWRvdHMnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCBtZWFuOiAwLCByYW5nZTogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtZWFuUmFkaXVzOiAzLFxuICAgICAgcmFuZ2VSYWRpdXM6IDMsXG4gICAgICBtZWFuQ29sb3I6ICcjMjMyMzIzJyxcbiAgICAgIHJhbmdlQ29sb3I6ICdzdGVlbGJsdWUnXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuICAgIC8vIGNvbnRhaW5lclxuICAgIHRoaXMuJGVsID0gW107XG4gICAgLy8gZHJhdyBtZWFuIGRvdFxuICAgIHRoaXMuJG1lYW4gPSBuZXcgS29udmEuQ2lyY2xlKHt9KTtcbiAgICB0aGlzLiRtZWFuLnNoYXBlID0gdGhpcztcblxuICAgIC8vIHJhbmdlIGRvdHMgKDAgPT4gdG9wLCAxID0+IGJvdHRvbSlcbiAgICB0aGlzLiRtYXggPSBuZXcgS29udmEuQ2lyY2xlKHt9KTtcbiAgICB0aGlzLiRtYXguc2hhcGUgPSB0aGlzO1xuXG4gICAgdGhpcy4kbWluID0gbmV3IEtvbnZhLkNpcmNsZSh7fSk7XG4gICAgdGhpcy4kbWluLnNoYXBlID0gdGhpcztcblxuICAgIHRoaXMuJGVsLnB1c2godGhpcy4kbWVhbik7XG4gICAgdGhpcy4kZWwucHVzaCh0aGlzLiRtYXgpO1xuICAgIHRoaXMuJGVsLnB1c2godGhpcy4kbWluKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIC8vIEBUT0RPIHVzZSBhY2Nlc3NvcnNcbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgY29uc3QgbWVhbiA9IHRoaXMubWVhbihkYXR1bSk7XG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJhbmdlKGRhdHVtKTtcbiAgICBjb25zdCB4ID0gdGhpcy54KGRhdHVtKTtcbiAgICBjb25zdCBtZWFuUG9zID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwobWVhbik7XG4gICAgY29uc3QgaGFsZlJhbmdlID0gcmFuZ2UgLyAyO1xuICAgIGNvbnN0IG1heCA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4gKyBoYWxmUmFuZ2UpO1xuICAgIGNvbnN0IG1pbiA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4gLSBoYWxmUmFuZ2UpO1xuICAgIGNvbnN0IHhQb3MgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHgpO1xuICAgIFxuXG4gICAgdGhpcy4kbWVhbi54KHhQb3MpXG4gICAgICAgICAgICAgIC55KG1lYW5Qb3MpXG4gICAgICAgICAgICAgIC5yYWRpdXModGhpcy5wYXJhbXMubWVhblJhZGl1cylcbiAgICAgICAgICAgICAgLnN0cm9rZSh0aGlzLnBhcmFtcy5yYW5nZUNvbG9yKVxuICAgICAgICAgICAgICAuZmlsbCgndHJhbnNwYXJlbnQnKVxuICAgICAgICAgICAgICAuYWRkTmFtZSgnbWVhbicpO1xuXG4gICAgdGhpcy4kbWF4LngoeFBvcylcbiAgICAgICAgICAgICAgLnkobWF4KVxuICAgICAgICAgICAgICAucmFkaXVzKHRoaXMucGFyYW1zLm1lYW5SYWRpdXMpXG4gICAgICAgICAgICAgIC5zdHJva2UodGhpcy5wYXJhbXMucmFuZ2VDb2xvcilcbiAgICAgICAgICAgICAgLmZpbGwoJ3RyYW5zcGFyZW50JylcbiAgICAgICAgICAgICAgLmFkZE5hbWUoJ21heCcpO1xuXG4gICAgXG4gICAgdGhpcy4kbWluLngoeFBvcylcbiAgICAgICAgICAgICAgLnkobWluKVxuICAgICAgICAgICAgICAucmFkaXVzKHRoaXMucGFyYW1zLm1lYW5SYWRpdXMpXG4gICAgICAgICAgICAgIC5zdHJva2UodGhpcy5wYXJhbXMucmFuZ2VDb2xvcilcbiAgICAgICAgICAgICAgLmZpbGwoJ3RyYW5zcGFyZW50JylcbiAgICAgICAgICAgICAgLmFkZE5hbWUoJ21pbicpO1xuICB9XG5cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpO1xuICAgIGNvbnN0IG1lYW4gPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLm1lYW4oZGF0dW0pKTtcbiAgICBjb25zdCByYW5nZSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMucmFuZ2UoZGF0dW0pKTtcbiAgICBjb25zdCBtaW4gPSBtZWFuIC0gKHJhbmdlIC8gMik7XG4gICAgY29uc3QgbWF4ID0gbWVhbiArIChyYW5nZSAvIDIpO1xuXG4gICAgaWYgKHggPiB4MSAmJiB4IDwgeDIgJiYgKG1pbiA+IHkxIHx8IG1heCA8IHkyKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iXX0=