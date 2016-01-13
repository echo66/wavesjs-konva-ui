'use strict'

class Segment extends BaseShape {

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
		return { x: 0, y: 0, width: 0, height: 1};
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
		this.$segment.opacity(this.params.opacity);
		this.$segment.shape = this;

		this.$el.push(this.$segment);

		this.$leftHandler = new Konva.Rect({});
		this.$leftHandler.addName('left');
		this.$leftHandler.addName('handler');
		this.$leftHandler.width(this.params.handlerWidth);
		this.$leftHandler.opacity(this.params.handlerOpacity);
		// this.$leftHandler.on('mouseover', function() { document.body.style.cursor = 'ew-resize'; });
		// this.$leftHandler.on('mouseout', function() { document.body.style.cursor = 'default'; });
		this.$leftHandler.shape = this;

		this.$rightHandler = new Konva.Rect({});
		this.$rightHandler.addName('right');
		this.$rightHandler.addName('handler');
		this.$rightHandler.width(this.params.handlerWidth);
		this.$rightHandler.opacity(this.params.handlerOpacity);
		// this.$rightHandler.on('mouseover', function() { document.body.style.cursor = 'ew-resize'; });
		// this.$rightHandler.on('mouseout', function() { document.body.style.cursor = 'default'; });
		this.$rightHandler.shape = this;

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
		const color = this.color(d);

		this.$segment.x(x).width(Math.max(width, 0)).height(height).fill(this.params.color).opacity(this.params.opacity);

		this.$leftHandler
				.x(x).y(0)
				.width(this.params.handlerWidth)
				.height(height)
				.fill(this.params.handlerColor)
				.opacity(this.params.handlerOpacity);
				
		this.$rightHandler
				.x(x + width - this.params.handlerWidth).y(0)
				.height(height)
				.width(this.params.handlerWidth)
				.fill(this.params.handlerColor)
				.opacity(this.params.handlerOpacity);
	}

	inArea(renderingContext, x1, y1, x2, y2, datum) {
		const d = datum || this.datum;

		const shapeX1 = renderingContext.timeToPixel(this.x(d));
		const shapeX2 = renderingContext.timeToPixel(this.x(d) + this.width(d));
		const shapeY1 = renderingContext.valueToPixel(this.y(d));
		const shapeY2 = renderingContext.valueToPixel(this.y(d) + this.height(d));

		// http://jsfiddle.net/uthyZ/ - check overlaping area
		const xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
		const yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
		const area = xOverlap * yOverlap;

		return area > 0;
	}

}