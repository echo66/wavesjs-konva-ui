'use strict'


class MarkerBehavior extends BaseBehavior {

	edit(renderingContext, shape, datum, dx, dy, target) {
		const x = renderingContext.timeToPixel(shape.x(datum));
		let targetX = (x + dx) > 0 ? x + dx : 0;

		shape.x(datum, renderingContext.timeToPixel.invert(targetX));
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
				shape.params.color = 'red';
				shape.params.handlerColor = 'red';
			} else {
				const defaults = shape._getDefaults();
				shape.params.color = defaults.color;
				shape.params.handlerColor = defaults.handlerColor;
			}
		} else {
			throw new Error('No shape for this datum in this layer', { datum: datum, layer: this._layer });
		}
	}
}
