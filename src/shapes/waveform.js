'use strict';
import BaseShape from './base-shape';
import scales from '../utils/scales'
import Konva from 'konva';

export default class Waveform extends BaseShape {

	destroy() {
		this.$label.destroy();
		this.$label = null;

		this.$header.destroy();
		this.$header = null;

		this.$body.destroy();
		this.$body = null;

		this.$leftHandler.destroy();
		this.$leftHandler = null;

		this.$rightHandler.destroy();
		this.$rightHandler = null;

		this.$waveform.destroy();
		this.$waveform = null;

		super.destroy();
	}

	getClassName() { return 'waveform'; }

	_getAccessorList() {
		// return { y: 0 };
		// TODO: delete all but sampleRate.
		return { data: [], x: 0, width: 10000, bufferStart: 0, bufferEnd: 0, sampleRate: 44100, color: 'black', text: "" };
	}

	_getDefaults() {
		return {
			waveformQuality: 2000, 
			squaringFactor: 1, 
			displayHandlers: true, 
			displayBody: true, 
			displayLabel: true, 
			displayHeader: true, 
			headerHeightRatio: 0.1, // 10% of the body height
			waveform: {
				color: '#000000',
				opacity: 1, 
			},
			header: {
				color: 'green',
				opacity: 0.4, 
			},
			body: {
				color: 'yellow',
				opacity: 0.1, 
			},
			handler: {
				width: 2, 
				opacity: 1,
				color: 'orange'
			},
		};
	}

	render(renderingContext) {
		if (this.$el) { return this.$el; }

		this.$el = [];

		this.$header = new Konva.Rect({});
		this.$header.addName('header');
		this.$header.shape = this;
		// this.$header.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
		// this.$header.on('mouseout', function() { document.body.style.cursor = 'default'; });		

		this.$body	 = new Konva.Rect({});
		this.$body.addName('body');
		this.$body.shape = this;
		// this.$body.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
		// this.$body.on('mouseout', function() { document.body.style.cursor = 'default'; });

		this.$leftHandler = new Konva.Rect({});
		this.$leftHandler.addName('handler');
		this.$leftHandler.addName('left');
		this.$leftHandler.shape = this;
		// this.$leftHandler.on('mouseover', function() { document.body.style.cursor = 'ew-resize'; });
		// this.$leftHandler.on('mouseout', function() { document.body.style.cursor = 'default'; });

		this.$rightHandler = new Konva.Rect({});
		this.$rightHandler.addName('handler');
		this.$rightHandler.addName('right');
		this.$rightHandler.shape = this;
		// this.$rightHandler.on('mouseover', function() { document.body.style.cursor = 'ew-resize'; });
		// this.$rightHandler.on('mouseout', function() { document.body.style.cursor = 'default'; });

		this.$label = new Konva.Text({ listening: false });
		this.$label.shape = this;

		this.$waveform = new Konva.Path({ listening: false });
		this.$waveform.shape = this;

		this.$el.push(this.$body);
		this.$el.push(this.$waveform);
		this.$el.push(this.$header);
		this.$el.push(this.$label);
		this.$el.push(this.$leftHandler);
		this.$el.push(this.$rightHandler);

		return this.$el;
	}

