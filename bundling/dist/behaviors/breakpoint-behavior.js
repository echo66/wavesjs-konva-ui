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

var BreakpointBehavior = (function (_BaseBehavior) {
  _inherits(BreakpointBehavior, _BaseBehavior);

  function BreakpointBehavior() {
    _classCallCheck(this, BreakpointBehavior);

    _get(Object.getPrototypeOf(BreakpointBehavior.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BreakpointBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      var data = this._layer.data;
      var layerHeight = renderingContext.height;
      // current position
      var x = renderingContext.timeToPixel(shape.x(datum));
      var y = renderingContext.valueToPixel(shape.y(datum));
      // target position
      var targetX = x + dx;
      var targetY = y + dy;

      if (data.length > 2) {
        // create a sorted map of all `x` positions
        var xMap = data.map(function (d) {
          return renderingContext.timeToPixel(shape.x(d));
        });
        xMap.sort(function (a, b) {
          return a < b ? -1 : 1;
        });
        // find index of our shape x position
        var index = xMap.indexOf(x);
        // lock to next siblings
        if (targetX < xMap[index - 1] || targetX > xMap[index + 1]) {
          targetX = x;
        }
      }

      if (targetX < 0) targetX = 0;

      // lock in y axis
      if (targetY < 0) {
        targetY = 0;
      } else if (targetY > layerHeight) {
        targetY = layerHeight;
      }

      // update datum with new values
      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.y(datum, renderingContext.valueToPixel.invert(targetY));
    }
  }, {
    key: 'select',
    value: function select(datum) {
      _get(Object.getPrototypeOf(BreakpointBehavior.prototype), 'select', this).call(this, datum);
      this.highlight(datum, true);
    }
  }, {
    key: 'unselect',
    value: function unselect(datum) {
      _get(Object.getPrototypeOf(BreakpointBehavior.prototype), 'unselect', this).call(this, datum);
      this.highlight(datum, false);
    }
  }, {
    key: 'highlight',
    value: function highlight(datum, isHighlighted) {
      var shape = this._layer.getShapeFromDatum(datum);
      if (shape) {
        if (isHighlighted) {
          shape.params.color = 'red';
        } else {
          shape.params.color = 'black';
        }
      } else {
        throw new Error('No shape for this datum in this layer', { datum: datum, layer: this._layer });
      }
    }
  }]);

  return BreakpointBehavior;
})(_baseBehavior2['default']);

