'use strict';
import BaseShape from './base-shape';
import Konva from 'konva';

export default class Segment extends BaseShape {

	destroy() {
		this.$segment.destroy();
		this.$segment = null;
		this.$leftHandler.destroy();
		this.$leftHandler = null;
		this.$rightHandler.destroy();
		this.$rightHandler = null;
		this.$topHandler.destroy();
		this.$topHandler = null;
		this.$bottomHandler.destroy();
		this.$bottomHandler = null;
		super.destroy();
	}

	getClassName() { return 'segment'; }

	_getAccessorList() {
		return { 
			x: 0, 
			y: 0, 
			width: 1, 
			height: 1, 

			displayHandlers: true,
			handlerWidth: 2,
			handlerOpacity: 0.8,
			opacity: 0.6, 
			handlerColor: '#000000', 
			color: '#000000',
		};
	}

	_getDefaults() {
		return {
			x: undefined, 
			y: undefined, 
			width: undefined, 
			height: undefined, 

			displayHandlers: undefined,
			handlerWidth: undefined,
			handlerOpacity: undefined,
			opacity: undefined, 
			handlerColor: undefined, 
			color: undefined,
		};
	}

	render(renderingContext) {
		if (this.$el) { return this.$el; }

		this.$el = [];

		this.$segment = new Konva.Rect({});
		this.$segment.name('segment');
		this.$segment.shape = this;

		this.$el.push(this.$segment);

		this.$leftHandler = new Konva.Rect({});
		this.$leftHandler.addName('left');
		this.$leftHandler.addName('handler');
		this.$leftHandler.shape = this;

		this.$rightHandler = new Konva.Rect({});
		this.$rightHandler.addName('right');
		this.$rightHandler.addName('handler');
		this.$rightHandler.shape = this;

		this.$topHandler = new Konva.Rect({});
		this.$topHandler.addName('top');
		this.$topHandler.addName('handler');
		this.$topHandler.shape = this;

		this.$bottomHandler = new Konva.Rect({});
		this.$bottomHandler.addName('bottom');
		this.$bottomHandler.addName('handler');
		this.$bottomHandler.shape = this;

		this.$segment.perfectDrawEnabled(false);
		this.$leftHandler.perfectDrawEnabled(false);
		this.$rightHandler.perfectDrawEnabled(false);
		this.$topHandler.perfectDrawEnabled(false);
		this.$bottomHandler.perfectDrawEnabled(false);

		this.$el.push(this.$leftHandler);
		this.$el.push(this.$rightHandler);
		this.$el.push(this.$topHandler);
		this.$el.push(this.$bottomHandler);

		return this.$el;
	}

	update(renderingContext, datum) {
		const d = datum || this.datum;

		this.$segment.visible(this.visible);
		this.$leftHandler.visible(this.visible && this.params.displayHandlers);
		this.$rightHandler.visible(this.visible && this.params.displayHandlers);
		this.$topHandler.visible(this.visible && this.params.topHandler);
		this.$bottomHandler.visible(this.visible && this.params.bottomHandler);

		if (!this.visible)	return;

		const width = this.params.width || renderingContext.timeToPixel(this.width(d));
		const height = this.params.height || Math.abs(renderingContext.valueToPixel(this.y(d) + this.height(d)) - renderingContext.valueToPixel(this.y(d)));
		const x = this.params.x || renderingContext.timeToPixel(this.x(d));
		const y = this.params.y || renderingContext.valueToPixel(this.y(d) + this.height(d));
		const color = this.params.color || this.color(d);
		const handlerColor = this.params.handlerColor || this.handlerColor(d);
		const opacity = this.params.opacity || this.opacity(d);
		const handlerOpacity = this.params.handlerOpacity || this.handlerOpacity(d);
		const handlerWidth = this.params.handlerWidth || this.handlerWidth(d);

		this.$segment
				.x(x)
				.y(y)
				.width(Math.max(width, 0))
				.height(height)
				.fill(color)
				.opacity(opacity);

		this.$leftHandler
				.x(x)
				.y(y)
				.width(handlerWidth)
				.height(height)
				.fill(handlerColor)
				.opacity(handlerOpacity);
				
		this.$rightHandler
				.x(x + width - handlerWidth)
				.y(y)
				.height(height)
				.width(handlerWidth)
				.fill(handlerColor)
				.opacity(handlerOpacity);

		this.$topHandler
				.x(x)
				.y(y)
				.height(handlerWidth)
				.width(width)
				.fill(handlerColor)
				.opacity(handlerOpacity);

		this.$bottomHandler
				.x(x)
				.y(y+height-handlerWidth)
				.height(handlerWidth)
				.width(width)
				.fill(handlerColor)
				.opacity(handlerOpacity);
	}

	inArea(renderingContext, datum, x1, y1, x2, y2) {
		const d = datum || this.datum;

		const shapeX1 = this.$segment.getAbsolutePosition().x;
		const shapeY1 = this.$segment.getAbsolutePosition().y;
		const shapeX2 = shapeX1 + this.$segment.width();
		const shapeY2 = shapeY1 + this.$segment.height();

		/*
		 *	The segment is entirely within the provided area.
		 */
		// if (x1 <= shapeX1 && x2 >= shapeX2 && y1 <= shapeY1 && y2 >= shapeY2)
		// 	return true;
		// else
		// 	return false;

		/*
		 *	The segment overlaps the provided area.
		 */
		const xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
		const yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
		const area = xOverlap * yOverlap;

		return area > 0;
	}

}