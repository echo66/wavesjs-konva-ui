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
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var BaseBehavior = (function () {
  function BaseBehavior() {
    _classCallCheck(this, BaseBehavior);

    this._selectedDatums = new _Set(); // no duplicate in Set
    this._selectedClass = null;
    this._layer = null;
  }

  _createClass(BaseBehavior, [{
    key: 'initialize',
    value: function initialize(layer) {
      this._layer = layer;
      this._selectedClass = layer.params.selectedClassName;
    }

    /**
     * Destroy the references to the selected datums.
     *
     * @type {String}
     * @todo - rename to `clearSelection` (removing the class) ?
     */
  }, {
    key: 'destroy',
    value: function destroy() {
      this._selectedDatums.clear();
    }

    /**
     * The class to add to the shapes when selected.
     *
     * @type {String}
     */
  }, {
    key: 'select',

    /**
     * @param {Object} datum - The datum to select.
     * @todo - Pass the shape object to get the accessors ?
     */
    value: function select(datum) {
      // $item.classList.add(this.selectedClass);
      this._selectedDatums.add(datum);
    }

    /**
     * @param {Object} datum - The datum to unselect.
     * @todo - Pass the shape object to get the accessors ?
     */
  }, {
    key: 'unselect',
    value: function unselect(datum) {
      // $item.classList.remove(this.selectedClass);
      this._selectedDatums['delete'](datum);
    }

    /**
     * @param {Object} datum - The datum to toggle selection.
     * @todo - Pass the shape object to get the accessors ?
     */
  }, {
    key: 'toggleSelection',
    value: function toggleSelection(datum) {
      var method = this._selectedDatums.has(datum) ? 'unselect' : 'select';
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
  }, {
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, $target) {}
    // must be implemented in children

    /**
     * TODO
     */

  }, {
    key: 'minimize',
    value: function minimize() {}

    /**
     * TODO
     */
  }, {
    key: 'highlight',
    value: function highlight(datum, isHighlighted) {}
  }, {
    key: 'selectedClass',
    set: function set(value) {
      this._selectedClass = value;
    },

    /**
     * The class to add to the shapes when selected.
     *
     * @type {String}
     */
    get: function get() {
      return this._selectedClass;
    }

    /**
     * An array containing all the selected datums of the layer.
     *
     * @type {Array}
     */
  }, {
    key: 'selectedDatums',
    get: function get() {
      return this._selectedDatums;
    }
  }]);

  return BaseBehavior;
})();

