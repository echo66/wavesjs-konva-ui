import AxisLayer from '../axis/axis-layer';
import Ticks from '../shapes/ticks';
import beatGridAxisGenerator from '../axis/beat-grid-axis-generator';


export default class BeatGridAxisLayer extends AxisLayer {
  constructor(options) {
    options = Object.assign({
      color: 'steelblue',
      signature: '4/4'
    }, options);

    super(beatGridAxisGenerator(options.beatGrid, options.signature), options);

    this.configureShape(Ticks, {}, {
      color: options.color
    });
  }
}