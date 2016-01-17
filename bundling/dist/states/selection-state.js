'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

var SelectionState = (function (_BaseState) {
  _inherits(SelectionState, _BaseState);

  function SelectionState(timeline /*, options = {} */) {
    _classCallCheck(this, SelectionState);

    _get(Object.getPrototypeOf(SelectionState.prototype), 'constructor', this).call(this, timeline /*, options */);

    this.currentLayer = undefined;
    // need a cached
    this.selectedDatums = undefined;
    this.mouseDown = false;
    this.shiftKey = false;

    this._layerSelectedItemsMap = new _Map();
  }

  _createClass(SelectionState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {
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

      $brush.x(e.area.left).y(e.area.top).width(e.area.width).height(e.area.height);
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
        var aux = [];
        layer.selectedDatums.forEach(function (datum) {
          aux.push(datum);
        });
        _this._layerSelectedItemsMap.set(layer, aux.slice(0));
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var _this2 = this;

      console.log(e.area);

      this._updateBrush(e, this._currentTrack);

      this._currentTrack.layers.forEach(function (layer) {
        var currentSelection = layer.selectedDatums;
        var currentItems = layer.getDatumsInArea(e.area);

        // if is not pressed
        if (!e.originalEvent.shiftKey) {
          layer.unselect(currentSelection);
          layer.select(currentItems);
        } else {
          (function () {
            var toSelect = [];
            var toUnselect = [];
            // use the selection from the previous drag
            var previousSelection = _this2._layerSelectedItemsMap.get(layer);
            // toUnselect = toUnselect.concat(previousSelectedItems);

            currentItems.forEach(function (item) {
              if (previousSelection.indexOf(item) === -1) {
                toSelect.push(item);
              } else {
                toUnselect.push(item);
              }
            });

            currentSelection.forEach(function (item) {
              if (currentItems.indexOf(item) === -1 && previousSelection.indexOf(item) === -1) {
                toUnselect.push(item);
              }
            });

            layer.unselect(toUnselect);
            layer.select(toSelect);
          })();
        }
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this._removeBrush(this._currentTrack);
    }
  }, {
    key: 'onClick',
    value: function onClick(e) {
      if (!this._currentTrack) {
        return;
      }

      this._currentTrack.layers.forEach(function (layer) {
        var shape = e.target.shape;
        var datum = layer.getDatumFromShape(shape);

        if (!e.originalEvent.shiftKey) {
          layer.unselect();
        }

        if (datum) {
          layer.toggleSelection([datum]);
        }
      });
    }
  }]);

  return SelectionState;
})(_baseState2['default']);

