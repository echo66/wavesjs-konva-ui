'use strict';
import BaseState from './base-state';

export default class BreakpointState extends BaseState {
  constructor(timeline, datumGenerator) {
    super(timeline);

    this.datumGenerator = datumGenerator;
    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  enter() {}
  exit() {}

  handleEvent(e, hitLayers) {
    switch (e.type) {
      case 'mousedown':
        this.onMouseDown(e, hitLayers);
        break;
      case 'mousemove':
        this.onMouseMove(e, hitLayers);
        break;
      case 'mouseup':
        this.onMouseUp(e, hitLayers);
        break;
    }
  }

  onMouseDown(e, hitLayers) {

    this.mouseDown = true;
    // keep target consistent with mouse down
    this.currentTarget = e.target;
    let updatedLayer = null;

    const layers = hitLayers;

    layers.forEach((layer) => {
      layer.unselect();
      const item = e.target;

      if (item === null || item === undefined || layer.getDatumFromShape(item.shape) === undefined) {
        // create an item
        const time = layer.timeToPixel.invert(e.x) - this.timeline.offset;
        const value = layer.valueToPixel.invert(e.y);
        const datum = this.datumGenerator(time, value);

        if (datum) {
          layer.add(datum);
          updatedLayer = layer;
        }
      } else {
        // if shift is pressed, remove the item
        if (e.originalEvent.shiftKey) {
          const datum = layer.getDatumFromShape(item.shape);
          layer.remove(datum);
          updatedLayer = layer;
        } else {
          this.currentEditedLayer = layer;
          const datum = layer.getDatumFromShape(item.shape);
          layer.select([datum]);
        }
      }

      layer.selectedDatums.forEach((datum) => {
        layer.getShapeFromDatum(datum).stopDrag();
      });

    });

    

    if (updatedLayer) {
      this.timeline.tracks.update(updatedLayer);
    }
  }

  onMouseMove(e, hitLayers) {
    if (!this.mouseDown || !this.currentEditedLayer) { return; }

    const layer = this.currentEditedLayer;
    const datums = layer.selectedDatums;
    // the loop should be in layer to match select / unselect API
    layer.edit(datums, e.dx, e.dy, this.currentTarget);

    layer.updateShapes(datums);
  }

  onMouseUp(e, hitLayers) {
    const that = this;
    hitLayers.forEach((layer) => {
      layer.selectedDatums.forEach((datum) => {
        layer.getShapeFromDatum(datum).stopDrag();
      });
    });
    this.currentEditedLayer = null;
    this.mouseDown = false;
  }
}
