'use strict'

class BrushZoomState extends BaseState {
	constructor(timeline) {
		super(timeline);
	}

	handleEvent(e) {
		switch(e.type) {
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

	onMouseDown(e) {
		this.brushes = [];
		this.startX = e.x;
		// create brush in each containers
		this.tracks.forEach((track) => {
			const interactions = track.$interactionsLayer;

			const brush = new Konva.Rect({});
			brush.height(track.height)
				.y(0)
				.fill('#787878')
				.opacity(0.2);
			brush.track = track;

			interactions.add(brush);

			this.brushes.push(brush);

			interactions.batchDraw();
			interactions.moveToTop();
		});
	}

	onMouseMove(e) {
		// update brush
		const width = Math.abs(e.x - this.startX);
		const x = Math.min(e.x, this.startX);

		this.brushes.forEach((brush) => {
			brush.x(x).width(width);
			brush.track.$interactionsLayer.batchDraw();
		});
	}

	onMouseUp(e) {
		// remove brush
		this.brushes.forEach((brush) => {
			brush.destroy();
			brush.track.$interactionsLayer.batchDraw();
			brush.track = undefined
		});
		this.brushes.length = 0;

		// update timeContext
		const startX = this.startX;
		const endX = e.x;
		// return if no drag
		if (Math.abs(startX - endX) < 1) { return; }

		const leftX = Math.max(0, Math.min(startX, endX));
		const rightX = Math.max(startX, endX);

		let minTime = this.timeline.timeToPixel.invert(leftX);
		let maxTime = this.timeline.timeToPixel.invert(rightX);

		const deltaDuration = maxTime - minTime;
		const zoom = this.timeline.visibleDuration / deltaDuration;

		this.timeline.offset -= minTime;
		this.timeline.zoom *= zoom;

		this.tracks.update();
	}

	onKeyDown(e) {
		// reset on space bar
		if (e.originalEvent.keyCode === 32) {
			this.timeline.offset = 0;
			this.timeline.zoom = 1;
			this.tracks.update();
		}
	}
}
