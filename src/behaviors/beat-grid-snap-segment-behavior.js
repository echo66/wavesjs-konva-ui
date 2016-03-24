'use strict';
import BaseBehavior from './base-behavior';


export default class BeatGridSnapSegmentBehavior extends BaseBehavior {

  constructor(beatGrid) {
    super();
    this._beatGrid = beatGrid;
    this._snapToGrid = true;
  }

  set beatGrid(value) {
    this._beatGrid = value;
  }

  get beatGrid() {
    return this._beatGrid;
  }

  set snapToGrid(value) {
    this._snapToGrid = value;
  }

  get snapToGrid() {
    return this._snapToGrid;
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
    const timeToPixel = renderingContext.timeToPixel;
    const layerHeight = renderingContext.height;
    // current values
    const x = renderingContext.timeToPixel(Math.max(0, shape.x(datum)));
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

    if (this.snapToGrid) {
      const beat0 = this._beatGrid.beats(timeToPixel.invert(targetX));
      const snapped0 = this._beatGrid.seconds((dx > 0)? Math.ceil(beat0): Math.floor(beat0));
      const beat1 = this._beatGrid.beats(timeToPixel.invert(targetX) + shape.width(datum));
      const snapped1 = this._beatGrid.seconds((dx > 0)? Math.ceil(beat1): Math.floor(beat1));

      if (snapped0 !== snapped1) {
        shape.x(datum, snapped0);
        shape.width(datum, snapped1 - snapped0);
        // shape.y(datum, renderingContext.valueToPixel.invert(targetY));
      }
    } else {
      shape.x(datum, timeToPixel.invert(targetX));
    }
    
  }

  _resizeLeft(renderingContext, shape, datum, dx, dy, target) {
    const timeToPixel = renderingContext.timeToPixel;
    // current values
    const x     = timeToPixel(Math.max(0, shape.x(datum)));
    const width = timeToPixel(shape.width(datum));
    // target values
    let maxTargetX  = x + width;
    let targetX     = x + dx < maxTargetX ? Math.max(x + dx, 0) : x;
    let targetWidth = targetX !== 0 ? Math.max(width - dx, 1) : width;

    if (this.snapToGrid) {
      const beat0 = this._beatGrid.beats(timeToPixel.invert(targetX));
      const snapped0 = this._beatGrid.seconds((dx > 0)? Math.ceil(beat0): Math.floor(beat0));
      const beat1 = this._beatGrid.beats(timeToPixel.invert(targetX) + timeToPixel.invert(targetWidth));
      const snapped1 = this._beatGrid.seconds((dx > 0)? Math.ceil(beat1): Math.floor(beat1));


      if (snapped0 !== snapped1) {
        shape.x(datum, snapped0);
        shape.width(datum, snapped1 - snapped0);
      }
    } else {
      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
    }

      
    
  }

  _resizeRight(renderingContext, shape, datum, dx, dy, target) {
    // current values
    const width = renderingContext.timeToPixel(shape.width(datum));
    // target values
    let targetWidth = Math.max(width + dx, 1);

    if (this.snapToGrid) {
      const beat1 = this._beatGrid.beats(shape.x(datum) + renderingContext.timeToPixel.invert(targetWidth));
      const snapped1 = this._beatGrid.seconds((dx > 0)? Math.ceil(beat1): Math.floor(beat1));

      if (snapped1 - shape.x(datum)) {
        shape.width(datum, snapped1 - shape.x(datum));
      }
    } else {
      shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
    }
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
