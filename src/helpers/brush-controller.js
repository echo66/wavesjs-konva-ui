'use strict';
import Konva from 'konva';

export default class BrushController {
	constructor(track, style) {
		this.track = track;
		this.innerColor = style.innerColor || '#686868';
		this.opacity = style.opacity || 0.5;
	}

	

	set opacity(value) {
		this.innerColor = value;
		if (this.track.$brush)
			this.track.$brush.opacity(this.opacity);
	}

	get opacity() {
		return this.opacity;
	}

	set innerColor(value) {
		this.innerColor = value;
		if (this.track.$brush)
			this.track.$brush.fill(this.innerColor);
	}

	get innerColor() {
		return this.innerColor;
	}



	addBrush() {
		if (this.track.$brush) return; 

		const brush = new Konva.Rect({});
		brush.fill(this.innerColor).opacity(this.opacity);

		this.track.$interactionsLayer.add(brush);
		this.track.$interactionsLayer.moveToTop();

		this.track.$brush = brush;

		this.track.$interactionsLayer.batchDraw();
	}

	removeBrush() {
		if (this.track.$brush === undefined) return; 

		this._resetBrush(this.track);

		this.track.$brush.destroy();

		this.track.$interactionsLayer.batchDraw();

		delete this.track.$brush;
	}

	resetBrush() {
		const $brush = this.track.$brush;
		// reset brush element
		$brush.x(0).y(0).width(0).height(0);
		this.track.$interactionsLayer.batchDraw();
	}

	updateBrush(e, track) {
		const $brush = this.track.$brush;

		$brush.x(e.area.left).y(0).width(e.area.width).height(this.track.height);

		this.track.$interactionsLayer.batchDraw();
	}
}