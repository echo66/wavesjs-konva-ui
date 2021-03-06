'use strict';
import BaseState from './base-state';


/**
 * A state to select and edit shapes in a simple way. (kind of plug n play state)
 */
export default class SimpleEditionState extends BaseState {
  constructor(timeline, autoUpdateShapes) {
    super(timeline);

    this.autoUpdateShapes = (autoUpdateShapes === undefined)? true : autoUpdateShapes;
    this.currentEditedLayer = null;
    this.currentTarget = null;
    this.lastEventType = null;
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
    this.lastEventType = e.type;
  }

  onMouseDown(e) {
    // TODO: allow shapes from multiple layers to be edited at the same time.
    // TODO: move target shapes to the drag konva layer of each layer.

    // keep target consistent with mouse down
    this.currentTarget = e.target;
    const that = this;

    if (this.currentTarget.shape && this.currentTarget.shape.isContextShape) {
      if (!e.originalEvent.shiftKey) 
        this.timeline.getTrackFromDOMElement(e.currentTarget).layers.forEach((layer) => {
          const aux = new Set(layer.selectedDatums);
          layer.unselect(layer.selectedDatums);
          if (that.autoUpdateShapes) 
            layer.updateShapes(aux);
        });
      return;
    } else if (!this.currentTarget.shape) {
      if (!e.originalEvent.shiftKey) 
        this.timeline.getTrackFromDOMElement(e.currentTarget).layers.forEach((layer) => {
          const aux = new Set(layer.selectedDatums);
          layer.unselect(layer.selectedDatums);
          if (that.autoUpdateShapes)
            layer.updateShapes(aux);
        });
      return;
    }

    const layer = this.currentTarget.shape.layer;

    const a = new Set(layer.selectedDatums);

    if (this.currentTarget.shape.layer) {
      if (!e.originalEvent.shiftKey) {
        this.timeline.getTrackFromDOMElement(e.currentTarget).layers.forEach((layer) => layer.unselect(layer.selectedDatums));
      }
      this.currentEditedLayer = layer;
      const datum = layer.getDatumFromShape(this.currentTarget.shape);
      if (datum !== undefined) {
        layer.select([datum]);
        a.add(datum);
      }
      if (that.autoUpdateShapes)
        layer.updateShapes(a);
      this.currentEditedLayer.selectedDatums.forEach((datum) => {
        that.currentEditedLayer.getShapeFromDatum(datum).startDrag();
      });
    } else if (!e.originalEvent.shiftKey) {
      layer.unselect(layer.selectedDatums);
      if (that.autoUpdateShapes)
        layer.updateShapes(a);
      this.currentEditedLayer.selectedDatums.forEach((datum) => {
        that.currentEditedLayer.getShapeFromDatum(datum).startDrag();
      });
    }
  }

  onMouseMove(e) {
    // TODO: allow shapes from multiple layers to be edited at the same time.
    // TODO: move target shapes to the drag konva layer of each layer.

    if (!this.currentEditedLayer) { return; }

    const layer = this.currentEditedLayer;
    const datums = layer.selectedDatums;
    const that = this;

    if (this.lastEventType === 'mousedown') 
      layer.emit('start-edit', datums);

    layer.edit(datums, e.dx, e.dy, this.currentTarget);
    if (that.autoUpdateShapes)
      layer.updateShapes(datums);
  }

  onMouseUp(e) {
    // TODO: allow shapes from multiple layers to be edited at the same time.
    // TODO: use Layer.allocateShapesToContentLayers to move the target shapes from the drag konva layers to a content konva layer.

    const that = this;
    const layer = this.currentEditedLayer;

    if (!layer) return;

    if (that.autoUpdateShapes)
      layer.updateShapes(layer.selectedDatums);
    layer.selectedDatums.forEach((datum) => {
      layer.getShapeFromDatum(datum).stopDrag();
    });
    if (this.lastEventType === 'mousemove') {
      layer.emit('end-edit', layer.selectedDatums);
    }
    this.currentEditedLayer = null;
  }
}
