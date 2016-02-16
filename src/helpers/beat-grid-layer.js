import Layer from '../core/layer';
import Marker from '../shapes/marker';
import BreakpointBehavior from '../behaviors/marker-behavior';


export default class BeatGridLayer extends Layer {
  constructor(data, options = {}, accessors = {}) {
    super('collection', data, options);

    this.sort_data = options.sort_data;
    this.visible_data = options.visible_data;

    options = Object.assign({ displayHandlers: true }, options);
    const color = options.color;
    if (color) {
      accessors.color = function() { return color; };
    }

    this.configureShape(Marker, accessors, {
      displayHandlers: options.displayHandlers
    });

    this.setBehavior(new BreakpointBehavior());
  }
}
