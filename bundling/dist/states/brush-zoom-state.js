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

var BrushZoomState = (function (_BaseState) {
	_inherits(BrushZoomState, _BaseState);

	function BrushZoomState(timeline) {
		_classCallCheck(this, BrushZoomState);

		_get(Object.getPrototypeOf(BrushZoomState.prototype), 'constructor', this).call(this, timeline);
	}

	_createClass(BrushZoomState, [{
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
				case 'keydown':
					this.onKeyDown(e);
					break;
			}
		}
	}, {
		key: 'onMouseDown',
		value: function onMouseDown(e) {
			var _this = this;

			this.brushes = [];
			this.startX = e.x;
			// create brush in each containers
			this.tracks.forEach(function (track) {
				var interactions = track.$interactionsLayer;

				var brush = new Konva.Rect({});
				brush.height(track.height).y(0).fill('#787878').opacity(0.2);
				brush.track = track;

				interactions.add(brush);

				_this.brushes.push(brush);

				interactions.batchDraw();
				// interactions.moveToTop();
			});
		}
	}, {
		key: 'onMouseMove',
		value: function onMouseMove(e) {
			// update brush
			var width = Math.abs(e.x - this.startX);
			var x = Math.min(e.x, this.startX);

			this.brushes.forEach(function (brush) {
				brush.x(x).width(width);
				brush.track.$interactionsLayer.batchDraw();
			});
		}
	}, {
		key: 'onMouseUp',
		value: function onMouseUp(e) {
			// remove brush
			this.brushes.forEach(function (brush) {
				brush.destroy();
				brush.track.$interactionsLayer.batchDraw();
				brush.track = undefined;
			});
			this.brushes.length = 0;

			// update timeContext
			var startX = this.startX;
			var endX = e.x;
			// return if no drag
			if (Math.abs(startX - endX) < 1) {
				return;
			}

			var leftX = Math.max(0, Math.min(startX, endX));
			var rightX = Math.max(startX, endX);

			var minTime = this.timeline.timeToPixel.invert(leftX);
			var maxTime = this.timeline.timeToPixel.invert(rightX);

			var deltaDuration = maxTime - minTime;
			var zoom = this.timeline.visibleDuration / deltaDuration;

			this.timeline.offset -= minTime;
			this.timeline.zoom *= zoom;

			this.tracks.update();
		}
	}, {
		key: 'onKeyDown',
		value: function onKeyDown(e) {
			// reset on space bar
			if (e.originalEvent.keyCode === 32) {
				this.timeline.offset = 0;
				this.timeline.zoom = 1;
				this.tracks.update();
			}
		}
	}]);

	return BrushZoomState;
})(_baseState2['default']);

