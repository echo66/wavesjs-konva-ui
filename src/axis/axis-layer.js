'use strict';
import Layer from '../core/layer';
import Segment from '../shapes/segment';
import BaseBehavior from '../behaviors/base-behavior';


/**
 * Simplified Layer for Axis. The main difference with a regular layer is that
 * an axis layer use the `Timeline~timeContext` attributes to render it's layout
 * and stay synchronized with the tracks visible area. All getters and setters
 * to the `TimelineTimeContext` attributes are bypassed.
 *
 * It also handle it's own data and its updates. The `_generateData` method is
 * responsible to create some usefull data to visualize
 *
 * [example usage of the layer-axis](./examples/layer-axis.html)
 */
export default class AxisLayer extends Layer {
  /**
   * @param {Function} generator - A function to create data according to
   *    the `Timeline~timeContext`.
   * @param {Object} options - Layer options, cf. Layer for available options.
   */
  constructor(generator, options) {
    super('entity', [], options);
    this._generator = generator;

    this._contextShape = new Segment({});
    this._contextShape.install({
      opacity : () => 1, 
      color : () => this.params.context.color, 
      width : () => this.timeContext.visibleDuration,
      height  : () => this._renderingContext.valueToPixel.domain()[1],
      y   : () => this._renderingContext.valueToPixel.domain()[0],
      x   : () => -this.timeContext.offset
    }); 
    this._contextShape.params.handlerWidth = this.params.context.handlerWidth;
    this._contextShape.render(this._renderingContext);
    this._contextShape.layer = this;
    for (var i=0; i<this._contextShape.$el.length; i++) {
      this._contextLayer.add(this._contextShape.$el[i]);
    }
    this._contextShape.$el.forEach((ks) => { ks.shape = this._contextShape; });

    this.setBehavior(new BaseBehavior());
  }

  /** @private */
  set stretchRatio(value) { return; }
  /** @private */
  set offset(value) { return; }
  /** @private */
  set start(value) { return; }
  /** @private */
  set duration(value) { return; }
  /** @private */
  get stretchRatio() { return; }
  /** @private */
  get offset() { return; }
  /** @private */
  get start() { return; }
  /** @private */
  get duration() { return; }


  /**
   * The generator that creates the data to be rendered to display the axis.
   *
   * @type {Function}
   */
  set generator(func) {
    this._generator = func;
  }

  /**
   * The generator that creates the data to be rendered to display the axis.
   *
   * @type {Function}
   */
  get generator() {
    return this._generator;
  }

  /**
   * This method is the main difference with a classical layer. An `AxisLayer`
   * instance generates and maintains it's own data.
   */
  _generateData() {
    const that = this;
    this.contentLayers.forEach((l) => { // Hacked this to make it work.
      l.destroy();
      that.contentLayers.delete(l);
    });
    const data = this._generator(this.timeContext);
    // this.remove(this.data);
    this.set([data]);
  }

  /**
   * Generates the data and update the layer.
   */
  update() {
    this._generateData();
    super.update();
  }

  updateContainer() {
    this._updateRenderingContext();
  }

  updateShapes() {
    const changedContentLayers = new Set();
    const that = this;

    this.allocateShapesToContentLayers(this._stage, this.data, 'datums', true).forEach((changedContentLayer) => {
      changedContentLayers.add(changedContentLayer);
    });

    changedContentLayers.forEach((changedContentLayer) => {
      changedContentLayer
        .y(that.params.top)
        .offsetX(0);
      changedContentLayer.clear();
      changedContentLayer.batchDraw();
    });

    this._contextShape.update(this._renderingContext, this.timeContext);

    this._contextLayer
        .y(that.params.top)
        .batchDraw()
        .moveToBottom();
  }

  /**
   * Updates the rendering context for the shapes.
   */
  _updateRenderingContext() {
    this._renderingContext.timeToPixel = this.timeContext.timeToPixel;
    this._renderingContext.valueToPixel = this._valueToPixel;

    this._renderingContext.height = this.params.height;
    this._renderingContext.width  = this.timeContext.timeToPixel(this.timeContext.visibleDuration);

    // for foreign object issue in chrome
    this._renderingContext.offsetX = this.timeContext.timeToPixel(this.timeContext.offset);

    // expose some timeline attributes - allow to improve perf in some cases - cf. Waveform
    this._renderingContext.trackOffsetX = this.timeContext.timeToPixel(this.timeContext.offset);
    this._renderingContext.visibleWidth = this.timeContext.visibleWidth;
  }

  visible_data(timeContext, data) {
    return undefined;
  }

  sort_data(data) { }
}

module.exports = AxisLayer;