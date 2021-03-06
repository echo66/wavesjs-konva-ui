'use strict';
import BaseBehavior from './base-behavior';

export default class SiblingLockedSegmentBehavior extends BaseBehavior {
  edit(renderingContext, shape, datum, dx, dy, target) {
    const data  = this._layer.data;
    const layerHeight = renderingContext.height;
    // current position
    const x = renderingContext.timeToPixel(shape.x(datum));
    const y = renderingContext.valueToPixel(shape.y(datum));
    // target position
    let targetX = x + dx;
    let targetY = y + dy;

    if (data.length > 2) {
      // create a sorted map of all `x` positions
      const xMap = data.map((d) => {
        let x = renderingContext.timeToPixel(shape.x(d)); 
        let width = renderingContext.timeToPixel(shape.x(d) + shape.width(d));
        return { start: x, end: x + width };
      });
      xMap.sort((a, b) => a.start < b.start ? -1 : 1);
      // find index of our shape x position
      const index = xMap.indexOf(x);
      // lock to next siblings
      if (targetX < xMap[index - 1].end || targetX + shape.width(datum) > xMap[index + 1].start) {
        targetX = x;
      }
    }

    if (targetX < 0)
      targetX = 0;

    // lock in y axis
    if (targetY < 0) {
      targetY = 0;
    } else if (targetY > layerHeight) {
      targetY = layerHeight;
    }

    // update datum with new values
    shape.x(datum, renderingContext.timeToPixel.invert(targetX));
    shape.y(datum, renderingContext.valueToPixel.invert(targetY));
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
        shape.params.color = 'black';
      }
    } else {
      throw new Error('No shape for this datum in this layer', { datum: datum, layer: this._layer });
    }
  }
}
