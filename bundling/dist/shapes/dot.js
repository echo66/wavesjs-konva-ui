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

var Dot = (function (_BaseShape) {
	_inherits(Dot, _BaseShape);

	function Dot() {
		_classCallCheck(this, Dot);

		_get(Object.getPrototypeOf(Dot.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(Dot, [{
		key: 'destroy',
		value: function destroy() {
			this.$el.destroy();
			_get(Object.getPrototypeOf(Dot.prototype), 'destroy', this).call(this);
		}
	}, {
		key: 'getClassName',
		value: function getClassName() {
			return 'dot';
		}

		// @TODO rename : confusion between accessors and meta-accessors
	}, {
		key: '_getAccessorList',
		value: function _getAccessorList() {
			return { x: 0, y: 0 };
		}
	}, {
		key: '_getDefaults',
		value: function _getDefaults() {
			return {
				color: 'black',
				r: 3
			};
		}
	}, {
		key: 'render',
		value: function render() {
			if (this.$el) {
				return this.$el;
			}

			this.$el = new _konva2['default'].Circle({});
			this.$el.shape = this;
			this.$el.perfectDrawEnabled(false);

			return this.$el;
		}
	}, {
		key: 'update',
		value: function update(renderingContext, datum) {
			var d = datum || this.datum;

			var x = renderingContext.timeToPixel(this.x(d));
			var y = renderingContext.valueToPixel(this.y(d));
			// const r	= this.r(d);
			// const color = this.color(d);
			var r = this.params.r;
			var color = this.params.color;

			this.$el.x(x);
			this.$el.y(y);
			this.$el.radius(r);
			this.$el.fill(color);
		}

		// x1, x2, y1, y2 => in pixel domain
	}, {
		key: 'inArea',
		value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
			var x = this.$el.getAbsolutePosition().x;
			var y = this.$el.getAbsolutePosition().y;

			if (x >= x1 && x <= x2 && (y >= y1 && y <= y2)) {
				return true;
			}

			return false;
		}
	}]);

	return Dot;
})(_baseShape2['default']);

exports['default'] = Dot;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvZG90LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBQWtCLE9BQU87Ozs7eUJBQ0gsY0FBYzs7OztJQUVmLEdBQUc7V0FBSCxHQUFHOztVQUFILEdBQUc7d0JBQUgsR0FBRzs7NkJBQUgsR0FBRzs7O2NBQUgsR0FBRzs7U0FFaEIsbUJBQUc7QUFDVCxPQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ25CLDhCQUptQixHQUFHLHlDQUlOO0dBQ2hCOzs7U0FFVyx3QkFBRztBQUFFLFVBQU8sS0FBSyxDQUFDO0dBQUU7Ozs7O1NBR2hCLDRCQUFHO0FBQ2xCLFVBQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztHQUN0Qjs7O1NBRVcsd0JBQUc7QUFDZCxVQUFPO0FBQ04sU0FBSyxFQUFFLE9BQU87QUFDZCxLQUFDLEVBQUUsQ0FBQztJQUNKLENBQUM7R0FDRjs7O1NBRUssa0JBQUc7QUFDUixPQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxXQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFBRTs7QUFFbEMsT0FBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLG1CQUFNLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNoQyxPQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDdEIsT0FBSSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFbkMsVUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0dBQ2hCOzs7U0FFSyxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUU7QUFDL0IsT0FBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7O0FBRTlCLE9BQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEQsT0FBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O0FBR25ELE9BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLE9BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDOztBQUVoQyxPQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE9BQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsT0FBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkIsT0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDckI7Ozs7O1NBR0ssZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUMvQyxPQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNDLE9BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTNDLE9BQUksQUFBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBLEFBQUMsRUFBRTtBQUNqRCxXQUFPLElBQUksQ0FBQztJQUNaOztBQUVELFVBQU8sS0FBSyxDQUFDO0dBQ2I7OztRQXpEbUIsR0FBRzs7O3FCQUFILEdBQUciLCJmaWxlIjoic3JjL3NoYXBlcy9kb3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgS29udmEgZnJvbSAna29udmEnO1xuaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3QgZXh0ZW5kcyBCYXNlU2hhcGUge1xuXG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy4kZWwuZGVzdHJveSgpO1xuXHRcdHN1cGVyLmRlc3Ryb3koKTtcblx0fVxuXG5cdGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdkb3QnOyB9XG5cblx0Ly8gQFRPRE8gcmVuYW1lIDogY29uZnVzaW9uIGJldHdlZW4gYWNjZXNzb3JzIGFuZCBtZXRhLWFjY2Vzc29yc1xuXHRfZ2V0QWNjZXNzb3JMaXN0KCkge1xuXHRcdHJldHVybiB7IHg6IDAsIHk6IDAgfTtcblx0fVxuXG5cdF9nZXREZWZhdWx0cygpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y29sb3I6ICdibGFjaycsIFxuXHRcdFx0cjogM1xuXHRcdH07XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0aWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG5cdFx0dGhpcy4kZWwgPSBuZXcgS29udmEuQ2lyY2xlKHt9KTtcblx0XHR0aGlzLiRlbC5zaGFwZSA9IHRoaXM7XG5cdFx0dGhpcy4kZWwucGVyZmVjdERyYXdFbmFibGVkKGZhbHNlKTtcblxuXHRcdHJldHVybiB0aGlzLiRlbDtcblx0fVxuXG5cdHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuXHRcdGNvbnN0IGQgPSBkYXR1bSB8fCB0aGlzLmRhdHVtO1xuXG5cdFx0Y29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGQpKTtcblx0XHRjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy55KGQpKTtcblx0XHQvLyBjb25zdCByXHQ9IHRoaXMucihkKTtcblx0XHQvLyBjb25zdCBjb2xvciA9IHRoaXMuY29sb3IoZCk7XG5cdFx0Y29uc3QgciA9IHRoaXMucGFyYW1zLnI7XG5cdFx0Y29uc3QgY29sb3IgPSB0aGlzLnBhcmFtcy5jb2xvcjtcblx0XHRcblx0XHR0aGlzLiRlbC54KHgpO1xuXHRcdHRoaXMuJGVsLnkoeSk7XG5cdFx0dGhpcy4kZWwucmFkaXVzKHIpO1xuXHRcdHRoaXMuJGVsLmZpbGwoY29sb3IpO1xuXHR9XG5cblx0Ly8geDEsIHgyLCB5MSwgeTIgPT4gaW4gcGl4ZWwgZG9tYWluXG5cdGluQXJlYShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpIHtcblx0XHRjb25zdCB4ID0gdGhpcy4kZWwuZ2V0QWJzb2x1dGVQb3NpdGlvbigpLng7XG5cdFx0Y29uc3QgeSA9IHRoaXMuJGVsLmdldEFic29sdXRlUG9zaXRpb24oKS55O1xuXG5cdFx0aWYgKCh4ID49IHgxICYmIHggPD0geDIpICYmICh5ID49IHkxICYmIHkgPD0geTIpKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cbiJdfQ==