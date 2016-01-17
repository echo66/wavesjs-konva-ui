'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

var BreakpointState = (function (_BaseState) {
  _inherits(BreakpointState, _BaseState);

  function BreakpointState(timeline, datumGenerator) {
    _classCallCheck(this, BreakpointState);

    _get(Object.getPrototypeOf(BreakpointState.prototype), 'constructor', this).call(this, timeline);

    this.datumGenerator = datumGenerator;
    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  _createClass(BreakpointState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {}
  }, {
    key: 'handleEvent',
    value: function handleEvent(e, hitLayers) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e, hitLayers);
          break;
        case 'mousemove':
          this.onMouseMove(e, hitLayers);
          break;
        case 'mouseup':
          this.onMouseUp(e, hitLayers);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e, hitLayers) {
      var _this = this;

      this.mouseDown = true;
      // keep target consistent with mouse down
      this.currentTarget = e.target;
      var updatedLayer = null;

      var layers = hitLayers;

      layers.forEach(function (layer) {
        layer.unselect();
        var item = e.target;

        if (item === null || item === undefined || layer.getDatumFromShape(item.shape) === undefined) {
          // create an item
          var time = layer.timeToPixel.invert(e.x) - _this.timeline.offset;
          var value = layer.valueToPixel.invert(e.y);
          var datum = _this.datumGenerator(time, value);

          layer.add(datum);
          updatedLayer = layer;
        } else {
          // if shift is pressed, remove the item
          if (e.originalEvent.shiftKey) {
            var datum = layer.getDatumFromShape(item.shape);
            layer.remove(datum);
            updatedLayer = layer;
          } else {
            _this.currentEditedLayer = layer;
            var datum = layer.getDatumFromShape(item.shape);
            layer.select([datum]);
          }
        }

        layer.selectedDatums.forEach(function (datum) {
          layer.getShapeFromDatum(datum).stopDrag();
        });
      });

      if (updatedLayer) {
        this.timeline.tracks.update(updatedLayer);
      }
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e, hitLayers) {
      if (!this.mouseDown || !this.currentEditedLayer) {
        return;
      }

      var layer = this.currentEditedLayer;
      var datums = layer.selectedDatums;
      // the loop should be in layer to match select / unselect API
      layer.edit(datums, e.dx, e.dy, this.currentTarget);

      layer.updateShapes(datums);
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e, hitLayers) {
      var that = this;
      hitLayers.forEach(function (layer) {
        layer.selectedDatums.forEach(function (datum) {
          layer.getShapeFromDatum(datum).stopDrag();
        });
      });
      this.currentEditedLayer = null;
      this.mouseDown = false;
    }
  }]);

  return BreakpointState;
})(_baseState2['default']);

