import Layer from '../core/layer';
import TracePath from '../shapes/trace-path';
import TraceDots from '../shapes/trace-dots';
import TraceBehavior from '../behaviors/trace-behavior';


export default class TraceLayer extends Layer {
  constructor(data, options = {}, accessors = {}) {
    options = Object.assign({ displayDots: true }, options);
    super(options.displayDots ? 'collection' : 'entity', data, options);

    this.sort_data = options.sort_data;
    this.visible_data = options.visible_data;

    const shapeOptions = {};
    if (options.meanColor !== undefined) { shapeOptions.meanColor = options.meanColor; }
    if (options.rangeColor !== undefined) { shapeOptions.rangeColor = options.rangeColor; }
    if (options.displayMean !== undefined) { shapeOptions.displayMean = options.displayMean; }

    if (options.displayDots) {
      this.configureCommonShape(TracePath, accessors, shapeOptions);
      this.configureShape(TraceDots, accessors, shapeOptions);
    } else {
      this.configureShape(TracePath, accessors, shapeOptions);
    }

    this.setBehavior(new TraceBehavior());
  }
}