'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

var HorizontalSelectionState = (function (_BaseState) {
  _inherits(HorizontalSelectionState, _BaseState);

  function HorizontalSelectionState(timeline /*, options = {} */) {
    _classCallCheck(this, HorizontalSelectionState);

    _get(Object.getPrototypeOf(HorizontalSelectionState.prototype), 'constructor', this).call(this, timeline /*, options */);

    this._layerSelectedItemsMap = new _Map();

    this.shiftKey = false;

    this.wasMoving = false;
  }

  _createClass(HorizontalSelectionState, [{
    key: 'enter',
    value: function enter() {
      // TODO
    }
  }, {
    key: 'exit',
    value: function exit() {
      // TODO
      var containers = this.timeline.containers;

      for (var id in containers) {
        this._removeBrush(containers[id]);
      }
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
        case 'click':
          this.onClick(e);
          break;
        case 'keydown':
          this.onKey(e);
          break;
        case 'keyup':
          this.onKey(e);
          break;
      }
    }
  }, {
    key: '_addBrush',
    value: function _addBrush(track) {
      if (track.$brush) {
        return;
      }

      var brush = new Konva.Rect({});
      brush.fill('#686868').opacity(0.5);

      track.$interactionsLayer.add(brush);
      track.$interactionsLayer.moveToTop();

      track.$brush = brush;

      track.$interactionsLayer.batchDraw();
    }
  }, {
    key: '_removeBrush',
    value: function _removeBrush(track) {
      if (track.$brush === undefined) {
        return;
      }

      this._resetBrush(track);

      track.$brush.destroy();

      track.$interactionsLayer.batchDraw();

      delete track.$brush;
    }
  }, {
    key: '_resetBrush',
    value: function _resetBrush(track) {
      var $brush = track.$brush;
      // reset brush element
      $brush.x(0).y(0).width(0).height(0);
      track.$interactionsLayer.batchDraw();
    }
  }, {
    key: '_updateBrush',
    value: function _updateBrush(e, track) {
      var $brush = track.$brush;

      $brush.x(e.area.left).y(0).width(e.area.width).height(track.height);
      track.$interactionsLayer.batchDraw();
    }
  }, {
    key: 'onKey',
    value: function onKey(e) {
      this.shiftKey = e.shiftKey;
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      var _this = this;

      this._currentTrack = this.timeline.getTrackFromDOMElement(e.currentTarget);

      if (!this._currentTrack) {
        return;
      }

      this._addBrush(this._currentTrack);

      // recreate the map
      this._layerSelectedItemsMap = new _Map();

      this._currentTrack.layers.forEach(function (layer) {

        if (!e.originalEvent.shiftKey) {
          var aux = new _Set(layer.selectedDatums);
          layer.unselect(aux);
          layer.updateShapes(aux);
        }

        _this._layerSelectedItemsMap.set(layer, new _Set(layer.selectedDatums));
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var _this2 = this;

      this.wasMoving = true;

      e.area = { left: e.area.left, width: e.area.width, top: 0, height: this._currentTrack.height };

      this._updateBrush(e, this._currentTrack);

      var that = this;

      this._currentTrack.layers.forEach(function (layer) {
        var currentSelection = layer.selectedDatums;
        var datumsInArea = layer.getDatumsInArea(e.area);

        var toSelect;
        var toUnselect;

        // if is not pressed
        if (!e.originalEvent.shiftKey) {

          toUnselect = new _Set(currentSelection);
          toSelect = new _Set(datumsInArea);
        } else {
          (function () {

            toSelect = new _Set();
            toUnselect = new _Set();
            // use the selection from the previous drag
            var previousSelection = _this2._layerSelectedItemsMap.get(layer);

            datumsInArea.forEach(function (datum) {
              if (!previousSelection.has(datum)) {
                toSelect.add(datum);
              } else {
                toUnselect.add(datum);
              }
            });

            currentSelection.forEach(function (datum) {
              if (!datumsInArea.has(datum) && !previousSelection.has(datum)) {
                toUnselect.add(datum);
              }
            });

            previousSelection.forEach(function (datum) {
              if (!datumsInArea.has(datum)) {
                toSelect.add(datum);
              }
            });
          })();
        }

        layer.unselect(toUnselect);
        layer.select(toSelect);

        layer.updateShapes(currentSelection);
        layer.updateShapes(datumsInArea);
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this._removeBrush(this._currentTrack);
      if (this.wasMoving) {
        this.wasMoving = false;
        // this._currentTrack.layers.forEach((layer) => {
        //   layer.updateShapes();
        // });
      }
    }
  }, {
    key: 'onClick',
    value: function onClick(e) {
      // console.log('click');
      if (!this._currentTrack) {
        return;
      }
      var that = this;

      this._currentTrack.layers.forEach(function (layer) {

        var shape = e.target.shape;
        var datum = layer.getDatumFromShape(shape);
        var toUpdate = new _Set();

        //TODO: correct this because it is not working as I expected to. 
        if (!e.originalEvent.shiftKey) {
          toUpdate = new _Set(layer.selectedDatums);
          layer.unselect(layer.selectedDatums);
        }

        if (datum) {
          toUpdate.add(datum);
          layer.toggleSelection([datum]);
        }

        layer.updateShapes(toUpdate);
      });
    }
  }]);

  return HorizontalSelectionState;
})(_baseState2['default']);

exports['default'] = HorizontalSelectionState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdGF0ZXMvaG9yaXpvbnRhbC1zZWxlY3Rpb24tc3RhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQXNCLGNBQWM7Ozs7SUFFZix3QkFBd0I7WUFBeEIsd0JBQXdCOztBQUVoQyxXQUZRLHdCQUF3QixDQUUvQixRQUFRLHNCQUFzQjswQkFGdkIsd0JBQXdCOztBQUd6QywrQkFIaUIsd0JBQXdCLDZDQUduQyxRQUFRLGlCQUFpQjs7QUFFL0IsUUFBSSxDQUFDLHNCQUFzQixHQUFHLFVBQVMsQ0FBQzs7QUFFeEMsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRXRCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0dBQ3hCOztlQVZrQix3QkFBd0I7O1dBWXRDLGlCQUFHOztLQUVQOzs7V0FFRyxnQkFBRzs7QUFFTCxVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQzs7QUFFNUMsV0FBSyxJQUFJLEVBQUUsSUFBSSxVQUFVLEVBQUU7QUFDekIsWUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUNuQztLQUNGOzs7V0FFVSxxQkFBQyxDQUFDLEVBQUU7QUFDYixjQUFRLENBQUMsQ0FBQyxJQUFJO0FBQ1osYUFBSyxXQUFXO0FBQ2QsY0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxXQUFXO0FBQ2QsY0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxTQUFTO0FBQ1osY0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxPQUFPO0FBQ1YsY0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQixnQkFBTTtBQUFBLEFB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QUFDO0FBQ3RDLFVBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNsQixZQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQzs7OztPQUl4QjtLQUNGOzs7V0FFTSxpQkFBQyxDQUFDLEVBQUU7O0FBRVQsVUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFBRSxlQUFPO09BQUU7QUFDcEMsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7O0FBRTNDLFlBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQzdCLFlBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QyxZQUFJLFFBQVEsR0FBRyxVQUFTLENBQUM7OztBQUd6QixZQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUU7QUFDN0Isa0JBQVEsR0FBRyxTQUFRLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN6QyxlQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUN0Qzs7QUFFRCxZQUFJLEtBQUssRUFBRTtBQUNULGtCQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BCLGVBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ2hDOztBQUVELGFBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7T0FFOUIsQ0FBQyxDQUFDO0tBQ0o7OztTQW5Oa0Isd0JBQXdCOzs7cUJBQXhCLHdCQUF3QiIsImZpbGUiOiJzcmMvc3RhdGVzL2hvcml6b250YWwtc2VsZWN0aW9uLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb3Jpem9udGFsU2VsZWN0aW9uU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuXG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lIC8qLCBvcHRpb25zID0ge30gKi8pIHtcbiAgICBzdXBlcih0aW1lbGluZSAvKiwgb3B0aW9ucyAqLyk7XG5cbiAgICB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAgPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLnNoaWZ0S2V5ID0gZmFsc2U7XG5cbiAgICB0aGlzLndhc01vdmluZyA9IGZhbHNlO1xuICB9XG5cbiAgZW50ZXIoKSB7XG4gICAgLy8gVE9ET1xuICB9XG5cbiAgZXhpdCgpIHtcbiAgICAvLyBUT0RPXG4gICAgY29uc3QgY29udGFpbmVycyA9IHRoaXMudGltZWxpbmUuY29udGFpbmVycztcblxuICAgIGZvciAobGV0IGlkIGluIGNvbnRhaW5lcnMpIHtcbiAgICAgIHRoaXMuX3JlbW92ZUJydXNoKGNvbnRhaW5lcnNbaWRdKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2xpY2snOlxuICAgICAgICB0aGlzLm9uQ2xpY2soZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna2V5ZG93bic6XG4gICAgICAgIHRoaXMub25LZXkoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna2V5dXAnOlxuICAgICAgICB0aGlzLm9uS2V5KGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfYWRkQnJ1c2godHJhY2spIHtcbiAgICBpZiAodHJhY2suJGJydXNoKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgYnJ1c2ggPSBuZXcgS29udmEuUmVjdCh7fSk7XG4gICAgYnJ1c2guZmlsbCgnIzY4Njg2OCcpLm9wYWNpdHkoMC41KTtcblxuICAgIHRyYWNrLiRpbnRlcmFjdGlvbnNMYXllci5hZGQoYnJ1c2gpO1xuICAgIHRyYWNrLiRpbnRlcmFjdGlvbnNMYXllci5tb3ZlVG9Ub3AoKTtcblxuICAgIHRyYWNrLiRicnVzaCA9IGJydXNoO1xuXG4gICAgdHJhY2suJGludGVyYWN0aW9uc0xheWVyLmJhdGNoRHJhdygpO1xuICB9XG5cbiAgX3JlbW92ZUJydXNoKHRyYWNrKSB7XG4gICAgaWYgKHRyYWNrLiRicnVzaCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fcmVzZXRCcnVzaCh0cmFjayk7XG5cbiAgICB0cmFjay4kYnJ1c2guZGVzdHJveSgpO1xuXG4gICAgdHJhY2suJGludGVyYWN0aW9uc0xheWVyLmJhdGNoRHJhdygpO1xuXG4gICAgZGVsZXRlIHRyYWNrLiRicnVzaDtcbiAgfVxuXG4gIF9yZXNldEJydXNoKHRyYWNrKSB7XG4gICAgY29uc3QgJGJydXNoID0gdHJhY2suJGJydXNoO1xuICAgIC8vIHJlc2V0IGJydXNoIGVsZW1lbnRcbiAgICAkYnJ1c2gueCgwKS55KDApLndpZHRoKDApLmhlaWdodCgwKTtcbiAgICB0cmFjay4kaW50ZXJhY3Rpb25zTGF5ZXIuYmF0Y2hEcmF3KCk7XG4gIH1cblxuICBfdXBkYXRlQnJ1c2goZSwgdHJhY2spIHtcbiAgICBjb25zdCAkYnJ1c2ggPSB0cmFjay4kYnJ1c2g7XG5cbiAgICAkYnJ1c2gueChlLmFyZWEubGVmdCkueSgwKS53aWR0aChlLmFyZWEud2lkdGgpLmhlaWdodCh0cmFjay5oZWlnaHQpO1xuICAgIHRyYWNrLiRpbnRlcmFjdGlvbnNMYXllci5iYXRjaERyYXcoKTtcbiAgfVxuXG4gIG9uS2V5KGUpIHtcbiAgICB0aGlzLnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLl9jdXJyZW50VHJhY2sgPSB0aGlzLnRpbWVsaW5lLmdldFRyYWNrRnJvbURPTUVsZW1lbnQoZS5jdXJyZW50VGFyZ2V0KTtcblxuICAgIGlmICghdGhpcy5fY3VycmVudFRyYWNrKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fYWRkQnJ1c2godGhpcy5fY3VycmVudFRyYWNrKTtcblxuICAgIC8vIHJlY3JlYXRlIHRoZSBtYXBcbiAgICB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAgPSBuZXcgTWFwKCk7XG4gICAgXG4gICAgdGhpcy5fY3VycmVudFRyYWNrLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgXG4gICAgICBpZiAoIWUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkge1xuICAgICAgICBjb25zdCBhdXggPSBuZXcgU2V0KGxheWVyLnNlbGVjdGVkRGF0dW1zKTtcbiAgICAgICAgbGF5ZXIudW5zZWxlY3QoYXV4KTtcbiAgICAgICAgbGF5ZXIudXBkYXRlU2hhcGVzKGF1eCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2xheWVyU2VsZWN0ZWRJdGVtc01hcC5zZXQobGF5ZXIsIG5ldyBTZXQobGF5ZXIuc2VsZWN0ZWREYXR1bXMpKTtcbiAgICAgIFxuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuXG4gICAgdGhpcy53YXNNb3ZpbmcgPSB0cnVlO1xuXG4gICAgZS5hcmVhID0ge2xlZnQ6IGUuYXJlYS5sZWZ0LCB3aWR0aDplLmFyZWEud2lkdGgsIHRvcDogMCwgaGVpZ2h0OiB0aGlzLl9jdXJyZW50VHJhY2suaGVpZ2h0IH07XG4gICAgXG4gICAgdGhpcy5fdXBkYXRlQnJ1c2goZSwgdGhpcy5fY3VycmVudFRyYWNrKTtcblxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuXG4gICAgdGhpcy5fY3VycmVudFRyYWNrLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFNlbGVjdGlvbiA9IGxheWVyLnNlbGVjdGVkRGF0dW1zO1xuICAgICAgY29uc3QgZGF0dW1zSW5BcmVhID0gbGF5ZXIuZ2V0RGF0dW1zSW5BcmVhKGUuYXJlYSk7XG5cbiAgICAgIHZhciB0b1NlbGVjdDtcbiAgICAgIHZhciB0b1Vuc2VsZWN0O1xuXG4gICAgICAvLyBpZiBpcyBub3QgcHJlc3NlZFxuICAgICAgaWYgKCFlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkpIHsgICAgICAgIFxuXG4gICAgICAgIHRvVW5zZWxlY3QgPSBuZXcgU2V0KGN1cnJlbnRTZWxlY3Rpb24pO1xuICAgICAgICB0b1NlbGVjdCA9IG5ldyBTZXQoZGF0dW1zSW5BcmVhKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICB0b1NlbGVjdCA9IG5ldyBTZXQoKTtcbiAgICAgICAgdG9VbnNlbGVjdCA9IG5ldyBTZXQoKTtcbiAgICAgICAgLy8gdXNlIHRoZSBzZWxlY3Rpb24gZnJvbSB0aGUgcHJldmlvdXMgZHJhZ1xuICAgICAgICBjb25zdCBwcmV2aW91c1NlbGVjdGlvbiA9IHRoaXMuX2xheWVyU2VsZWN0ZWRJdGVtc01hcC5nZXQobGF5ZXIpO1xuICAgICAgICBcblxuICAgICAgICBkYXR1bXNJbkFyZWEuZm9yRWFjaCgoZGF0dW0pID0+IHtcbiAgICAgICAgICBpZiAoIXByZXZpb3VzU2VsZWN0aW9uLmhhcyhkYXR1bSkpIHtcbiAgICAgICAgICAgIHRvU2VsZWN0LmFkZChkYXR1bSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvVW5zZWxlY3QuYWRkKGRhdHVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGN1cnJlbnRTZWxlY3Rpb24uZm9yRWFjaCgoZGF0dW0pID0+IHtcbiAgICAgICAgICBpZiAoIWRhdHVtc0luQXJlYS5oYXMoZGF0dW0pICYmICFwcmV2aW91c1NlbGVjdGlvbi5oYXMoZGF0dW0pKSB7XG4gICAgICAgICAgICB0b1Vuc2VsZWN0LmFkZChkYXR1bSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBwcmV2aW91c1NlbGVjdGlvbi5mb3JFYWNoKChkYXR1bSkgPT4ge1xuICAgICAgICAgIGlmICghZGF0dW1zSW5BcmVhLmhhcyhkYXR1bSkpIHtcbiAgICAgICAgICAgIHRvU2VsZWN0LmFkZChkYXR1bSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgfVxuXG4gICAgICBsYXllci51bnNlbGVjdCh0b1Vuc2VsZWN0KTtcbiAgICAgIGxheWVyLnNlbGVjdCh0b1NlbGVjdCk7XG5cbiAgICAgIGxheWVyLnVwZGF0ZVNoYXBlcyhjdXJyZW50U2VsZWN0aW9uKTtcbiAgICAgIGxheWVyLnVwZGF0ZVNoYXBlcyhkYXR1bXNJbkFyZWEpO1xuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLl9yZW1vdmVCcnVzaCh0aGlzLl9jdXJyZW50VHJhY2spO1xuICAgIGlmICh0aGlzLndhc01vdmluZykge1xuICAgICAgdGhpcy53YXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgIC8vIHRoaXMuX2N1cnJlbnRUcmFjay5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIC8vICAgbGF5ZXIudXBkYXRlU2hhcGVzKCk7XG4gICAgICAvLyB9KTtcbiAgICB9XG4gIH1cblxuICBvbkNsaWNrKGUpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnY2xpY2snKTtcbiAgICBpZiAoIXRoaXMuX2N1cnJlbnRUcmFjaykgeyByZXR1cm47IH1cbiAgICBjb25zdCB0aGF0ID0gdGhpcztcblxuICAgIHRoaXMuX2N1cnJlbnRUcmFjay5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcblxuICAgICAgY29uc3Qgc2hhcGUgPSBlLnRhcmdldC5zaGFwZTtcbiAgICAgIGNvbnN0IGRhdHVtID0gbGF5ZXIuZ2V0RGF0dW1Gcm9tU2hhcGUoc2hhcGUpO1xuICAgICAgdmFyIHRvVXBkYXRlID0gbmV3IFNldCgpO1xuXG4gICAgICAvL1RPRE86IGNvcnJlY3QgdGhpcyBiZWNhdXNlIGl0IGlzIG5vdCB3b3JraW5nIGFzIEkgZXhwZWN0ZWQgdG8uICBcbiAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIHRvVXBkYXRlID0gbmV3IFNldChsYXllci5zZWxlY3RlZERhdHVtcyk7XG4gICAgICAgIGxheWVyLnVuc2VsZWN0KGxheWVyLnNlbGVjdGVkRGF0dW1zKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdHVtKSB7XG4gICAgICAgIHRvVXBkYXRlLmFkZChkYXR1bSk7XG4gICAgICAgIGxheWVyLnRvZ2dsZVNlbGVjdGlvbihbZGF0dW1dKTtcbiAgICAgIH1cblxuICAgICAgbGF5ZXIudXBkYXRlU2hhcGVzKHRvVXBkYXRlKTtcblxuICAgIH0pO1xuICB9XG59XG4iXX0=