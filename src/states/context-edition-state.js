'use strict';
import BaseState from './base-state';

export default class ContextEditionState extends BaseState {
  constructor(timeline) {
    super(timeline);
  }

  handleEvent(e) {
    switch(e.type) {
      case 'mousedown':
        this.onMouseDown(e);
        break;
      case 'mousemove':
        this.onMouseMove(e);
        break;
      case 'mouseup':
        this.onMouseUp(e);
        break;
    }
  }

  onMouseDown(e) {
    this.mouseDown = true;
    this.currentTarget = e.target;
    this.currentLayer = (this.currentTarget.shape)? this.currentTarget.shape.layer : undefined;
  }

  onMouseMove(e) {
    if (!this.mouseDown || !this.currentLayer) { return; }

    const layer = this.currentLayer;
    const target = this.currentTarget;

    // in this example the context is stretched when shift is pressed
    if (!e.originalEvent.shiftKey) {
      layer.editContext(e.dx, e.dy, target);
    } else {
      layer.stretchContext(e.dx, e.dy, target);
    }

    layer.update();
  }

  onMouseUp(e) {
    this.mouseDown = false;
    this.currentTarget = null;
    this.currentLayer = null;
  }
}
