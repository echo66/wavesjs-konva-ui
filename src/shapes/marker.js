'use strict';
import BaseShape from './base-shape';
import Konva from 'konva';

export default class Marker extends BaseShape {

  destroy() {
    this.$line.destroy();
    this.$line = null;
    this.$handler.destroy();
    this.$handler = null;
    super.destroy();
  }

  getClassName() { return 'marker'; }

  _getAccessorList() {
    return { 
      x: 0, 
      handlerWidth: 7,
      handlerHeight: 10,
      displayHandler: true,
      opacity: 1,
      strokeWidth: 2, 
      color: 'black',
      handlerColor: 'black'
    };
  }

  _getDefaults() {
    return {
      x: undefined, 
      handlerWidth: undefined,
      handlerHeight: undefined,
      displayHandler: undefined,
      opacity: undefined,
      strokeWidth: undefined, 
      color: undefined,
      handlerColor: undefined
    };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }

    this.$el = [];

    this.$line = new Konva.Rect({});
    this.$line.addName('marker');
    this.$line.shape = this;

    this.$handler = new Konva.Rect({});
    this.$handler.addName('handler');
    this.$handler.shape = this;

    this.$el.push(this.$line);
    this.$el.push(this.$handler);

    return this.$el;
  }

  update(renderingContext, datum) {
    const d = datum || this.datum;

    const displayHandler = this.params.displayHandler || this.displayHandler(d);

    this.$line.visible(this.visible);
    this.$handler.visible(this.visible && displayHandler);

    if (!this.visible)  return;

    const x = this.params.x || renderingContext.timeToPixel(this.x(d)) - 0.5; //TODO: for 0 and undefined, the boolean condition will return the same.
    const height = renderingContext.height;
    const handlerWidth = this.params.handlerWidth || this.handlerWidth(d);
    const handlerHeight = this.params.handlerHeight || this.handlerHeight(d);
    const opacity = this.params.opacity || this.opacity(d);
    const strokeWidth = this.params.strokeWidth || this.strokeWidth(d);
    const color = this.params.color || this.color(d);
    const handlerColor = this.params.handlerColor || this.handlerColor(d);

    this.$line
            .x(x)
            .y(0)
            .width(strokeWidth)
            .height(height)
            .fill(color)
            .opacity(opacity);

    this.$handler
            .x(x)
            .y(0)
            .width(handlerWidth)
            .height(handlerHeight)
            .fill(handlerColor)
            .opacity(opacity);
  }

  inArea(renderingContext, datum, x1, y1, x2, y2) {
    const d = datum || this.datum;

    // handlers only are selectable
    const x = renderingContext.timeToPixel(this.x(d));
    const handlerWidth = this.params.handlerWidth || this.handlerWidth(d);
    const handlerHeight = this.params.handlerHeight || this.handlerHeight(d);
    const shapeX1 = x - (handlerWidth - 1) / 2;
    const shapeX2 = shapeX1 + handlerWidth;
    const shapeY1 = renderingContext.height - handlerHeight;
    const shapeY2 = renderingContext.height;

    const xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
    const yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
    const area = xOverlap * yOverlap;

    return area > 0;
  }
}
