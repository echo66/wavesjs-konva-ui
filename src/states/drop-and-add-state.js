'use strict';
import BaseState from './base-state';

export default class DropAndAddState extends BaseState {
	constructor(timeline) {
		super(timeline);
		this.targetLayer = new Map();
	}

	setTargetLayerForTrack(track, layer) {
		this.targetLayer.set(track, layer);
	}

	exit() {
		this.targetLayer.clear();
		// TODO: remove track highlight ?
	}

	handleEvent(e) {
		switch (e.type) {
			case 'dragstart':
				this.onDragStart(e);
				break;
			case 'dragend':
				this.onDragEnd(e);
				break;
			case 'dragover':
				this.onDragOver(e);
				break;
			case 'drop':
				this.onDrop(e);
				break;
			case 'dragleave':
				this.onDragLeave(e);
				break;
		}
	}

	onDragStart(e) {
		// N/A
	}

	onDragEnd(e) {
		// TODO ?
	}

	onDragOver(e) {
		// TODO: highlight track ?
	}

	onDragLeave(e) {
		// TODO: remove track highlight ?
	}

	onDrop(e) {
		const offset = (-this.timeline.timeContext.offset);
		const time = this.timeline.timeContext.timeToPixel.invert(e.x);
		const currentTime = offset + time;

		var track = this.timeline.getTrackFromDOMElement(e.currentTarget);
		var layer = this.targetLayer.get(track);

		if (layer) {
			var datum = document.getElementById(e.originalEvent.dataTransfer.getData("Text")).getDatum();
			datum.x = currentTime;
			layer.add(datum);
			layer.getShapeFromDatum(datum).params.color = datum.color;
			layer.update();
		}
		
		e.originalEvent.dataTransfer.clearData();
	}
}