exports['default'] = BreakpointBehavior;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzRCQUF5QixpQkFBaUI7Ozs7SUFFckIsa0JBQWtCO1lBQWxCLGtCQUFrQjs7V0FBbEIsa0JBQWtCOzBCQUFsQixrQkFBa0I7OytCQUFsQixrQkFBa0I7OztlQUFsQixrQkFBa0I7O1dBQ2pDLGNBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUNuRCxVQUFNLElBQUksR0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztBQUMvQixVQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRTVDLFVBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkQsVUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFeEQsVUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQixVQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVyQixVQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOztBQUVuQixZQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQztpQkFBSyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUFBLENBQUMsQ0FBQztBQUN2RSxZQUFJLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO1NBQUEsQ0FBQyxDQUFDOztBQUVwQyxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU5QixZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzFELGlCQUFPLEdBQUcsQ0FBQyxDQUFDO1NBQ2I7T0FDRjs7QUFFRCxVQUFJLE9BQU8sR0FBRyxDQUFDLEVBQ2IsT0FBTyxHQUFHLENBQUMsQ0FBQzs7O0FBR2QsVUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO0FBQ2YsZUFBTyxHQUFHLENBQUMsQ0FBQztPQUNiLE1BQU0sSUFBSSxPQUFPLEdBQUcsV0FBVyxFQUFFO0FBQ2hDLGVBQU8sR0FBRyxXQUFXLENBQUM7T0FDdkI7OztBQUdELFdBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM3RCxXQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDL0Q7OztXQUVLLGdCQUFDLEtBQUssRUFBRTtBQUNaLGlDQXZDaUIsa0JBQWtCLHdDQXVDdEIsS0FBSyxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzdCOzs7V0FFTyxrQkFBQyxLQUFLLEVBQUU7QUFDZCxpQ0E1Q2lCLGtCQUFrQiwwQ0E0Q3BCLEtBQUssRUFBRTtBQUN0QixVQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM5Qjs7O1dBRVEsbUJBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtBQUM5QixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25ELFVBQUksS0FBSyxFQUFFO0FBQ1QsWUFBSSxhQUFhLEVBQUU7QUFDakIsZUFBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQzVCLE1BQU07QUFDTCxlQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7U0FDOUI7T0FDRixNQUFNO0FBQ0wsY0FBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO09BQ2hHO0tBQ0Y7OztTQTNEa0Isa0JBQWtCOzs7cUJBQWxCLGtCQUFrQiIsImZpbGUiOiJzcmMvYmVoYXZpb3JzL2JyZWFrcG9pbnQtYmVoYXZpb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUJlaGF2aW9yIGZyb20gJy4vYmFzZS1iZWhhdmlvcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyZWFrcG9pbnRCZWhhdmlvciBleHRlbmRzIEJhc2VCZWhhdmlvciB7XG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGRhdGEgID0gdGhpcy5fbGF5ZXIuZGF0YTtcbiAgICBjb25zdCBsYXllckhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuICAgIC8vIGN1cnJlbnQgcG9zaXRpb25cbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS54KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNoYXBlLnkoZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgcG9zaXRpb25cbiAgICBsZXQgdGFyZ2V0WCA9IHggKyBkeDtcbiAgICBsZXQgdGFyZ2V0WSA9IHkgKyBkeTtcblxuICAgIGlmIChkYXRhLmxlbmd0aCA+IDIpIHtcbiAgICAgIC8vIGNyZWF0ZSBhIHNvcnRlZCBtYXAgb2YgYWxsIGB4YCBwb3NpdGlvbnNcbiAgICAgIGNvbnN0IHhNYXAgPSBkYXRhLm1hcCgoZCkgPT4gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS54KGQpKSk7XG4gICAgICB4TWFwLnNvcnQoKGEsIGIpID0+IGEgPCBiID8gLTEgOiAxKTtcbiAgICAgIC8vIGZpbmQgaW5kZXggb2Ygb3VyIHNoYXBlIHggcG9zaXRpb25cbiAgICAgIGNvbnN0IGluZGV4ID0geE1hcC5pbmRleE9mKHgpO1xuICAgICAgLy8gbG9jayB0byBuZXh0IHNpYmxpbmdzXG4gICAgICBpZiAodGFyZ2V0WCA8IHhNYXBbaW5kZXggLSAxXSB8fCB0YXJnZXRYID4geE1hcFtpbmRleCArIDFdKSB7XG4gICAgICAgIHRhcmdldFggPSB4O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0YXJnZXRYIDwgMClcbiAgICAgIHRhcmdldFggPSAwO1xuXG4gICAgLy8gbG9jayBpbiB5IGF4aXNcbiAgICBpZiAodGFyZ2V0WSA8IDApIHtcbiAgICAgIHRhcmdldFkgPSAwO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0WSA+IGxheWVySGVpZ2h0KSB7XG4gICAgICB0YXJnZXRZID0gbGF5ZXJIZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGRhdHVtIHdpdGggbmV3IHZhbHVlc1xuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS55KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5pbnZlcnQodGFyZ2V0WSkpO1xuICB9XG5cbiAgc2VsZWN0KGRhdHVtKSB7XG4gICAgc3VwZXIuc2VsZWN0KGRhdHVtKTtcbiAgICB0aGlzLmhpZ2hsaWdodChkYXR1bSwgdHJ1ZSk7XG4gIH1cblxuICB1bnNlbGVjdChkYXR1bSkge1xuICAgIHN1cGVyLnVuc2VsZWN0KGRhdHVtKTtcbiAgICB0aGlzLmhpZ2hsaWdodChkYXR1bSwgZmFsc2UpO1xuICB9XG5cbiAgaGlnaGxpZ2h0KGRhdHVtLCBpc0hpZ2hsaWdodGVkKSB7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLl9sYXllci5nZXRTaGFwZUZyb21EYXR1bShkYXR1bSk7XG4gICAgaWYgKHNoYXBlKSB7XG4gICAgICBpZiAoaXNIaWdobGlnaHRlZCkge1xuICAgICAgICBzaGFwZS5wYXJhbXMuY29sb3IgPSAncmVkJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoYXBlLnBhcmFtcy5jb2xvciA9ICdibGFjayc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gc2hhcGUgZm9yIHRoaXMgZGF0dW0gaW4gdGhpcyBsYXllcicsIHsgZGF0dW06IGRhdHVtLCBsYXllcjogdGhpcy5fbGF5ZXIgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=