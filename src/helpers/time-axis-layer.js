import AxisLayer from '../axis/axis-layer';
import Ticks from '../shapes/ticks';
import timeAxisGenerator from '../axis/time-axis-generator';


export default class TimeAxisLayer extends AxisLayer {
  constructor(options) {
    options = Object.assign({ color: 'steelblue' }, options);
    super(timeAxisGenerator(), options);

    this.sort_data = options.sort_data;
    this.visible_data = options.visible_data;

    this.configureShape(Ticks, {}, {
      color: options.color
    });
  }
}