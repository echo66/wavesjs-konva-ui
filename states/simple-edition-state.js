'use strict'


/**
 * A state to select and edit shapes in a simple way. (kind of plug n play state)
 */
class SimpleEditionState extends BaseState {
  constructor(timeline) {
    super(timeline);

    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  enter() {}
  exit() {
    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  handleEvent(e) {
    switch (e.type) {
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
    // keep target consistent with mouse down
    this.currentTarget = e.target;

    const a = new Set(layer.selectedDatums);
    if (this.currentTarget.shape.layer) {
      if (!e.originalEvent.shiftKey) {
        layer.unselect(layer.selectedDatums);
      }
      this.currentEditedLayer = layer;
      const datum = layer.getDatumFromShape(this.currentTarget.shape);
      if (datum != undefined) {
        layer.select([datum]);
        a.add(datum);
      }
      layer.updateShapes(a);
      const that = this;
      this.currentEditedLayer.selectedDatums.forEach((datum) => {
        that.currentEditedLayer.getShapeFromDatum(datum).startDrag();
      });
    } else if (!e.originalEvent.shiftKey) {
      layer.unselect(layer.selectedDatums);
      layer.updateShapes(a);
      this.currentEditedLayer.selectedDatums.forEach((datum) => {
        that.currentEditedLayer.getShapeFromDatum(datum).startDrag();
      });
    }
  }

  onMouseMove(e) {
    if (!this.currentEditedLayer) { return; }

    const layer = this.currentEditedLayer;
    const datums = layer.selectedDatums;

    layer.edit(datums, e.dx, e.dy, this.currentTarget);
    layer.updateShapes(datums);
  }

  onMouseUp(e) {
    const that = this;
    this.currentEditedLayer.updateShapes(layer.selectedDatums);
    this.currentEditedLayer.selectedDatums.forEach((datum) => {
      that.currentEditedLayer.getShapeFromDatum(datum).stopDrag();
    });
    this.currentEditedLayer = null;
  }
}
