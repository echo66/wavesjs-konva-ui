'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * A state to select and edit shapes in a simple way. (kind of plug n play state)
 */

var SimpleEditionState = (function (_BaseState) {
  _inherits(SimpleEditionState, _BaseState);

  function SimpleEditionState(timeline) {
    _classCallCheck(this, SimpleEditionState);

    _get(Object.getPrototypeOf(SimpleEditionState.prototype), 'constructor', this).call(this, timeline);

    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  _createClass(SimpleEditionState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {
      this.currentEditedLayer = null;
      this.currentTarget = null;
    }
  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      var _this = this;

      // TODO: allow shapes from multiple layers to be edited at the same time.
      // TODO: move target shapes to the drag konva layer of each layer.

      // keep target consistent with mouse down
      this.currentTarget = e.target;

      if (this.currentTarget.shape && this.currentTarget.shape.isContextShape) {
        if (!e.originalEvent.shiftKey) this.timeline.getTrackFromDOMElement(e.currentTarget).layers.forEach(function (layer) {
          var aux = new _Set(layer.selectedDatums);
          layer.unselect(layer.selectedDatums);
          layer.updateShapes(aux);
        });
        return;
      } else if (!this.currentTarget.shape) return;

      var layer = this.currentTarget.shape.layer;

      var a = new _Set(layer.selectedDatums);

      if (this.currentTarget.shape.layer) {
        (function () {
          if (!e.originalEvent.shiftKey) {
            layer.unselect(layer.selectedDatums);
          }
          _this.currentEditedLayer = layer;
          var datum = layer.getDatumFromShape(_this.currentTarget.shape);
          if (datum !== undefined) {
            layer.select([datum]);
            a.add(datum);
          }
          layer.updateShapes(a);
          var that = _this;
          _this.currentEditedLayer.selectedDatums.forEach(function (datum) {
            that.currentEditedLayer.getShapeFromDatum(datum).startDrag();
          });
        })();
      } else if (!e.originalEvent.shiftKey) {
        layer.unselect(layer.selectedDatums);
        layer.updateShapes(a);
        this.currentEditedLayer.selectedDatums.forEach(function (datum) {
          that.currentEditedLayer.getShapeFromDatum(datum).startDrag();
        });
      }
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      // TODO: allow shapes from multiple layers to be edited at the same time.
      // TODO: move target shapes to the drag konva layer of each layer.

      if (!this.currentEditedLayer) {
        return;
      }

      var layer = this.currentEditedLayer;
      var datums = layer.selectedDatums;

      layer.edit(datums, e.dx, e.dy, this.currentTarget);
      layer.updateShapes(datums);
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      // TODO: allow shapes from multiple layers to be edited at the same time.
      // TODO: use Layer.allocateShapesToContentLayers to move the target shapes from the drag konva layers to a content konva layer.

      var that = this;
      var layer = this.currentEditedLayer;

      if (!layer) return;

      layer.updateShapes(layer.selectedDatums);
      layer.selectedDatums.forEach(function (datum) {
        layer.getShapeFromDatum(datum).stopDrag();
      });
      this.currentEditedLayer = null;
    }
  }]);

  return SimpleEditionState;
})(_baseState2['default']);

