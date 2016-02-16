import Layer from '../core/layer';
import Waveform from '../shapes/waveform';


const defaults = {
  yDomain: [-1, 1],
  channel: 0,
  color: 'steelblue',
  renderingStrategy: 'svg'
};

export default class WaveformLayer extends Layer {
  constructor(data, options) {
    options = Object.assign({}, defaults, options);

    super('collection', data, options);

    this.sort_data = options.sort_data;
    this.visible_data = options.visible_data;

    this.configureShape(Waveform, {}, {
      sampleRate: buffer.sampleRate,
      color: options.color,
      renderingStrategy: options.renderingStrategy
    });
  }
}
