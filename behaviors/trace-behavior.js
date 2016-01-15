'use strict'

class TraceBehavior extends BaseBehavior {
  edit(renderingContext, shape, datum, dx, dy, target) {
    if (target.hasName('min')) {
      this._editRange(renderingContext, shape, datum, dx, -dy, 'min');
    } else if (target.hasName('max')) {
      this._editRange(renderingContext, shape, datum, dx, -dy, 'max');
    } else if (target.hasName('mean')) {
      this._editMean(renderingContext, shape, datum, dx, -dy);
    } else 
      throw new Error('Unexpected konva shape name');
  }

  _editMean(renderingContext, shape, datum, dx, dy) {
    // work in pixel domain
    const x = renderingContext.timeToPixel(shape.x(datum));
    const y = renderingContext.valueToPixel(shape.mean(datum));

    let targetX = x + dx;
    let targetY = y - dy;

    shape.x(datum, renderingContext.timeToPixel.invert(targetX));
    shape.mean(datum, renderingContext.valueToPixel.invert(targetY));
  }

  _editRange(renderingContext, shape, datum, dx, dy, rangeSide) {
    const range = renderingContext.valueToPixel(shape.range(datum));

    let targetRange = rangeSide === 'min' ? range + 2 * dy : range - 2 * dy;
    targetRange = Math.max(targetRange, 0);

    shape.range(datum, Math.max(0, renderingContext.valueToPixel.invert(targetRange)));
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
    console.log(shape)
    if (shape) {
      if (isHighlighted) {
        shape.params.meanColor = 'red';
        shape.params.rangeColor = 'red';
      } else {
        const defaults = shape._getDefaults();
        shape.params.meanColor = defaults.meanColor;
        shape.params.rangeColor = defaults.rangeColor;
      }
    } else {
      throw new Error('No shape for this datum in this layer', { datum: datum, layer: this._layer });
    }
  }
}
