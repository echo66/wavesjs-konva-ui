'use strict';
import events from 'events';
import Timeline from '../core/timeline';
import Track from '../core/track';
import Layer from '../core/layer';
import LayerTimeContext from '../core/layer-time-context';
import ScrollSegmentBehavior from '../behaviors/scroll-segment-behavior';
import Segment from '../shapes/segment';
import SimpleEditionState from '../states/simple-edition-state';


export default class Scroller extends events.EventEmitter {
	constructor($el, targetTimelines, pixelsPerSecond, width, height, start, duration) {
		super();
		const that = this;
		this.handlers = {
			set: function(timelines, index, value) {
				// console.log([timelines, index, value]);
				if (!isNaN(parseInt(index))) {
					timelines[index] = value;
					var interval = {
						start: that.visibleRange.start, 
						duration: that.visibleRange.duration
					};
					timelines[index].visibleInterval = interval;
					timelines[index].tracks.update();
				}
				return true;
			}
		};
		this.auxTimeline = new Timeline(pixelsPerSecond, width);
		var t = document.createElement('div');
		t.classList.add("scroll-div");
		$el.appendChild(t);

		this.auxTrack = new Track(t, 20, width);

		this.auxScrollLayer = new Layer('collection', [], {
			height: height,
			yDomain: [0, 1]
		});
		this.auxScrollLayer.setBehavior(new ScrollSegmentBehavior(new Proxy([], this.handlers)));
		this.auxScrollLayer.setTimeContext(new LayerTimeContext(this.auxTimeline.timeContext));
		this.auxScrollLayer.configureShape(Segment, {});
		this.auxScrollLayer.timeContext.lockedToParentInterval = true;

		this.auxScrollLayer.sort_data = function(data) {};
		this.auxScrollLayer.visible_data = function(timeContext, data) { return [0, data.length-1]; };
		this.auxScrollLayer.timeContext.lockedToParentInterval = true;

		var visibleInterval = { start: start || 0, duration: duration || 10};

		this.scrollDatum = {x: visibleInterval.start, duration: visibleInterval.duration};
		this.auxScrollLayer.add(this.scrollDatum);

		this.auxTimeline.visibleInterval = visibleInterval;

		targetTimelines = (targetTimelines instanceof Array)? targetTimelines : [targetTimelines];
		targetTimelines.forEach((timeline) => {
			that.timelines.push(timeline);
		});

		this.auxTrack.add(this.auxScrollLayer);
		this.auxTimeline.add(this.auxTrack);
		this.auxTimeline.tracks.update();

		this.auxScrollLayer.edit([this.scrollDatum], 0, 0, this.auxScrollLayer.getShapeFromDatum(this.scrollDatum).$segment);

		this.auxTimeline.state = new SimpleEditionState(this.auxTimeline);

		
		this.auxTimeline.on('event', (e)=> {
			if (e.type == 'click' && e.target && !e.target.shape) {
				const offset = (-that.auxTimeline.timeContext.offset);
				const time = that.auxTimeline.timeContext.timeToPixel.invert(e.x);
				const currentTime = offset + time;
				const dx = e.x - that.auxTimeline.timeContext.timeToPixel(that.scrollDatum.x);
				const shape = that.auxScrollLayer.getShapeFromDatum(that.scrollDatum);

				that.auxScrollLayer.edit([that.scrollDatum], dx, 0, shape.$segment);
				that.auxTimeline.tracks.update();
				that.emit('drag');
			} else if (e.type == 'mousemove') {
				that.emit('drag');
			}
		});
	}

	set availableScrollRange(interval) {
		this.auxTimeline.visibleInterval = interval;
		this.auxTimeline.tracks.update();
	}
	
	get availableScrollRange() {
		return this.auxTimeline.visibleInterval;
	}

	set visibleRange(interval) {
		const targetX = this.auxTimeline.timeContext.timeToPixel(interval.start);
		const x = this.auxTimeline.timeContext.timeToPixel(this.scrollDatum.x);
		const dx = targetX - x;
		this.scrollDatum.width = interval.duration;

		const shape = this.auxScrollLayer.getShapeFromDatum(this.scrollDatum);
		this.auxScrollLayer.edit([this.scrollDatum], dx, 0, shape.$segment);

		this.auxTimeline.tracks.update();
	}

	get visibleRange() {
		return {start: this.scrollDatum.x, duration: this.scrollDatum.width || 10};
	}

	set color(value) {
		this.auxScrollLayer.getShapeFromDatum(this.scrollDatum).params.color = value;
		this.auxTimeline.tracks.update();
	}

	get color() {
		return this.auxScrollLayer.getShapeFromDatum(this.scrollDatum).params.color;
	}

	set timelines(timelines) {
		this.auxScrollLayer._behavior.targetTimelines = new Proxy(timelines, this.handlers);
		this.auxScrollLayer._behavior._refresh();
	}

	get timelines() {
		return this.auxScrollLayer._behavior.targetTimelines;
	}
}