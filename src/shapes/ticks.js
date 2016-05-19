'use strict';
import BaseShape from './base-shape';
import Konva from 'konva';

/**
 * Kind of Marker for entity oriented data. Useful to display a grid.
 */
export default class Ticks extends BaseShape {
	_getClassName() {
		return 'tick';
	}

	_getAccessorList() {
		return { time: 0, label: '', focused: false };
	}

	_getDefaults() {
		return {
			default: {
				color: 'steelblue',
				opacity: 0.3,
				width: 1,
			},
			focused: {
				color: 'black',
				opacity: 0.8,
				width: 2,
			}
		};
	}

	render(renderingContext) {
		this.$el = new Set();

		this.$ticks = new Konva.Shape({ listening: false });
		this.$ticks.addName('ticks');
		this.$ticks.perfectDrawEnabled(false);

		this.$el.add(this.$ticks);
		
		return this.$el;
	}

	update(renderingContext, data) {

		const that = this;
		/*
		 * Maintain the same number of ticks and labels in the Shape memory as the number of datums.
		 * Destroy the remaining konva nodes.
		 */
		this.$ticks.sceneFunc(function(context) {
			context.beginPath();

			data.forEach(function(datum) {

				const x = renderingContext.timeToPixel(that.time(datum));
				const height = renderingContext.height;
				const isFocused = that.focused(datum);
				const label = that.label(datum);
				const width = (isFocused)? that.params.focused.width : that.params.default.width;
				const color = (isFocused)? that.params.focused.color : that.params.default.color;

				context.moveTo(x, 0);
				context.fillStyle = color;
				context.fillRect(x, 0, width, height);

				// TODO: text
				if (label !== undefined && label !== '') {
					context.globalAlpha = 0.9;
					context.font = '10px monospace';
					context.fillStyle = '#676767';
					context.fillText(label, x + 5, 10);
				}

			});

			context.closePath();

			context.fillStrokeShape(this);
		});

	}
}