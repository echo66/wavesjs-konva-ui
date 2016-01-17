import Konva from 'konva';
import BaseShape from './base-shape';


/**
 * A shape to display a cursor.
 */
export default class Cursor extends BaseShape {
  getClassName() { return 'cursor'; }

  _getAccessorList() {
    return { x: 0 };
  }

  _getDefaults() {
    return {
      color: '#000000',
      opacity: 1,
      width: 2
    };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }

    this.$el = new Konva.Rect({});

    return this.$el;
  }

  update(renderingContext, datum) {
    // const x = Math.round(renderingContext.timeToPixel(this.x(datum))) + 0.5;
    const x = renderingContext.timeToPixel(this.x(datum));

    this.$el.x(x)
            .y(0)
            .width(this.params.width)
            .height(renderingContext.height)
            .fill(this.params.color)
            .opacity(this.params.opacity);
  }

  /**
   * The cursor cannot be selected.
   * @return {Boolean} false
   */
  inArea() { return false; }
}
