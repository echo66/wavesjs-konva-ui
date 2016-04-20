'use strict';
import Dot from './dot';
import Konva from 'konva';

export default class AnnotatedDot extends Dot {

	destroy() {
		this.$label.destroy();
		this.$label = null;
		super.destroy();
	}

	getClassName() { return 'annotated-dot'; }

	_getAccessorList() {
		let list = super._getAccessorList();
		list.text = 'default';
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
		const y = renderingContext.valueToPixel(this.y(d));
		const text = this.text(d);

		this.$label.x(x + 3).y(y + 11);
		this.$label.height(y);
		this.$label.fill('#242424');
		this.$label.fontSize(10);
		this.$label.fontFamily('monospace');
		this.$label.text(text);
	}

}