'use strict';
import BaseBehavior from './base-behavior';


export default class MarkerBehavior extends BaseBehavior {

	constructor(snapFn) {
		super();
		this.snapFn = snapFn || function(datum, accessor, value) {
			return value;
		};
	}

	edit(renderingContext, shape, datum, dx, dy, target) {
		const x = renderingContext.timeToPixel(shape.x(datum));
		let targetX = (x + dx) > 0 ? x + dx : 0;

		shape.x(datum, this.snapFn(datum, 'x', renderingContext.timeToPixel.invert(targetX)));
	}

	select(datum) {
		super.select(datum);
		this.highlight(datum, true);
	}

	unselect(datum) {
		super.unselect(datum);
		this.highlight(datum, false);
	}

	highlight(datum, isHighlighted) {
		const shape = this._layer.getShapeFromDatum(datum);
		if (shape) {
			if (isHighlighted) {
				shape.params.color = shape.params.handlerColor = 'red';
			} else {
				shape.params.color = shape.params.handlerColor = undefined;
			}
		} else {
			throw new Error('No shape for this datum in this layer', { datum: datum, layer: this._layer });
		}
	}
}
