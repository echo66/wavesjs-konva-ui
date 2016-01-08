'use strict'



class Track extends events.EventEmitter {
  /**
   * @param {DOMElement} $el
   * @param {Number} [height = 100]
   */
  constructor($el, height, width) {
    super();

    if (!height)
      height = 100;
    if (!width)
      width  = 500;

    this._height = height;
    this._width  = width;

    /**
     * The DOM element in which the track is created.
     * @type {Element}
     */
    this.$el = $el;

    this.$stage = null;
    
    this.$interactions = null;

    /**
     * An array of all the layers belonging to the track.
     * @type {Array<Layer>}
     */
    this.layers = [];
    /**
     * The context used to maintain the DOM structure of the track.
     * @type {TimelineTimeContext}
     */
    this.renderingContext = null;

    this._createContainer();
  }


  get width() {
    return this._width;
  }

  set width(value) {
    this._width = value;
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

    this.$stage.destroy();
    this.$interactions.destroy();

    this._height = null;
    this._width  = null;
    this.$el = null;
    this.$stage = null;
    this.$interactions = null;
    this.layers.length = 0;
    this.renderingContext = null;
  }

  /**
   * Creates the basic Konva structure of the track.
   */
  _createContainer() {
    this.$stage = new Konva.Stage({
      width: this.width, 
      height: this.height, 
      container: this.$el
    });
    this.$stage.addName('track-stage');

    this.$interactions = new Konva.Layer({});
    this.$interactions.addName('track-interactions');

    this.$stage.add(this.$interactions);
  }

  /**
   * Adds a layer to the track.
   *
   * @param {Layer} layer - the layer to add to the track.
   */
  add(layer) {
    this.layers.push(layer);
  }

  /**
   * Removes a layer from the track. The layer can be reused elsewhere.
   *
   * @param {Layer} layer - the layer to remove from the track.
   */
  remove(layer) {
    this.layers.splice(this.layers.indexOf(layer), 1);
    // TODO: Removes all konva layers that belong to the provided Layer.
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
    const offsetX = Math.round(renderingContext.timeToPixel(renderingContext.offset));

    this.$stage.width(this.width).height(this.height).offsetX(offsetX);
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
      if (this.layers.indexOf(layer) === -1) { return; }
      layer.update();
    });
  }



  /**
   * Iterates through the added layers.
   */
  *[Symbol.iterator]() {
    yield* this.layers[Symbol.iterator]();
  }
}