exports['default'] = BrushZoomState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdGF0ZXMvYnJ1c2gtem9vbS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7O0lBRWYsY0FBYztXQUFkLGNBQWM7O0FBQ3ZCLFVBRFMsY0FBYyxDQUN0QixRQUFRLEVBQUU7d0JBREYsY0FBYzs7QUFFakMsNkJBRm1CLGNBQWMsNkNBRTNCLFFBQVEsRUFBRTtFQUNoQjs7Y0FIbUIsY0FBYzs7U0FLdkIscUJBQUMsQ0FBQyxFQUFFO0FBQ2QsV0FBTyxDQUFDLENBQUMsSUFBSTtBQUNaLFNBQUssV0FBVztBQUNmLFNBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsV0FBTTtBQUFBLEFBQ1AsU0FBSyxXQUFXO0FBQ2YsU0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixXQUFNO0FBQUEsQUFDUCxTQUFLLFNBQVM7QUFDYixTQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLFdBQU07QUFBQSxBQUNQLFNBQUssU0FBUztBQUNiLFNBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsV0FBTTtBQUFBLElBQ1A7R0FDRDs7O1NBRVUscUJBQUMsQ0FBQyxFQUFFOzs7QUFDZCxPQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixPQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRWxCLE9BQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQzlCLFFBQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQzs7QUFFOUMsUUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLFNBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUN4QixDQUFDLENBQUMsQ0FB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TSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3JCO0dBQ0Q7OztRQTdGbUIsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoic3JjL3N0YXRlcy9icnVzaC16b29tLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcnVzaFpvb21TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG5cdGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG5cdFx0c3VwZXIodGltZWxpbmUpO1xuXHR9XG5cblx0aGFuZGxlRXZlbnQoZSkge1xuXHRcdHN3aXRjaChlLnR5cGUpIHtcblx0XHRcdGNhc2UgJ21vdXNlZG93bic6XG5cdFx0XHRcdHRoaXMub25Nb3VzZURvd24oZSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnbW91c2Vtb3ZlJzpcblx0XHRcdFx0dGhpcy5vbk1vdXNlTW92ZShlKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdtb3VzZXVwJzpcblx0XHRcdFx0dGhpcy5vbk1vdXNlVXAoZSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAna2V5ZG93bic6XG5cdFx0XHRcdHRoaXMub25LZXlEb3duKGUpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXHRvbk1vdXNlRG93bihlKSB7XG5cdFx0dGhpcy5icnVzaGVzID0gW107XG5cdFx0dGhpcy5zdGFydFggPSBlLng7XG5cdFx0Ly8gY3JlYXRlIGJydXNoIGluIGVhY2ggY29udGFpbmVyc1xuXHRcdHRoaXMudHJhY2tzLmZvckVhY2goKHRyYWNrKSA9PiB7XG5cdFx0XHRjb25zdCBpbnRlcmFjdGlvbnMgPSB0cmFjay4kaW50ZXJhY3Rpb25zTGF5ZXI7XG5cblx0XHRcdGNvbnN0IGJydXNoID0gbmV3IEtvbnZhLlJlY3Qoe30pO1xuXHRcdFx0YnJ1c2guaGVpZ2h0KHRyYWNrLmhlaWdodClcblx0XHRcdFx0LnkoMClcblx0XHRcdFx0LmZpbGwoJyM3ODc4NzgnKVxuXHRcdFx0XHQub3BhY2l0eSgwLjIpO1xuXHRcdFx0YnJ1c2gudHJhY2sgPSB0cmFjaztcblxuXHRcdFx0aW50ZXJhY3Rpb25zLmFkZChicnVzaCk7XG5cblx0XHRcdHRoaXMuYnJ1c2hlcy5wdXNoKGJydXNoKTtcblxuXHRcdFx0aW50ZXJhY3Rpb25zLmJhdGNoRHJhdygpO1xuXHRcdFx0Ly8gaW50ZXJhY3Rpb25zLm1vdmVUb1RvcCgpO1xuXHRcdH0pO1xuXHR9XG5cblx0b25Nb3VzZU1vdmUoZSkge1xuXHRcdC8vIHVwZGF0ZSBicnVzaFxuXHRcdGNvbnN0IHdpZHRoID0gTWF0aC5hYnMoZS54IC0gdGhpcy5zdGFydFgpO1xuXHRcdGNvbnN0IHggPSBNYXRoLm1pbihlLngsIHRoaXMuc3RhcnRYKTtcblxuXHRcdHRoaXMuYnJ1c2hlcy5mb3JFYWNoKChicnVzaCkgPT4ge1xuXHRcdFx0YnJ1c2gueCh4KS53aWR0aCh3aWR0aCk7XG5cdFx0XHRicnVzaC50cmFjay4kaW50ZXJhY3Rpb25zTGF5ZXIuYmF0Y2hEcmF3KCk7XG5cdFx0fSk7XG5cdH1cblxuXHRvbk1vdXNlVXAoZSkge1xuXHRcdC8vIHJlbW92ZSBicnVzaFxuXHRcdHRoaXMuYnJ1c2hlcy5mb3JFYWNoKChicnVzaCkgPT4ge1xuXHRcdFx0YnJ1c2guZGVzdHJveSgpO1xuXHRcdFx0YnJ1c2gudHJhY2suJGludGVyYWN0aW9uc0xheWVyLmJhdGNoRHJhdygpO1xuXHRcdFx0YnJ1c2gudHJhY2sgPSB1bmRlZmluZWQ7XG5cdFx0fSk7XG5cdFx0dGhpcy5icnVzaGVzLmxlbmd0aCA9IDA7XG5cblx0XHQvLyB1cGRhdGUgdGltZUNvbnRleHRcblx0XHRjb25zdCBzdGFydFggPSB0aGlzLnN0YXJ0WDtcblx0XHRjb25zdCBlbmRYID0gZS54O1xuXHRcdC8vIHJldHVybiBpZiBubyBkcmFnXG5cdFx0aWYgKE1hdGguYWJzKHN0YXJ0WCAtIGVuZFgpIDwgMSkgeyByZXR1cm47IH1cblxuXHRcdGNvbnN0IGxlZnRYID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oc3RhcnRYLCBlbmRYKSk7XG5cdFx0Y29uc3QgcmlnaHRYID0gTWF0aC5tYXgoc3RhcnRYLCBlbmRYKTtcblxuXHRcdGxldCBtaW5UaW1lID0gdGhpcy50aW1lbGluZS50aW1lVG9QaXhlbC5pbnZlcnQobGVmdFgpO1xuXHRcdGxldCBtYXhUaW1lID0gdGhpcy50aW1lbGluZS50aW1lVG9QaXhlbC5pbnZlcnQocmlnaHRYKTtcblxuXHRcdGNvbnN0IGRlbHRhRHVyYXRpb24gPSBtYXhUaW1lIC0gbWluVGltZTtcblx0XHRjb25zdCB6b29tID0gdGhpcy50aW1lbGluZS52aXNpYmxlRHVyYXRpb24gLyBkZWx0YUR1cmF0aW9uO1xuXG5cdFx0dGhpcy50aW1lbGluZS5vZmZzZXQgLT0gbWluVGltZTtcblx0XHR0aGlzLnRpbWVsaW5lLnpvb20gKj0gem9vbTtcblxuXHRcdHRoaXMudHJhY2tzLnVwZGF0ZSgpO1xuXHR9XG5cblx0b25LZXlEb3duKGUpIHtcblx0XHQvLyByZXNldCBvbiBzcGFjZSBiYXJcblx0XHRpZiAoZS5vcmlnaW5hbEV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG5cdFx0XHR0aGlzLnRpbWVsaW5lLm9mZnNldCA9IDA7XG5cdFx0XHR0aGlzLnRpbWVsaW5lLnpvb20gPSAxO1xuXHRcdFx0dGhpcy50cmFja3MudXBkYXRlKCk7XG5cdFx0fVxuXHR9XG59XG4iXX0=