'use strict'

class SelectionState extends BaseState {

  constructor(timeline /*, options = {} */) {
    super(timeline /*, options */);

    this.currentLayer = undefined;
    // need a cached
    this.selectedDatums = undefined;
    this.mouseDown = false;
    this.shiftKey = false;

    this._layerSelectedItemsMap = new Map();
  }

  enter() {

  }

  exit() {
    const containers = this.timeline.containers;

    for (let id in containers) {
      this._removeBrush(containers[id]);
    }
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
      case 'click':
        this.onClick(e);
        break;
      case 'keydown':
        this.onKey(e);
        break;
      case 'keyup':
        this.onKey(e);
        break;
    }
  }

  _addBrush(track) {
    if (track.$brush) { return; }

    const brush = new Konva.Rect({});
    brush.fill('#686868').opacity(0.5);

    track.$interactionsLayer.add(brush);
    track.$interactionsLayer.moveToTop();

    track.$brush = brush;

    track.$interactionsLayer.batchDraw();
  }

  _removeBrush(track) {
    if (track.$brush === undefined) { return; }

    this._resetBrush(track);

    track.$brush.destroy();

    track.$interactionsLayer.batchDraw();

    delete track.$brush;
  }

  _resetBrush(track) {
    const $brush = track.$brush;
    // reset brush element
    $brush.x(0).y(0).width(0).height(0);
    track.$interactionsLayer.batchDraw();
  }

  _updateBrush(e, track) {
    const $brush = track.$brush;

    $brush.x(e.area.left).y(e.area.top).width(e.area.width).height(e.area.height);
    track.$interactionsLayer.batchDraw();
  }

  onKey(e) {
    this.shiftKey = e.shiftKey;
  }

  onMouseDown(e) {
    // Shame!!! ..... Shame!!! .... Shame!!!
    if (e.target.shape && e.target.shape.layer && e.target.shape.layer.track)
      this._currentTrack = e.target.shape.layer.track;
    else 
      this._currentTrack = undefined;

    if (!this._currentTrack) { return; }

    this._addBrush(this._currentTrack);

    // recreate the map
    this._layerSelectedItemsMap = new Map();
    this._currentTrack.layers.forEach((layer) => {
      const aux = [];
      layer.selectedDatums.forEach((datum) => {
        aux.push(datum);
      })
      this._layerSelectedItemsMap.set(layer, aux.slice(0));
    });
  }

  onMouseMove(e) {
    console.log(e.area);
    
    this._updateBrush(e, this._currentTrack);

    this._currentTrack.layers.forEach((layer) => {
      const currentSelection = layer.selectedDatums;
      const currentItems = layer.getDatumsInArea(e.area);

      // if is not pressed
      if (!e.originalEvent.shiftKey) {
        layer.unselect(currentSelection);
        layer.select(currentItems);
      } else {
        const toSelect = [];
        const toUnselect = [];
        // use the selection from the previous drag
        const previousSelection = this._layerSelectedItemsMap.get(layer);
        // toUnselect = toUnselect.concat(previousSelectedItems);

        currentItems.forEach((item) => {
          if (previousSelection.indexOf(item) === -1) {
            toSelect.push(item);
          } else {
            toUnselect.push(item);
          }
        });

        currentSelection.forEach((item) => {
          if (
            currentItems.indexOf(item) === -1 &&
            previousSelection.indexOf(item) === -1
          ) {
            toUnselect.push(item);
          }
        });

        layer.unselect(toUnselect);
        layer.select(toSelect);
      }
    });
  }

  onMouseUp(e) {
    this._removeBrush(this._currentTrack);
  }

  onClick(e) {
    if (!this._currentTrack) { return; }

    this._currentTrack.layers.forEach((layer) => {
      const shape = e.target.shape;
      const datum = layer.getDatumFromShape(shape);

      if (!e.originalEvent.shiftKey) {
        layer.unselect();
      }

      if (datum) {
        layer.toggleSelection([datum]);
      }
    });
  }
}