exports['default'] = SelectionState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBc0IsY0FBYzs7OztJQUVmLGNBQWM7WUFBZCxjQUFjOztBQUV0QixXQUZRLGNBQWMsQ0FFckIsUUFBUSxzQkFBc0I7MEJBRnZCLGNBQWM7O0FBRy9CLCtCQUhpQixjQUFjLDZDQUd6QixRQUFRLGlCQUFpQjs7QUFFL0IsUUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7O0FBRTlCLFFBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO0FBQ2hDLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDOztBQUV0QixRQUFJLENBQUMsc0JBQXNCLEdBQUcsVUFBUyxDQUFDO0dBQ3pDOztlQVprQixjQUFjOztXQWM1QixpQkFBRyxFQUVQOzs7V0FFRyxnQkFBRztBQUNMLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDOztBQUU1QyxXQUFLLElBQUksRUFBRSxJQUFJLFVBQVUsRUFBRTtBQUN6QixZQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQ25DO0tBQ0Y7OztXQUVVLHFCQUFDLENBQUMsRUFBRTtBQUNiLGNBQVEsQ0FBQyxDQUFDLElBQUk7QUFDWixhQUFLLFdBQVc7QUFDZCxjQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGdCQUFNO0FBQUEsQUFDUixhQUFLLFdBQVc7QUFDZCxjQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGdCQUFNO0FBQUEsQUFDUixhQUFLLFNBQVM7QUFDWixjQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGdCQUFNO0FBQUEsQUFDUixhQUFLLE9BQU87QUFDVixjQUFJLENBQUMs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Q0FBQyxDQUFDO1NBQ2hDO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7OztTQTdLa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoic3JjL3N0YXRlcy9zZWxlY3Rpb24tc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdGlvblN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcblxuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSAvKiwgb3B0aW9ucyA9IHt9ICovKSB7XG4gICAgc3VwZXIodGltZWxpbmUgLyosIG9wdGlvbnMgKi8pO1xuXG4gICAgdGhpcy5jdXJyZW50TGF5ZXIgPSB1bmRlZmluZWQ7XG4gICAgLy8gbmVlZCBhIGNhY2hlZFxuICAgIHRoaXMuc2VsZWN0ZWREYXR1bXMgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLnNoaWZ0S2V5ID0gZmFsc2U7XG5cbiAgICB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBlbnRlcigpIHtcblxuICB9XG5cbiAgZXhpdCgpIHtcbiAgICBjb25zdCBjb250YWluZXJzID0gdGhpcy50aW1lbGluZS5jb250YWluZXJzO1xuXG4gICAgZm9yIChsZXQgaWQgaW4gY29udGFpbmVycykge1xuICAgICAgdGhpcy5fcmVtb3ZlQnJ1c2goY29udGFpbmVyc1tpZF0pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjbGljayc6XG4gICAgICAgIHRoaXMub25DbGljayhlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXlkb3duJzpcbiAgICAgICAgdGhpcy5vbktleShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXl1cCc6XG4gICAgICAgIHRoaXMub25LZXkoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9hZGRCcnVzaCh0cmFjaykge1xuICAgIGlmICh0cmFjay4kYnJ1c2gpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBicnVzaCA9IG5ldyBLb252YS5SZWN0KHt9KTtcbiAgICBicnVzaC5maWxsKCcjNjg2ODY4Jykub3BhY2l0eSgwLjUpO1xuXG4gICAgdHJhY2suJGludGVyYWN0aW9uc0xheWVyLmFkZChicnVzaCk7XG4gICAgdHJhY2suJGludGVyYWN0aW9uc0xheWVyLm1vdmVUb1RvcCgpO1xuXG4gICAgdHJhY2suJGJydXNoID0gYnJ1c2g7XG5cbiAgICB0cmFjay4kaW50ZXJhY3Rpb25zTGF5ZXIuYmF0Y2hEcmF3KCk7XG4gIH1cblxuICBfcmVtb3ZlQnJ1c2godHJhY2spIHtcbiAgICBpZiAodHJhY2suJGJydXNoID09PSB1bmRlZmluZWQpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9yZXNldEJydXNoKHRyYWNrKTtcblxuICAgIHRyYWNrLiRicnVzaC5kZXN0cm95KCk7XG5cbiAgICB0cmFjay4kaW50ZXJhY3Rpb25zTGF5ZXIuYmF0Y2hEcmF3KCk7XG5cbiAgICBkZWxldGUgdHJhY2suJGJydXNoO1xuICB9XG5cbiAgX3Jlc2V0QnJ1c2godHJhY2spIHtcbiAgICBjb25zdCAkYnJ1c2ggPSB0cmFjay4kYnJ1c2g7XG4gICAgLy8gcmVzZXQgYnJ1c2ggZWxlbWVudFxuICAgICRicnVzaC54KDApLnkoMCkud2lkdGgoMCkuaGVpZ2h0KDApO1xuICAgIHRyYWNrLiRpbnRlcmFjdGlvbnNMYXllci5iYXRjaERyYXcoKTtcbiAgfVxuXG4gIF91cGRhdGVCcnVzaChlLCB0cmFjaykge1xuICAgIGNvbnN0ICRicnVzaCA9IHRyYWNrLiRicnVzaDtcblxuICAgICRicnVzaC54KGUuYXJlYS5sZWZ0KS55KGUuYXJlYS50b3ApLndpZHRoKGUuYXJlYS53aWR0aCkuaGVpZ2h0KGUuYXJlYS5oZWlnaHQpO1xuICAgIHRyYWNrLiRpbnRlcmFjdGlvbnNMYXllci5iYXRjaERyYXcoKTtcbiAgfVxuXG4gIG9uS2V5KGUpIHtcbiAgICB0aGlzLnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLl9jdXJyZW50VHJhY2sgPSB0aGlzLnRpbWVsaW5lLmdldFRyYWNrRnJvbURPTUVsZW1lbnQoZS5jdXJyZW50VGFyZ2V0KTtcblxuICAgIGlmICghdGhpcy5fY3VycmVudFRyYWNrKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fYWRkQnJ1c2godGhpcy5fY3VycmVudFRyYWNrKTtcblxuICAgIC8vIHJlY3JlYXRlIHRoZSBtYXBcbiAgICB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fY3VycmVudFRyYWNrLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgY29uc3QgYXV4ID0gW107XG4gICAgICBsYXllci5zZWxlY3RlZERhdHVtcy5mb3JFYWNoKChkYXR1bSkgPT4ge1xuICAgICAgICBhdXgucHVzaChkYXR1bSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2xheWVyU2VsZWN0ZWRJdGVtc01hcC5zZXQobGF5ZXIsIGF1eC5zbGljZSgwKSk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgY29uc29sZS5sb2coZS5hcmVhKTtcbiAgICBcbiAgICB0aGlzLl91cGRhdGVCcnVzaChlLCB0aGlzLl9jdXJyZW50VHJhY2spO1xuXG4gICAgdGhpcy5fY3VycmVudFRyYWNrLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFNlbGVjdGlvbiA9IGxheWVyLnNlbGVjdGVkRGF0dW1zO1xuICAgICAgY29uc3QgY3VycmVudEl0ZW1zID0gbGF5ZXIuZ2V0RGF0dW1zSW5BcmVhKGUuYXJlYSk7XG5cbiAgICAgIC8vIGlmIGlzIG5vdCBwcmVzc2VkXG4gICAgICBpZiAoIWUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkge1xuICAgICAgICBsYXllci51bnNlbGVjdChjdXJyZW50U2VsZWN0aW9uKTtcbiAgICAgICAgbGF5ZXIuc2VsZWN0KGN1cnJlbnRJdGVtcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0b1NlbGVjdCA9IFtdO1xuICAgICAgICBjb25zdCB0b1Vuc2VsZWN0ID0gW107XG4gICAgICAgIC8vIHVzZSB0aGUgc2VsZWN0aW9uIGZyb20gdGhlIHByZXZpb3VzIGRyYWdcbiAgICAgICAgY29uc3QgcHJldmlvdXNTZWxlY3Rpb24gPSB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAuZ2V0KGxheWVyKTtcbiAgICAgICAgLy8gdG9VbnNlbGVjdCA9IHRvVW5zZWxlY3QuY29uY2F0KHByZXZpb3VzU2VsZWN0ZWRJdGVtcyk7XG5cbiAgICAgICAgY3VycmVudEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAocHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRvU2VsZWN0LnB1c2goaXRlbSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvVW5zZWxlY3QucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGN1cnJlbnRTZWxlY3Rpb24uZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGN1cnJlbnRJdGVtcy5pbmRleE9mKGl0ZW0pID09PSAtMSAmJlxuICAgICAgICAgICAgcHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTFcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRvVW5zZWxlY3QucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxheWVyLnVuc2VsZWN0KHRvVW5zZWxlY3QpO1xuICAgICAgICBsYXllci5zZWxlY3QodG9TZWxlY3QpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLl9yZW1vdmVCcnVzaCh0aGlzLl9jdXJyZW50VHJhY2spO1xuICB9XG5cbiAgb25DbGljayhlKSB7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50VHJhY2spIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9jdXJyZW50VHJhY2subGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBjb25zdCBzaGFwZSA9IGUudGFyZ2V0LnNoYXBlO1xuICAgICAgY29uc3QgZGF0dW0gPSBsYXllci5nZXREYXR1bUZyb21TaGFwZShzaGFwZSk7XG5cbiAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIGxheWVyLnVuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXR1bSkge1xuICAgICAgICBsYXllci50b2dnbGVTZWxlY3Rpb24oW2RhdHVtXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==