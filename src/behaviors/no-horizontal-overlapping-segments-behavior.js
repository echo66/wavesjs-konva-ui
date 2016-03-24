'use strict';
import BaseBehavior from './base-behavior';

/*
 *  Allow to create a new datum only in empty spaces.
 *  When the layer requests an edit, refuse it if the new datum version overlaps an existing segment.
 */
export default class NoHorizontallOverlappingSegmentsBehavior extends BaseBehavior {
  /* This class name clearly shows the author suffers from some Java/COBOL related cognitive disease. */

  constructor(accessors) {
    super();
    this.dummy = {
      x: (d, v) => {
        if (v === undefined) v = null;
        if (v === null) { return d.x; }
        d.x = v;
      }, 
      width: (d, v) => {
        if (v === undefined) v = null;
        if (v === null) { return d.width; }
        d.width = v;
      }
    };
    for (let key in accessors) { this.dummy[key] = accessors[key]; }
  }

  initialize(layer) {
    super.initialize(layer);
    let accessors = (this._layer._shapeConfiguration)? this._layer._shapeConfiguration.accessors : {};
    for (let key in accessors) { this.dummy[key] = accessors[key]; }
  }

  intersects(datum1, datum2) {
    if (this.dummy.x(datum1) >= this.dummy.x(datum2) + this.dummy.width(datum2) || 
        this.dummy.x(datum1) + this.dummy.width(datum1) <= this.dummy.x(datum2))
      return false;
    else 
      return true;
  }

  destroy() {
    super.destroy();
    this.intersects = null;
  }

  edit(renderingContext, shape, datum, dx, dy, target) {
    let action = 'move';

    if (target.hasName('handler')) {
      if (target.hasName('left')) 
        action = 'resizeLeft';
      else if (target.hasName('right')) 
        action = 'resizeRight';
      else 
        throw new Error('Unexpected konva shape name');
    } else if (target.hasName('segment')) 
      action = 'move';
    else 
      throw new Error('Unexpected konva shape name');

    this[`_${action}`](renderingContext, shape, datum, dx, dy, target);
  }

  _move(renderingContext, shape, datum, dx, dy, target) {
    const layerHeight = renderingContext.height;
    // current values
    let x = renderingContext.timeToPixel(shape.x(datum));
    const y = renderingContext.valueToPixel(shape.y(datum));
    const width = renderingContext.timeToPixel(shape.width(datum));
    const height = renderingContext.valueToPixel(shape.height(datum));
    // target values
    let targetX = Math.max(x + dx, 0);

    targetX = renderingContext.timeToPixel.invert(targetX);
    x = shape.x(datum);

    shape.x(datum, targetX);

    for (let i=0; i < this._layer.data.length; i++) {
      if (this._layer.data[i] !== datum && this.intersects(this._layer.data[i], datum)) {
        if (x < shape.x(this._layer.data[i])) 
          shape.x(datum, shape.x(this._layer.data[i]) - shape.width(datum));
        else 
          shape.x(datum, shape.x(this._layer.data[i]) + shape.width(this._layer.data[i]));
        return;
      }
    }
  }

  _resizeLeft(renderingContext, shape, datum, dx, dy, target) {
    // current values
    let x     = renderingContext.timeToPixel(shape.x(datum));
    let width = renderingContext.timeToPixel(shape.width(datum));
    // target values
    let maxTargetX  = x + width;
    let targetX     = x + dx < maxTargetX ? Math.max(x + dx, 0) : x;
    let targetWidth = targetX !== 0 ? Math.max(width - dx, 1) : width;

    targetX = renderingContext.timeToPixel.invert(targetX);
    targetWidth = renderingContext.timeToPixel.invert(targetWidth);
    x = shape.x(datum);
    width = shape.width(datum);

    shape.x(datum, targetX);
    shape.width(datum, targetWidth);

    for (let i=0; i < this._layer.data.length; i++) {
      if (this._layer.data[i] !== datum && this.intersects(this._layer.data[i], datum)) {
        shape.width(datum, (x + width) - (shape.x(this._layer.data[i]) + shape.width(this._layer.data[i])));
        shape.x(datum, shape.x(this._layer.data[i]) + shape.width(this._layer.data[i]));
        return;
      }
    }

  }

  _resizeRight(renderingContext, shape, datum, dx, dy, target) {
    // current values
    let width = renderingContext.timeToPixel(shape.width(datum));
    // target values
    let targetWidth = renderingContext.timeToPixel.invert(Math.max(width + dx, 1));
    let x = shape.x(datum);
    width = shape.width(datum);

    shape.width(datum, targetWidth);

    for (let i=0; i < this._layer.data.length; i++) {
      if (this._layer.data[i] !== datum && this.intersects(this._layer.data[i], datum)) {
        shape.width(datum, shape.x(this._layer.data[i]) - shape.x(datum));
        return;
      }
    }
  }

  can(action, datums) { 
    switch (action) {
      case 'add': 
        let i=0, j=0;
        for (i=0; i < datums.length; i++) 
          for (j=i+1; j < datums.length; j++) 
            if (datums[i] !== datums[j] && this.intersects(datums[i], datums[j]))
              return false;

        for (i=0; i < this._layer.data.length; i++) 
          for (j=0; j < datums.length; j++) 
            if (this._layer.data[i] !== datums[j] && this.intersects(this._layer.data[i], datums[j]))
              return false;

        return true;
      default:
        return true;
    }
  }

}
