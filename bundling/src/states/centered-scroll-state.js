import BaseState from './base-state';

export default class CenteredScrollState extends BaseState {
  constructor(timeline) {
    super(timeline);
    this.currentLayer = null;
    // Set max/min zoom
    // maxZoom: 1px per sample
    // minZoom: 10 000 px per 1 hour
    // with a default to 44.1kHz sample rate
    this.maxZoom = 44100 * 1 / this.timeline.timeContext.pixelsPerSecond;
    this.minZoom = 10000 / 3600 / this.timeline.timeContext.pixelsPerSecond;
  }

  handleEvent(e) {
    switch(e.type) {
      case 'mousedown':
        this.onMouseDown(e);
        break;
      case 'mousemove':
        this.onMouseMove(e);
        break;
      case 'mouseup':
        this.onMouseUp(e);
        break;
    }
  }

  onMouseDown(e) {
  }

  onMouseMove(e) {
    // prevent annoying text selection when dragging
    e.originalEvent.preventDefault();

    const timeContext = this.timeline.timeContext;
    const lastCenterTime = timeContext.timeToPixel.invert(e.x);

    const newCenterTime = timeContext.timeToPixel.invert(e.x);
    const delta = newCenterTime - lastCenterTime;

    // Apply new offset to keep it centered to the mouse
    timeContext.offset += (delta + timeContext.timeToPixel.invert(e.dx));

    // Other possible experiments with centered-zoom-state
    //
    // Example 1: Prevent timeline.offset to be negative
    timeContext.offset = Math.min(timeContext.offset, 0);
    

    this.timeline.tracks.update();
  }

  onMouseUp(e) {}
}
