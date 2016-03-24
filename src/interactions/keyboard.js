'use strict';
import EventSource from './event-source';
import WaveEvent from './wave-event';

/**
 * A global event sourve for the keyboard. Only one instance of this source
 * can be created. The first created timeline instanciate the singleton, each
 * subsequent instanciation returns the first created instance.
 */
export default class Keyboard extends EventSource {
  /**
   * @param {Element} $el - The element on which to install the listener.
   */
  constructor($el) {
    // kind of singleton
    if (Keyboard._instance) { return Keyboard._instance; }

    super($el);
    /**
     * The name of the source
     * @type {String}
     */
    this.sourceName = 'keyboard';

    Keyboard._instance = this;

    this._beingPressed = new Set();
  }

  _createEvent(type, e) {
    const event = new WaveEvent(this.sourceName, type, e);

    event.shiftKey = e.shiftKey;
    event.ctrlKey = e.ctrlKey;
    event.altKey = e.altKey;
    event.metaKey = e.metaKey;

    event.keyCode = e.keyCode;
    event.char = String.fromCharCode(e.keyCode);

    return event;
  }

  _bindEvents() {
    const onKeyDown = (e) => {
      if (!this._beingPressed.has(e.keyCode)) {
        let event = this._createEvent('keydown', e);
        this.emit('event', event);
        this._beingPressed.add(e.keyCode);
      }
    };

    const onKeyUp = (e) => {
      let event1 = this._createEvent('keyup', e);
      this.emit('event', event1);

      let event2 = this._createEvent('keypress', e);
      this.emit('event', event2);

      this._beingPressed.delete(e.keyCode);
    };

    this.$el.addEventListener('keydown', onKeyDown, false);
    this.$el.addEventListener('keyup', onKeyUp, false);
  }
}
