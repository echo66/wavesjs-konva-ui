import Konva from 'konva';
import BaseShape from './base-shape';

export default class Segment extends BaseShape {

	destroy() {
		this.$segment.destroy();
		this.$segment = null;
		this.$leftHandler.destroy();
		this.$leftHandler = null;
		this.$rightHandler.destroy();
		this.$rightHandler = null;
		super.destroy();
	}

	getClassName() { return 'segment'; }

	_getAccessorList() {
		return { x: 0, y: 0, width: 1, height: 1 };
	}

	_getDefaults() {
		return {
			displayHandlers: true,
			handlerWidth: 2,
			handlerOpacity: 0.8,
			opacity: 0.6, 
			handlerColor: '#000000', 
			color: '#000000',
		};
	}

	render(renderingContext) {
		if (this.$el) { return this.$el; }

		this.$el = [];

		this.$segment = new Konva.Rect({});
		this.$segment.name('segment');
		// this.$segment.on('mouseover', function(e) { document.body.style.cursor = 'pointer'; });
		// this.$segment.on('mouseout', function(e) { document.body.style.cursor = 'default'; });
		this.$segment.shape = this;

		this.$el.push(this.$segment);

		this.$leftHandler = new Konva.Rect({});
		this.$leftHandler.addName('left');
		this.$leftHandler.addName('handler');
		// this.$leftHandler.on('mouseover', function() { document.body.style.cursor = 'ew-resize'; });
		// this.$leftHandler.on('mouseout', function() { document.body.style.cursor = 'default'; });
		this.$leftHandler.shape = this;

		this.$rightHandler = new Konva.Rect({});
		this.$rightHandler.addName('right');
		this.$rightHandler.addName('handler');
		// this.$rightHandler.on('mouseover', function() { document.body.style.cursor = 'ew-resize'; });
		// this.$rightHandler.on('mouseout', function() { document.body.style.cursor = 'default'; });
		this.$rightHandler.shape = this;

		this.$segment.perfectDrawEnabled(false);
		this.$leftHandler.perfectDrawEnabled(false);
		this.$rightHandler.perfectDrawEnabled(false);

		this.$el.push(this.$leftHandler);
		this.$el.push(this.$rightHandler);

		return this.$el;
	}

	update(renderingContext, datum) {
		const d = datum || this.datum;

		this.$segment.visible(this.visible);
		this.$leftHandler.visible(this.visible && this.params.displayHandlers);
		this.$rightHandler.visible(this.visible && this.params.displayHandlers);

		if (!this.visible)	return;

		const width = renderingContext.timeToPixel(this.width(d));
		const height = Math.abs(renderingContext.valueToPixel(this.y(d) + this.height(d)) - renderingContext.valueToPixel(this.y(d)));
		const x = renderingContext.timeToPixel(this.x(d));
		const y = renderingContext.valueToPixel(this.y(d) + this.height(d));

		this.$segment
				.x(x)
				.y(y)
				.width(Math.max(width, 0))
				.height(height)
				.fill(this.params.color)
				.opacity(this.params.opacity);

		this.$leftHandler
				.x(x)
				.y(y)
				.width(this.params.handlerWidth)
				.height(height)
				.fill(this.params.handlerColor)
				.opacity(this.params.handlerOpacity);
				
		this.$rightHandler
				.x(x + width - this.params.handlerWidth)
				.y(y)
				.height(height)
				.width(this.params.handlerWidth)
				.fill(this.params.handlerColor)
				.opacity(this.params.handlerOpacity);
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