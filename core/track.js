'use strict'



class Track extends events.EventEmitter {
  /**
   * @param {DOMElement} $el
   * @param {Number} [height = 100]
   */
  constructor($el, height) {
    super();

    if (!height)
      height = 100;

    this._height = height;

    /**
     * The DOM element in which the track is created.
     * @type {Element}
     */
    this.$el = $el;

    this.$stage = null;

    this.$dragLayer = null;
    
    this.$interactionsLayer = null;

    this.$backgroundLayer = null;

    /**
     * A set of all the layers belonging to the track.
     * @type {Set<Layer>}
     */
    this.layers = new Set();
    /**
     * The context used to maintain the DOM structure of the track.
     * @type {TimelineTimeContext}
     */
    this.renderingContext = null;

    this._createContainer();
  }


  /**
   * Returns the height of the track.
   *
   * @type {Number}
   */
  get height() {
    return this._height;
  }

  /**
   * Sets the height of the track.
   *
   * @todo propagate to layers, keeping ratio? could be handy for vertical
   *    resize. This is why a set/get is implemented here.
   * @type {Number}
   */
  set height(value) {
    this._height = value;
  }

  /**
   * This method is called when the track is added to the timeline. The
   * track cannot be updated without being added to a timeline.
   *
   * @private
   * @param {TimelineTimeContext} renderingContext
   */
  configure(renderingContext) {
    this.renderingContext = renderingContext;
  }

  /**
   * Destroy the track and its layers.
   */
  destroy() {
    this.layers.forEach((layer) => layer.destroy());
    this.layers.clear();

    this.$stage.destroy();
    this.$interactionsLayer.destroy();
    this.$backgroundLayer.destroy();

    this._height = null;
    this.$el = null;
    this.$stage = null;
    this.$interactionsLayer = null;
    this.$backgroundLayer = null;
    this.renderingContext = null;
  }

  /**
   * Creates the basic Konva structure of the track.
   */
  _createContainer() {
    this.$stage = new Konva.Stage({
      height: this.height, 
      container: this.$el
    });
    this.$stage.addName('track-stage');

    this.$interactionsLayer = new Konva.Layer({});
    this.$interactionsLayer.addName('track-interactions');

    this.$backgroundLayer = new Konva.Layer({});
    this.$backgroundLayer.addName('track-background');
    this.$backgroundLayer.add(new Konva.Rect({}));
    // this.$backgroundLayer.children[0].shape = { layer: { track: this } }; // Shame!!! ..... Shame!!! .... Shame!!!

    this.$dragLayer = new Konva.Layer({});
    this.$dragLayer.addName('track-drag-layer');

    this.$stage.add(this.$dragLayer);
    this.$stage.add(this.$interactionsLayer);
    this.$stage.add(this.$backgroundLayer);
  }

  /**
   * Adds a layer to the track.
   *
   * @param {Layer} layer - the layer to add to the track.
   */
  add(layer) {
    if (!this.layers.has(layer)) {
      layer.createContainer(this.$stage);
      this.layers.add(layer);
      this.moveToTop(layer);
      this.emit('add', layer);
    }
  }

  /**
   * Removes a layer from the track and destroys that alyer
   *
   * @param {Layer} layer - the layer to remove from the track.
   */
  remove(layer) {
    // TODO
    if (this.layers.has(layer)) {
      this.layers.delete(layer);
      layer.destroy();
      this.emit('remove', layer);
    } else {
      throw new Error('Layer not found');
    }
  }

  /**
   * Tests if a given element belongs to the track.
   *
   * @param {Element} $el
   * @return {bool}
   */
  hasElement($el) {
    throw new Error("deprecated");

    do {
      if ($el === this.$el) {
        return true;
      }

      $el = $el.parentNode;
    } while ($el !== null);

    return false;
  }

  /**
   * Render all the layers added to the track.
   */
  render() {
    for (let layer of this) { layer.render(); }
  }

  /**
   * Updates the track Konva structure and updates the layers.
   *
   * @param {Array<Layer>} [layers=null] - if not null, a subset of the layers to update.
   */
  update(layers) {
    if (layers == undefined)
      layers = null;

    this.updateContainer();
    this.updateLayers(layers);
  }

  /**
   * Updates the track Konva structure.
   */
  updateContainer() {
    // Should be in some update layout
    const renderingContext = this.renderingContext;
    const height = this.height;
    const width = Math.round(renderingContext.visibleWidth);
    const offsetX = -Math.round(renderingContext.timeToPixel(renderingContext.offset));

    this.$stage.width(width).height(this.height).offsetX(offsetX);
    this.$interactionsLayer.offsetX(-offsetX);
    this.$backgroundLayer.offsetX(-offsetX);
    this.$backgroundLayer.children[0].x(0).y(0).width(width).height(this.height).opacity(0).moveToBottom();
    this.$backgroundLayer.batchDraw();

    /*
     * Change the layer stack order according to Layer.zIndex.
     */
    // var zIndexCounter = 0;
    // var maxZIndex = -Infinity;
    // this.$backgroundLayer.setZIndex(zIndexCounter++);
    // this.layers.forEach((layer) => {
    //   layer._contextLayer.setZIndex(layer.zIndex + zIndexCounter++);
    //   layer._commonShapeLayer.setZIndex(layer.zIndex + zIndexCounter++);
    //   layer.contentLayers.forEach((konvaLayer) => konvaLayer.setZIndex(layer.zIndex + zIndexCounter++));
    //   layer._dragLayer.setZIndex(layer.zIndex + zIndexCounter++);
    //   maxZIndex = Math.max(maxZIndex, layer.zIndex);
    // })
    // this.$interactionsLayer.setZIndex(maxZIndex + zIndexCounter);
  }

  /**
   * Updates the layers.
   *
   * @param {Array<Layer>} [layers=null] - if not null, a subset of the layers to update.
   */
  updateLayers(layers) {
    if (layers == undefined) 
      layers = null;

    layers = (layers === null) ? this.layers : layers;

    layers.forEach((layer) => {
      if (!this.layers.has(layer)) { return; }
      layer.update();
    });
    this.$backgroundLayer.moveToBottom();
  }

  minimize() {
    // TODO
  }

  maximize() {
    // TODO
  }

  moveToTop(layer) {
    layer._contextLayer.moveToTop();
    layer._commonShapeLayer.moveToTop();
    layer.contentLayers.forEach((konvaLayer) => konvaLayer.moveToTop());

    this.$interactionsLayer.moveToTop();
    this.$backgroundLayer.moveToBottom();
  }

  moveToBottom(layer) {
    this.$interactionsLayer.moveToTop();
    
    layer.contentLayers.forEach((konvaLayer) => konvaLayer.moveToBottom());
    layer._commonShapeLayer.moveToBottom();
    layer._contextLayer.moveToBottom();
    
    this.$backgroundLayer.moveToBottom();
  }



  /**
   * Iterates through the added layers.
   */
  *[Symbol.iterator]() {
    yield* this.layers[Symbol.iterator]();
  }
}