exports['default'] = BaseBehavior;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9iZWhhdmlvcnMvYmFzZS1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFrQnFCLFlBQVk7QUFDcEIsV0FEUSxZQUFZLEdBQ2pCOzBCQURLLFlBQVk7O0FBRTdCLFFBQUksQ0FBQyxlQUFlLEdBQUcsVUFBUyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQzNCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0dBQ3BCOztlQUxrQixZQUFZOztXQU9yQixvQkFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDcEIsVUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0tBQ3REOzs7Ozs7Ozs7O1dBUU0sbUJBQUc7QUFDUixVQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzlCOzs7Ozs7Ozs7Ozs7OztXQWlDSyxnQkFBQyxLQUFLLEVBQUU7O0FBRVosVUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDakM7Ozs7Ozs7O1dBTU8sa0JBQUMsS0FBSyxFQUFFOztBQUVkLFVBQUksQ0FBQyxlQUFlLFVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwQzs7Ozs7Ozs7V0FNYyx5QkFBQyxLQUFLLEVBQUU7QUFDckIsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUN2RSxVQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckI7Ozs7Ozs7Ozs7Ozs7OztXQWFHLGNBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUVyRDs7Ozs7O0FBQUE7OztXQUtPLG9CQUFHLEVBQUc7Ozs7Ozs7V0FLTCxtQkFBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLEVBQUc7OztTQXhFbEIsYUFBQyxLQUFLLEVBQUU7QUFDdkIsVUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7S0FDN0I7Ozs7Ozs7U0FPZ0IsZUFBRztBQUNsQixhQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7S0FDNUI7Ozs7Ozs7OztTQU9pQixlQUFHO0FBQ25CLGFBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztLQUM3Qjs7O1NBL0NrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJzcmMvYmVoYXZpb3JzL2Jhc2UtYmVoYXZpb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIElzIGFuIGFic3RyYWN0IGNsYXNzIG9yIGludGVyZmFjZSB0byBiZSBvdmVycmlkZW4gaW4gb3JkZXIgdG8gZGVmaW5lIHRoZSB3YXlcbiAqIGEgZ2l2ZW4gc2hhcGUgc2hvdWxkIGJlaGF2ZSB3aGVuIHNlbGVjdGVkIG9yIGVkaXRlZCBieSBhIHVzZXIuIEluc3RhbmNlcyBvZlxuICogYEJhc2VCZWhhdmlvcmAgYXJlIGludGVybmFsbHkgdXNlZCBieSBgTGF5ZXJgIGluc3RhbmNlcyB0byBtb2RpZnkgdGhlIGRhdGFcbiAqIGFjY29yZGluZyB0byBhIHVzZXIgaW50ZXJhY3Rpb24gYW5kIGEgZ2l2ZW4gc2hhcGUuIEEgc2luZ2xlIGluc3RhbmNlIG9mXG4gKiBgQmVoYXZpb3JgIGlzIGNyZWF0ZWQgaW4gb25lIGdpdmVuIHNoYXBlLlxuICpcbiAqIEJ5IGRlZmF1bHQsIHRoZSBvbmx5IG1ldGhvZCB0byBvdmVycmlkZSB0byBkZWZpbmUgYSBuZXcgYmVoYXZpb3IgZm9yIGFcbiAqIHNoYXBlIGlzIHRoZSBgZWRpdGAgbWV0aG9kLiBIb3dldmVyLCBpZiBuZWVkZWQgaW4gc3BlY2lhbCBjYXNlcywgYWxsIHRoZVxuICogc2VsZWN0aW9uIGhhbmRsaW5nIGNhbiBiZSBvdmVycmlkZW4gdG9vLlxuICpcbiAqIFRoZSBmbG93IGlzIHRoZSBmb2xsb3dpbmc6XG4gKiBgRXZlbnRgICAtIChmb3J3YXJkZWQgdG8pIC0+IGBMYXllcmAgLSAoY29tbWFuZCkgLT4gYEJlaGF2aW9yYCAtIChtb2RpZnkpIC0+IGBkYXRhYCAtICh1cGF0ZXMpIC0+IGBTaGFwZWBcbiAqXG4gKiBUaGUgYmVoYXZpb3IgcmVzcG9uc2FiaWxpdHkgaXMgdGhlbiB0byBtb2RpZnkgdGhlIGRhdGEgYWNjb3JkaW5nIHRvIHRoZVxuICogdXNlciBpbnRlcmFjdGlvbnMsIHdoaWxlIHNoYXBlcyBhcmUgYWx3YXlzIGEgdmlldyBvZiB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGVcbiAqIGRhdGEuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VCZWhhdmlvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3NlbGVjdGVkRGF0dW1zID0gbmV3IFNldCgpOyAvLyBubyBkdXBsaWNhdGUgaW4gU2V0XG4gICAgdGhpcy5fc2VsZWN0ZWRDbGFzcyA9IG51bGw7XG4gICAgdGhpcy5fbGF5ZXIgPSBudWxsO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShsYXllcikge1xuICAgIHRoaXMuX2xheWVyID0gbGF5ZXI7XG4gICAgdGhpcy5fc2VsZWN0ZWRDbGFzcyA9IGxheWVyLnBhcmFtcy5zZWxlY3RlZENsYXNzTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSByZWZlcmVuY2VzIHRvIHRoZSBzZWxlY3RlZCBkYXR1bXMuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEB0b2RvIC0gcmVuYW1lIHRvIGBjbGVhclNlbGVjdGlvbmAgKHJlbW92aW5nIHRoZSBjbGFzcykgP1xuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9zZWxlY3RlZERhdHVtcy5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjbGFzcyB0byBhZGQgdG8gdGhlIHNoYXBlcyB3aGVuIHNlbGVjdGVkLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgc2V0IHNlbGVjdGVkQ2xhc3ModmFsdWUpIHtcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNsYXNzIHRvIGFkZCB0byB0aGUgc2hhcGVzIHdoZW4gc2VsZWN0ZWQuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBnZXQgc2VsZWN0ZWRDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDbGFzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgc2VsZWN0ZWQgZGF0dW1zIG9mIHRoZSBsYXllci5cbiAgICpcbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cbiAgZ2V0IHNlbGVjdGVkRGF0dW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZERhdHVtcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0dW0gLSBUaGUgZGF0dW0gdG8gc2VsZWN0LlxuICAgKiBAdG9kbyAtIFBhc3MgdGhlIHNoYXBlIG9iamVjdCB0byBnZXQgdGhlIGFjY2Vzc29ycyA/XG4gICAqL1xuICBzZWxlY3QoZGF0dW0pIHtcbiAgICAvLyAkaXRlbS5jbGFzc0xpc3QuYWRkKHRoaXMuc2VsZWN0ZWRDbGFzcyk7XG4gICAgdGhpcy5fc2VsZWN0ZWREYXR1bXMuYWRkKGRhdHVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0dW0gLSBUaGUgZGF0dW0gdG8gdW5zZWxlY3QuXG4gICAqIEB0b2RvIC0gUGFzcyB0aGUgc2hhcGUgb2JqZWN0IHRvIGdldCB0aGUgYWNjZXNzb3JzID9cbiAgICovXG4gIHVuc2VsZWN0KGRhdHVtKSB7XG4gICAgLy8gJGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLnNlbGVjdGVkQ2xhc3MpO1xuICAgIHRoaXMuX3NlbGVjdGVkRGF0dW1zLmRlbGV0ZShkYXR1bSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdHVtIC0gVGhlIGRhdHVtIHRvIHRvZ2dsZSBzZWxlY3Rpb24uXG4gICAqIEB0b2RvIC0gUGFzcyB0aGUgc2hhcGUgb2JqZWN0IHRvIGdldCB0aGUgYWNjZXNzb3JzID9cbiAgICovXG4gIHRvZ2dsZVNlbGVjdGlvbihkYXR1bSkge1xuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMuX3NlbGVjdGVkRGF0dW1zLmhhcyhkYXR1bSkgPyAndW5zZWxlY3QnIDogJ3NlbGVjdCc7XG4gICAgdGhpc1ttZXRob2RdKGRhdHVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIG92ZXJyaWRlIGluIG9yZGVyIHRvIGRlZmluZSBpdHMgcGFydGljdWxhciBiZWhhdmlvciB3aGVuXG4gICAqIGludGVyYWN0ZWQgd2l0aC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmluZ0NvbnRleHQgLSBUaGUgbGF5ZXIgcmVuZGVyaW5nIGNvbnRleHQuXG4gICAqIEBwYXJhbSB7QmFzZVNoYXBlfSBzaGFwZSAtIFRoZSBzaGFwZSBvYmplY3QgdG8gYmUgZWRpdGVkLlxuICAgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gZGF0dW0gLSBUaGUgcmVsYXRlZCBkYXR1bSB0byBtb2RpZnkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeCAtIFRoZSB2YWx1ZSBvZiB0aGUgaW50ZXJhY3Rpb24gaW4gdGhlIHggYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR5IC0gVGhlIHZhbHVlIG9mIHRoZSBpbnRlcmFjdGlvbiBpbiB0aGUgeSBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICR0YXJnZXQgLSBUaGUgdGFyZ2V0IERPTSBlbGVtZW50IG9mIHRoZSBpbnRlcmFjdGlvbi5cbiAgICovXG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksICR0YXJnZXQpIHtcbiAgICAvLyBtdXN0IGJlIGltcGxlbWVudGVkIGluIGNoaWxkcmVuXG4gIH1cblxuICAvKipcbiAgICogVE9ET1xuICAgKi9cbiAgbWluaW1pemUoKSB7IH1cblxuICAvKipcbiAgICogVE9ET1xuICAgKi9cbiAgaGlnaGxpZ2h0KGRhdHVtLCBpc0hpZ2hsaWdodGVkKSB7IH1cblxufVxuIl19