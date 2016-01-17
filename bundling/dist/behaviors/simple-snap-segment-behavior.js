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

var SimpleSnapSegmentBehavior = (function (_BaseBehavior) {
  _inherits(SimpleSnapSegmentBehavior, _BaseBehavior);

  function SimpleSnapSegmentBehavior() {
    _classCallCheck(this, SimpleSnapSegmentBehavior);

    _get(Object.getPrototypeOf(SimpleSnapSegmentBehavior.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SimpleSnapSegmentBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      var action = 'move';

      if (target.hasName('handler')) {
        if (target.hasName('left')) action = 'resizeLeft';else if (target.hasName('right')) action = 'resizeRight';else throw new Error('Unexpected konva shape name');
      } else if (target.hasName('segment')) action = 'move';else throw new Error('Unexpected konva shape name');

      this['_' + action](renderingContext, shape, datum, dx, dy, target);
    }
  }, {
    key: '_move',
    value: function _move(renderingContext, shape, datum, dx, dy, target) {
      var layerHeight = renderingContext.height;
      // current values
      var x = renderingContext.timeToPixel(shape.x(datum));
      var y = renderingContext.valueToPixel(shape.y(datum));
      var width = renderingContext.timeToPixel(shape.width(datum));
      var height = renderingContext.valueToPixel(shape.height(datum));
      // target values
      var targetX = Math.max(x + dx, 0);
      var targetY = y + dy;

      // lock in layer's y axis
      if (targetY > layerHeight) {
        targetY = layerHeight;
      } else if (targetY - (layerHeight - height) < 0) {
        targetY = layerHeight - height;
      }

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.y(datum, renderingContext.valueToPixel.invert(targetY));

      var snappedX = renderingContext.timeToPixel(Math.round(shape.x(datum)));

      shape.x(datum, renderingContext.timeToPixel.invert(snappedX));
    }
  }, {
    key: '_resizeLeft',
    value: function _resizeLeft(renderingContext, shape, datum, dx, dy, target) {
      // current values
      var x = renderingContext.timeToPixel(shape.x(datum));
      var width = renderingContext.timeToPixel(shape.width(datum));
      // target values
      var maxTargetX = x + width;
      var targetX = x + dx < maxTargetX ? Math.max(x + dx, 0) : x;
      var targetWidth = targetX !== 0 ? Math.max(width - dx, 1) : width;

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
    }
  }, {
    key: '_resizeRight',
    value: function _resizeRight(renderingContext, shape, datum, dx, dy, target) {
      // current values
      var width = renderingContext.timeToPixel(shape.width(datum));
      // target values
      var targetWidth = Math.max(width + dx, 1);

      shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
    }
  }, {
    key: 'select',
    value: function select(datum) {
      _get(Object.getPrototypeOf(SimpleSnapSegmentBehavior.prototype), 'select', this).call(this, datum);
      this.highlight(datum, true);
    }
  }, {
    key: 'unselect',
    value: function unselect(datum) {
      _get(Object.getPrototypeOf(SimpleSnapSegmentBehavior.prototype), 'unselect', this).call(this, datum);
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

  return SimpleSnapSegmentBehavior;
})(_baseBehavior2['default']);

exports['default'] = SimpleSnapSegmentBehavior;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9iZWhhdmlvcnMvc2ltcGxlLXNuYXAtc2VnbWVudC1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzRCQUF5QixpQkFBaUI7Ozs7SUFFckIseUJBQXlCO1lBQXpCLHlCQUF5Qjs7V0FBekIseUJBQXlCOzBCQUF6Qix5QkFBeUI7OytCQUF6Qix5QkFBeUI7OztlQUF6Qix5QkFBeUI7O1dBQ3hDLGNBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUNuRCxVQUFJLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRXBCLFVBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUM3QixZQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ3hCLE1BQU0sR0FBRyxZQUFZLENBQUMsS0FDbkIsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUM5QixNQUFNLEdBQUcsYUFBYSxDQUFDLEtBRXZCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztPQUNsRCxNQUFNLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFDbEMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUVoQixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0FBRWpELFVBQUksT0FBSyxNQUFNLENBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDcEU7OztXQUVJLGVBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUNwRCxVQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRTVDLFVBQU0sQ0FBQyxHQUFH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c291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VCZWhhdmlvciBmcm9tICcuL2Jhc2UtYmVoYXZpb3InO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaW1wbGVTbmFwU2VnbWVudEJlaGF2aW9yIGV4dGVuZHMgQmFzZUJlaGF2aW9yIHtcbiAgZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgbGV0IGFjdGlvbiA9ICdtb3ZlJztcblxuICAgIGlmICh0YXJnZXQuaGFzTmFtZSgnaGFuZGxlcicpKSB7XG4gICAgICBpZiAodGFyZ2V0Lmhhc05hbWUoJ2xlZnQnKSkgXG4gICAgICAgIGFjdGlvbiA9ICdyZXNpemVMZWZ0JztcbiAgICAgIGVsc2UgaWYgKHRhcmdldC5oYXNOYW1lKCdyaWdodCcpKSBcbiAgICAgICAgYWN0aW9uID0gJ3Jlc2l6ZVJpZ2h0JztcbiAgICAgIGVsc2UgXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCBrb252YSBzaGFwZSBuYW1lJyk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQuaGFzTmFtZSgnc2VnbWVudCcpKSBcbiAgICAgIGFjdGlvbiA9ICdtb3ZlJztcbiAgICBlbHNlIFxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIGtvbnZhIHNoYXBlIG5hbWUnKTtcblxuICAgIHRoaXNbYF8ke2FjdGlvbn1gXShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KTtcbiAgfVxuXG4gIF9tb3ZlKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBsYXllckhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuICAgIC8vIGN1cnJlbnQgdmFsdWVzXG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUueChkYXR1bSkpO1xuICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChzaGFwZS55KGRhdHVtKSk7XG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLndpZHRoKGRhdHVtKSk7XG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoc2hhcGUuaGVpZ2h0KGRhdHVtKSk7XG4gICAgLy8gdGFyZ2V0IHZhbHVlc1xuICAgIGxldCB0YXJnZXRYID0gTWF0aC5tYXgoeCArIGR4LCAwKTtcbiAgICBsZXQgdGFyZ2V0WSA9IHkgKyBkeTtcblxuICAgIC8vIGxvY2sgaW4gbGF5ZXIncyB5IGF4aXNcbiAgICBpZiAodGFyZ2V0WSA+IGxheWVySGVpZ2h0KSB7XG4gICAgICB0YXJnZXRZID0gbGF5ZXJIZWlnaHQ7XG4gICAgfSBlbHNlIGlmICh0YXJnZXRZIC0gKGxheWVySGVpZ2h0IC0gaGVpZ2h0KSA8IDApIHtcbiAgICAgIHRhcmdldFkgPSAobGF5ZXJIZWlnaHQgLSBoZWlnaHQpO1xuICAgIH1cblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS55KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5pbnZlcnQodGFyZ2V0WSkpO1xuXG4gICAgY29uc3Qgc25hcHBlZFggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKE1hdGgucm91bmQoc2hhcGUueChkYXR1bSkpKTtcblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHNuYXBwZWRYKSk7XG4gIH1cblxuICBfcmVzaXplTGVmdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgLy8gY3VycmVudCB2YWx1ZXNcbiAgICBjb25zdCB4ICAgICA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUueChkYXR1bSkpO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS53aWR0aChkYXR1bSkpO1xuICAgIC8vIHRhcmdldCB2YWx1ZXNcbiAgICBsZXQgbWF4VGFyZ2V0WCAgPSB4ICsgd2lkdGg7XG4gICAgbGV0IHRhcmdldFggICAgID0geCArIGR4IDwgbWF4VGFyZ2V0WCA/IE1hdGgubWF4KHggKyBkeCwgMCkgOiB4O1xuICAgIGxldCB0YXJnZXRXaWR0aCA9IHRhcmdldFggIT09IDAgPyBNYXRoLm1heCh3aWR0aCAtIGR4LCAxKSA6IHdpZHRoO1xuXG4gICAgc2hhcGUueChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0WCkpO1xuICAgIHNoYXBlLndpZHRoKGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRXaWR0aCkpO1xuICB9XG5cbiAgX3Jlc2l6ZVJpZ2h0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICAvLyBjdXJyZW50IHZhbHVlc1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS53aWR0aChkYXR1bSkpO1xuICAgIC8vIHRhcmdldCB2YWx1ZXNcbiAgICBsZXQgdGFyZ2V0V2lkdGggPSBNYXRoLm1heCh3aWR0aCArIGR4LCAxKTtcblxuICAgIHNoYXBlLndpZHRoKGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRXaWR0aCkpO1xuICB9XG5cbiAgc2VsZWN0KGRhdHVtKSB7XG4gICAgc3VwZXIuc2VsZWN0KGRhdHVtKTtcbiAgICB0aGlzLmhpZ2hsaWdodChkYXR1bSwgdHJ1ZSk7XG4gIH1cblxuICB1bnNlbGVjdChkYXR1bSkge1xuICAgIHN1cGVyLnVuc2VsZWN0KGRhdHVtKTtcbiAgICB0aGlzLmhpZ2hsaWdodChkYXR1bSwgZmFsc2UpO1xuICB9XG5cbiAgaGlnaGxpZ2h0KGRhdHVtLCBpc0hpZ2hsaWdodGVkKSB7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLl9sYXllci5nZXRTaGFwZUZyb21EYXR1bShkYXR1bSk7XG4gICAgaWYgKHNoYXBlKSB7XG4gICAgICBpZiAoaXNIaWdobGlnaHRlZCkge1xuICAgICAgICBzaGFwZS5wYXJhbXMuY29sb3IgPSAncmVkJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoYXBlLnBhcmFtcy5jb2xvciA9ICdibGFjayc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gc2hhcGUgZm9yIHRoaXMgZGF0dW0gaW4gdGhpcyBsYXllcicsIHsgZGF0dW06IGRhdHVtLCBsYXllcjogdGhpcy5fbGF5ZXIgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=