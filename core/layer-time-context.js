'use strict'

class LayerTimeContext {
  /**
   * @param {TimelineTimeContext} parent - The `TimelineTimeContext` instance of the timeline.
   */
  constructor(parent) {
    if (!parent) { throw new Error('LayerTimeContext must have a parent'); }

    /**
     * The `TimelineTimeContext` instance of the timeline.
     *
     * @type {TimelineTimeContext}
     */
    this.parent = parent;
    this._lockedToParentInterval = false;

    this._timeToPixel = null;
    this._start = 0;
    this._duration = parent.visibleDuration;
    this._offset = 0;
    this._stretchRatio = 1;
    // register into the timeline's TimeContext
    this.parent._children.push(this);
  }

  /**
   * Creates a clone of the current time context.
   *
   * @return {LayerTimeContext}
   */
  clone() {
    const ctx = new this();

    ctx.parent = this.parent;
    ctx.start = this.start;
    ctx.duration = this.duration;
    ctx.offset = this.offset;
    ctx.stretchRatio = this.stretchRatio; // creates the local scale if needed

    return ctx;
  }

  /**
   * Returns the start position of the time context (in seconds).
   *
   * @type {Number}
   */
  get start() {
    return (!this._lockedToParentInterval)? this._start : -this.parent.offset;
  }

  /**
   * Sets the start position of the time context (in seconds).
   *
   * @type {Number}
   */
  set start(value) {
    this._start = value;
  }

  /**
   * Returns the duration of the time context (in seconds).
   *
   * @type {Number}
   */
  get duration() {
    return (!this._lockedToParentInterval)? this._duration : this.parent.visibleDuration;
  }

  /**
   * Sets the duration of the time context (in seconds).
   *
   * @type {Number}
   */
  set duration(value) {
    this._duration = value;
  }

  /**
   * Returns the offset of the time context (in seconds).
   *
   * @type {Number}
   */
  get offset() {
    return (!this._lockedToParentInterval)? this._offset : this.parent.offset;
  }

  /**
   * Sets the offset of the time context (in seconds).
   *
   * @type {Number}
   */
  set offset(value) {
    this._offset = value;
  }

  /**
   * Returns the stretch ratio of the time context.
   *
   * @type {Number}
   */
  get stretchRatio() {
    return this._stretchRatio;
  }

  /**
   * Sets the stretch ratio of the time context.
   *
   * @type {Number}
   */
  set stretchRatio(value) {
    // remove local scale if ratio = 1
    if (value ===  1) {
      this._timeToPixel = null;
      return;
    }
    // reuse previsously created local scale if exists
    const timeToPixel = this._timeToPixel ?
      this._timeToPixel : scales.linear().domain([0, 1]);

    timeToPixel.range([0, this.parent.computedPixelsPerSecond * value]);

    this._timeToPixel = timeToPixel;
    this._stretchRatio = value;
  }

  /**
   * Returns the time to pixel transfert function of the time context. If
   * the `stretchRatio` attribute is equal to 1, this function is the global
   * one from the `TimelineTimeContext` instance.
   *
   * @type {Function}
   */
  get timeToPixel() {
    if (!this._timeToPixel) {
      return this.parent.timeToPixel;
    }

    return this._timeToPixel;
  }

  /**
   * Helper function to convert pixel to time.
   *
   * @param {Number} px
   * @return {Number}
   */
  pixelToTime(px) {
    if (!this._timeToPixel) {
      return this.parent.timeToPixel.invert(px);
    }

    return this._timeToPixel.invert(px);
  }


  /**
   * Returns the time interval of the visible area in the timeline.
   *
   * @type {Object} 
   */
  get visibleInterval() {
    var interval = {};
    interval.start = -this.offset;
    interval.duration = this.duration;
    return interval;
  }

  /**
   * Focus the timeline visible area in the provided time interval.
   *
   * @type {Object} 
   */
  set visibleInterval(value) {
    this.offset = -value.start;
    this.duration = value.duration;
  }

  /**
   *  TODO
   */
  get lockedToParentInterval() {
    return this._lockedToParentInterval;
  }

  set lockedToParentInterval(value) {
    this._lockedToParentInterval = value;
  }
}
