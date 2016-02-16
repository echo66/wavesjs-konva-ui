'use strict';
import BaseBehavior from './base-behavior';


export default class NoBehavior extends BaseBehavior {

  set selectedClass(value) { }

  get selectedClass() { }

  get selectedDatums() { }

  select(datum) { }

  unselect(datum) { }

  toggleSelection(datum) { }

  edit(renderingContext, shape, datum, dx, dy, $target) { }

  can(action, datums) { return false; }

  create(datum) { }

  remove(datum) { }

  minimize() { }

  highlight(datum, isHighlighted) { }

}
