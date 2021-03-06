'use strict';
import BaseBehavior from './base-behavior';


export default class BreakpointBehavior extends BaseBehavior {
  constructor(snapFn) {
    super();
    this.snapFn = snapFn || function(datum, accessor, value) {
      return value;
    };
  }

  edit(renderingContext, shape, datum, dx, dy, target) {
    const data  = this._layer.data;
    const layerHeight = renderingContext.height;
    // current position
    const x = renderingContext.timeToPixel(shape.x(datum));
    const y = renderingContext.valueToPixel(shape.y(datum));
    // target position
    let targetX = x + dx;
    let targetY = y + dy;

    // if (data.length > 2) {
    //   // create a sorted map of all `x` positions
    //   const xMap = data.map((d) => renderingContext.timeToPixel(shape.x(d)));
    //   xMap.sort((a, b) => a < b ? -1 : 1);
    //   // find index of our shape x position
    //   const index = xMap.indexOf(x);
    //   // lock to next siblings
    //   if (targetX < xMap[index - 1] || targetX > xMap[index + 1]) {
    //     targetX = x;
    //   }
    // }

    // ASSUME THAT THE 'data' ARRAY IS ORDERED ACCORDING TO x.

    if (targetX < 0)
      targetX = 0;

    // lock in y axis
    if (targetY < 0) {
      targetY = 0;
    } else if (targetY > layerHeight) {
      targetY = layerHeight;
    }

    // update datum with new values
    shape.x(datum, this.snapFn(datum, 'x', renderingContext.timeToPixel.invert(targetX)));
    shape.y(datum, this.snapFn(datum, 'y', renderingContext.valueToPixel.invert(targetY)));
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
