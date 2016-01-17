import scales from '../utils/scales';

export default class TimelineTimeContext {
  /**
   * @param {Number} pixelsPerSecond - The number of pixels that should be
   *    used to display one second.
   * @param {Number} visibleWidth - The default with of the visible area
   *    displayed in `tracks` (in pixels).
   */
  constructor(pixelsPerSecond, visibleWidth) {
    this._children = [];

    this._timeToPixel = null;
    this._offset = 0;
    this._zoom = 1;
    this._computedPixelsPerSecond = pixelsPerSecond;
    // params
    this._visibleWidth = visibleWidth;
    this._maintainVisibleDuration = false;

    // create the timeToPixel scale
    const scale = scales.linear()
      .domain([0, 1])
      .range([0, pixelsPerSecond]);

    this._timeToPixel = scale;

    this._originalPixelsPerSecond = this._computedPixelsPerSecond;
  }

  /**
   * Returns the number of pixels per seconds ignoring the current zoom value.
   *
   * @type {Number}
   */
  get pixelsPerSecond() {
    return this._originalPixelsPerSecond;
  }

  /**
   * Updates all the caracteristics of this object according to the new
   * given value of pixels per seconds. Propagates the changes to the
   * `LayerTimeContext` children.
   *
   * @type {Number}
   */
  set pixelsPerSecond(value) {
    this._computedPixelsPerSecond = value * this.zoom;
    this._originalPixelsPerSecond = value;
    this._updateTimeToPixelRange();

    // force children scale update
    this._children.forEach(function(child) {
      if (child.stretchRatio === 1) { return; }
      child.stretchRatio = child.stretchRatio;
    });
  }

  /**
   * Returns the number of pixels per seconds including the current zoom value.
   *
   * @type {Number}
   */
  get computedPixelsPerSecond() {
    return this._computedPixelsPerSecond;
  }

  /**
   * Returns the current offset applied to the registered `Track` instances
   * from origin (in seconds).
   *
   * @type {Number}
   */
  get offset() {
    return this._offset;
  }

  /**
   * Sets the offset to apply to the registered `Track` instances from origin
   * (in seconds).
   *
   * @type {Number}
   */
  set offset(value) {
    this._offset = value;
  }

  /**
   * Returns the current zoom level applied to the whole visualization.
   *
   * @type {Number}
   */
  get zoom() {
    return this._zoom;
  }

  /**
   * Sets the zoom ratio for the whole visualization.
   *
   * @type {Number}
   */
  set zoom(value) {
    // Compute change to propagate to children who have their own timeToPixel
    const ratioChange = value / this._zoom;
    this._zoom = value;
    this._computedPixelsPerSecond = this._originalPixelsPerSecond * value;
    this._updateTimeToPixelRange();

    this._children.forEach(function(child) {
      if (child.stretchRatio === 1) { return; }
      child.stretchRatio = child.stretchRatio * ratioChange;
    });
  }

  /**
   * Returns the visible width of the `Track` instances.
   *
   * @type {Number}
   */
  get visibleWidth() {
    return this._visibleWidth;
  }

  /**
   * Sets the visible width of the `Track` instances.
   *
   * @type {Number}
   */
  set visibleWidth(value) {
    const widthRatio = value / this.visibleWidth;
    this._visibleWidth = value;

    if (this.maintainVisibleDuration) {
      this.pixelsPerSecond = this._computedPixelsPerSecond * widthRatio;
    }
  }

  /**
   * Returns the duration displayed by `Track` instances.
   *
   * @type {Number}
   */
  get visibleDuration() {
    return this.visibleWidth / this._computedPixelsPerSecond;
  }

  /**
   * Returns if the duration displayed by tracks should be maintained when
   * their width is updated.
   *
   * @type {Number}
   */
  get maintainVisibleDuration() {
    return this._maintainVisibleDuration;
  }

  /**
   * Defines if the duration displayed by tracks should be maintained when
   * their width is updated.
   *
   * @type {Boolean}
   */
  set maintainVisibleDuration(bool) {
    this._maintainVisibleDuration = bool;
  }

  /**
   * Returns the time to pixel trasfert function.
   *
   * @type {Function}
   */
  get timeToPixel() {
    return this._timeToPixel;
  }

  _updateTimeToPixelRange() {
    this.timeToPixel.range([0, this._computedPixelsPerSecond]);
  }

  /**
   * Returns the time interval of the visible area in the timeline.
   *
   * @type {Object} 
   */
  get visibleInterval() {
    var interval = {};
    interval.start = -this.offset;
    interval.duration = this.visibleDuration;
    return interval;
  }

  /**
   * Focus the timeline visible area in the provided time interval.
   *
   * @type {Object} 
   */
  set visibleInterval(value) {
    this.offset = -value.start;
    this.pixelsPerSecond = this.visibleWidth / value.duration;
  }


}