exports['default'] = SimpleEditionState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdGF0ZXMvc2ltcGxlLWVkaXRpb24tc3RhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7Ozs7OztJQU1mLGtCQUFrQjtZQUFsQixrQkFBa0I7O0FBQzFCLFdBRFEsa0JBQWtCLENBQ3pCLFFBQVEsRUFBRTswQkFESCxrQkFBa0I7O0FBRW5DLCtCQUZpQixrQkFBa0IsNkNBRTdCLFFBQVEsRUFBRTs7QUFFaEIsUUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUMvQixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztHQUMzQjs7ZUFOa0Isa0JBQWtCOztXQVFoQyxpQkFBRyxFQUFFOzs7V0FDTixnQkFBRztBQUNMLFVBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7QUFDL0IsVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7S0FDM0I7OztXQUVVLHFCQUFDLENBQUMsRUFBRTtBQUNiLGNBQVEsQ0FBQyxDQUFDLElBQUk7QUFDWixhQUFLLFdBQVc7QUFDZCxjQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGdCQUFNO0FBQUEsQUFDUixhQUFLLFdBQVc7QUFDZCxjQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGdCQUFNO0FBQUEsQUFDUixhQUFLLFNBQVM7QUFDWixjQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGdCQUFNO0FBQUEsT0FDVDtLQUNGOzs7V0FFVSxxQkFBQyxDQUFDLEVBQUU7Ozs7Ozs7QUFLYixVQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O0FBRTlCLFVBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFO0FBQ3ZFLFlBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxD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LFdBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3pDLFdBQUssQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQ3RDLGFBQUssQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztPQUMzQyxDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0tBQ2hDOzs7U0FyR2tCLGtCQUFrQjs7O3FCQUFsQixrQkFBa0IiLCJmaWxlIjoic3JjL3N0YXRlcy9zaW1wbGUtZWRpdGlvbi1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcblxuXG4vKipcbiAqIEEgc3RhdGUgdG8gc2VsZWN0IGFuZCBlZGl0IHNoYXBlcyBpbiBhIHNpbXBsZSB3YXkuIChraW5kIG9mIHBsdWcgbiBwbGF5IHN0YXRlKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaW1wbGVFZGl0aW9uU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICB9XG5cbiAgZW50ZXIoKSB7fVxuICBleGl0KCkge1xuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgLy8gVE9ETzogYWxsb3cgc2hhcGVzIGZyb20gbXVsdGlwbGUgbGF5ZXJzIHRvIGJlIGVkaXRlZCBhdCB0aGUgc2FtZSB0aW1lLlxuICAgIC8vIFRPRE86IG1vdmUgdGFyZ2V0IHNoYXBlcyB0byB0aGUgZHJhZyBrb252YSBsYXllciBvZiBlYWNoIGxheWVyLlxuXG4gICAgLy8ga2VlcCB0YXJnZXQgY29uc2lzdGVudCB3aXRoIG1vdXNlIGRvd25cbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcblxuICAgIGlmICh0aGlzLmN1cnJlbnRUYXJnZXQuc2hhcGUgJiYgdGhpcy5jdXJyZW50VGFyZ2V0LnNoYXBlLmlzQ29udGV4dFNoYXBlKSB7XG4gICAgICBpZiAoIWUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkgXG4gICAgICAgIHRoaXMudGltZWxpbmUuZ2V0VHJhY2tGcm9tRE9NRWxlbWVudChlLmN1cnJlbnRUYXJnZXQpLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgICAgIGNvbnN0IGF1eCA9IG5ldyBTZXQobGF5ZXIuc2VsZWN0ZWREYXR1bXMpO1xuICAgICAgICAgIGxheWVyLnVuc2VsZWN0KGxheWVyLnNlbGVjdGVkRGF0dW1zKTtcbiAgICAgICAgICBsYXllci51cGRhdGVTaGFwZXMoYXV4KTtcbiAgICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmICghdGhpcy5jdXJyZW50VGFyZ2V0LnNoYXBlKSBcbiAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IGxheWVyID0gdGhpcy5jdXJyZW50VGFyZ2V0LnNoYXBlLmxheWVyO1xuXG4gICAgY29uc3QgYSA9IG5ldyBTZXQobGF5ZXIuc2VsZWN0ZWREYXR1bXMpO1xuXG4gICAgaWYgKHRoaXMuY3VycmVudFRhcmdldC5zaGFwZS5sYXllcikge1xuICAgICAgaWYgKCFlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgbGF5ZXIudW5zZWxlY3QobGF5ZXIuc2VsZWN0ZWREYXR1bXMpO1xuICAgICAgfVxuICAgICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBsYXllcjtcbiAgICAgIGNvbnN0IGRhdHVtID0gbGF5ZXIuZ2V0RGF0dW1Gcm9tU2hhcGUodGhpcy5jdXJyZW50VGFyZ2V0LnNoYXBlKTtcbiAgICAgIGlmIChkYXR1bSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxheWVyLnNlbGVjdChbZGF0dW1dKTtcbiAgICAgICAgYS5hZGQoZGF0dW0pO1xuICAgICAgfVxuICAgICAgbGF5ZXIudXBkYXRlU2hhcGVzKGEpO1xuICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllci5zZWxlY3RlZERhdHVtcy5mb3JFYWNoKChkYXR1bSkgPT4ge1xuICAgICAgICB0aGF0LmN1cnJlbnRFZGl0ZWRMYXllci5nZXRTaGFwZUZyb21EYXR1bShkYXR1bSkuc3RhcnREcmFnKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKCFlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIGxheWVyLnVuc2VsZWN0KGxheWVyLnNlbGVjdGVkRGF0dW1zKTtcbiAgICAgIGxheWVyLnVwZGF0ZVNoYXBlcyhhKTtcbiAgICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyLnNlbGVjdGVkRGF0dW1zLmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgICAgIHRoYXQuY3VycmVudEVkaXRlZExheWVyLmdldFNoYXBlRnJvbURhdHVtKGRhdHVtKS5zdGFydERyYWcoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICAvLyBUT0RPOiBhbGxvdyBzaGFwZXMgZnJvbSBtdWx0aXBsZSBsYXllcnMgdG8gYmUgZWRpdGVkIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAgLy8gVE9ETzogbW92ZSB0YXJnZXQgc2hhcGVzIHRvIHRoZSBkcmFnIGtvbnZhIGxheWVyIG9mIGVhY2ggbGF5ZXIuXG5cbiAgICBpZiAoIXRoaXMuY3VycmVudEVkaXRlZExheWVyKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgbGF5ZXIgPSB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllcjtcbiAgICBjb25zdCBkYXR1bXMgPSBsYXllci5zZWxlY3RlZERhdHVtcztcblxuICAgIGxheWVyLmVkaXQoZGF0dW1zLCBlLmR4LCBlLmR5LCB0aGlzLmN1cnJlbnRUYXJnZXQpO1xuICAgIGxheWVyLnVwZGF0ZVNoYXBlcyhkYXR1bXMpO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICAvLyBUT0RPOiBhbGxvdyBzaGFwZXMgZnJvbSBtdWx0aXBsZSBsYXllcnMgdG8gYmUgZWRpdGVkIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAgLy8gVE9ETzogdXNlIExheWVyLmFsbG9jYXRlU2hhcGVzVG9Db250ZW50TGF5ZXJzIHRvIG1vdmUgdGhlIHRhcmdldCBzaGFwZXMgZnJvbSB0aGUgZHJhZyBrb252YSBsYXllcnMgdG8gYSBjb250ZW50IGtvbnZhIGxheWVyLlxuXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgY29uc3QgbGF5ZXIgPSB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllcjtcblxuICAgIGlmICghbGF5ZXIpIHJldHVybjtcblxuICAgIGxheWVyLnVwZGF0ZVNoYXBlcyhsYXllci5zZWxlY3RlZERhdHVtcyk7XG4gICAgbGF5ZXIuc2VsZWN0ZWREYXR1bXMuZm9yRWFjaCgoZGF0dW0pID0+IHtcbiAgICAgIGxheWVyLmdldFNoYXBlRnJvbURhdHVtKGRhdHVtKS5zdG9wRHJhZygpO1xuICAgIH0pO1xuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgfVxufVxuIl19