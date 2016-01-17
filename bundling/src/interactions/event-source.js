import events from 'events';

/**
 * Abstract export default class to extend to create new sources ofinteractions.
 * A `Surface` and `Keyboard` event sources are provided.
 */
export default class EventSource extends events.EventEmitter{
  constructor($el) {
    super();
    /**
     * The element on which the listener is added
     * @type {Element}
     */
    this.$el = $el;

    this._bindEvents();
  }

  _createEvent(type, e) {}

  _bindEvents() {}
}
