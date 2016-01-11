'use strict'

class Dot extends BaseShape {

  destroy() {
    this.$el.destroy();
    super.destroy();
  }

  getClassName() { return 'dot'; }

  // @TODO rename : confusion between accessors and meta-accessors
  _getAccessorList() {
    return { x: 0, y: 0, r: 3, color: '#000000'};
  }

  render() {
    if (this.$el) { return this.$el; }

    this.$el = new Konva.Circle({});
    this.$el.shape = this;
    this.$el.perfectDrawEnabled(false);

    return this.$el;
  }

  update(renderingContext, datum) {
    const d = datum || this.datum;

    const x = renderingContext.timeToPixel(this.x(d));
    const y = renderingContext.valueToPixel(this.y(d));
    const r  = this.r(d);
    const color = this.color(d);
    
    this.$el.x(x);
    this.$el.y(y);
    this.$el.radius(r);
    this.$el.fill(color);
  }

  // x1, x2, y1, y2 => in pixel domain
  inArea(renderingContext, datum, x1, y1, x2, y2) {
    const x = this.$el.getAbsolutePosition().x;
    const y = this.$el.getAbsolutePosition().y;

    if ((x >= x1 && x <= x2) && (y >= y1 && y <= y2)) {
      return true;
    }

    return false;
  }
}
