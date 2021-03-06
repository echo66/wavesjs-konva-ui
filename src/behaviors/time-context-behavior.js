'use strict';
import BaseBehavior from './base-behavior';

/**
* TimeContextBehavior is used internally in Layers to modify their TimeContext.
* This object is different from other Shapes Behaviors and exists mostly to decrease the size of the Layer.
* All the code here could be considered as part of the layer.
*/
export default class TimeContextBehavior extends BaseBehavior {
	edit(layer, dx, dy, target) {
		const timeContext = layer.timeContext;

		if (target.hasName('handler')) {
			if (target.hasName('left')) 
				this._editLeft(timeContext, dx);
			else if (target.hasName('right')) 
				this._editRight(timeContext, dx);
			else 
				throw new Error('Unexpected konva shape name');
		} else if (target.hasName('segment')) 
			this._move(timeContext, dx);
		else 
			throw new Error('Unexpected konva shape name');
	}

	_editLeft(timeContext, dx) {
		// edit `start`, `offset` and `duration`
		const x = timeContext.parent.timeToPixel(timeContext.start);
		const offset = timeContext.timeToPixel(timeContext.offset);
		const width = timeContext.timeToPixel(timeContext.duration);

		const targetX = x + dx;
		const targetOffset = offset - dx;
		const targetWidth = Math.max(width - dx, 1);

		timeContext.start = timeContext.parent.timeToPixel.invert(targetX);
		timeContext.offset = timeContext.timeToPixel.invert(targetOffset);
		timeContext.duration = timeContext.timeToPixel.invert(targetWidth);
	}

	_editRight(timeContext, dx) {
		const width = timeContext.timeToPixel(timeContext.duration);
		const targetWidth = Math.max(width + dx, 1);

		timeContext.duration = timeContext.timeToPixel.invert(targetWidth);
	}

	_move(timeContext, dx) {
		const x = timeContext.parent.timeToPixel(timeContext.start);
		const targetX = Math.max(x + dx, 0);

		timeContext.start = timeContext.parent.timeToPixel.invert(targetX);
	}

	stretch(layer, dx, dy, target) {
		const timeContext = layer.timeContext;
		const lastDuration = timeContext.duration;
		const lastOffset = timeContext.offset;

		this.edit(layer, dx, dy, target);

		const newDuration = timeContext.duration;
		const ratio = (newDuration / lastDuration);

		timeContext.stretchRatio *= ratio;
		timeContext.offset = lastOffset;
		timeContext.duration = lastDuration;
	}
}
