'use strict';

/**
 * Is an abstract class or interface to be overriden in order to define the way
 * a given shape should behave when selected or edited by a user. Instances of
 * `BaseBehavior` are internally used by `Layer` instances to modify the data
 * according to a user interaction and a given shape. A single instance of
 * `Behavior` is created in one given shape.
 *
 * By default, the only method to override to define a new behavior for a
 * shape is the `edit` method. However, if needed in special cases, all the
 * selection handling can be overriden too.
 *
 * The flow is the following:
 * `Event`  - (forwarded to) -> `Layer` - (command) -> `Behavior` - (modify) -> `data` - (upates) -> `Shape`
 *
 * The behavior responsability is then to modify the data according to the
 * user interactions, while shapes are always a view of the current state of the
 * data.
 */
export default class BaseBehavior {
  constructor() {
    this._selectedDatums = new Set(); // no duplicate in Set
    this._selectedClass = null;
    this._layer = null;
  }

  initialize(layer) {
    this._layer = layer;
    this._selectedClass = layer.params.selectedClassName;
  }

  /**
   * Destroy the references to the selected datums.
   *
   * @type {String}
   * @todo - rename to `clearSelection` (removing the class) ?
   */
  destroy() {
    this._selectedDatums.clear();
  }

  /**
   * The class to add to the shapes when selected.
   *
   * @type {String}
   */
  set selectedClass(value) {
    this._selectedClass = value;
  }

  /**
   * The class to add to the shapes when selected.
   *
   * @type {String}
   */
  get selectedClass() {
    return this._selectedClass;
  }

  /**
   * An array containing all the selected datums of the layer.
   *
   * @type {Array}
   */
  get selectedDatums() {
    return this._selectedDatums;
  }

  /**
   * @param {Object} datum - The datum to select.
   * @todo - Pass the shape object to get the accessors ?
   */
  select(datum) {
    // $item.classList.add(this.selectedClass);
    this._selectedDatums.add(datum);
  }

  /**
   * @param {Object} datum - The datum to unselect.
   * @todo - Pass the shape object to get the accessors ?
   */
  unselect(datum) {
    // $item.classList.remove(this.selectedClass);
    this._selectedDatums.delete(datum);
  }

  /**
   * @param {Object} datum - The datum to toggle selection.
   * @todo - Pass the shape object to get the accessors ?
   */
  toggleSelection(datum) {
    const method = this._selectedDatums.has(datum) ? 'unselect' : 'select';
    this[method](datum);
  }

  /**
   * Interface method to override in order to define its particular behavior when
   * interacted with.
   *
   * @param {Object} renderingContext - The layer rendering context.
   * @param {BaseShape} shape - The shape object to be edited.
   * @param {Object|Array} datum - The related datum to modify.
   * @param {Number} dx - The value of the interaction in the x axis (in pixels).
   * @param {Number} dy - The value of the interaction in the y axis (in pixels).
   * @param {Element} $target - The target DOM element of the interaction.
   */
  edit(renderingContext, shape, datum, dx, dy, $target) {
    // must be implemented in children
  }

  /**
   * TODO: possible actions are 'add', 'remove', 'edit', 'minimize', 'highlight', 'select', 'unselect'.
   */
  can(action, datums) { 
    return true;
  }

  /**
   * TODO
   */
  create(datum) { }

  /**
   * TODO
   */
  remove(datum) { }

  /**
   * TODO
   */
  minimize() { }

  /**
   * TODO
   */
  highlight(datum, isHighlighted) { }

}
