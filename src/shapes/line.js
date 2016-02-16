'use strict';
import BaseShape from './base-shape';
import Konva from 'konva';


export default class Line extends BaseShape {

  destroy() {
    this.$el.destroy();
    super.destroy();
  }

  getClassName() { return 'line'; }

  _getAccessorList() {
    return { x: 0, y: 0 };
  }

  _getDefaults() {
    return { color: '#000000', strokeWidth: 1 };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }

    this.$el = new Konva.Path({});
    this.$el.perfectDrawEnabled(false);

    return this.$el;
  }

  update(renderingContext, data) {

    data = data.slice(0);
    data.sort((a, b) => this.x(a) < this.x(b) ? -1 : 1);

    this.$el.data(this._buildLine(renderingContext, data));
    this.$el.stroke(this.params.color);
    this.$el.strokeWidth(this.params.strokeWidth);

    data = null;
  }

  // builds the `path.d` attribute
  // @TODO create some ShapeHelper ?
  _buildLine(renderingContext, data) {
    if (!data.length) { return ''; }
    // sort data
    let instructions = data.map((datum, index) => {
      const x = renderingContext.timeToPixel(this.x(datum));
      const y = renderingContext.valueToPixel(this.y(datum)) - 0.5;
      return `${x},${y}`;
    });

    return 'M' + instructions.join('L');
  }
}
