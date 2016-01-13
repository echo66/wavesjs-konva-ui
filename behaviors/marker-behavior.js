'use strict'


class MarkerBehavior extends BaseBehavior {
  edit(renderingContext, shape, datum, dx, dy, target) {
    const x = renderingContext.timeToPixel(shape.x(datum));
    let targetX = (x + dx) > 0 ? x + dx : 0;

    shape.x(datum, renderingContext.timeToPixel.invert(targetX));
  }
}
