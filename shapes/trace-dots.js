'use strict'


/**
 * A shape to display dots in a trace visualization (mean / range).
 *
 */
class TraceDots extends BaseShape {
  getClassName() { return 'trace-dots'; }

  _getAccessorList() {
    return { x: 0, mean: 0, range: 0 };
  }

  _getDefaults() {
    return {
      meanRadius: 3,
      rangeRadius: 3,
      meanColor: '#232323',
      rangeColor: 'steelblue'
    };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }
    // container
    this.$el = [];
    // draw mean dot
    this.$mean = new Konva.Circle({});

    // range dots (0 => top, 1 => bottom)
    this.$max = new Konva.Circle({});

    this.$min = new Konva.Circle({});

    this.$el.push(this.$mean);
    this.$el.push(this.$max);
    this.$el.push(this.$min);

    return this.$el;
  }

  // @TODO use accessors
  update(renderingContext, datum) {
    const mean = this.mean(datum);
    const range = this.range(datum);
    const x = this.x(datum);
    const meanPos = renderingContext.valueToPixel(mean);
    const halfRange = range / 2;
    const max = renderingContext.valueToPixel(mean + halfRange);
    const min = renderingContext.valueToPixel(mean - halfRange);
    const xPos = renderingContext.timeToPixel(x);
    

    this.$mean.x(xPos)
              .y(meanPos)
              .radius(this.params.meanRadius)
              .stroke(this.params.rangeColor)
              .fill('transparent')
              .addName('mean');

    this.$max.x(xPos)
              .y(max)
              .radius(this.params.meanRadius)
              .stroke(this.params.rangeColor)
              .fill('transparent')
              .addName('max');

    
    this.$min.x(xPos)
              .y(min)
              .radius(this.params.meanRadius)
              .stroke(this.params.rangeColor)
              .fill('transparent')
              .addName('min');
  }

  inArea(renderingContext, datum, x1, y1, x2, y2) {
    const x = renderingContext.timeToPixel(this.x(datum));
    const mean = renderingContext.valueToPixel(this.mean(datum));
    const range = renderingContext.valueToPixel(this.range(datum));
    const min = mean - (range / 2);
    const max = mean + (range / 2);

    if (x > x1 && x < x2 && (min > y1 || max < y2)) {
      return true;
    }

    return false;
  }
}
