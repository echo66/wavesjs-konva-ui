'use strict';
import BaseBehavior from './base-behavior';

export default class ScrollSegmentBehavior extends BaseBehavior {
  constructor(targetTimeline) {
    super();
    this.targetTimeline = targetTimeline;
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
    const x = renderingContext.timeToPixel(shape.x(datum));
    const y = renderingContext.valueToPixel(shape.y(datum));
    const width = renderingContext.timeToPixel(shape.width(datum));
    const height = renderingContext.valueToPixel(shape.height(datum));
    // target values
    let targetX = Math.max(x + dx, 0);
    let targetY = y + dy;

    // lock in layer's y axis
    if (targetY > layerHeight) {
      targetY = layerHeight;
    } else if (targetY - (layerHeight - height) < 0) {
      targetY = (layerHeight - height);
    }

    shape.x(datum, renderingContext.timeToPixel.invert(targetX));
    shape.y(datum, renderingContext.valueToPixel.invert(targetY));

    this.targetTimeline.visibleInterval = {start: shape.x(datum), duration: shape.width(datum)};
    this.targetTimeline.tracks.update();
  }

  _resizeLeft(renderingContext, shape, datum, dx, dy, target) {
    // current values
    const x     = renderingContext.timeToPixel(shape.x(datum));
    const width = renderingContext.timeToPixel(shape.width(datum));
    // target values
    let maxTargetX  = x + width;
    let targetX     = x + dx < maxTargetX ? Math.max(x + dx, 0) : x;
    let targetWidth = targetX !== 0 ? Math.max(width - dx, 1) : width;

    shape.x(datum, renderingContext.timeToPixel.invert(targetX));
    shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));

    this.targetTimeline.visibleInterval = {start: shape.x(datum), duration: shape.width(datum)};
    this.targetTimeline.tracks.update();
  }

  _resizeRight(renderingContext, shape, datum, dx, dy, target) {
    // current values
    const width = renderingContext.timeToPixel(shape.width(datum));
    // target values
    let targetWidth = Math.max(width + dx, 1);

    shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));

    this.targetTimeline.visibleInterval = {start: shape.x(datum), duration: shape.width(datum)};
    this.targetTimeline.tracks.update();
  }
}
