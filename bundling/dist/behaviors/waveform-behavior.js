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

var WaveformBehavior = (function (_BaseBehavior) {
  _inherits(WaveformBehavior, _BaseBehavior);

  function WaveformBehavior() {
    _classCallCheck(this, WaveformBehavior);

    _get(Object.getPrototypeOf(WaveformBehavior.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(WaveformBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      var action = 'move';

      if (target.hasName('handler')) {
        if (target.hasName('left')) action = 'resizeLeft';else if (target.hasName('right')) action = 'resizeRight';else throw new Error('Unexpected konva shape name');
      } else if (target.hasName('body')) {
        action = 'move';
      } else if (target.hasName('header')) {
        // TODO
        return;
      } else throw new Error('Unexpected konva shape name');

      this['_' + action](renderingContext, shape, datum, dx, dy, target);
    }
  }, {
    key: '_move',
    value: function _move(renderingContext, shape, datum, dx, dy, target) {
      var layerHeight = renderingContext.height;
      // current values
      var x = renderingContext.timeToPixel(shape.x(datum));
      // const y = renderingContext.valueToPixel(shape.y(datum));
      var y = 0;
      var width = renderingContext.timeToPixel(shape.width(datum));
      // const height = renderingContext.valueToPixel(shape.height(datum));
      var height = renderingContext.height;
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
      // shape.y(datum, renderingContext.valueToPixel.invert(targetY));
    }
  }, {
    key: '_resizeLeft',
    value: function _resizeLeft(renderingContext, shape, datum, dx, dy, target) {
      // return; // TODO: update this for the waveform shape
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
      // return; // TODO: update this for the waveform shape
      // current values
      var width = renderingContext.timeToPixel(shape.width(datum));
      // target values
      var targetWidth = Math.max(width + dx, 1);

      shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
    }
  }, {
    key: 'select',
    value: function select(datum) {
      _get(Object.getPrototypeOf(WaveformBehavior.prototype), 'select', this).call(this, datum);
      this.highlight(datum, true);
    }
  }, {
    key: 'unselect',
    value: function unselect(datum) {
      _get(Object.getPrototypeOf(WaveformBehavior.prototype), 'unselect', this).call(this, datum);
      this.highlight(datum, false);
    }
  }, {
    key: 'highlight',
    value: function highlight(datum, isHighlighted) {
      var shape = this._layer.getShapeFromDatum(datum);
      if (shape) {
        // if (isHighlighted) {
        //   shape.params.color = 'red';
        // } else {
        //   shape.params.color = 'black';
        // }
      } else {
          throw new Error('No shape for this datum in this layer', { datum: datum, layer: this._layer });
        }
    }
  }]);

  return WaveformBehavior;
})(_baseBehavior2['default']);

