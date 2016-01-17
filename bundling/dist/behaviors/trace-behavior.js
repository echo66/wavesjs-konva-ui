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

var TraceBehavior = (function (_BaseBehavior) {
  _inherits(TraceBehavior, _BaseBehavior);

  function TraceBehavior() {
    _classCallCheck(this, TraceBehavior);

    _get(Object.getPrototypeOf(TraceBehavior.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TraceBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      if (target.hasName('min')) {
        this._editRange(renderingContext, shape, datum, dx, -dy, 'min');
      } else if (target.hasName('max')) {
        this._editRange(renderingContext, shape, datum, dx, -dy, 'max');
      } else if (target.hasName('mean')) {
        this._editMean(renderingContext, shape, datum, dx, -dy);
      } else throw new Error('Unexpected konva shape name');
    }
  }, {
    key: '_editMean',
    value: function _editMean(renderingContext, shape, datum, dx, dy) {
      // work in pixel domain
      var x = renderingContext.timeToPixel(shape.x(datum));
      var y = renderingContext.valueToPixel(shape.mean(datum));

      var targetX = x + dx;
      var targetY = y - dy;

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.mean(datum, renderingContext.valueToPixel.invert(targetY));
    }
  }, {
    key: '_editRange',
    value: function _editRange(renderingContext, shape, datum, dx, dy, rangeSide) {
      var range = renderingContext.valueToPixel(shape.range(datum));

      var targetRange = rangeSide === 'min' ? range + 2 * dy : range - 2 * dy;
      targetRange = Math.max(targetRange, 0);

      shape.range(datum, Math.max(0, renderingContext.valueToPixel.invert(targetRange)));
    }
  }, {
    key: 'select',
    value: function select(datum) {
      _get(Object.getPrototypeOf(TraceBehavior.prototype), 'select', this).call(this, datum);
      this.highlight(datum, true);
    }
  }, {
    key: 'unselect',
    value: function unselect(datum) {
      _get(Object.getPrototypeOf(TraceBehavior.prototype), 'unselect', this).call(this, datum);
      this.highlight(datum, false);
    }
  }, {
    key: 'highlight',
    value: function highlight(datum, isHighlighted) {
      var shape = this._layer.getShapeFromDatum(datum);
      if (shape) {
        if (isHighlighted) {
          shape.params.meanColor = 'red';
          shape.params.rangeColor = 'red';
        } else {
          var defaults = shape._getDefaults();
          shape.params.meanColor = defaults.meanColor;
          shape.params.rangeColor = defaults.rangeColor;
        }
      } else {
        throw new Error('No shape for this datum in this layer', { datum: datum, layer: this._layer });
      }
    }
  }]);

  return TraceBehavior;
})(_baseBehavior2['default']);

