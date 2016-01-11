'use strict'

/**
 * Normalizes mouse user interactions with the timeline upon the DOM
 * container element of `Track` instances. As soon as a `track` is added to a
 * `timeline`, its attached `Surface` instance will emit the mouse events.
 */
class Surface extends EventSource {
  /**
   * @param {DOMElement} el - The DOM element to listen.
   * @todo - Add some padding to the surface.
   */
  constructor($el) {
    super($el);

    /**
     * The name of the event source.
     * @type {String}
     */
    this.sourceName = 'surface';
    this._mouseDownEvent = null;
    this._lastEvent = null;
  }

  /**
   * Factory method for `Event` class
   */
  _createEvent(type, e) {
    const event = new KonvaWaveEvent(this.sourceName, type, e);

    const pos = this._getRelativePosition(e);
    event.x = pos.x;
    event.y = pos.y;

    return event;
  }

  /**
   * Returns the x, y coordinates coordinates relative to the surface element.
   *
   * @param {Event} e - Raw event from listener.
   * @return {Object}
   * @todo - handle padding.
   */
  _getRelativePosition(e) {
    if (e instanceof MouseEvent) {
      let x = e.offsetX;
      let y = e.offsetY;
      return { x, y };
    } else {
      let x = e.evt.offsetX;
      let y = e.evt.offsetY;
      return { x, y };
    }
  }

  _defineArea(e, mouseDownEvent, lastEvent) {
    if (!mouseDownEvent || !lastEvent) { return; }
    e.dx = e.x - lastEvent.x;
    e.dy = e.y - lastEvent.y;

    const left = mouseDownEvent.x < e.x ? mouseDownEvent.x : e.x;
    const top  = mouseDownEvent.y < e.y ? mouseDownEvent.y : e.y;
    const width  = Math.abs(Math.round(e.x - mouseDownEvent.x));
    const height = Math.abs(Math.round(e.y - mouseDownEvent.y));

    e.area = { left, top, width, height };
  }

  /**
   * Keep this private to avoid double event binding. Main logic of the surface
   * is here. Should be extended with needed events (mouseenter, mouseleave,
   * wheel ...).
   */
  _bindEvents() {
    const onMouseDown = (e) => {
      // By removing the previous selection we prevent bypassing the mousemove events coming from SVG in Firefox.
      window.getSelection().removeAllRanges();
      const event = this._createEvent('mousedown', e);


      this._mouseDownEvent = event;
      this._lastEvent = event;
      // Register mousemove and mouseup listeners on window
      window.addEventListener('mousemove', onMouseDrag, false);
      window.addEventListener('mouseup', onMouseUp, false);

      this.emit('event', event);
    };

    const onMouseDrag = (e) => {

      let event = this._createEvent('mousedrag', e);
      this._defineArea(event, this._mouseDownEvent, this._lastEvent);
      // Update `lastEvent` for next call
      this._lastEvent = event;

      this.emit('event', event);
    };

    const onMouseUp = (e) => {
      
      let event = this._createEvent('mouseup', e);
      this._defineArea(event, this._mouseDownEvent, this._lastEvent);


      this._mouseDownEvent = null;
      this._lastEvent = null;
      // Remove mousemove and mouseup listeners on window
      window.removeEventListener('mousemove', onMouseDrag);
      window.removeEventListener('mouseup', onMouseUp);

      this.emit('event', event);
    };

    const onClick = (e) => {
      let event = this._createEvent('click', e);
      this.emit('event', event);
    };

    const onDblClick = (e) => {
      let event = this._createEvent('dblclick', e);
      this.emit('event', event);
    };

    const onMouseOver = (e) => {
      let event = this._createEvent('mouseover', e);
      this.emit('event', event);
    };

    const onMouseOut = (e) => {
      let event = this._createEvent('mouseout', e);
      this.emit('event', event);
    };

    // Bind callbacks
    this.$el.$stage.on('contentClick', onMouseDown);
    this.$el.$stage.on('mousedown', onMouseDown);
    this.$el.$stage.on('click', onClick);
    this.$el.$stage.on('dblclick', onDblClick);
    this.$el.$stage.on('mouseover', onMouseOver);
    this.$el.$stage.on('mouseout', onMouseOut);
    this.$el.$stage.on('mouseover', onMouseOver)
  }
}
