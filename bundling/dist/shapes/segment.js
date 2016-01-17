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

var Segment = (function (_BaseShape) {
	_inherits(Segment, _BaseShape);

	function Segment() {
		_classCallCheck(this, Segment);

		_get(Object.getPrototypeOf(Segment.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(Segment, [{
		key: 'destroy',
		value: function destroy() {
			this.$segment.destroy();
			this.$segment = null;
			this.$leftHandler.destroy();
			this.$leftHandler = null;
			this.$rightHandler.destroy();
			this.$rightHandler = null;
			_get(Object.getPrototypeOf(Segment.prototype), 'destroy', this).call(this);
		}
	}, {
		key: 'getClassName',
		value: function getClassName() {
			return 'segment';
		}
	}, {
		key: '_getAccessorList',
		value: function _getAccessorList() {
			return { x: 0, y: 0, width: 1, height: 1 };
		}
	}, {
		key: '_getDefaults',
		value: function _getDefaults() {
			return {
				displayHandlers: true,
				handlerWidth: 2,
				handlerOpacity: 0.8,
				opacity: 0.6,
				handlerColor: '#000000',
				color: '#000000'
			};
		}
	}, {
		key: 'render',
		value: function render(renderingContext) {
			if (this.$el) {
				return this.$el;
			}

			this.$el = [];

			this.$segment = new _konva2['default'].Rect({});
			this.$segment.name('segment');
			// this.$segment.on('mouseover', function(e) { document.body.style.cursor = 'pointer'; });
			// this.$segment.on('mouseout', function(e) { document.body.style.cursor = 'default'; });
			this.$segment.shape = this;

			this.$el.push(this.$segment);

			this.$leftHandler = new _konva2['default'].Rect({});
			this.$leftHandler.addName('left');
			this.$leftHandler.addName('handler');
			// this.$leftHandler.on('mouseover', function() { document.body.style.cursor = 'ew-resize'; });
			// this.$leftHandler.on('mouseout', function() { document.body.style.cursor = 'default'; });
			this.$leftHandler.shape = this;

			this.$rightHandler = new _konva2['default'].Rect({});
			this.$rightHandler.addName('right');
			this.$rightHandler.addName('handler');
			// this.$rightHandler.on('mouseover', function() { document.body.style.cursor = 'ew-resize'; });
			// this.$rightHandler.on('mouseout', function() { document.body.style.cursor = 'default'; });
			this.$rightHandler.shape = this;

			this.$segment.perfectDrawEnabled(false);
			this.$leftHandler.perfectDrawEnabled(false);
			this.$rightHandler.perfectDrawEnabled(false);

			this.$el.push(this.$leftHandler);
			this.$el.push(this.$rightHandler);

			return this.$el;
		}
	}, {
		key: 'update',
		value: function update(renderingContext, datum) {
			var d = datum || this.datum;

			this.$segment.visible(this.visible);
			this.$leftHandler.visible(this.visible && this.params.displayHandlers);
			this.$rightHandler.visible(this.visible && this.params.displayHandlers);

			if (!this.visible) return;

			var width = renderingContext.timeToPixel(this.width(d));
			var height = Math.abs(renderingContext.valueToPixel(this.y(d) + this.height(d)) - renderingContext.valueToPixel(this.y(d)));
			var x = renderingContext.timeToPixel(this.x(d));
			var y = renderingContext.valueToPixel(this.y(d) + this.height(d));

			this.$segment.x(x).y(y).width(Math.max(width, 0)).height(height).fill(this.params.color).opacity(this.params.opacity);

			this.$leftHandler.x(x).y(y).width(this.params.handlerWidth).height(height).fill(this.params.handlerColor).opacity(this.params.handlerOpacity);

			this.$rightHandler.x(x + width - this.params.handlerWidth).y(y).height(height).width(this.params.handlerWidth).fill(this.params.handlerColor).opacity(this.params.handlerOpacity);
		}
	}, {
		key: 'inArea',
		value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
			var d = datum || this.datum;

			var shapeX1 = this.$segment.getAbsolutePosition().x;
			var shapeY1 = this.$segment.getAbsolutePosition().y;
			var shapeX2 = shapeX1 + this.$segment.width();
			var shapeY2 = shapeY1 + this.$segment.height();

			/*
    *	The segment is entirely within the provided area.
    */
			// if (x1 <= shapeX1 && x2 >= shapeX2 && y1 <= shapeY1 && y2 >= shapeY2)
			// 	return true;
			// else
			// 	return false;

			/*
    *	The segment overlaps the provided area.
    */
			var xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
			var yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
			var area = xOverlap * yOverlap;

			return area > 0;
		}
	}]);

	return Segment;
})(_baseShape2['default']);

exports['default'] = Segment;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvc2VnbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3FCQUFrQixPQUFPOzs7O3lCQUNILGNBQWM7Ozs7SUFFZixPQUFPO1dBQVAsT0FBTzs7VUFBUCxPQUFPO3dCQUFQLE9BQU87OzZCQUFQLE9BQU87OztjQUFQLE9BQU87O1NBRXBCLG1CQUFHO0FBQ1QsT0FBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN4QixPQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUNyQixPQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzVCLE9BQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLE9BQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsT0FBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsOEJBVG1CLE9BQU8seUNBU1Y7R0FDaEI7OztTQUVXLHdCQUFHO0FBQUUsVUFBTyxTQUFTLENBQUM7R0FBRTs7O1NBRXBCLDRCQUFHO0FBQ2xCLFVBQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7R0FDM0M7OztTQUVXLHdCQUFHO0FBQ2QsVUFBTztBQUNOLG1CQUFlLEVBQUUsSUFBSTtBQUNyQixnQkFBWSxFQUFFLENBQUM7QUFDZixrQkFBYyxFQUFFLEdBQUc7QUFDbkIsV0FBTyxFQUFFLEdBQUc7QUFDWixnQkFBWSxFQUFFLFNBQVM7QUFDdkIsU0FBSyxFQUFFLFNBQVM7SUFDaEIsQ0FBQztHQUNGOzs7U0FFSyxnQkFBQyxnQkFBZ0IsRUFBRTtBQUN4QixPQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxXQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFBRTs7QUFFbEMsT0FBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7O0FBRWQsT0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLG1CQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuQyxPQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7O0FBRzlCLE9BQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFM0IsT0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUU3QixPQUFJLENBQUMsWUFBWSxHQUFHLElBQUksbUJBQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDLE9BQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDLE9BQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7QUFHckMsT0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUUvQixPQUFJLENBQUMsYUFBYSxHQUFHLElBQUksbUJBQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLE9BQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BDLE9BQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7QUFHdEMsT0FBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVoQyxPQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLE9BQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUMsT0FBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFN0MsT0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2pDLE9BQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFbEMsVUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0dBQ2hCOzs7U0FFSyxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUU7QUFDL0IsT0FBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7O0FBRTlCLE9BQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNwQyxPQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDdkUsT0FBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUV4RSxPQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPOztBQUUxQixPQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELE9BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5SCxPQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xELE9BQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFcEUsT0FBSSxDQUFDLFFBQVEsQ0FDVixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ0osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNKLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUN6QixNQUFNLENBQUMsTUFBTSxDQUFDLENBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQ3ZCLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVoQyxPQUFJLENBQUMsWUFBWSxDQUNkLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDSixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ0osS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQy9CLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FDZCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FDOUIsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRXZDLE9BQUksQ0FBQyxhQUFhLENBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNKLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FDZCxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQzlCLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0dBQ3ZDOzs7U0FFSyxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQy9DLE9BQU0sQ0FBQyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDOztBQUU5QixPQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RELE9BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEQsT0FBTSxPQUFPLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDaEQsT0FBTSxPQUFPLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFhakQsT0FBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM1RSxPQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzVFLE9BQU0sSUFBSSxHQUFHLFFBQVEsR0FBRyxRQUFRLENBQUM7O0FBRWpDLFVBQU8sSUFBSSxHQUFHLENBQUMsQ0FBQztHQUNoQjs7O1FBakltQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiJzcmMvc2hhcGVzL3NlZ21lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgS29udmEgZnJvbSAna29udmEnO1xuaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50IGV4dGVuZHMgQmFzZVNoYXBlIHtcblxuXHRkZXN0cm95KCkge1xuXHRcdHRoaXMuJHNlZ21lbnQuZGVzdHJveSgpO1xuXHRcdHRoaXMuJHNlZ21lbnQgPSBudWxsO1xuXHRcdHRoaXMuJGxlZnRIYW5kbGVyLmRlc3Ryb3koKTtcblx0XHR0aGlzLiRsZWZ0SGFuZGxlciA9IG51bGw7XG5cdFx0dGhpcy4kcmlnaHRIYW5kbGVyLmRlc3Ryb3koKTtcblx0XHR0aGlzLiRyaWdodEhhbmRsZXIgPSBudWxsO1xuXHRcdHN1cGVyLmRlc3Ryb3koKTtcblx0fVxuXG5cdGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdzZWdtZW50JzsgfVxuXG5cdF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG5cdFx0cmV0dXJuIHsgeDogMCwgeTogMCwgd2lkdGg6IDEsIGhlaWdodDogMSB9O1xuXHR9XG5cblx0X2dldERlZmF1bHRzKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRkaXNwbGF5SGFuZGxlcnM6IHRydWUsXG5cdFx0XHRoYW5kbGVyV2lkdGg6IDIsXG5cdFx0XHRoYW5kbGVyT3BhY2l0eTogMC44LFxuXHRcdFx0b3BhY2l0eTogMC42LCBcblx0XHRcdGhhbmRsZXJDb2xvcjogJyMwMDAwMDAnLCBcblx0XHRcdGNvbG9yOiAnIzAwMDAwMCcsXG5cdFx0fTtcblx0fVxuXG5cdHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG5cdFx0aWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG5cdFx0dGhpcy4kZWwgPSBbXTtcblxuXHRcdHRoaXMuJHNlZ21lbnQgPSBuZXcgS29udmEuUmVjdCh7fSk7XG5cdFx0dGhpcy4kc2VnbWVudC5uYW1lKCdzZWdtZW50Jyk7XG5cdFx0Ly8gdGhpcy4kc2VnbWVudC5vbignbW91c2VvdmVyJywgZnVuY3Rpb24oZSkgeyBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJzsgfSk7XG5cdFx0Ly8gdGhpcy4kc2VnbWVudC5vbignbW91c2VvdXQnLCBmdW5jdGlvbihlKSB7IGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnOyB9KTtcblx0XHR0aGlzLiRzZWdtZW50LnNoYXBlID0gdGhpcztcblxuXHRcdHRoaXMuJGVsLnB1c2godGhpcy4kc2VnbWVudCk7XG5cblx0XHR0aGlzLiRsZWZ0SGFuZGxlciA9IG5ldyBLb252YS5SZWN0KHt9KTtcblx0XHR0aGlzLiRsZWZ0SGFuZGxlci5hZGROYW1lKCdsZWZ0Jyk7XG5cdFx0dGhpcy4kbGVmdEhhbmRsZXIuYWRkTmFtZSgnaGFuZGxlcicpO1xuXHRcdC8vIHRoaXMuJGxlZnRIYW5kbGVyLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbigpIHsgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSAnZXctcmVzaXplJzsgfSk7XG5cdFx0Ly8gdGhpcy4kbGVmdEhhbmRsZXIub24oJ21vdXNlb3V0JywgZnVuY3Rpb24oKSB7IGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnOyB9KTtcblx0XHR0aGlzLiRsZWZ0SGFuZGxlci5zaGFwZSA9IHRoaXM7XG5cblx0XHR0aGlzLiRyaWdodEhhbmRsZXIgPSBuZXcgS29udmEuUmVjdCh7fSk7XG5cdFx0dGhpcy4kcmlnaHRIYW5kbGVyLmFkZE5hbWUoJ3JpZ2h0Jyk7XG5cdFx0dGhpcy4kcmlnaHRIYW5kbGVyLmFkZE5hbWUoJ2hhbmRsZXInKTtcblx0XHQvLyB0aGlzLiRyaWdodEhhbmRsZXIub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKCkgeyBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9ICdldy1yZXNpemUnOyB9KTtcblx0XHQvLyB0aGlzLiRyaWdodEhhbmRsZXIub24oJ21vdXNlb3V0JywgZnVuY3Rpb24oKSB7IGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnOyB9KTtcblx0XHR0aGlzLiRyaWdodEhhbmRsZXIuc2hhcGUgPSB0aGlzO1xuXG5cdFx0dGhpcy4kc2VnbWVudC5wZXJmZWN0RHJhd0VuYWJsZWQoZmFsc2UpO1xuXHRcdHRoaXMuJGxlZnRIYW5kbGVyLnBlcmZlY3REcmF3RW5hYmxlZChmYWxzZSk7XG5cdFx0dGhpcy4kcmlnaHRIYW5kbGVyLnBlcmZlY3REcmF3RW5hYmxlZChmYWxzZSk7XG5cblx0XHR0aGlzLiRlbC5wdXNoKHRoaXMuJGxlZnRIYW5kbGVyKTtcblx0XHR0aGlzLiRlbC5wdXNoKHRoaXMuJHJpZ2h0SGFuZGxlcik7XG5cblx0XHRyZXR1cm4gdGhpcy4kZWw7XG5cdH1cblxuXHR1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHtcblx0XHRjb25zdCBkID0gZGF0dW0gfHwgdGhpcy5kYXR1bTtcblxuXHRcdHRoaXMuJHNlZ21lbnQudmlzaWJsZSh0aGlzLnZpc2libGUpO1xuXHRcdHRoaXMuJGxlZnRIYW5kbGVyLnZpc2libGUodGhpcy52aXNpYmxlICYmIHRoaXMucGFyYW1zLmRpc3BsYXlIYW5kbGVycyk7XG5cdFx0dGhpcy4kcmlnaHRIYW5kbGVyLnZpc2libGUodGhpcy52aXNpYmxlICYmIHRoaXMucGFyYW1zLmRpc3BsYXlIYW5kbGVycyk7XG5cblx0XHRpZiAoIXRoaXMudmlzaWJsZSlcdHJldHVybjtcblxuXHRcdGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLndpZHRoKGQpKTtcblx0XHRjb25zdCBoZWlnaHQgPSBNYXRoLmFicyhyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZCkgKyB0aGlzLmhlaWdodChkKSkgLSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZCkpKTtcblx0XHRjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZCkpO1xuXHRcdGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZCkgKyB0aGlzLmhlaWdodChkKSk7XG5cblx0XHR0aGlzLiRzZWdtZW50XG5cdFx0XHRcdC54KHgpXG5cdFx0XHRcdC55KHkpXG5cdFx0XHRcdC53aWR0aChNYXRoLm1heCh3aWR0aCwgMCkpXG5cdFx0XHRcdC5oZWlnaHQoaGVpZ2h0KVxuXHRcdFx0XHQuZmlsbCh0aGlzLnBhcmFtcy5jb2xvcilcblx0XHRcdFx0Lm9wYWNpdHkodGhpcy5wYXJhbXMub3BhY2l0eSk7XG5cblx0XHR0aGlzLiRsZWZ0SGFuZGxlclxuXHRcdFx0XHQueCh4KVxuXHRcdFx0XHQueSh5KVxuXHRcdFx0XHQud2lkdGgodGhpcy5wYXJhbXMuaGFuZGxlcldpZHRoKVxuXHRcdFx0XHQuaGVpZ2h0KGhlaWdodClcblx0XHRcdFx0LmZpbGwodGhpcy5wYXJhbXMuaGFuZGxlckNvbG9yKVxuXHRcdFx0XHQub3BhY2l0eSh0aGlzLnBhcmFtcy5oYW5kbGVyT3BhY2l0eSk7XG5cdFx0XHRcdFxuXHRcdHRoaXMuJHJpZ2h0SGFuZGxlclxuXHRcdFx0XHQueCh4ICsgd2lkdGggLSB0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGgpXG5cdFx0XHRcdC55KHkpXG5cdFx0XHRcdC5oZWlnaHQoaGVpZ2h0KVxuXHRcdFx0XHQud2lkdGgodGhpcy5wYXJhbXMuaGFuZGxlcldpZHRoKVxuXHRcdFx0XHQuZmlsbCh0aGlzLnBhcmFtcy5oYW5kbGVyQ29sb3IpXG5cdFx0XHRcdC5vcGFjaXR5KHRoaXMucGFyYW1zLmhhbmRsZXJPcGFjaXR5KTtcblx0fVxuXG5cdGluQXJlYShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpIHtcblx0XHRjb25zdCBkID0gZGF0dW0gfHwgdGhpcy5kYXR1bTtcblxuXHRcdGNvbnN0IHNoYXBlWDEgPSB0aGlzLiRzZWdtZW50LmdldEFic29sdXRlUG9zaXRpb24oKS54O1xuXHRcdGNvbnN0IHNoYXBlWTEgPSB0aGlzLiRzZWdtZW50LmdldEFic29sdXRlUG9zaXRpb24oKS55O1xuXHRcdGNvbnN0IHNoYXBlWDIgPSBzaGFwZVgxICsgdGhpcy4kc2VnbWVudC53aWR0aCgpO1xuXHRcdGNvbnN0IHNoYXBlWTIgPSBzaGFwZVkxICsgdGhpcy4kc2VnbWVudC5oZWlnaHQoKTtcblxuXHRcdC8qXG5cdFx0ICpcdFRoZSBzZWdtZW50IGlzIGVudGlyZWx5IHdpdGhpbiB0aGUgcHJvdmlkZWQgYXJlYS5cblx0XHQgKi9cblx0XHQvLyBpZiAoeDEgPD0gc2hhcGVYMSAmJiB4MiA+PSBzaGFwZVgyICYmIHkxIDw9IHNoYXBlWTEgJiYgeTIgPj0gc2hhcGVZMilcblx0XHQvLyBcdHJldHVybiB0cnVlO1xuXHRcdC8vIGVsc2Vcblx0XHQvLyBcdHJldHVybiBmYWxzZTtcblxuXHRcdC8qXG5cdFx0ICpcdFRoZSBzZWdtZW50IG92ZXJsYXBzIHRoZSBwcm92aWRlZCBhcmVhLlxuXHRcdCAqL1xuXHRcdGNvbnN0IHhPdmVybGFwID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oeDIsIHNoYXBlWDIpIC0gTWF0aC5tYXgoeDEsIHNoYXBlWDEpKTtcblx0XHRjb25zdCB5T3ZlcmxhcCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHkyLCBzaGFwZVkyKSAtIE1hdGgubWF4KHkxLCBzaGFwZVkxKSk7XG5cdFx0Y29uc3QgYXJlYSA9IHhPdmVybGFwICogeU92ZXJsYXA7XG5cblx0XHRyZXR1cm4gYXJlYSA+IDA7XG5cdH1cblxufSJdfQ==