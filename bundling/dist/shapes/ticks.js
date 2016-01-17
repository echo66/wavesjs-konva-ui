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

var _konva = require('konva');

var _konva2 = _interopRequireDefault(_konva);

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * Kind of Marker for entity oriented data. Useful to display a grid.
 */

var Ticks = (function (_BaseShape) {
  _inherits(Ticks, _BaseShape);

  function Ticks() {
    _classCallCheck(this, Ticks);

    _get(Object.getPrototypeOf(Ticks.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Ticks, [{
    key: '_getClassName',
    value: function _getClassName() {
      return 'tick';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { time: 0, label: '' };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        'default': {
          color: 'steelblue',
          opacity: 0.3,
          width: 1
        },
        focused: {
          color: 'black',
          opacity: 0.8,
          width: 2
        }
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = new _Set();

      this.$currentTicks = new _Set();
      this.$currentLabels = new _Set();

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, data) {
      var _this = this;

      /*
       * Maintain the same number of ticks and labels in the Shape memory as the number of datums.
       * Destroy the remaining konva nodes.
       */

      if (this.$el.size < data.length * 2) {
        while (this.$el.size < data.length * 2) {
          var r = new _konva2['default'].Rect({ listening: false });
          r.addName('tick');
          var t = new _konva2['default'].Text({ listening: false });
          t.addName('label');
          this.$currentTicks.add(r);
          this.$currentLabels.add(t);
          this.$el.add(r);
          this.$el.add(t);
        }
      } else if (this.$el.size > data.length * 2) {
        var ti1 = this.$currentTicks.values();
        var li2 = this.$currentLabels.values();
        while (this.$el.size > data.length * 2) {
          var tick = ti1.next().value;
          var label = li2.next().value;
          this.$currentTicks['delete'](tick);
          this.$currentLabels['delete'](label);
          this.$el['delete'](tick);
          this.$el['delete'](label);
          tick.destroy();
          label.destroy();
        }
      }

      var that = this;
      var layerHeight = renderingContext.height;
      var ticksIterator = this.$currentTicks.values();
      var labelsIterator = this.$currentLabels.values();

      data.forEach(function (datum) {
        var label = labelsIterator.next().value;
        var tick = ticksIterator.next().value;

        var x = renderingContext.timeToPixel(_this.time(datum));
        var height = layerHeight;
        var isFocused = that.focused(datum);
        var hasLabel = that.label(datum);

        tick.x(x).height(height);

        if (isFocused) {
          tick.width(that.params.focused.width).fill(that.params.focused.color).opacity(that.params.focused.opacity);
        } else {
          tick.width(that.params['default'].width).fill(that.params['default'].color).opacity(that.params['default'].opacity);
        }

        label.x(x + 5).y(5).text(that.label(datum))
        // .height(height)
        .fontFamily('monospace').lineHeight('10px').fontSize('10px').fill('#676767').opacity(0.9);

        if (hasLabel) {
          label.visible(true);
        } else {
          label.visible(false);
        }
      });
    }
  }]);

  return Ticks;
})(_baseShape2['default']);

exports['default'] = Ticks;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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LENBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMzQyxNQUFNO0FBQ0wsY0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxXQUFRLENBQUMsS0FBSyxDQUFDLENBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxXQUFRLENBQUMsS0FBSyxDQUFDLENBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxXQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDM0M7O0FBRUQsYUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDOztTQUV2QixVQUFVLENBQUMsV0FBVyxDQUFDLENBQ3ZCLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FDbEIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVwQixZQUFJLFFBQVEsRUFBRTtBQUNaLGVBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckIsTUFBTTtBQUNMLGVBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdEI7T0FHRixDQUFDLENBQUM7S0FFSjs7O1NBL0drQixLQUFLOzs7cUJBQUwsS0FBSyIsImZpbGUiOiJzcmMvc2hhcGVzL3RpY2tzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEtvbnZhIGZyb20gJ2tvbnZhJztcbmltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuLyoqXG4gKiBLaW5kIG9mIE1hcmtlciBmb3IgZW50aXR5IG9yaWVudGVkIGRhdGEuIFVzZWZ1bCB0byBkaXNwbGF5IGEgZ3JpZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja3MgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBfZ2V0Q2xhc3NOYW1lKCkge1xuICAgIHJldHVybiAndGljayc7XG4gIH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHRpbWU6IDAsIGxhYmVsOiAnJyB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGNvbG9yOiAnc3RlZWxibHVlJyxcbiAgICAgICAgb3BhY2l0eTogMC4zLFxuICAgICAgICB3aWR0aDogMSxcbiAgICAgIH0sXG4gICAgICBmb2N1c2VkOiB7XG4gICAgICAgIGNvbG9yOiAnYmxhY2snLFxuICAgICAgICBvcGFjaXR5OiAwLjgsXG4gICAgICAgIHdpZHRoOiAyLFxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMuJGVsID0gbmV3IFNldCgpO1xuXG4gICAgdGhpcy4kY3VycmVudFRpY2tzICA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLiRjdXJyZW50TGFiZWxzID0gbmV3IFNldCgpO1xuICAgIFxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG5cbiAgICAvKlxuICAgICAqIE1haW50YWluIHRoZSBzYW1lIG51bWJlciBvZiB0aWNrcyBhbmQgbGFiZWxzIGluIHRoZSBTaGFwZSBtZW1vcnkgYXMgdGhlIG51bWJlciBvZiBkYXR1bXMuXG4gICAgICogRGVzdHJveSB0aGUgcmVtYWluaW5nIGtvbnZhIG5vZGVzLlxuICAgICAqL1xuXG4gICAgaWYgKHRoaXMuJGVsLnNpemUgPCBkYXRhLmxlbmd0aCAqIDIpIHtcbiAgICAgIHdoaWxlICh0aGlzLiRlbC5zaXplIDwgZGF0YS5sZW5ndGggKiAyKSB7XG4gICAgICAgIGNvbnN0IHIgPSBuZXcgS29udmEuUmVjdCh7IGxpc3RlbmluZzogZmFsc2UgfSk7XG4gICAgICAgIHIuYWRkTmFtZSgndGljaycpO1xuICAgICAgICBjb25zdCB0ID0gbmV3IEtvbnZhLlRleHQoeyBsaXN0ZW5pbmc6IGZhbHNlIH0pO1xuICAgICAgICB0LmFkZE5hbWUoJ2xhYmVsJyk7XG4gICAgICAgIHRoaXMuJGN1cnJlbnRUaWNrcy5hZGQocik7XG4gICAgICAgIHRoaXMuJGN1cnJlbnRMYWJlbHMuYWRkKHQpO1xuICAgICAgICB0aGlzLiRlbC5hZGQocik7XG4gICAgICAgIHRoaXMuJGVsLmFkZCh0KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuJGVsLnNpemUgPiBkYXRhLmxlbmd0aCAqIDIpIHtcbiAgICAgIGNvbnN0IHRpMSA9IHRoaXMuJGN1cnJlbnRUaWNrcy52YWx1ZXMoKTtcbiAgICAgIGNvbnN0IGxpMiA9IHRoaXMuJGN1cnJlbnRMYWJlbHMudmFsdWVzKCk7XG4gICAgICB3aGlsZSAodGhpcy4kZWwuc2l6ZSA+IGRhdGEubGVuZ3RoICogMikge1xuICAgICAgICBjb25zdCB0aWNrID0gdGkxLm5leHQoKS52YWx1ZTtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBsaTIubmV4dCgpLnZhbHVlO1xuICAgICAgICB0aGlzLiRjdXJyZW50VGlja3MuZGVsZXRlKHRpY2spO1xuICAgICAgICB0aGlzLiRjdXJyZW50TGFiZWxzLmRlbGV0ZShsYWJlbCk7XG4gICAgICAgIHRoaXMuJGVsLmRlbGV0ZSh0aWNrKTtcbiAgICAgICAgdGhpcy4kZWwuZGVsZXRlKGxhYmVsKTtcbiAgICAgICAgdGljay5kZXN0cm95KCk7XG4gICAgICAgIGxhYmVsLmRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICBjb25zdCBsYXllckhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0OyBcbiAgICBjb25zdCB0aWNrc0l0ZXJhdG9yID0gdGhpcy4kY3VycmVudFRpY2tzLnZhbHVlcygpO1xuICAgIGNvbnN0IGxhYmVsc0l0ZXJhdG9yID0gdGhpcy4kY3VycmVudExhYmVscy52YWx1ZXMoKTtcblxuICAgIGRhdGEuZm9yRWFjaCgoZGF0dW0pID0+IHtcbiAgICAgIGNvbnN0IGxhYmVsID0gbGFiZWxzSXRlcmF0b3IubmV4dCgpLnZhbHVlO1xuICAgICAgY29uc3QgdGljayA9IHRpY2tzSXRlcmF0b3IubmV4dCgpLnZhbHVlO1xuXG4gICAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWUoZGF0dW0pKTtcbiAgICAgIGNvbnN0IGhlaWdodCA9IGxheWVySGVpZ2h0O1xuICAgICAgY29uc3QgaXNGb2N1c2VkID0gdGhhdC5mb2N1c2VkKGRhdHVtKTtcbiAgICAgIGNvbnN0IGhhc0xhYmVsID0gdGhhdC5sYWJlbChkYXR1bSk7XG5cbiAgICAgIHRpY2sueCh4KS5oZWlnaHQoaGVpZ2h0KTtcblxuICAgICAgaWYgKGlzRm9jdXNlZCkge1xuICAgICAgICB0aWNrLndpZHRoKHRoYXQucGFyYW1zLmZvY3VzZWQud2lkdGgpXG4gICAgICAgICAgICAuZmlsbCh0aGF0LnBhcmFtcy5mb2N1c2VkLmNvbG9yKVxuICAgICAgICAgICAgLm9wYWNpdHkodGhhdC5wYXJhbXMuZm9jdXNlZC5vcGFjaXR5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpY2sud2lkdGgodGhhdC5wYXJhbXMuZGVmYXVsdC53aWR0aClcbiAgICAgICAgICAgIC5maWxsKHRoYXQucGFyYW1zLmRlZmF1bHQuY29sb3IpXG4gICAgICAgICAgICAub3BhY2l0eSh0aGF0LnBhcmFtcy5kZWZhdWx0Lm9wYWNpdHkpO1xuICAgICAgfVxuXG4gICAgICBsYWJlbC54KHgrNSlcbiAgICAgICAgICAgIC55KDUpXG4gICAgICAgICAgICAudGV4dCh0aGF0LmxhYmVsKGRhdHVtKSlcbiAgICAgICAgICAgIC8vIC5oZWlnaHQoaGVpZ2h0KVxuICAgICAgICAgICAgLmZvbnRGYW1pbHkoJ21vbm9zcGFjZScpXG4gICAgICAgICAgICAubGluZUhlaWdodCgnMTBweCcpXG4gICAgICAgICAgICAuZm9udFNpemUoJzEwcHgnKVxuICAgICAgICAgICAgLmZpbGwoJyM2NzY3NjcnKVxuICAgICAgICAgICAgLm9wYWNpdHkoMC45KTtcblxuICAgICAgaWYgKGhhc0xhYmVsKSB7XG4gICAgICAgIGxhYmVsLnZpc2libGUodHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYWJlbC52aXNpYmxlKGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgXG4gICAgfSk7XG5cbiAgfVxufSJdfQ==