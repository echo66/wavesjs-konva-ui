'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

/**
 * Defines the default behavior for a marker.
 *
 * [example usage](./examples/layer-marker.html)
 */

var MarkerBehavior = (function (_BaseBehavior) {
	_inherits(MarkerBehavior, _BaseBehavior);

	function MarkerBehavior() {
		_classCallCheck(this, MarkerBehavior);

		_get(Object.getPrototypeOf(MarkerBehavior.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(MarkerBehavior, [{
		key: 'edit',
		value: function edit(renderingContext, shape, datum, dx, dy, target) {
			var x = renderingContext.timeToPixel(shape.x(datum));
			var targetX = x + dx > 0 ? x + dx : 0;

			shape.x(datum, renderingContext.timeToPixel.invert(targetX));
		}
	}, {
		key: 'select',
		value: function select(datum) {
			_get(Object.getPrototypeOf(MarkerBehavior.prototype), 'select', this).call(this, datum);
			this.highlight(datum, true);
		}
	}, {
		key: 'unselect',
		value: function unselect(datum) {
			_get(Object.getPrototypeOf(MarkerBehavior.prototype), 'unselect', this).call(this, datum);
			this.highlight(datum, false);
		}
	}, {
		key: 'highlight',
		value: function highlight(datum, isHighlighted) {
			var shape = this._layer.getShapeFromDatum(datum);
			if (shape) {
				if (isHighlighted) {
					shape.params.color = 'red';
					shape.params.handlerColor = 'red';
				} else {
					var defaults = shape._getDefaults();
					shape.params.color = defaults.color;
					shape.params.handlerColor = defaults.handlerColor;
				}
			} else {
				throw new Error('No shape for this datum in this layer', { datum: datum, layer: this._layer });
			}
		}
	}]);

	return MarkerBehavior;
})(_baseBehavior2['default']);

exports['default'] = MarkerBehavior;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9iZWhhdmlvcnMvbWFya2VyLWJlaGF2aW9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBQXlCLGlCQUFpQjs7Ozs7Ozs7OztJQVFyQixjQUFjO1dBQWQsY0FBYzs7VUFBZCxjQUFjO3dCQUFkLGNBQWM7OzZCQUFkLGNBQWM7OztjQUFkLGNBQWM7O1NBRTlCLGNBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUNwRCxPQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELE9BQUksT0FBTyxHQUFHLEFBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRXhDLFFBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztHQUM3RDs7O1NBRUssZ0JBQUMsS0FBSyxFQUFFO0FBQ2IsOEJBVm1CLGNBQWMsd0NBVXBCLEtBQUssRUFBRTtBQUNwQixPQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztHQUM1Qjs7O1NBRU8sa0JBQUMsS0FBSyxFQUFFO0FBQ2YsOEJBZm1CLGNBQWMsMENBZWxCLEtBQUssRUFBRTtBQUN0QixPQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztHQUM3Qjs7O1NBRVEsbUJBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtBQUMvQixPQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25ELE9BQUksS0FBSyxFQUFFO0FBQ1YsUUFBSSxhQUFhLEVBQUU7QUFDbEIsVUFBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQzNCLFVBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztLQUNsQyxNQUFNO0FBQ04sU0FBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3RDLFVBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDcEMsVUFBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQztLQUNsRDtJQUNELE1BQU07QUFDTixVQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDL0Y7R0FDRDs7O1FBakNtQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiJzcmMvYmVoYXZpb3JzL21hcmtlci1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlQmVoYXZpb3IgZnJvbSAnLi9iYXNlLWJlaGF2aW9yJztcblxuXG4vKipcbiAqIERlZmluZXMgdGhlIGRlZmF1bHQgYmVoYXZpb3IgZm9yIGEgbWFya2VyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLW1hcmtlci5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXJrZXJCZWhhdmlvciBleHRlbmRzIEJhc2VCZWhhdmlvciB7XG5cblx0ZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG5cdFx0Y29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUueChkYXR1bSkpO1xuXHRcdGxldCB0YXJnZXRYID0gKHggKyBkeCkgPiAwID8geCArIGR4IDogMDtcblxuXHRcdHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcblx0fVxuXG5cdHNlbGVjdChkYXR1bSkge1xuXHRcdHN1cGVyLnNlbGVjdChkYXR1bSk7XG5cdFx0dGhpcy5oaWdobGlnaHQoZGF0dW0sIHRydWUpO1xuXHR9XG5cblx0dW5zZWxlY3QoZGF0dW0pIHtcblx0XHRzdXBlci51bnNlbGVjdChkYXR1bSk7XG5cdFx0dGhpcy5oaWdobGlnaHQoZGF0dW0sIGZhbHNlKTtcblx0fVxuXG5cdGhpZ2hsaWdodChkYXR1bSwgaXNIaWdobGlnaHRlZCkge1xuXHRcdGNvbnN0IHNoYXBlID0gdGhpcy5fbGF5ZXIuZ2V0U2hhcGVGcm9tRGF0dW0oZGF0dW0pO1xuXHRcdGlmIChzaGFwZSkge1xuXHRcdFx0aWYgKGlzSGlnaGxpZ2h0ZWQpIHtcblx0XHRcdFx0c2hhcGUucGFyYW1zLmNvbG9yID0gJ3JlZCc7XG5cdFx0XHRcdHNoYXBlLnBhcmFtcy5oYW5kbGVyQ29sb3IgPSAncmVkJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGRlZmF1bHRzID0gc2hhcGUuX2dldERlZmF1bHRzKCk7XG5cdFx0XHRcdHNoYXBlLnBhcmFtcy5jb2xvciA9IGRlZmF1bHRzLmNvbG9yO1xuXHRcdFx0XHRzaGFwZS5wYXJhbXMuaGFuZGxlckNvbG9yID0gZGVmYXVsdHMuaGFuZGxlckNvbG9yO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ05vIHNoYXBlIGZvciB0aGlzIGRhdHVtIGluIHRoaXMgbGF5ZXInLCB7IGRhdHVtOiBkYXR1bSwgbGF5ZXI6IHRoaXMuX2xheWVyIH0pO1xuXHRcdH1cblx0fVxufVxuIl19