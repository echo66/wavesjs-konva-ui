'use strict'

class Marker extends BaseShape {

  destroy() {
    this.$line.destroy();
    this.$line = null;
    this.$handler.destroy();
    this.$handler = null;
    super.destroy();
  }

  getClassName() { return 'marker'; }

  _getAccessorList() {
    return { x: 0, color: '#ff0000' };
  }

  _getDefaults() {
    return {
      handlerWidth: 7,
      handlerHeight: 10,
      displayHandlers: true,
      opacity: 1,
      strokeWidth: 2, 
      color: 'red',
      highlight: {
        opacity: 1,
        strokeWidth: 2,
        color: 'red'
      }
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

    this.$line.visible(this.visible);
    this.$handler.visible(this.visible && this.params.displayHandlers);

    if (!this.visible)  return;

    const x = renderingContext.timeToPixel(this.x(d)) - 0.5;
    const color = this.color(d);
    const height = renderingContext.height;

    this.$line.x(x).y(0).width(this.params.strokeWidth);
    this.$line.height(height);
    this.$line.fill(color);

    this.$handler.x(x).y(0).width(this.params.handlerWidth).height(this.params.handlerHeight).fill(color || this.params.color);
  }

  inArea(renderingContext, x1, y1, x2, y2, datum) {
    const d = datum || this.datum;

    // handlers only are selectable
    const x = renderingContext.timeToPixel(this.x(d));
    const shapeX1 = x - (this.params.handlerWidth - 1) / 2;
    const shapeX2 = shapeX1 + this.params.handlerWidth;
    const shapeY1 = renderingContext.height - this.params.handlerHeight;
    const shapeY2 = renderingContext.height;

    const xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
    const yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
    const area = xOverlap * yOverlap;

    return area > 0;
  }
}