exports['default'] = TraceBehavior;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9iZWhhdmlvcnMvdHJhY2UtYmVoYXZpb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFBeUIsaUJBQWlCOzs7O0lBRXJCLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7V0FDNUIsY0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO0FBQ25ELFVBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN6QixZQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ2pFLE1BQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ2hDLFlBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDakUsTUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDakMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO09BQ3pELE1BQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0tBQ2xEOzs7V0FFUSxtQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7O0FBRWhELFVBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkQsVUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFM0QsVUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQixVQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVyQixXQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDN0QsV0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ2xFOzs7V0FFUyxvQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFO0FBQzVELFVBQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRWhFLFVBQUksV0FBVyxHQUFHLFNBQVMsS0FBSyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDeEUsaUJBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFdkMsV0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEY7OztXQUVLLGdCQUFDLEtBQUssRUFBRTtBQUNaLGlDQWxDaUIsYUFBYSx3Q0FrQ2pCLEtBQUssRUFBRTtBQUNwQixVQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM3Qjs7O1dBRU8sa0JBQUMsS0FBSyxFQUFFO0FBQ2QsaUNBdkNpQixhQUFhLDBDQXVDZixLQUFLLEVBQUU7QUFDdEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDOUI7OztXQUVRLG1CQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7QUFDOUIsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuRCxVQUFJLEtBQUssRUFBRTtBQUNULFlBQUksYUFBYSxFQUFFO0FBQ2pCLGVBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUMvQixlQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7U0FDakMsTUFBTTtBQUNMLGNBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUN0QyxlQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO0FBQzVDLGVBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7U0FDL0M7T0FDRixNQUFNO0FBQ0wsY0FBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO09BQ2hHO0tBQ0Y7OztTQXpEa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoic3JjL2JlaGF2aW9ycy90cmFjZS1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlQmVoYXZpb3IgZnJvbSAnLi9iYXNlLWJlaGF2aW9yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2VCZWhhdmlvciBleHRlbmRzIEJhc2VCZWhhdmlvciB7XG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGlmICh0YXJnZXQuaGFzTmFtZSgnbWluJykpIHtcbiAgICAgIHRoaXMuX2VkaXRSYW5nZShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCAtZHksICdtaW4nKTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5oYXNOYW1lKCdtYXgnKSkge1xuICAgICAgdGhpcy5fZWRpdFJhbmdlKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIC1keSwgJ21heCcpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0Lmhhc05hbWUoJ21lYW4nKSkge1xuICAgICAgdGhpcy5fZWRpdE1lYW4ocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgLWR5KTtcbiAgICB9IGVsc2UgXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQga29udmEgc2hhcGUgbmFtZScpO1xuICB9XG5cbiAgX2VkaXRNZWFuKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5KSB7XG4gICAgLy8gd29yayBpbiBwaXhlbCBkb21haW5cbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS54KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNoYXBlLm1lYW4oZGF0dW0pKTtcblxuICAgIGxldCB0YXJnZXRYID0geCArIGR4O1xuICAgIGxldCB0YXJnZXRZID0geSAtIGR5O1xuXG4gICAgc2hhcGUueChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0WCkpO1xuICAgIHNoYXBlLm1lYW4oZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmludmVydCh0YXJnZXRZKSk7XG4gIH1cblxuICBfZWRpdFJhbmdlKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCByYW5nZVNpZGUpIHtcbiAgICBjb25zdCByYW5nZSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNoYXBlLnJhbmdlKGRhdHVtKSk7XG5cbiAgICBsZXQgdGFyZ2V0UmFuZ2UgPSByYW5nZVNpZGUgPT09ICdtaW4nID8gcmFuZ2UgKyAyICogZHkgOiByYW5nZSAtIDIgKiBkeTtcbiAgICB0YXJnZXRSYW5nZSA9IE1hdGgubWF4KHRhcmdldFJhbmdlLCAwKTtcblxuICAgIHNoYXBlLnJhbmdlKGRhdHVtLCBNYXRoLm1heCgwLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5pbnZlcnQodGFyZ2V0UmFuZ2UpKSk7XG4gIH1cblxuICBzZWxlY3QoZGF0dW0pIHtcbiAgICBzdXBlci5zZWxlY3QoZGF0dW0pO1xuICAgIHRoaXMuaGlnaGxpZ2h0KGRhdHVtLCB0cnVlKTtcbiAgfVxuXG4gIHVuc2VsZWN0KGRhdHVtKSB7XG4gICAgc3VwZXIudW5zZWxlY3QoZGF0dW0pO1xuICAgIHRoaXMuaGlnaGxpZ2h0KGRhdHVtLCBmYWxzZSk7XG4gIH1cblxuICBoaWdobGlnaHQoZGF0dW0sIGlzSGlnaGxpZ2h0ZWQpIHtcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMuX2xheWVyLmdldFNoYXBlRnJvbURhdHVtKGRhdHVtKTtcbiAgICBpZiAoc2hhcGUpIHtcbiAgICAgIGlmIChpc0hpZ2hsaWdodGVkKSB7XG4gICAgICAgIHNoYXBlLnBhcmFtcy5tZWFuQ29sb3IgPSAncmVkJztcbiAgICAgICAgc2hhcGUucGFyYW1zLnJhbmdlQ29sb3IgPSAncmVkJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0gc2hhcGUuX2dldERlZmF1bHRzKCk7XG4gICAgICAgIHNoYXBlLnBhcmFtcy5tZWFuQ29sb3IgPSBkZWZhdWx0cy5tZWFuQ29sb3I7XG4gICAgICAgIHNoYXBlLnBhcmFtcy5yYW5nZUNvbG9yID0gZGVmYXVsdHMucmFuZ2VDb2xvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBzaGFwZSBmb3IgdGhpcyBkYXR1bSBpbiB0aGlzIGxheWVyJywgeyBkYXR1bTogZGF0dW0sIGxheWVyOiB0aGlzLl9sYXllciB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==