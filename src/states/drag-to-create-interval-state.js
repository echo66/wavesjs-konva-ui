'use strict';
import BaseState from './base-state';
import BrushController from '../helpers/brush-controller';

export default class DragToCreateIntervalState extends BaseState {
	constructor(timeline) {
		super(timeline);
		this.brushController = null;
		this.currentTrack = null;
	}

	enter() {}

	exit() {
		this.brushController = null;
		this.currentTrack = null;
	}

	onIntervalAvailable(interval, track) {
		throw new Error('The developer must assign a proper function');
	}

	snapInterval(interval, track) {
		throw new Error('The developer must assign a proper function');	
	}

	handleEvent(e) {
		switch (e.type) {
			case 'mousedown':
				this.onMouseDown(e);
				break;
			case 'mousemove':
				this.onMouseMove(e);
				break;
			case 'mouseup':
				this.onMouseUp(e);
				break;
			case 'click':
				this.onClick(e);
				break;
		}
	}

	onMouseDown(e) {
		this.currentTrack = this.timeline.getTrackFromDOMElement(e.target.parent.parent.content);
		this.brushController = new BrushController(this.currentTrack);
		this.brushController.addBrush();
	}

	onMouseMove(e) {
		this.brushController.updateBrush(e);
	}

	onMouseUp(e) {
		let area = this.brushController.brushArea;

		let interval = {
			time: -this.timeline.timeContext.offset + this.timeline.timeContext.timeToPixel.invert(area.x), 
			duration: this.timeline.timeContext.timeToPixel.invert(area.width)
		};

		this.onIntervalAvailable(interval, this.currentTrack);
		
		this.brushController.removeBrush();
	}

	onClick(e) {
		let interval = { time: -this.timeline.timeContext.offset + this.timeline.timeContext.timeToPixel.invert(e.x) };

		this.onIntervalAvailable(interval, this.currentTrack);
	}
}