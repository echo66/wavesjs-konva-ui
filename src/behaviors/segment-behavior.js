'use strict';
import BaseBehavior from './base-behavior';

export default class SegmentBehavior extends BaseBehavior {
  constructor(snapFn) {
    super();
    this.snapFn = snapFn || function(datum, accessor, value) {
      return value;
    };
  }

  edit(renderingContext, shape, datum, dx, dy, target) {
    let action = 'move';

    if (target.hasName('handler')) {
      if (target.hasName('left')) 
        action = 'resizeLeft';
      else if (target.hasName('right')) 
        action = 'resizeRight';
      else if (target.hasName('top'))
      	action = 'resizeTop';
      else if (target.hasName('bottom'))
      	action = 'resizeBottom';
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
    const x = renderingContext.timeToPixel(shape.x(datum));
    const y = renderingContext.valueToPixel(shape.y(datum));
    const width = renderingContext.timeToPixel(shape.width(datum));
    // const height = renderingContext.valueToPixel(shape.height(datum));
    const height = Math.abs(renderingContext.valueToPixel(shape.y(datum) + shape.height(datum)) - renderingContext.valueToPixel(shape.y(datum)));
    
    // target values
    let targetX = Math.max(x + dx, 0);
    let targetY = Math.min(Math.max(0, y + dy), layerHeight);

    // console.log([targetY, y, height, layerHeight]);

    // lock in layer's y axis
    if (targetY > layerHeight) {
      targetY = layerHeight;
    } else if (targetY - height < 0) {
      targetY = height;
    }

    shape.x(datum, this.snapFn(datum, 'x', renderingContext.timeToPixel.invert(targetX)));
    shape.y(datum, this.snapFn(datum, 'y', renderingContext.valueToPixel.invert(targetY)));
  }

  _resizeLeft(renderingContext, shape, datum, dx, dy, target) {
    // current values
    const x     = renderingContext.timeToPixel(shape.x(datum));
    const width = renderingContext.timeToPixel(shape.width(datum));
    // target values
    let maxTargetX  = x + width;
    let targetX     = x + dx < maxTargetX ? Math.max(x + dx, 0) : x;
    let targetWidth = targetX !== 0 ? Math.max(width - dx, 1) : width;

    shape.x(datum, this.snapFn(datum, 'x', renderingContext.timeToPixel.invert(targetX)));
    shape.width(datum, this.snapFn(datum, 'width', renderingContext.timeToPixel.invert(targetWidth)));
  }

  _resizeRight(renderingContext, shape, datum, dx, dy, target) {
    // current values
    const width = renderingContext.timeToPixel(shape.width(datum));
    // target values
    let targetWidth = Math.max(width + dx, 1);

    shape.width(datum, this.snapFn(datum, 'width', renderingContext.timeToPixel.invert(targetWidth)));
  }

  _resizeTop(renderingContext, shape, datum, dx, dy, target) {
  	// console.log('top ' + dy);

	const height = renderingContext.valueToPixel(shape.height(datum));

  	let targetHeight = height + dy;

  	shape.height(datum, this.snapFn(datum, 'height', renderingContext.valueToPixel.invert(targetHeight)));

  }

  _resizeBottom(renderingContext, shape, datum, dx, dy, target) {
  	// console.log('bottom ' + dy);

    const layerHeight = renderingContext.height;
    const y = renderingContext.valueToPixel(shape.y(datum));
    const height = renderingContext.valueToPixel(shape.height(datum));

  	let targetY = Math.min(Math.max(0, y + dy), layerHeight);
  	let targetHeight = height - dy;

  	shape.y(datum, this.snapFn(datum, 'y', renderingContext.valueToPixel.invert(targetY)));
  	shape.height(datum, this.snapFn(datum, 'height', renderingContext.valueToPixel.invert(targetHeight)));

  }

  select(datum) {
    super.select(datum);
    this.highlight(datum, true);
  }

  unselect(datum) {
    super.unselect(datum);
    this.highlight(datum, false);
  }

  highlight(datum, isHighlighted) {
    const shape = this._layer.getShapeFromDatum(datum);
    if (shape) {
      if (isHighlighted) {
        shape.params.color = 'red';
      } else {
        shape.params.color = undefined;
      }
    } else {
      throw new Error('No shape for this datum in this layer', { datum: datum, layer: this._layer });
    }
  }
}
