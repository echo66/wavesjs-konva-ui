import Layer from '../core/layer';
import Ticks from '../shapes/ticks';


export default class TickLayer extends Layer {
  constructor(data, options, accessors) {
    options = Object.assign({

    }, options);

    super('entity', data, options);

    this.sort_data = options.sort_data;
    this.visible_data = options.visible_data;

    const config = options.color ? { color: options.color } : undefined;
    this.configureShape(Ticks, accessors, config);
  }
}