'use strict'

/**
 * Object template for all events. Event sources should use this event template
 * in order to keep consistency with existing sources.
 */
class KonvaWaveEvent extends WaveEvent {
  /**
   * @param {String} source - The name of the source (`keyboard`, `surface`, ...).
   * @param {String} type - The type of the source (`mousedown`, `keyup`, ...).
   * @param {Event} originalEvent - The original event as emitted by the browser.
   */
  constructor(source, type, originalEvent) {
    super(source, type, originalEvent);
    if (!(originalEvent instanceof MouseEvent)) {
      this.originalEvent = originalEvent.evt;
      this.currentTarget = originalEvent.evt.currentTarget;
    }
  }
}
