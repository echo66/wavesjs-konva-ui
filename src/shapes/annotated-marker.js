'use strict';
import Marker from './marker';
import Konva from 'konva';

export default class AnnotatedMarker extends Marker {

  destroy() {
    this.$label.destroy();
    this.$label = null;
    super.destroy();
  }

  getClassName() { return 'annotated-segment'; }

  _getAccessorList() {
    let list = super._getAccessorList();
    list.text = 'default';
    list.fontFill = '#242424';
    list.fontSize = 10;
    list.fontFamily = 'monospace';
    return list;
  }

  _getDefaults() {
    let list = super._getDefaults();
    list.text = undefined;
    list.fontFill = undefined;
    list.fontSize = undefined;
    list.fontFamily = undefined;
    return list;
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }
    
    this.$el = super.render(renderingContext);

    this.$label = new Konva.Text({ listening: false });
    this.$label.addName('text');

    this.$el.push(this.$label);

    return this.$el;
  }

  update(renderingContext, datum) {
    var d = datum || this.datum;

    super.update(renderingContext, d);

    const x = renderingContext.timeToPixel(this.x(d));
    const y = 0;
    const text = this.params.text || this.text(d);
    const fontFill = this.params.fontFill || this.fontFill(d);
    const fontSize = this.params.fontSize || this.fontSize(d);
    const fontFamily = this.params.fontFamily || this.fontFamily(d);

    this.$label.x(x + 3).y(y + 11);
    this.$label.fill(fontFill);
    this.$label.fontSize(fontSize);
    this.$label.fontFamily(fontFamily);
    this.$label.text(text);
  }
}
