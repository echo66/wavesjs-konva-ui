import Konva from 'konva';
import BaseShape from './base-shape';

/**
 * Kind of Marker for entity oriented data. Useful to display a grid.
 */
export default class Ticks extends BaseShape {
  _getClassName() {
    return 'tick';
  }

  _getAccessorList() {
    return { time: 0, label: '' };
  }

  _getDefaults() {
    return {
      default: {
        color: 'steelblue',
        opacity: 0.3,
        width: 1,
      },
      focused: {
        color: 'black',
        opacity: 0.8,
        width: 2,
      }
    };
  }

  render(renderingContext) {
    this.$el = new Set();

    this.$currentTicks  = new Set();
    this.$currentLabels = new Set();
    
    return this.$el;
  }

  update(renderingContext, data) {

    /*
     * Maintain the same number of ticks and labels in the Shape memory as the number of datums.
     * Destroy the remaining konva nodes.
     */

    if (this.$el.size < data.length * 2) {
      while (this.$el.size < data.length * 2) {
        const r = new Konva.Rect({ listening: false });
        r.addName('tick');
        const t = new Konva.Text({ listening: false });
        t.addName('label');
        this.$currentTicks.add(r);
        this.$currentLabels.add(t);
        this.$el.add(r);
        this.$el.add(t);
      }
    } else if (this.$el.size > data.length * 2) {
      const ti1 = this.$currentTicks.values();
      const li2 = this.$currentLabels.values();
      while (this.$el.size > data.length * 2) {
        const tick = ti1.next().value;
        const label = li2.next().value;
        this.$currentTicks.delete(tick);
        this.$currentLabels.delete(label);
        this.$el.delete(tick);
        this.$el.delete(label);
        tick.destroy();
        label.destroy();
      }
    }

    const that = this;
    const layerHeight = renderingContext.height; 
    const ticksIterator = this.$currentTicks.values();
    const labelsIterator = this.$currentLabels.values();

    data.forEach((datum) => {
      const label = labelsIterator.next().value;
      const tick = ticksIterator.next().value;

      const x = renderingContext.timeToPixel(this.time(datum));
      const height = layerHeight;
      const isFocused = that.focused(datum);
      const hasLabel = that.label(datum);

      tick.x(x).height(height);

      if (isFocused) {
        tick.width(that.params.focused.width)
            .fill(that.params.focused.color)
            .opacity(that.params.focused.opacity);
      } else {
        tick.width(that.params.default.width)
            .fill(that.params.default.color)
            .opacity(that.params.default.opacity);
      }

      label.x(x+5)
            .y(5)
            .text(that.label(datum))
            // .height(height)
            .fontFamily('monospace')
            .lineHeight('10px')
            .fontSize('10px')
            .fill('#676767')
            .opacity(0.9);

      if (hasLabel) {
        label.visible(true);
      } else {
        label.visible(false);
      }

      
    });

  }
}