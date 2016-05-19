'use strict';
import BaseState from './base-state';
import BrushController from '../helpers/brush-controller';

export default class DragAndDropState extends BaseState {
	constructor(timeline) {
		super(timeline);
		this.targetLayer = new Map();
		this.brushController = null;
	}

	setTargetLayerForTrack(track, layer) {
		this.targetLayer.set(track, layer);
		this.brushController = null;
	}

	exit() {
		this.targetLayer.clear();
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
			case 'dragenter':
				this.onDragEnter(e);
				break;
		}
	}

	onDragStart(e) {
		// N/A
		console.log('DragAndDropState - dragStart');
	}

	onDragEnd(e) {
		// TODO ?
		console.log('DragAndDropState - dragEnd');
	}

	onDragEnter(e) {
		console.log('DragAndDropState - dragEnter');	
		if (!this.brushController) {
			this.currentTrack = this.timeline.getTrackFromDOMElement(e.target);
			this.brushController = new BrushController(this.currentTrack);
		}
	}

	onDragOver(e) {
		this.brushController.addBrush();

		var timeToPixel	= this.timeline.timeContext.timeToPixel;
		var time = -this.timeline.timeContext.offset + timeToPixel.invert(e.x);
		var data = e.originalEvent.dataTransfer.getData("text");
		var duration = this.onDataAvailable(time, data, 'drag');
		
		var x = timeToPixel(time);
		var width = timeToPixel(duration);

		this.brushController.brushArea = { x: x, width: width };

		console.log('DragAndDropState - dragOver');
	}

	onDragLeave(e) {
		this.brushController.removeBrush();

		console.log('DragAndDropState - dragLeave');
	}

	onDrop(e) {
		var timeToPixel	= this.timeline.timeContext.timeToPixel;

		var time = -this.timeline.timeContext.offset + timeToPixel.invert(e.x);
		var data = e.originalEvent.dataTransfer.getData("text");
		this.onDataAvailable(time, data, 'drop');
		
		e.originalEvent.dataTransfer.clearData();

		this.brushController.removeBrush();

		console.log('DragAndDropState - drop');
	}
}