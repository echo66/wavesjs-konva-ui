'use strict'

class HorizontalSelectionState extends BaseState {

  constructor(timeline /*, options = {} */) {
    super(timeline /*, options */);

    this._layerSelectedItemsMap = new Map();

    this.shiftKey = false;

    this.wasMoving = false;
  }

  enter() {
    // TODO
  }

  exit() {
    // TODO
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

    $brush.x(e.area.left).y(0).width(e.area.width).height(track.height);
    track.$interactionsLayer.batchDraw();
  }

  onKey(e) {
    this.shiftKey = e.shiftKey;
  }

  onMouseDown(e) {
    this._currentTrack = this.timeline.getTrackFromDOMElement(e.currentTarget);

    if (!this._currentTrack) { return; }

    this._addBrush(this._currentTrack);

    // recreate the map
    this._layerSelectedItemsMap = new Map();
    
    this._currentTrack.layers.forEach((layer) => {
      
      if (!e.originalEvent.shiftKey) {
        const aux = new Set(layer.selectedDatums);
        layer.unselect(aux);
        layer.updateShapes(aux);
      }

      this._layerSelectedItemsMap.set(layer, new Set(layer.selectedDatums));
      
    });
  }

  onMouseMove(e) {

    this.wasMoving = true;

    e.area = {left: e.area.left, width:e.area.width, top: 0, height: this._currentTrack.height };
    
    this._updateBrush(e, this._currentTrack);

    const that = this;

    this._currentTrack.layers.forEach((layer) => {
      const currentSelection = layer.selectedDatums;
      const datumsInArea = layer.getDatumsInArea(e.area);

      var toSelect;
      var toUnselect;

      // if is not pressed
      if (!e.originalEvent.shiftKey) {        

        toUnselect = new Set(currentSelection);
        toSelect = new Set(datumsInArea);

      } else {

        toSelect = new Set();
        toUnselect = new Set();
        // use the selection from the previous drag
        const previousSelection = this._layerSelectedItemsMap.get(layer);
        

        datumsInArea.forEach((datum) => {
          if (!previousSelection.has(datum)) {
            toSelect.add(datum);
          } else {
            toUnselect.add(datum);
          }
        });

        currentSelection.forEach((datum) => {
          if (!datumsInArea.has(datum) && !previousSelection.has(datum)) {
            toUnselect.add(datum);
          }
        });

        previousSelection.forEach((datum) => {
          if (!datumsInArea.has(datum)) {
            toSelect.add(datum);
          }
        });

      }

      layer.unselect(toUnselect);
      layer.select(toSelect);

      layer.updateShapes(currentSelection);
      layer.updateShapes(datumsInArea);
    });
  }

  onMouseUp(e) {
    this._removeBrush(this._currentTrack);
    if (this.wasMoving) {
      this.wasMoving = false;
      // this._currentTrack.layers.forEach((layer) => {
      //   layer.updateShapes();
      // });
    }
  }

  onClick(e) {
    // console.log('click');
    if (!this._currentTrack) { return; }
    const that = this;

    this._currentTrack.layers.forEach((layer) => {

      const shape = e.target.shape;
      const datum = layer.getDatumFromShape(shape);
      var toUpdate = new Set();

      //TODO: correct this because it is not working as I expected to.  
      if (!e.originalEvent.shiftKey) {
        toUpdate = new Set(layer.selectedDatums);
        layer.unselect(layer.selectedDatums);
      }

      if (datum) {
        toUpdate.add(datum);
        layer.toggleSelection([datum]);
      }

      layer.updateShapes(toUpdate);

    });
  }
}