	update(renderingContext, datum) {
		const d = datum || this.datum;

		this.$header.visible(this.visible && this.params.displayHeader);
		this.$label.visible(this.visible && this.params.displayLabel);
		this.$body.visible(this.visible && this.params.displayBody);
		this.$leftHandler.visible(this.visible && this.params.displayHandlers);
		this.$rightHandler.visible(this.visible && this.params.displayHandlers);
		this.$waveform.visible(this.visible);

		if (!this.visible)	return;


		var  x = renderingContext.timeToPixel(this.x(d));
		var width = renderingContext.timeToPixel(this.width(d));
		var height = renderingContext.height;
		var color = this.params.waveform.color;

		for (var i in this.$el) {
			this.$el[i].x(x).y(0);
		}
		this.$el.forEach((el) => el.x(x).y(0));

		this.$label.text(this.text(d)).x(x+10).y(5);

		this.$header.width(Math.max(width, 0))
								.height(height * this.params.headerHeightRatio)
								.fill(this.params.header.color)
								.opacity(this.params.header.opacity);
		this.$body.width(Math.max(width, 0))
								.height(height)
								.fill(this.params.body.color)
								.opacity(this.params.body.opacity);

		this.$leftHandler.width(this.params.handler.width).height(height).fill(this.params.handler.color);

		this.$rightHandler.x(x + width - this.params.handler.width).width(this.params.handler.width).height(height).fill(this.params.handler.color);

		this.$waveform.fill(this.params.waveform.color).opacity(this.params.waveform.opacity).y(0);

		this.$waveform.perfectDrawEnabled(true);


		// WAVEFORM PART


		// define nbr of samples per pixels
	    const sliceMethod = this.data(d) instanceof Float32Array ? 'subarray' : 'slice';
	    const nbrSamples = this.bufferEnd(d) - this.bufferStart(d);
	    const duration = nbrSamples / this.sampleRate(d);
	    const samplesPerPixel = nbrSamples / width;

	    if (!samplesPerPixel || this.data(d).length < samplesPerPixel) { return; }

	    // compute/draw visible area only
	    // @TODO refactor this ununderstandable mess
	    let minX = Math.max(-renderingContext.offsetX, renderingContext.timeToPixel(this.x(d)));

	    let maxX = Math.min(-renderingContext.offsetX + renderingContext.width, renderingContext.timeToPixel(this.x(d) + this.width(d)));

	    // get min/max per pixels, clamped to the visible area
	    const invert = renderingContext.timeToPixel.invert;
	    const sampleRate = this.sampleRate(d);
	    const minMax = [];

	    for (let px = minX; px < maxX; px++) {
	      const startTime = invert(px);
	      const startSample = startTime * sampleRate;
	      const extract = this.data(d)[sliceMethod](startSample, startSample + samplesPerPixel);

	      let min = Infinity;
	      let max = -Infinity;

	      for (let j = 0, l = extract.length; j < l; j++) {
	        let sample = extract[j];
	        if (sample < min) { min = sample; }
	        if (sample > max) { max = sample; }
	      }
	      // disallow Infinity
	      min = !isFinite(min) ? 0 : min;
	      max = !isFinite(max) ? 0 : max;
	      if (min === 0 && max === 0) { continue; }

	      minMax.push([px, min, max]);
	    }

	    if (!minMax.length) { return; }

	    // const MID = renderingContext.valueToPixel((renderingContext.valueToPixel.domain()[1] - renderingContext.valueToPixel.domain()[0]) / 2)
	    const MID = 0;
	    const PIXEL = 0;
	    const MIN   = 1;
	    const MAX   = 2;
	    const ZERO  = renderingContext.valueToPixel(0);
	    // rendering strategies
	    // if (this.params.renderingStrategy === 'svg') {

	    let instructions = minMax.map((datum, index) => {
	        const x  = datum[PIXEL];
	        let y1 = Math.round(renderingContext.valueToPixel(datum[MIN]));
	        let y2 = Math.round(renderingContext.valueToPixel(datum[MAX]));
	        // return `${x},${ZERO}L${x},${y1}L${x},${y2}L${x},${ZERO}`;
	        return `${x},${y1-MID}L${x},${y2-MID}`;
	    });

	    const path = 'M' + instructions.join('L');
	    this.$waveform.data('M' + `${0},${height/2}L` + instructions.join('L') + `L${minMax[minMax.length-1][0]},${height/2}` + 'z');
	}

	inArea(renderingContext, datum, x1, y1, x2, y2) {
		const shapeX1 = renderingContext.timeToPixel(this.x(datum));
		const shapeX2 = renderingContext.timeToPixel(this.x(datum) + this.width(datum));
		const shapeY1 = renderingContext.valueToPixel(0);
		const shapeY2 = renderingContext.valueToPixel(renderingContext.height);

		// http://jsfiddle.net/uthyZ/ - check overlaping area
		const xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
		const yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
		const area = xOverlap * yOverlap;

		return area > 0;
	}

	linear_interpolation(arr, pos) {
		const first	 = Math.floor(pos);
		const frac		= pos - first;
		const second	= (first + 1) < arr.length ? (first + 1) : 0;

		return arr[first] * (1 - frac) + arr[second] * frac;
	}
}