exports['default'] = BreakpointState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdGF0ZXMvYnJlYWtwb2ludC1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7O0lBSWYsZUFBZTtZQUFmLGVBQWU7O0FBQ3ZCLFdBRFEsZUFBZSxDQUN0QixRQUFRLEVBQUUsY0FBYyxFQUFFOzBCQURuQixlQUFlOztBQUVoQywrQkFGaUIsZUFBZSw2Q0FFMUIsUUFBUSxFQUFFOztBQUVoQixRQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztBQUNyQyxRQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0FBQy9CLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0dBQzNCOztlQVBrQixlQUFlOztXQVM3QixpQkFBRyxFQUFFOzs7V0FDTixnQkFBRyxFQUFFOzs7V0FFRSxxQkFBQyxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQ3hCLGNBQVEsQ0FBQyxDQUFDLElBQUk7QUFDWixhQUFLLFdBQVc7QUFDZCxjQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMvQixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxXQUFXO0FBQ2QsY0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDL0IsZ0JBQU07QUFBQSxBQUNSLGFBQUssU0FBUztBQUNaLGNBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzdCLGdCQUFNO0FBQUEsT0FDVDtLQUNGOzs7V0FFVSxxQkFBQyxDQUFDLEVBQUUsU0FBUyxFQUFFOzs7QUFFeEIsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7O0FBRXRCLFVBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUM5QixVQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7O0FBRXhCLFVBQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQzs7QUFFekIsWUFBTSxDQUFD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cUJBQWYsZUFBZSIsImZpbGUiOiJzcmMvc3RhdGVzL2JyZWFrcG9pbnQtc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmVha3BvaW50U3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSwgZGF0dW1HZW5lcmF0b3IpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmRhdHVtR2VuZXJhdG9yID0gZGF0dW1HZW5lcmF0b3I7XG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gIH1cblxuICBlbnRlcigpIHt9XG4gIGV4aXQoKSB7fVxuXG4gIGhhbmRsZUV2ZW50KGUsIGhpdExheWVycykge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUsIGhpdExheWVycyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlLCBoaXRMYXllcnMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlLCBoaXRMYXllcnMpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlLCBoaXRMYXllcnMpIHtcblxuICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTtcbiAgICAvLyBrZWVwIHRhcmdldCBjb25zaXN0ZW50IHdpdGggbW91c2UgZG93blxuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IGUudGFyZ2V0O1xuICAgIGxldCB1cGRhdGVkTGF5ZXIgPSBudWxsO1xuXG4gICAgY29uc3QgbGF5ZXJzID0gaGl0TGF5ZXJzO1xuXG4gICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBsYXllci51bnNlbGVjdCgpO1xuICAgICAgY29uc3QgaXRlbSA9IGUudGFyZ2V0O1xuXG4gICAgICBpZiAoaXRlbSA9PT0gbnVsbCB8fCBpdGVtID09PSB1bmRlZmluZWQgfHwgbGF5ZXIuZ2V0RGF0dW1Gcm9tU2hhcGUoaXRlbS5zaGFwZSkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBjcmVhdGUgYW4gaXRlbVxuICAgICAgICBjb25zdCB0aW1lID0gbGF5ZXIudGltZVRvUGl4ZWwuaW52ZXJ0KGUueCkgLSB0aGlzLnRpbWVsaW5lLm9mZnNldDtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBsYXllci52YWx1ZVRvUGl4ZWwuaW52ZXJ0KGUueSk7XG4gICAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5kYXR1bUdlbmVyYXRvcih0aW1lLCB2YWx1ZSk7XG5cbiAgICAgICAgbGF5ZXIuYWRkKGRhdHVtKTtcbiAgICAgICAgdXBkYXRlZExheWVyID0gbGF5ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBzaGlmdCBpcyBwcmVzc2VkLCByZW1vdmUgdGhlIGl0ZW1cbiAgICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkge1xuICAgICAgICAgIGNvbnN0IGRhdHVtID0gbGF5ZXIuZ2V0RGF0dW1Gcm9tU2hhcGUoaXRlbS5zaGFwZSk7XG4gICAgICAgICAgbGF5ZXIucmVtb3ZlKGRhdHVtKTtcbiAgICAgICAgICB1cGRhdGVkTGF5ZXIgPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IGxheWVyO1xuICAgICAgICAgIGNvbnN0IGRhdHVtID0gbGF5ZXIuZ2V0RGF0dW1Gcm9tU2hhcGUoaXRlbS5zaGFwZSk7XG4gICAgICAgICAgbGF5ZXIuc2VsZWN0KFtkYXR1bV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxheWVyLnNlbGVjdGVkRGF0dW1zLmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgICAgIGxheWVyLmdldFNoYXBlRnJvbURhdHVtKGRhdHVtKS5zdG9wRHJhZygpO1xuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIFxuXG4gICAgaWYgKHVwZGF0ZWRMYXllcikge1xuICAgICAgdGhpcy50aW1lbGluZS50cmFja3MudXBkYXRlKHVwZGF0ZWRMYXllcik7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSwgaGl0TGF5ZXJzKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93biB8fCAhdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBsYXllciA9IHRoaXMuY3VycmVudEVkaXRlZExheWVyO1xuICAgIGNvbnN0IGRhdHVtcyA9IGxheWVyLnNlbGVjdGVkRGF0dW1zO1xuICAgIC8vIHRoZSBsb29wIHNob3VsZCBiZSBpbiBsYXllciB0byBtYXRjaCBzZWxlY3QgLyB1bnNlbGVjdCBBUElcbiAgICBsYXllci5lZGl0KGRhdHVtcywgZS5keCwgZS5keSwgdGhpcy5jdXJyZW50VGFyZ2V0KTtcblxuICAgIGxheWVyLnVwZGF0ZVNoYXBlcyhkYXR1bXMpO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUsIGhpdExheWVycykge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIGhpdExheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgbGF5ZXIuc2VsZWN0ZWREYXR1bXMuZm9yRWFjaCgoZGF0dW0pID0+IHtcbiAgICAgICAgbGF5ZXIuZ2V0U2hhcGVGcm9tRGF0dW0oZGF0dW0pLnN0b3BEcmFnKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgfVxufVxuIl19