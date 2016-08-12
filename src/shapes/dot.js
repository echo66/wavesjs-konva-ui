'use strict';
import BaseShape from './base-shape';
import Konva from 'konva';


export default class Dot extends BaseShape {

	destroy() {
		this.$el[0].destroy();
		super.destroy();
	}

	getClassName() { return 'dot'; }

	// @TODO rename : confusion between accessors and meta-accessors
	_getAccessorList() {
		return { 
			x: 0, 
			y: 0, 
			r: 3, 
			color: 'black' 
		};
	}

	_getDefaults() {
		return { 
			x: undefined, 
			y: undefined, 
			r: undefined, 
			color: undefined 
		};
	}

	render() {
		if (this.$el) { return this.$el; }

		this.$el = [new Konva.Circle({})];
		this.$el[0].shape = this;
		this.$el[0].perfectDrawEnabled(false);

		return this.$el;
	}

	update(renderingContext, datum) {
		const d = datum || this.datum;

		const x = this.params.x || renderingContext.timeToPixel(this.x(d));
		const y = this.params.y || renderingContext.valueToPixel(this.y(d));
		// const r	= this.r(d);
		// const color = this.color(d);
		const r = this.params.r || this.r(d);
		const color = this.params.color || this.color(d);
		
		this.$el[0].x(x);
		this.$el[0].y(y);
		this.$el[0].radius(r);
		this.$el[0].fill(color);
	}

	// x1, x2, y1, y2 => in pixel domain
	inArea(renderingContext, datum, x1, y1, x2, y2) {
		const x = this.$el[0].getAbsolutePosition().x;
		const y = this.$el[0].getAbsolutePosition().y;

		if ((x >= x1 && x <= x2) && (y >= y1 && y <= y2)) {
			return true;
		}

		return false;
	}
}