exports['default'] = WaveformBehavior;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9iZWhhdmlvcnMvd2F2ZWZvcm0tYmVoYXZpb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFBeUIsaUJBQWlCOzs7O0lBRXJCLGdCQUFnQjtZQUFoQixnQkFBZ0I7O1dBQWhCLGdCQUFnQjswQkFBaEIsZ0JBQWdCOzsrQkFBaEIsZ0JBQWdCOzs7ZUFBaEIsZ0JBQWdCOztXQUMvQixjQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDbkQsVUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVwQixVQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDN0IsWUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUN4QixNQUFNLEdBQUcsWUFBWSxDQUFDLEtBQ25CLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFDOUIsTUFBTSxHQUFHLGFBQWEsQ0FBQyxLQUV2QixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7T0FDbEQsTUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDakMsY0FBTSxHQUFHLE1BQU0sQ0FBQztPQUNqQixNQUFNLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTs7QUFFbkMsZUFBTztPQUNSLE1BQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDOztBQUVqRCxVQUFJLE9BQUssTUFBTSxDQUFHLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ3BFOzs7V0FFSSxlQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFD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O0tBQzdCOzs7V0FFTyxrQkFBQyxLQUFLLEVBQUU7QUFDZCxpQ0E1RWlCLGdCQUFnQiwwQ0E0RWxCLEtBQUssRUFBRTtBQUN0QixVQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM5Qjs7O1dBRVEsbUJBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtBQUM5QixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25ELFVBQUksS0FBSyxFQUFFOzs7Ozs7T0FNVixNQUFNO0FBQ0wsZ0JBQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUNoRztLQUNGOzs7U0EzRmtCLGdCQUFnQjs7O3FCQUFoQixnQkFBZ0IiLCJmaWxlIjoic3JjL2JlaGF2aW9ycy93YXZlZm9ybS1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlQmVoYXZpb3IgZnJvbSAnLi9iYXNlLWJlaGF2aW9yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F2ZWZvcm1CZWhhdmlvciBleHRlbmRzIEJhc2VCZWhhdmlvciB7XG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGxldCBhY3Rpb24gPSAnbW92ZSc7XG5cbiAgICBpZiAodGFyZ2V0Lmhhc05hbWUoJ2hhbmRsZXInKSkge1xuICAgICAgaWYgKHRhcmdldC5oYXNOYW1lKCdsZWZ0JykpIFxuICAgICAgICBhY3Rpb24gPSAncmVzaXplTGVmdCc7XG4gICAgICBlbHNlIGlmICh0YXJnZXQuaGFzTmFtZSgncmlnaHQnKSkgXG4gICAgICAgIGFjdGlvbiA9ICdyZXNpemVSaWdodCc7XG4gICAgICBlbHNlIFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQga29udmEgc2hhcGUgbmFtZScpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0Lmhhc05hbWUoJ2JvZHknKSkge1xuICAgICAgYWN0aW9uID0gJ21vdmUnO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0Lmhhc05hbWUoJ2hlYWRlcicpKSB7XG4gICAgICAvLyBUT0RPXG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIFxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIGtvbnZhIHNoYXBlIG5hbWUnKTtcblxuICAgIHRoaXNbYF8ke2FjdGlvbn1gXShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KTtcbiAgfVxuXG4gIF9tb3ZlKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBsYXllckhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuICAgIC8vIGN1cnJlbnQgdmFsdWVzXG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUueChkYXR1bSkpO1xuICAgIC8vIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChzaGFwZS55KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IDA7XG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLndpZHRoKGRhdHVtKSk7XG4gICAgLy8gY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoc2hhcGUuaGVpZ2h0KGRhdHVtKSk7XG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG4gICAgLy8gdGFyZ2V0IHZhbHVlc1xuICAgIGxldCB0YXJnZXRYID0gTWF0aC5tYXgoeCArIGR4LCAwKTtcbiAgICBsZXQgdGFyZ2V0WSA9IHkgKyBkeTtcblxuICAgIC8vIGxvY2sgaW4gbGF5ZXIncyB5IGF4aXNcbiAgICBpZiAodGFyZ2V0WSA+IGxheWVySGVpZ2h0KSB7XG4gICAgICB0YXJnZXRZID0gbGF5ZXJIZWlnaHQ7XG4gICAgfSBlbHNlIGlmICh0YXJnZXRZIC0gKGxheWVySGVpZ2h0IC0gaGVpZ2h0KSA8IDApIHtcbiAgICAgIHRhcmdldFkgPSAobGF5ZXJIZWlnaHQgLSBoZWlnaHQpO1xuICAgIH1cblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICAvLyBzaGFwZS55KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5pbnZlcnQodGFyZ2V0WSkpO1xuICB9XG5cbiAgX3Jlc2l6ZUxlZnQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIC8vIHJldHVybjsgLy8gVE9ETzogdXBkYXRlIHRoaXMgZm9yIHRoZSB3YXZlZm9ybSBzaGFwZVxuICAgIC8vIGN1cnJlbnQgdmFsdWVzXG4gICAgY29uc3QgeCAgICAgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLngoZGF0dW0pKTtcbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUud2lkdGgoZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgdmFsdWVzXG4gICAgbGV0IG1heFRhcmdldFggID0geCArIHdpZHRoO1xuICAgIGxldCB0YXJnZXRYICAgICA9IHggKyBkeCA8IG1heFRhcmdldFggPyBNYXRoLm1heCh4ICsgZHgsIDApIDogeDtcbiAgICBsZXQgdGFyZ2V0V2lkdGggPSB0YXJnZXRYICE9PSAwID8gTWF0aC5tYXgod2lkdGggLSBkeCwgMSkgOiB3aWR0aDtcblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS53aWR0aChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0V2lkdGgpKTtcbiAgfVxuXG4gIF9yZXNpemVSaWdodChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgLy8gcmV0dXJuOyAvLyBUT0RPOiB1cGRhdGUgdGhpcyBmb3IgdGhlIHdhdmVmb3JtIHNoYXBlXG4gICAgLy8gY3VycmVudCB2YWx1ZXNcbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUud2lkdGgoZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgdmFsdWVzXG4gICAgbGV0IHRhcmdldFdpZHRoID0gTWF0aC5tYXgod2lkdGggKyBkeCwgMSk7XG5cbiAgICBzaGFwZS53aWR0aChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0V2lkdGgpKTtcbiAgfVxuXG4gIHNlbGVjdChkYXR1bSkge1xuICAgIHN1cGVyLnNlbGVjdChkYXR1bSk7XG4gICAgdGhpcy5oaWdobGlnaHQoZGF0dW0sIHRydWUpO1xuICB9XG5cbiAgdW5zZWxlY3QoZGF0dW0pIHtcbiAgICBzdXBlci51bnNlbGVjdChkYXR1bSk7XG4gICAgdGhpcy5oaWdobGlnaHQoZGF0dW0sIGZhbHNlKTtcbiAgfVxuXG4gIGhpZ2hsaWdodChkYXR1bSwgaXNIaWdobGlnaHRlZCkge1xuICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fbGF5ZXIuZ2V0U2hhcGVGcm9tRGF0dW0oZGF0dW0pO1xuICAgIGlmIChzaGFwZSkge1xuICAgICAgLy8gaWYgKGlzSGlnaGxpZ2h0ZWQpIHtcbiAgICAgIC8vICAgc2hhcGUucGFyYW1zLmNvbG9yID0gJ3JlZCc7XG4gICAgICAvLyB9IGVsc2Uge1xuICAgICAgLy8gICBzaGFwZS5wYXJhbXMuY29sb3IgPSAnYmxhY2snO1xuICAgICAgLy8gfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHNoYXBlIGZvciB0aGlzIGRhdHVtIGluIHRoaXMgbGF5ZXInLCB7IGRhdHVtOiBkYXR1bSwgbGF5ZXI6IHRoaXMuX2xheWVyIH0pO1xuICAgIH1cbiAgfVxufVxuIl19