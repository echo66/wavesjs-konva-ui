import Konva from 'konva';
import BaseShape from './base-shape';

/**
 * A shape to display paths in a trace visualization (mean / range). (entity shape)
 *
 */
export default class TracePath extends BaseShape {
  getClassName() { return 'trace-common'; }

  _getAccessorList() {
    return { x: 0, mean: 0, range: 0 };
  }

  _getDefaults() {
    return {
      rangeColor: 'steelblue',
      meanColor: '#232323',
      displayMean: true
    };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }

    this.$el = [];

    this.$range = new Konva.Path({});
    this.$range.shape = this;

    this.$mean = new Konva.Path({});
    this.$mean.shape = this;

    this.$el.push(this.$range);
    this.$el.push(this.$mean);

    return this.$el;
  }

  update(renderingContext, data) {
    // order data by x position
    data = data.slice(0);
    data.sort((a, b) => this.x(a) < this.x(b) ? -1 : 1);

    if (this.params.displayMean) {
      this.$mean.visible(true)
                .data(this._buildMeanLine(renderingContext, data))
                .stroke(this.params.meanColor)
                .fill('none');
    } else {
      this.$mean.visible(false);
    }

    this.$range.visible(true)
              .data(this._buildRangeZone(renderingContext, data))
              .stroke('none')
              .fill(this.params.rangeColor)
              .opacity(0.4);

    data = null;
  }

  _buildMeanLine(renderingContext, data) {
    let instructions = data.map((datum, index) => {
      const x = renderingContext.timeToPixel(this.x(datum));
      const y = renderingContext.valueToPixel(this.mean(datum));
      return `${x},${y}`;
    });

    return 'M' + instructions.join('L');
  }

  _buildRangeZone(renderingContext, data) {
    const length = data.length;
    // const lastIndex = data
    let instructionsStart = '';
    let instructionsEnd = '';

    for (let i = 0; i < length; i++) {
      const datum = data[i];
      const mean = this.mean(datum);
      const halfRange = this.range(datum) / 2;

      const x  = renderingContext.timeToPixel(this.x(datum));
      const y0 = renderingContext.valueToPixel(mean + halfRange);
      const y1 = renderingContext.valueToPixel(mean - halfRange);

      const start = `${x},${y0}`;
      const end   = `${x},${y1}`;

      instructionsStart = instructionsStart === '' ?
        start : `${instructionsStart}L${start}`;

      instructionsEnd = instructionsEnd === '' ?
        end : `${end}L${instructionsEnd}`;
    }

    let instructions = `M${instructionsStart}L${instructionsEnd}Z`;
    return instructions;
  }
}
