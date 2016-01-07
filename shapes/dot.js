'use strict'

class Dot extends BaseShape {

  destroy() {
    this.$el.destroy();
    super.destroy();
  }

  getClassName() { return 'dot'; }

  // @TODO rename : confusion between accessors and meta-accessors
  _getAccessorList() {
    return { cx: 0, cy: 0, r: 3, color: '#000000'};
  }

  render() {
    if (this.$el) { return this.$el; }

    this.$el = new Konva.Circle({});
    this.$el.shape = this;

    return this.$el;
  }

  update(renderingContext, datum) {
    const d = datum || this.datum;

    const cx = renderingContext.timeToPixel(this.cx(d));
    const cy = renderingContext.valueToPixel(this.cy(d));
    const r  = this.r(d);
    const color = this.color(d);
    
    this.$el.x(cx);
    this.$el.y(cy);
    this.$el.radius(r);
    this.$el.fill(color);
  }

  // x1, x2, y1, y2 => in pixel domain
  inArea(renderingContext, datum, x1, y1, x2, y2) {
    const d = datum || this.datum;
    const cx = renderingContext.timeToPixel(this.cx(d));
    const cy = renderingContext.valueToPixel(this.cy(d));

    if ((cx > x1 && cx < x2) && (cy > y1 && cy < y2)) {
      return true;
    }

    return false;
  }
}
