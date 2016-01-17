'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _utilsScales = require('../utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

var _shapesSegment = require('../shapes/segment');

var _shapesSegment2 = _interopRequireDefault(_shapesSegment);

var _behaviorsTimeContextBehavior = require('../behaviors/time-context-behavior');

var _behaviorsTimeContextBehavior2 = _interopRequireDefault(_behaviorsTimeContextBehavior);

var Layer = (function (_events$EventEmitter) {
	_inherits(Layer, _events$EventEmitter);

	function Layer(dataType, data, options) {
		var _this = this;

		_classCallCheck(this, Layer);

		_get(Object.getPrototypeOf(Layer.prototype), 'constructor', this).call(this);

		this.dataType = dataType;

		if (!options) options = {};

		var defaults = {
			height: 100,
			top: 0,
			opacity: 1,
			yDomain: [0, 1],
			className: null, // TODO
			selectedClassName: 'selected',
			context: {
				handlerWidth: 10,
				handlerOpacity: 0.2,
				opacity: 0.5,
				color: '#787878'
			},
			hittable: true };

		// when false the layer is not returned by `BaseState.getHitLayers`
		this._behavior = null;

		/**
  * Parameters of the layers, `defaults` overrided with options.
  * @type {Object}
  */
		this.params = _Object$assign({}, defaults, options);
		this.timeContextBehavior = new _behaviorsTimeContextBehavior2['default']();

		this._shapeConfiguration = null; // { ctor, accessors, options }
		this._commonShapeConfiguration = null; // { ctor, accessors, options }
		this._$datumToShape = new _Map();
		this._$shapeToDatum = new _Map();
		this._commonShape = null;
		this._renderingContext = {};
		this.data = [];

		this._isContextEditable = false;

		this._valueToPixel = _utilsScales2['default'].linear().domain(this.params.yDomain).range([this.params.height, 0]);

		this.contentLayers = new _Set();

		this._dragLayer = new Konva.Layer({});

		this._commonShapeLayer = new Konva.FastLayer({});
		this._commonShapeLayer.addName('common-shape-layer');
		this._commonShapeLayer.layer = this;

		this._contextLayer = new Konva.Layer({});
		this._contextLayer.layer = this;
		this._contextLayer.addName('context-layer');

		this.setContextEditable(this._isContextEditable);

		this._contextShape = new _shapesSegment2['default']({});
		this._contextShape.install({
			opacity: function opacity() {
				return 1;
			},
			color: function color() {
				return _this.params.context.color;
			},
			width: function width() {
				return _this.timeContext.duration;
			},
			height: function height() {
				return _this._renderingContext.valueToPixel.domain()[1];
			},
			y: function y() {
				return _this._renderingContext.valueToPixel.domain()[0];
			},
			x: function x() {
				return _this.timeContext.start / _this.timeContext.stretchRatio;
			}
		});
		this._contextShape.params.handlerWidth = this.params.context.handlerWidth;
		this._contextShape.render(this._renderingContext);
		this._contextShape.layer = this;
		this._contextShape.isContextShape = true;
		for (var i = 0; i < this._contextShape.$el.length; i++) {
			this._contextLayer.add(this._contextShape.$el[i]);
		}

		this._stage = null;
	}

	_createClass(Layer, [{
		key: 'createContainer',
		value: function createContainer(stage) {
			this._stage = stage;

			this._stage.add(this._contextLayer);
			this._stage.add(this._commonShapeLayer);
			this._stage.add(this._dragLayer);
		}
	}, {
		key: '_destroy',
		value: function _destroy(it) {
			var entry = it.next();
			while (!entry.done) {
				var layer = entry.value;
				layer.destroy();
			}
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			this._contextShape.destroy();
			this._destroy(this._$datumToShape.values());
			this._destroy(this.contentLayers.values);
			this.contentLayers.clear();

			this._commonShapeLayer = null;
			this._contextLayer = null;
			this._contextShape = null;
			this._stage = null;
			this.params = null;
			this.timeContextBehavior = null;
			this._shapeConfiguration = null;
			this._commonShapeConfiguration = null;
			this._$datumToShape = null;
			this._$shapeToDatum = null;
			this._commonShape = null;
			this._renderingContext = null;
			this._isContextEditable = null;
			this._behavior = null;
		}

		/**
   * Allows to override default the `TimeContextBehavior` used to edit the layer.
   *
   * @param {Object} ctor
   */
	}, {
		key: 'setBehavior',

		/**
   * Register the behavior to use when interacting with a shape.
   *
   * @param {BaseBehavior} behavior
   */
		value: function setBehavior(behavior) {
			behavior.initialize(this);
			this._behavior = behavior;
		}

		/******************************************************************/
		/******************************************************************/
		/******************************************************************/
		/************************** SELECTION *****************************/
		/******************************************************************/
		/******************************************************************/
		/******************************************************************/

	}, {
		key: 'isSelected',
		value: function isSelected(datum) {
			return this._behavior._selectedDatums.has(datum);
		}
	}, {
		key: 'select',
		value: function select($datums) {
			var _this2 = this;

			if ($datums === undefined || $datums.length === undefined && $datums.size === undefined) $datums = this.data;

			var that = this;
			$datums.forEach(function (datum) {
				var shape = that._$datumToShape.get(datum);
				if (shape) {
					_this2._behavior.select(datum);
					_this2._toFront(datum);
					that.emit('select', datum);
				} else {
					throw new Error('No shape for this datum in this layer', { datum: datum, layer: that });
				}
			});
		}
	}, {
		key: 'unselect',
		value: function unselect($datums) {
			var _this3 = this;

			if ($datums === undefined || $datums.length === undefined && $datums.size === undefined) $datums = this.data;

			var that = this;
			$datums.forEach(function (datum) {
				var shape = that._$datumToShape.get(datum);
				if (shape) {
					_this3._behavior.unselect(datum);
					that.emit('unselect', datum);
				} else {
					throw new Error('No shape for this datum in this layer', { datum: datum, layer: that });
				}
			});
		}
	}, {
		key: '_toFront',
		value: function _toFront($datum) {
			var $shape = this._$datumToShape.get($datum);
			if ($shape) {
				if ($shape.$el instanceof Array || $shape.$el instanceof _Set) {
					$shape.$el.forEach(function (el) {
						return el.moveToTop();
					});
				} else {
					$shape.$el.moveToTop();
				}
			} else {
				throw new Error('No shape for this datum in this layer', { datum: datum, layer: that });
			}
		}
	}, {
		key: 'toDragLayer',
		value: function toDragLayer($datums) {
			var _this4 = this;

			var that = this;
			$datums.forEach(function ($datum) {
				var $shape = _this4._$datumToShape.get($datum);
				if (shape) {
					if ($shape.$el instanceof Array || $shape.$el instanceof _Set) {
						$shape.$el.forEach(function (el) {
							return that._dragLayer.add(el);
						});
					} else {
						_this4._dragLayer.add($shape.$el);
					}
				} else {
					throw new Error('No shape for this datum in this layer', { datum: datum, layer: that });
				}
			});
		}
	}, {
		key: 'toggleSelection',
		value: function toggleSelection($datums) {
			var _this5 = this;

			var that = this;
			$datums.forEach(function (datum) {
				var shape = that._$datumToShape.get(datum);
				if (shape) {
					_this5._behavior.toggleSelection(datum);
					that.emit('toggle-select', datum);
				} else {
					throw new Error('No shape for this datum in this layer', { datum: datum, layer: that });
				}
			});
		}

		/******************************************************************/
		/******************************************************************/
		/******************************************************************/
		/******************************************************************/
		/******************************************************************/
		/******************************************************************/
		/******************************************************************/

		/**
   * Sets the context of the layer, thus defining its `start`, `duration`,
   * `offset` and `stretchRatio`.
   *
   * @param {TimeContext} timeContext - The timeContext in which the layer is displayed.
   */
	}, {
		key: 'setTimeContext',
		value: function setTimeContext(timeContext) {
			this.timeContext = timeContext;
			// create a mixin to pass to the shapes
			this._renderingContext = {};
			this._updateRenderingContext();
		}

		/**
  * Register a shape and its configuration to use in order to render the data.
  *
  * @param {BaseShape} ctor - The constructor of the shape to be used.
  * @param {Object} [accessors={}] - Defines how the shape should adapt to a particular data struture.
  * @param {Object} [options={}] - Global configuration for the shapes, is specific to each `Shape`.
  */
	}, {
		key: 'configureShape',
		value: function configureShape(ctor, accessors, options) {
			if (!accessors) accessors = {};
			if (!options) options = {};
			this._shapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
		}

		/**
  * Optionnaly register a shape to be used accros the entire collection.
  *
  * @param {BaseShape} ctor - The constructor of the shape to be used.
  * @param {Object} [accessors={}] - Defines how the shape should adapt to a particular data struture.
  * @param {Object} [options={}] - Global configuration for the shapes, is specific to each `Shape`.
  */
	}, {
		key: 'configureCommonShape',
		value: function configureCommonShape(ctor, accessors, options) {
			var _this6 = this;

			if (!accessors) accessors = {};
			if (!options) options = {};
			this._commonShapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
			this._commonShape = new ctor(options);
			this._commonShape.install(accessors);
			this._commonShape.render(this._renderingContext);
			if (this._commonShape.$el instanceof Array || this._commonShape.$el instanceof _Set) {
				this._commonShape.$el.forEach(function (el) {
					return _this6._commonShapeLayer.add(el);
				});
			} else {
				this._commonShapeLayer.add(this._commonShape.$el);
			}
		}

		/**
  * Defines if the `Layer`, and thus the `LayerTimeContext` is editable or not.
  *
  * @params {Boolean} [bool=true]
  */
	}, {
		key: 'setContextEditable',
		value: function setContextEditable(editable) {
			if (editable === undefined) editable = true;
			// this._contextLayer.visible(editable);
			this._contextLayer.opacity(editable ? this.params.context.opacity : 0);
			this._contextLayer.listening(true);
			this._contextLayer.visible(true);
			this._isContextEditable = editable;
		}

		/**
  * Updates the values stored int the `_renderingContext` passed	to shapes
  * for rendering and updating.
  */
	}, {
		key: '_updateRenderingContext',
		value: function _updateRenderingContext() {

			this._renderingContext.timeToPixel = this.timeContext.timeToPixel;
			this._renderingContext.valueToPixel = this._valueToPixel;

			this._renderingContext.height = this.params.height;
			this._renderingContext.width = this.timeContext.timeToPixel(this.timeContext.duration);
			// for foreign object issue in chrome
			this._renderingContext.offsetX = this.timeContext.timeToPixel(this.timeContext.offset);
			this._renderingContext.startX = this.timeContext.parent.timeToPixel(this.timeContext.start);
			this._renderingContext.pixelsPerSecond = this.timeContext.parent.computedPixelsPerSecond;

			// @todo replace with `minX` and `maxX` representing the visible pixels in which
			// the shapes should be rendered, could allow to not update the DOM of shapes
			// who are not in this area.
			this._renderingContext.trackOffsetX = this.timeContext.parent.timeToPixel(this.timeContext.parent.offset);
			this._renderingContext.visibleWidth = this.timeContext.parent.visibleWidth;
		}

		// --------------------------------------
		// Helpers
		// --------------------------------------

	}, {
		key: 'getDatumFromShape',
		value: function getDatumFromShape($shape) {
			return this._$shapeToDatum.get($shape);
		}
	}, {
		key: 'getShapeFromDatum',
		value: function getShapeFromDatum($datum) {
			return this._$datumToShape.get($datum);
		}

		/**
  * Retrieve all the datums in a given area as defined in the registered `Shape~inArea` method.
  *
  * @param {Object} area - The area in which to find the elements
  * @param {Number} area.top
  * @param {Number} area.left
  * @param {Number} area.width
  * @param {Number} area.height
  * @return {Array} - list of the datums presents in the area
  */
	}, {
		key: 'getDatumsInArea',
		value: function getDatumsInArea(area) {
			var _this7 = this;

			var x1 = area.left;
			var y1 = area.top;
			var x2 = area.left + area.width;
			var y2 = area.top + area.height + this.params.top;

			var $filteredDatums = new _Set();

			var $entries = this._$datumToShape.entries();

			var that = this;

			this.contentLayers.forEach(function (contentLayer) {
				contentLayer.children.forEach(function (konvaShape) {
					var $shape = konvaShape.shape;
					var $datum = that.getDatumFromShape($shape);
					var inArea = $shape.inArea(_this7._renderingContext, $datum, x1, y1, x2, y2);

					if (inArea) {
						$filteredDatums.add($datum);
					}
				});
			});

			return $filteredDatums;
		}
	}, {
		key: 'update',
		value: function update($datums) {

			this.updateContainer();

			this.updateShapes($datums);
		}
	}, {
		key: 'sort_data',
		value: function sort_data(data) {
			throw new Error('The developer must assign a proper function');
		}
	}, {
		key: 'visible_data',
		value: function visible_data(timeContext, data) {
			throw new Error('The developer must assign a proper function');
		}
	}, {
		key: 'updateShapes',
		value: function updateShapes($datums) {
			var that = this;
			var changedContentLayers = new _Set();
			var targetData = null;
			var interval = null;
			var eraseChildren = true;

			if ($datums === undefined || this._commonShape) {
				interval = this.visible_data(this.timeContext, this.data);
			}

			if ($datums === undefined) {
				targetData = this.data.slice(interval[0], Math.min(interval[1] + 1, this.data.length));
			} else {
				targetData = $datums;
				eraseChildren = false;
			}

			this.allocateShapesToContentLayers(this._stage, targetData, 'datums', eraseChildren).forEach(function (changedContentLayer) {
				changedContentLayers.add(changedContentLayer);
			});

			// console.log('number of changedContentLayers : ' + changedContentLayers.size);

			changedContentLayers.forEach(function (changedContentLayer) {
				changedContentLayer.y(that.params.top).offsetX(-that._renderingContext.startX).x(that._renderingContext.offsetX).clip({
					x: -that._renderingContext.offsetX,
					y: 0,
					width: that._renderingContext.width,
					height: that._renderingContext.height
				});
				changedContentLayer.clear();
				changedContentLayer.batchDraw();
			});

			this._dragLayer.y(that.params.top).offsetX(-that._renderingContext.startX).x(that._renderingContext.offsetX).clip({
				x: -that._renderingContext.offsetX,
				y: 0,
				width: that._renderingContext.width,
				height: that._renderingContext.height
			}).clear().batchDraw();

			if (this._commonShape) {
				this._commonShape.update(this._renderingContext, that.data.slice(interval[0], interval[1] + 1));
				this._commonShapeLayer.y(that.params.top).offsetX(-that._renderingContext.startX).x(that._renderingContext.offsetX).clip({
					x: -that._renderingContext.offsetX,
					y: 0,
					width: that._renderingContext.width,
					height: that._renderingContext.height
				}).batchDraw();
			}

			this._contextShape.update(this._renderingContext, this.timeContext);

			this._contextLayer.y(that.params.top).batchDraw();
		}
	}, {
		key: 'updateContainer',
		value: function updateContainer() {
			var _this8 = this;

			this._updateRenderingContext();
			var that = this;

			this.contentLayers.forEach(function (contentLayer) {
				contentLayer.offsetX(-_this8._renderingContext.startX).x(_this8._renderingContext.offsetX).clip({
					x: -_this8._renderingContext.offsetX,
					y: 0,
					width: _this8._renderingContext.width,
					height: _this8._renderingContext.height
				});
			});
		}
	}, {
		key: 'allocateShapesToContentLayers',
		value: function allocateShapesToContentLayers(stage, objs, type, eraseChildren) {
			var LIMIT = Infinity; // TODO: make the LIMIT a dynamic variable, controlled by a user defined function.

			var changedContentLayers = new _Set();

			var konvaShapes = new _Set();

			/*
    * Of course one could write less code by including the type checking inside the forEach.
    * But that would mean a check for each object. This way, the program checks only one time.
    * This is meant to be a small optimization. Not pretty, of course.
    * Another thing: in order to use just one forEach at updateShapes, I included the shape update in here
    */
			var that = this;
			if (type == 'datums') {
				objs.forEach(function (datum) {
					var shape = that.getShapeFromDatum(datum);
					if (shape === undefined) {
						throw new Error('Unknown datum', { datum: datum, layer: that });
					}
					shape.update(that._renderingContext, datum);
					if (shape.$el instanceof Array || shape.$el instanceof _Set) {
						shape.$el.forEach(function (el) {
							return konvaShapes.add(el);
						});
					} else {
						konvaShapes.add(shape.$el);
					}
				});
			} else if (type == 'shapes') {
				objs.forEach(function (shape) {
					var datum = that.getDatumFromShape(shape);
					if (datum === undefined) {
						throw new Error('Unknown shape', { shape: shape, layer: that });
					}
					shape.update(that._renderingContext, datum);
					if (shape.$el instanceof Array || shape.$el instanceof _Set) {
						shape.$el.forEach(function (el) {
							return konvaShapes.add(el);
						});
					} else {
						konvaShapes.add(shape.$el);
					}
				});
			} else {
				throw new Error('Unknown objects type');
			}

			var ksIt = konvaShapes.entries();

			var clIt = this.contentLayers.entries();

			var cle = clIt.next();
			var kse = ksIt.next();

			var previousShape = null;

			while (!cle.done) {
				var layer = cle.value[1];
				while (!kse.done) {
					var konvaShape = kse.value[1];
					if (layer.children.length >= LIMIT && konvaShape.shape != previousShape) {
						break;
					}
					if (eraseChildren && !changedContentLayers.has(layer)) {
						layer.removeChildren();
					}
					konvaShape.remove();
					layer.add(konvaShape);
					kse = ksIt.next();
					changedContentLayers.add(layer);
				}
				cle = clIt.next();
			}

			while (!kse.done) {
				var layer = new Konva.Layer({});
				layer.layer = this;
				layer.addName('content-layer');
				layer.clearBeforeDraw(true);
				this.contentLayers.add(layer);
				stage.add(layer);
				while (!kse.done && layer.children.length < LIMIT) {
					var konvaShape = kse.value[1];
					konvaShape.remove();
					layer.add(konvaShape);
					kse = ksIt.next();
				}
				changedContentLayers.add(layer);
			}

			return changedContentLayers;
		}
	}, {
		key: 'set',
		value: function set(data) {
			var _this9 = this;

			var that = this;

			this.data.forEach(function (datum) {
				var shape = _this9._$datumToShape.get(datum);
				shape.destroy();
			});
			this._$datumToShape.clear();
			this._$shapeToDatum.clear();

			this.contentLayers.forEach(function (layer) {
				layer.destroy();
			});

			this.data = data;

			this.data.forEach(function (datum) {
				that._add(datum);
			});

			this.sort_data(this.data);

			this.emit('set', data);
		}
	}, {
		key: '_add',
		value: function _add(datum) {
			var ctor = this._shapeConfiguration.ctor;
			var accessors = this._shapeConfiguration.accessors;
			var options = this._shapeConfiguration.options;

			var shape = new ctor(options);
			shape.install(accessors);
			shape.render(this._renderingContext);
			shape.layer = this;
			shape.datum = datum;
			this._$datumToShape.set(datum, shape);
			this._$shapeToDatum.set(shape, datum);
		}
	}, {
		key: 'add',
		value: function add(datum) {
			this._add(datum);
			this.data[this.data.length] = datum;
			this.sort_data(this.data);

			this.emit('add', datum);
		}
	}, {
		key: 'remove',
		value: function remove(datum) {
			var _this10 = this;

			var shape = this._$datumToShape.get(datum);
			if (shape) {
				(function () {
					var changedContentLayers = new _Set();
					if (shape.$el instanceof Array || shape.$el instanceof _Set) {
						shape.$el.forEach(function (el) {
							return changedContentLayers.add(el);
						});
					} else {
						changedContentLayers.add(shape.$el);
					}
					shape.layer = null;
					shape.destroy();
					_this10._$datumToShape['delete'](datum);
					_this10._$shapeToDatum['delete'](shape);

					changedContentLayers.forEach(function (layer) {
						if (layer.children === 0) {
							layer.destroy();
							_this10.contentLayers['delete'](layer);
						}
					});
				})();
			}

			this.data.splice(this.data.indexOf(datum), 1);

			this.emit('remove', datum);
		}

		/******************************************************************/
		/******************************************************************/
		/******************************************************************/
		/*************************** EDITION ******************************/
		/******************************************************************/
		/******************************************************************/
		/******************************************************************/

		/**
   * Edit datum(s) according to the `edit` defined in the registered `Behavior`.
   *
   * @param {Object[]} $datums - The datum(s) to edit.
   * @param {Number} dx - The modification to apply in the x axis (in pixels).
   * @param {Number} dy - The modification to apply in the y axis (in pixels).
   * @param {Element} $target - The target of the interaction (for example, left
   *    handler DOM element in a segment).
   */
	}, {
		key: 'edit',
		value: function edit($datums, dx, dy, $target) {
			var _this11 = this;

			var that = this;
			$datums.forEach(function (datum) {
				var shape = that._$datumToShape.get(datum);

				_this11._behavior.edit(_this11._renderingContext, shape, datum, dx, dy, $target);
			});
			this.emit('edit', $datums);
		}

		/**
  * Edit the layer and thus its related `LayerTimeContext` attributes.
  *
  * @param {Number} dx - The modification to apply in the x axis (in pixels).
  * @param {Number} dy - The modification to apply in the y axis (in pixels).
  * @param {Element} $target - The target of the event of the interaction.
  */
	}, {
		key: 'editContext',
		value: function editContext(dx, dy, $target) {
			// TODO
			this.timeContextBehavior.edit(this, dx, dy, $target);
			this.emit('edit-context');
		}

		/**
  * Stretch the layer and thus its related `LayerTimeContext` attributes.
  *
  * @param {Number} dx - The modification to apply in the x axis (in pixels).
  * @param {Number} dy - The modification to apply in the y axis (in pixels).
  * @param {Element} $target - The target of the event of the interaction.
  */
	}, {
		key: 'stretchContext',
		value: function stretchContext(dx, dy, $target) {
			// TODO
			this.timeContextBehavior.stretch(this, dx, dy, $target);
			this.emit('stretch-context');
		}
	}, {
		key: 'minimize',
		value: function minimize() {
			// TODO
		}
	}, {
		key: 'visible',
		get: function get() {
			return this._dragLayer.visible();
		},
		set: function set(value) {
			this._contextLayer.visible(value);
			this._commonShapeLayer.visible(value);
			this._dragLayer.visible(value);
			this.contentLayer.forEach(function (l) {
				return l.visible(value);
			});
		}
	}, {
		key: 'zIndex',
		get: function get() {
			return this._contextLayer.getZIndex();
		}
	}, {
		key: 'start',

		/**
   * Returns `LayerTimeContext`'s `start` time domain value.
   *
   * @type {Number}
   */
		get: function get() {
			return this.timeContext.start;
		},

		/**
   * Sets `LayerTimeContext`'s `start` time domain value.
   *
   * @type {Number}
   */
		set: function set(value) {
			this.timeContext.start = value;
		}

		/**
   * Returns `LayerTimeContext`'s `offset` time domain value.
   *
   * @type {Number}
   */
	}, {
		key: 'offset',
		get: function get() {
			return this.timeContext.offset;
		},

		/**
   * Sets `LayerTimeContext`'s `offset` time domain value.
   *
   * @type {Number}
   */
		set: function set(value) {
			this.timeContext.offset = value;
		}

		/**
   * Returns `LayerTimeContext`'s `duration` time domain value.
   *
   * @type {Number}
   */
	}, {
		key: 'duration',
		get: function get() {
			return this.timeContext.duration;
		},

		/**
   * Sets `LayerTimeContext`'s `duration` time domain value.
   *
   * @type {Number}
   */
		set: function set(value) {
			this.timeContext.duration = value;
		}

		/**
   * Returns `LayerTimeContext`'s `stretchRatio` time domain value.
   *
   * @type {Number}
   */
	}, {
		key: 'stretchRatio',
		get: function get() {
			return this.timeContext.stretchRatio;
		},

		/**
   * Sets `LayerTimeContext`'s `stretchRatio` time domain value.
   *
   * @type {Number}
   */
		set: function set(value) {
			this.timeContext.stretchRatio = value;
		}

		/**
   * Set the domain boundaries of the data for the y axis.
   *
   * @type {Array}
   */
	}, {
		key: 'yDomain',
		set: function set(domain) {
			this.params.yDomain = domain;
			this._valueToPixel.domain(domain);
		},

		/**
   * Returns the domain boundaries of the data for the y axis.
   *
   * @type {Array}
   */
		get: function get() {
			return this.params.yDomain;
		}

		/**
   * Sets the opacity of the whole layer.
   *
   * @type {Number}
   */
	}, {
		key: 'opacity',
		set: function set(value) {
			this.params.opacity = value;
		},

		/**
   * Returns the opacity of the whole layer.
   *
   * @type {Number}
   */
		get: function get() {
			return this.params.opacity;
		}

		/**
   * Returns the transfert function used to display the data in the x axis.
   *
   * @type {Number}
   */
	}, {
		key: 'timeToPixel',
		get: function get() {
			return this.timeContext.timeToPixel;
		}

		/**
   * Returns the transfert function used to display the data in the y axis.
   *
   * @type {Number}
   */
	}, {
		key: 'valueToPixel',
		get: function get() {
			return this._valueToPixel;
		}
	}, {
		key: 'selectedDatums',
		get: function get() {
			return this._behavior ? this._behavior.selectedDatums : new _Set();
		}
	}], [{
		key: 'configureTimeContextBehavior',
		value: function configureTimeContextBehavior(ctor) {
			timeContextBehaviorCtor = ctor;
		}
	}]);

	return Layer;
})(_events2['default'].EventEmitter);

exports['default'] = Layer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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O0FBQ25CLE9BQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUM3QixPQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUNsQzs7Ozs7OztPQU9VLGVBQUc7QUFDYixVQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0dBQzNCOzs7Ozs7Ozs7T0FPVSxhQUFDLEtBQUssRUFBRTtBQUNsQixPQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7R0FDNUI7Ozs7Ozs7T0FPVSxlQUFHO0FBQ2IsVUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztHQUMzQjs7Ozs7Ozs7O09BT2MsZUFBRztBQUNqQixVQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDO0dBQ3BDOzs7Ozs7Ozs7T0FPZSxlQUFHO0FBQ2xCLFVBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztHQUMxQjs7O09BMkJpQixlQUFHO0FBQ3BCLFVBQU8sSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsR0FBRyxVQUFTLENBQUM7R0FDbEU7OztTQTlKa0Msc0NBQUMsSUFBSSxFQUFFO0FBQ3pDLDBCQUF1QixHQUFHLElBQUksQ0FBQztHQUMvQjs7O1FBbEptQixLQUFLO0dBQVMsb0JBQU8sWUFBWTs7cUJBQWpDLEtBQUsiLCJmaWxlIjoic3JjL2NvcmUvbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgc2NhbGVzIGZyb20gJy4uL3V0aWxzL3NjYWxlcyc7XG5pbXBvcnQgU2VnbWVudCBmcm9tICcuLi9zaGFwZXMvc2VnbWVudCc7XG5pbXBvcnQgVGltZUNvbnRleHRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvdGltZS1jb250ZXh0LWJlaGF2aW9yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXIgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcblxuXHRjb25zdHJ1Y3RvcihkYXRhVHlwZSwgZGF0YSwgb3B0aW9ucykge1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLmRhdGFUeXBlID0gZGF0YVR5cGU7XG5cblx0XHRpZiAoIW9wdGlvbnMpIFxuXHRcdFx0b3B0aW9ucyA9IHt9O1xuXG5cdFx0Y29uc3QgZGVmYXVsdHMgPSB7XG5cdFx0XHRoZWlnaHQ6IDEwMCxcblx0XHRcdHRvcDogMCxcblx0XHRcdG9wYWNpdHk6IDEsXG5cdFx0XHR5RG9tYWluOiBbMCwgMV0sXG5cdFx0XHRjbGFzc05hbWU6IG51bGwsIC8vIFRPRE9cblx0XHRcdHNlbGVjdGVkQ2xhc3NOYW1lOiAnc2VsZWN0ZWQnLFxuXHRcdFx0Y29udGV4dDoge1xuXHRcdFx0XHRoYW5kbGVyV2lkdGg6IDEwLFxuXHRcdFx0XHRoYW5kbGVyT3BhY2l0eTogMC4yLFxuXHRcdFx0XHRvcGFjaXR5OiAwLjUsIFxuXHRcdFx0XHRjb2xvcjogJyM3ODc4NzgnLFxuXHRcdFx0fSwgXG5cdFx0XHRoaXR0YWJsZTogdHJ1ZSwgLy8gd2hlbiBmYWxzZSB0aGUgbGF5ZXIgaXMgbm90IHJldHVybmVkIGJ5IGBCYXNlU3RhdGUuZ2V0SGl0TGF5ZXJzYFxuXHRcdH07XG5cblx0XHR0aGlzLl9iZWhhdmlvciA9IG51bGw7XG5cblx0XHQvKipcblx0XHQqIFBhcmFtZXRlcnMgb2YgdGhlIGxheWVycywgYGRlZmF1bHRzYCBvdmVycmlkZWQgd2l0aCBvcHRpb25zLlxuXHRcdCogQHR5cGUge09iamVjdH1cblx0XHQqL1xuXHRcdHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXHRcdHRoaXMudGltZUNvbnRleHRCZWhhdmlvciA9IG5ldyBUaW1lQ29udGV4dEJlaGF2aW9yKCk7XG5cblx0XHR0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSBudWxsO1x0XHRcdCAvLyB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9XG5cdFx0dGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuXHRcdHRoaXMuXyRkYXR1bVRvU2hhcGUgPSBuZXcgTWFwKCk7XG5cdFx0dGhpcy5fJHNoYXBlVG9EYXR1bSA9IG5ldyBNYXAoKTtcblx0XHR0aGlzLl9jb21tb25TaGFwZSA9IG51bGw7XG5cdFx0dGhpcy5fcmVuZGVyaW5nQ29udGV4dCA9IHt9O1xuXHRcdHRoaXMuZGF0YSA9IFtdO1xuXG5cdFx0dGhpcy5faXNDb250ZXh0RWRpdGFibGUgPSBmYWxzZTtcblxuXHRcdHRoaXMuX3ZhbHVlVG9QaXhlbCA9IHNjYWxlcy5saW5lYXIoKVxuXHRcdFx0LmRvbWFpbih0aGlzLnBhcmFtcy55RG9tYWluKVxuXHRcdFx0LnJhbmdlKFt0aGlzLnBhcmFtcy5oZWlnaHQsIDBdKTtcblxuXHRcdHRoaXMuY29udGVudExheWVycyA9IG5ldyBTZXQoKTtcblxuXHRcdHRoaXMuX2RyYWdMYXllciA9IG5ldyBLb252YS5MYXllcih7fSk7XG5cblx0XHR0aGlzLl9jb21tb25TaGFwZUxheWVyID0gbmV3IEtvbnZhLkZhc3RMYXllcih7fSk7XG5cdFx0dGhpcy5fY29tbW9uU2hhcGVMYXllci5hZGROYW1lKCdjb21tb24tc2hhcGUtbGF5ZXInKTtcblx0XHR0aGlzLl9jb21tb25TaGFwZUxheWVyLmxheWVyID0gdGhpcztcblxuXHRcdHRoaXMuX2NvbnRleHRMYXllciA9IG5ldyBLb252YS5MYXllcih7fSk7XG5cdFx0dGhpcy5fY29udGV4dExheWVyLmxheWVyID0gdGhpcztcblx0XHR0aGlzLl9jb250ZXh0TGF5ZXIuYWRkTmFtZSgnY29udGV4dC1sYXllcicpO1xuXG5cdFx0dGhpcy5zZXRDb250ZXh0RWRpdGFibGUodGhpcy5faXNDb250ZXh0RWRpdGFibGUpO1xuXHRcdFxuXHRcdHRoaXMuX2NvbnRleHRTaGFwZSA9IG5ldyBTZWdtZW50KHt9KTtcblx0XHR0aGlzLl9jb250ZXh0U2hhcGUuaW5zdGFsbCh7XG5cdFx0XHRvcGFjaXR5XHQ6ICgpID0+IDEsIFxuXHRcdFx0Y29sb3JcdDogKCkgPT4gdGhpcy5wYXJhbXMuY29udGV4dC5jb2xvciwgXG5cdFx0XHR3aWR0aFx0OiAoKSA9PiB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uLFxuXHRcdFx0aGVpZ2h0XHQ6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmRvbWFpbigpWzFdLFxuXHRcdFx0eVx0XHQ6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmRvbWFpbigpWzBdLFxuXHRcdFx0eFx0XHQ6ICgpID0+IHRoaXMudGltZUNvbnRleHQuc3RhcnQgLyB0aGlzLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpb1xuXHRcdH0pOyBcblx0XHR0aGlzLl9jb250ZXh0U2hhcGUucGFyYW1zLmhhbmRsZXJXaWR0aCA9IHRoaXMucGFyYW1zLmNvbnRleHQuaGFuZGxlcldpZHRoO1xuXHRcdHRoaXMuX2NvbnRleHRTaGFwZS5yZW5kZXIodGhpcy5fcmVuZGVyaW5nQ29udGV4dCk7XG5cdFx0dGhpcy5fY29udGV4dFNoYXBlLmxheWVyID0gdGhpcztcblx0XHR0aGlzLl9jb250ZXh0U2hhcGUuaXNDb250ZXh0U2hhcGUgPSB0cnVlO1xuXHRcdGZvciAodmFyIGk9MDsgaTx0aGlzLl9jb250ZXh0U2hhcGUuJGVsLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0aGlzLl9jb250ZXh0TGF5ZXIuYWRkKHRoaXMuX2NvbnRleHRTaGFwZS4kZWxbaV0pO1xuXHRcdH1cblxuXHRcdHRoaXMuX3N0YWdlID0gbnVsbDtcblx0fVxuXG5cdGdldCB2aXNpYmxlKCkge1xuXHRcdHJldHVybiB0aGlzLl9kcmFnTGF5ZXIudmlzaWJsZSgpO1xuXHR9XG5cblx0c2V0IHZpc2libGUodmFsdWUpIHtcblx0XHR0aGlzLl9jb250ZXh0TGF5ZXIudmlzaWJsZSh2YWx1ZSk7XG5cdFx0dGhpcy5fY29tbW9uU2hhcGVMYXllci52aXNpYmxlKHZhbHVlKTtcblx0XHR0aGlzLl9kcmFnTGF5ZXIudmlzaWJsZSh2YWx1ZSk7XG5cdFx0dGhpcy5jb250ZW50TGF5ZXIuZm9yRWFjaCgobCkgPT4gbC52aXNpYmxlKHZhbHVlKSk7XG5cdH1cblxuXHRnZXQgekluZGV4KCkge1xuXHRcdHJldHVybiB0aGlzLl9jb250ZXh0TGF5ZXIuZ2V0WkluZGV4KCk7XG5cdH1cblxuXHRjcmVhdGVDb250YWluZXIoc3RhZ2UpIHtcblx0XHR0aGlzLl9zdGFnZSA9IHN0YWdlO1xuXG5cdFx0dGhpcy5fc3RhZ2UuYWRkKHRoaXMuX2NvbnRleHRMYXllcik7XG5cdFx0dGhpcy5fc3RhZ2UuYWRkKHRoaXMuX2NvbW1vblNoYXBlTGF5ZXIpO1xuXHRcdHRoaXMuX3N0YWdlLmFkZCh0aGlzLl9kcmFnTGF5ZXIpO1xuXHR9XG5cblxuXHRfZGVzdHJveShpdCkge1xuXHRcdHZhciBlbnRyeSA9IGl0Lm5leHQoKTtcblx0XHR3aGlsZSAoIWVudHJ5LmRvbmUpIHtcblx0XHRcdHZhciBsYXllciA9IGVudHJ5LnZhbHVlO1xuXHRcdFx0bGF5ZXIuZGVzdHJveSgpO1xuXHRcdH1cblx0fVxuXG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy5fY29udGV4dFNoYXBlLmRlc3Ryb3koKTtcblx0XHR0aGlzLl9kZXN0cm95KHRoaXMuXyRkYXR1bVRvU2hhcGUudmFsdWVzKCkpO1xuXHRcdHRoaXMuX2Rlc3Ryb3kodGhpcy5jb250ZW50TGF5ZXJzLnZhbHVlcyk7XG5cdFx0dGhpcy5jb250ZW50TGF5ZXJzLmNsZWFyKCk7XG5cblx0XHR0aGlzLl9jb21tb25TaGFwZUxheWVyID0gbnVsbDtcblx0XHR0aGlzLl9jb250ZXh0TGF5ZXIgPSBudWxsO1xuXHRcdHRoaXMuX2NvbnRleHRTaGFwZSA9IG51bGw7XG5cdFx0dGhpcy5fc3RhZ2UgPSBudWxsO1xuXHRcdHRoaXMucGFyYW1zID0gbnVsbDtcblx0XHR0aGlzLnRpbWVDb250ZXh0QmVoYXZpb3IgPSBudWxsO1xuXHRcdHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7XG5cdFx0dGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDtcblx0XHR0aGlzLl8kZGF0dW1Ub1NoYXBlID0gbnVsbDtcblx0XHR0aGlzLl8kc2hhcGVUb0RhdHVtID0gbnVsbDtcblx0XHR0aGlzLl9jb21tb25TaGFwZSA9IG51bGw7XG5cdFx0dGhpcy5fcmVuZGVyaW5nQ29udGV4dCA9IG51bGw7XG5cdFx0dGhpcy5faXNDb250ZXh0RWRpdGFibGUgPSBudWxsO1xuXHRcdHRoaXMuX2JlaGF2aW9yID0gbnVsbDtcblx0fVxuXG5cblxuXHQvKipcblx0ICogQWxsb3dzIHRvIG92ZXJyaWRlIGRlZmF1bHQgdGhlIGBUaW1lQ29udGV4dEJlaGF2aW9yYCB1c2VkIHRvIGVkaXQgdGhlIGxheWVyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gY3RvclxuXHQgKi9cblx0c3RhdGljIGNvbmZpZ3VyZVRpbWVDb250ZXh0QmVoYXZpb3IoY3Rvcikge1xuXHRcdHRpbWVDb250ZXh0QmVoYXZpb3JDdG9yID0gY3Rvcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGBMYXllclRpbWVDb250ZXh0YCdzIGBzdGFydGAgdGltZSBkb21haW4gdmFsdWUuXG5cdCAqXG5cdCAqIEB0eXBlIHtOdW1iZXJ9XG5cdCAqL1xuXHRnZXQgc3RhcnQoKSB7XG5cdFx0cmV0dXJuIHRoaXMudGltZUNvbnRleHQuc3RhcnQ7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgc3RhcnRgIHRpbWUgZG9tYWluIHZhbHVlLlxuXHQgKlxuXHQgKiBAdHlwZSB7TnVtYmVyfVxuXHQgKi9cblx0c2V0IHN0YXJ0KHZhbHVlKSB7XG5cdFx0dGhpcy50aW1lQ29udGV4dC5zdGFydCA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYExheWVyVGltZUNvbnRleHRgJ3MgYG9mZnNldGAgdGltZSBkb21haW4gdmFsdWUuXG5cdCAqXG5cdCAqIEB0eXBlIHtOdW1iZXJ9XG5cdCAqL1xuXHRnZXQgb2Zmc2V0KCkge1xuXHRcdHJldHVybiB0aGlzLnRpbWVDb250ZXh0Lm9mZnNldDtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIGBMYXllclRpbWVDb250ZXh0YCdzIGBvZmZzZXRgIHRpbWUgZG9tYWluIHZhbHVlLlxuXHQgKlxuXHQgKiBAdHlwZSB7TnVtYmVyfVxuXHQgKi9cblx0c2V0IG9mZnNldCh2YWx1ZSkge1xuXHRcdHRoaXMudGltZUNvbnRleHQub2Zmc2V0ID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgZHVyYXRpb25gIHRpbWUgZG9tYWluIHZhbHVlLlxuXHQgKlxuXHQgKiBAdHlwZSB7TnVtYmVyfVxuXHQgKi9cblx0Z2V0IGR1cmF0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgYExheWVyVGltZUNvbnRleHRgJ3MgYGR1cmF0aW9uYCB0aW1lIGRvbWFpbiB2YWx1ZS5cblx0ICpcblx0ICogQHR5cGUge051bWJlcn1cblx0ICovXG5cdHNldCBkdXJhdGlvbih2YWx1ZSkge1xuXHRcdHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24gPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGBMYXllclRpbWVDb250ZXh0YCdzIGBzdHJldGNoUmF0aW9gIHRpbWUgZG9tYWluIHZhbHVlLlxuXHQgKlxuXHQgKiBAdHlwZSB7TnVtYmVyfVxuXHQgKi9cblx0Z2V0IHN0cmV0Y2hSYXRpbygpIHtcblx0XHRyZXR1cm4gdGhpcy50aW1lQ29udGV4dC5zdHJldGNoUmF0aW87XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgc3RyZXRjaFJhdGlvYCB0aW1lIGRvbWFpbiB2YWx1ZS5cblx0ICpcblx0ICogQHR5cGUge051bWJlcn1cblx0ICovXG5cdHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHtcblx0XHR0aGlzLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgZG9tYWluIGJvdW5kYXJpZXMgb2YgdGhlIGRhdGEgZm9yIHRoZSB5IGF4aXMuXG5cdCAqXG5cdCAqIEB0eXBlIHtBcnJheX1cblx0ICovXG5cdHNldCB5RG9tYWluKGRvbWFpbikge1xuXHRcdHRoaXMucGFyYW1zLnlEb21haW4gPSBkb21haW47XG5cdFx0dGhpcy5fdmFsdWVUb1BpeGVsLmRvbWFpbihkb21haW4pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGRvbWFpbiBib3VuZGFyaWVzIG9mIHRoZSBkYXRhIGZvciB0aGUgeSBheGlzLlxuXHQgKlxuXHQgKiBAdHlwZSB7QXJyYXl9XG5cdCAqL1xuXHRnZXQgeURvbWFpbigpIHtcblx0XHRyZXR1cm4gdGhpcy5wYXJhbXMueURvbWFpbjtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBvcGFjaXR5IG9mIHRoZSB3aG9sZSBsYXllci5cblx0ICpcblx0ICogQHR5cGUge051bWJlcn1cblx0ICovXG5cdHNldCBvcGFjaXR5KHZhbHVlKSB7XG5cdFx0dGhpcy5wYXJhbXMub3BhY2l0eSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIG9wYWNpdHkgb2YgdGhlIHdob2xlIGxheWVyLlxuXHQgKlxuXHQgKiBAdHlwZSB7TnVtYmVyfVxuXHQgKi9cblx0Z2V0IG9wYWNpdHkoKSB7XG5cdFx0cmV0dXJuIHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgdHJhbnNmZXJ0IGZ1bmN0aW9uIHVzZWQgdG8gZGlzcGxheSB0aGUgZGF0YSBpbiB0aGUgeCBheGlzLlxuXHQgKlxuXHQgKiBAdHlwZSB7TnVtYmVyfVxuXHQgKi9cblx0Z2V0IHRpbWVUb1BpeGVsKCkge1xuXHRcdHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHRyYW5zZmVydCBmdW5jdGlvbiB1c2VkIHRvIGRpc3BsYXkgdGhlIGRhdGEgaW4gdGhlIHkgYXhpcy5cblx0ICpcblx0ICogQHR5cGUge051bWJlcn1cblx0ICovXG5cdGdldCB2YWx1ZVRvUGl4ZWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3ZhbHVlVG9QaXhlbDtcblx0fVxuXG5cblxuXG5cblxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlciB0aGUgYmVoYXZpb3IgdG8gdXNlIHdoZW4gaW50ZXJhY3Rpbmcgd2l0aCBhIHNoYXBlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Jhc2VCZWhhdmlvcn0gYmVoYXZpb3Jcblx0ICovXG5cdHNldEJlaGF2aW9yKGJlaGF2aW9yKSB7XG5cdFx0YmVoYXZpb3IuaW5pdGlhbGl6ZSh0aGlzKTtcblx0XHR0aGlzLl9iZWhhdmlvciA9IGJlaGF2aW9yO1xuXHR9XG5cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqIFNFTEVDVElPTiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcblx0Z2V0IHNlbGVjdGVkRGF0dW1zKCkge1xuXHRcdHJldHVybiB0aGlzLl9iZWhhdmlvciA/IHRoaXMuX2JlaGF2aW9yLnNlbGVjdGVkRGF0dW1zIDogbmV3IFNldCgpO1xuXHR9XG5cblx0aXNTZWxlY3RlZChkYXR1bSkge1xuXHRcdHJldHVybiB0aGlzLl9iZWhhdmlvci5fc2VsZWN0ZWREYXR1bXMuaGFzKGRhdHVtKTtcblx0fVxuXG5cdHNlbGVjdCgkZGF0dW1zKSB7XG5cdFx0aWYgKCRkYXR1bXMgPT09IHVuZGVmaW5lZCB8fCAoJGRhdHVtcy5sZW5ndGggPT09IHVuZGVmaW5lZCAmJiAkZGF0dW1zLnNpemUgPT09IHVuZGVmaW5lZCkpXG5cdFx0XHQkZGF0dW1zID0gdGhpcy5kYXRhO1xuXG5cdFx0Y29uc3QgdGhhdCA9IHRoaXM7XG5cdFx0JGRhdHVtcy5mb3JFYWNoKChkYXR1bSkgPT4ge1xuXHRcdFx0Y29uc3Qgc2hhcGUgPSB0aGF0Ll8kZGF0dW1Ub1NoYXBlLmdldChkYXR1bSk7XG5cdFx0XHRpZiAoc2hhcGUpIHtcblx0XHRcdFx0dGhpcy5fYmVoYXZpb3Iuc2VsZWN0KGRhdHVtKTtcblx0XHRcdFx0dGhpcy5fdG9Gcm9udChkYXR1bSk7XG5cdFx0XHRcdHRoYXQuZW1pdCgnc2VsZWN0JywgZGF0dW0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdObyBzaGFwZSBmb3IgdGhpcyBkYXR1bSBpbiB0aGlzIGxheWVyJywgeyBkYXR1bTogZGF0dW0sIGxheWVyOiB0aGF0IH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0dW5zZWxlY3QoJGRhdHVtcykge1xuXHRcdGlmICgkZGF0dW1zID09PSB1bmRlZmluZWQgfHwgKCRkYXR1bXMubGVuZ3RoID09PSB1bmRlZmluZWQgJiYgJGRhdHVtcy5zaXplID09PSB1bmRlZmluZWQpKVxuXHRcdFx0JGRhdHVtcyA9IHRoaXMuZGF0YTtcblx0XHRcblx0XHRjb25zdCB0aGF0ID0gdGhpcztcblx0XHQkZGF0dW1zLmZvckVhY2goKGRhdHVtKSA9PiB7XG5cdFx0XHRjb25zdCBzaGFwZSA9IHRoYXQuXyRkYXR1bVRvU2hhcGUuZ2V0KGRhdHVtKTtcblx0XHRcdGlmIChzaGFwZSkge1xuXHRcdFx0XHR0aGlzLl9iZWhhdmlvci51bnNlbGVjdChkYXR1bSk7XG5cdFx0XHRcdHRoYXQuZW1pdCgndW5zZWxlY3QnLCBkYXR1bSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ05vIHNoYXBlIGZvciB0aGlzIGRhdHVtIGluIHRoaXMgbGF5ZXInLCB7IGRhdHVtOiBkYXR1bSwgbGF5ZXI6IHRoYXQgfSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRfdG9Gcm9udCgkZGF0dW0pIHtcblx0XHRjb25zdCAkc2hhcGUgPSB0aGlzLl8kZGF0dW1Ub1NoYXBlLmdldCgkZGF0dW0pO1xuXHRcdGlmICgkc2hhcGUpIHtcblx0XHRcdGlmICgkc2hhcGUuJGVsIGluc3RhbmNlb2YgQXJyYXkgfHwgJHNoYXBlLiRlbCBpbnN0YW5jZW9mIFNldCkge1xuXHRcdFx0XHQkc2hhcGUuJGVsLmZvckVhY2goKGVsKSA9PiBlbC5tb3ZlVG9Ub3AoKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2hhcGUuJGVsLm1vdmVUb1RvcCgpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ05vIHNoYXBlIGZvciB0aGlzIGRhdHVtIGluIHRoaXMgbGF5ZXInLCB7IGRhdHVtOiBkYXR1bSwgbGF5ZXI6IHRoYXQgfSk7XG5cdFx0fVxuXHR9XG5cblx0dG9EcmFnTGF5ZXIoJGRhdHVtcykge1xuXHRcdGNvbnN0IHRoYXQgPSB0aGlzO1xuXHRcdCRkYXR1bXMuZm9yRWFjaCgoJGRhdHVtKSA9PiB7XG5cdFx0XHRjb25zdCAkc2hhcGUgPSB0aGlzLl8kZGF0dW1Ub1NoYXBlLmdldCgkZGF0dW0pO1xuXHRcdFx0aWYgKHNoYXBlKSB7XG5cdFx0XHRcdGlmICgkc2hhcGUuJGVsIGluc3RhbmNlb2YgQXJyYXkgfHwgJHNoYXBlLiRlbCBpbnN0YW5jZW9mIFNldCkge1xuXHRcdFx0XHRcdCRzaGFwZS4kZWwuZm9yRWFjaCgoZWwpID0+IHRoYXQuX2RyYWdMYXllci5hZGQoZWwpKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9kcmFnTGF5ZXIuYWRkKCRzaGFwZS4kZWwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ05vIHNoYXBlIGZvciB0aGlzIGRhdHVtIGluIHRoaXMgbGF5ZXInLCB7IGRhdHVtOiBkYXR1bSwgbGF5ZXI6IHRoYXQgfSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXG5cdFxuXHR0b2dnbGVTZWxlY3Rpb24oJGRhdHVtcykge1xuXHRcdGNvbnN0IHRoYXQgPSB0aGlzO1xuXHRcdCRkYXR1bXMuZm9yRWFjaCgoZGF0dW0pID0+IHtcblx0XHRcdGNvbnN0IHNoYXBlID0gdGhhdC5fJGRhdHVtVG9TaGFwZS5nZXQoZGF0dW0pO1xuXHRcdFx0aWYgKHNoYXBlKSB7XG5cdFx0XHRcdHRoaXMuX2JlaGF2aW9yLnRvZ2dsZVNlbGVjdGlvbihkYXR1bSk7XG5cdFx0XHRcdHRoYXQuZW1pdCgndG9nZ2xlLXNlbGVjdCcsIGRhdHVtKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignTm8gc2hhcGUgZm9yIHRoaXMgZGF0dW0gaW4gdGhpcyBsYXllcicsIHsgZGF0dW06IGRhdHVtLCBsYXllcjogdGhhdCB9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0XG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBjb250ZXh0IG9mIHRoZSBsYXllciwgdGh1cyBkZWZpbmluZyBpdHMgYHN0YXJ0YCwgYGR1cmF0aW9uYCxcblx0ICogYG9mZnNldGAgYW5kIGBzdHJldGNoUmF0aW9gLlxuXHQgKlxuXHQgKiBAcGFyYW0ge1RpbWVDb250ZXh0fSB0aW1lQ29udGV4dCAtIFRoZSB0aW1lQ29udGV4dCBpbiB3aGljaCB0aGUgbGF5ZXIgaXMgZGlzcGxheWVkLlxuXHQgKi9cblx0c2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpIHtcblx0XHR0aGlzLnRpbWVDb250ZXh0ID0gdGltZUNvbnRleHQ7XG5cdFx0Ly8gY3JlYXRlIGEgbWl4aW4gdG8gcGFzcyB0byB0aGUgc2hhcGVzXG5cdFx0dGhpcy5fcmVuZGVyaW5nQ29udGV4dCA9IHt9O1xuXHRcdHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblx0fVxuXG5cdC8qKlxuXHQqIFJlZ2lzdGVyIGEgc2hhcGUgYW5kIGl0cyBjb25maWd1cmF0aW9uIHRvIHVzZSBpbiBvcmRlciB0byByZW5kZXIgdGhlIGRhdGEuXG5cdCpcblx0KiBAcGFyYW0ge0Jhc2VTaGFwZX0gY3RvciAtIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gYmUgdXNlZC5cblx0KiBAcGFyYW0ge09iamVjdH0gW2FjY2Vzc29ycz17fV0gLSBEZWZpbmVzIGhvdyB0aGUgc2hhcGUgc2hvdWxkIGFkYXB0IHRvIGEgcGFydGljdWxhciBkYXRhIHN0cnV0dXJlLlxuXHQqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBHbG9iYWwgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNoYXBlcywgaXMgc3BlY2lmaWMgdG8gZWFjaCBgU2hhcGVgLlxuXHQqL1xuXHRjb25maWd1cmVTaGFwZShjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMpIHtcblx0XHRpZiAoIWFjY2Vzc29ycykgXG5cdFx0XHRhY2Nlc3NvcnMgPSB7fTtcblx0XHRpZiAoIW9wdGlvbnMpIFxuXHRcdFx0b3B0aW9ucyA9IHt9O1xuXHRcdHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvcjogY3RvciwgYWNjZXNzb3JzOiBhY2Nlc3NvcnMsIG9wdGlvbnM6IG9wdGlvbnMgfTtcblx0fVxuXG5cdC8qKlxuXHQqIE9wdGlvbm5hbHkgcmVnaXN0ZXIgYSBzaGFwZSB0byBiZSB1c2VkIGFjY3JvcyB0aGUgZW50aXJlIGNvbGxlY3Rpb24uXG5cdCpcblx0KiBAcGFyYW0ge0Jhc2VTaGFwZX0gY3RvciAtIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gYmUgdXNlZC5cblx0KiBAcGFyYW0ge09iamVjdH0gW2FjY2Vzc29ycz17fV0gLSBEZWZpbmVzIGhvdyB0aGUgc2hhcGUgc2hvdWxkIGFkYXB0IHRvIGEgcGFydGljdWxhciBkYXRhIHN0cnV0dXJlLlxuXHQqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBHbG9iYWwgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNoYXBlcywgaXMgc3BlY2lmaWMgdG8gZWFjaCBgU2hhcGVgLlxuXHQqL1xuXHRjb25maWd1cmVDb21tb25TaGFwZShjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMpIHtcblx0XHRpZiAoIWFjY2Vzc29ycylcdGFjY2Vzc29ycyA9IHt9O1xuXHRcdGlmICghb3B0aW9ucylcdG9wdGlvbnMgPSB7fTtcblx0XHR0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gPSB7IGN0b3I6IGN0b3IsIGFjY2Vzc29yczogYWNjZXNzb3JzLCBvcHRpb25zOiBvcHRpb25zIH07XG5cdFx0dGhpcy5fY29tbW9uU2hhcGUgPSBuZXcgY3RvcihvcHRpb25zKTtcblx0XHR0aGlzLl9jb21tb25TaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG5cdFx0dGhpcy5fY29tbW9uU2hhcGUucmVuZGVyKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQpO1xuXHRcdGlmICh0aGlzLl9jb21tb25TaGFwZS4kZWwgaW5zdGFuY2VvZiBBcnJheSB8fCB0aGlzLl9jb21tb25TaGFwZS4kZWwgaW5zdGFuY2VvZiBTZXQpIHtcblx0XHRcdHRoaXMuX2NvbW1vblNoYXBlLiRlbC5mb3JFYWNoKChlbCkgPT4gdGhpcy5fY29tbW9uU2hhcGVMYXllci5hZGQoZWwpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fY29tbW9uU2hhcGVMYXllci5hZGQodGhpcy5fY29tbW9uU2hhcGUuJGVsKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0KiBEZWZpbmVzIGlmIHRoZSBgTGF5ZXJgLCBhbmQgdGh1cyB0aGUgYExheWVyVGltZUNvbnRleHRgIGlzIGVkaXRhYmxlIG9yIG5vdC5cblx0KlxuXHQqIEBwYXJhbXMge0Jvb2xlYW59IFtib29sPXRydWVdXG5cdCovXG5cdHNldENvbnRleHRFZGl0YWJsZShlZGl0YWJsZSkge1xuXHRcdGlmIChlZGl0YWJsZSA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0ZWRpdGFibGUgPSB0cnVlO1xuXHRcdC8vIHRoaXMuX2NvbnRleHRMYXllci52aXNpYmxlKGVkaXRhYmxlKTtcblx0XHR0aGlzLl9jb250ZXh0TGF5ZXIub3BhY2l0eSgoZWRpdGFibGUpPyB0aGlzLnBhcmFtcy5jb250ZXh0Lm9wYWNpdHkgOiAwKTtcblx0XHR0aGlzLl9jb250ZXh0TGF5ZXIubGlzdGVuaW5nKHRydWUpO1xuXHRcdHRoaXMuX2NvbnRleHRMYXllci52aXNpYmxlKHRydWUpO1xuXHRcdHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID0gZWRpdGFibGU7XG5cdH1cblx0XG5cblxuXHQvKipcblx0KiBVcGRhdGVzIHRoZSB2YWx1ZXMgc3RvcmVkIGludCB0aGUgYF9yZW5kZXJpbmdDb250ZXh0YCBwYXNzZWRcdHRvIHNoYXBlc1xuXHQqIGZvciByZW5kZXJpbmcgYW5kIHVwZGF0aW5nLlxuXHQqL1xuXHRfdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpIHtcblxuXHRcdHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuXHRcdHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsID0gdGhpcy5fdmFsdWVUb1BpeGVsO1xuXG5cdFx0dGhpcy5fcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG5cdFx0dGhpcy5fcmVuZGVyaW5nQ29udGV4dC53aWR0aCAgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuXHRcdC8vIGZvciBmb3JlaWduIG9iamVjdCBpc3N1ZSBpbiBjaHJvbWVcblx0XHR0aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFggPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQub2Zmc2V0KTtcblx0XHR0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnN0YXJ0WCA9IHRoaXMudGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuc3RhcnQpO1xuXHRcdHRoaXMuX3JlbmRlcmluZ0NvbnRleHQucGl4ZWxzUGVyU2Vjb25kID0gdGhpcy50aW1lQ29udGV4dC5wYXJlbnQuY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQ7XG5cblx0XHQvLyBAdG9kbyByZXBsYWNlIHdpdGggYG1pblhgIGFuZCBgbWF4WGAgcmVwcmVzZW50aW5nIHRoZSB2aXNpYmxlIHBpeGVscyBpbiB3aGljaFxuXHRcdC8vIHRoZSBzaGFwZXMgc2hvdWxkIGJlIHJlbmRlcmVkLCBjb3VsZCBhbGxvdyB0byBub3QgdXBkYXRlIHRoZSBET00gb2Ygc2hhcGVzXG5cdFx0Ly8gd2hvIGFyZSBub3QgaW4gdGhpcyBhcmVhLlxuXHRcdHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudHJhY2tPZmZzZXRYID0gdGhpcy50aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5wYXJlbnQub2Zmc2V0KTtcblx0XHR0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aCA9IHRoaXMudGltZUNvbnRleHQucGFyZW50LnZpc2libGVXaWR0aDtcblx0fVxuXG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gSGVscGVyc1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdGdldERhdHVtRnJvbVNoYXBlKCRzaGFwZSkge1xuXHRcdHJldHVybiB0aGlzLl8kc2hhcGVUb0RhdHVtLmdldCgkc2hhcGUpO1xuXHR9XG5cblx0Z2V0U2hhcGVGcm9tRGF0dW0oJGRhdHVtKSB7XG5cdFx0cmV0dXJuIHRoaXMuXyRkYXR1bVRvU2hhcGUuZ2V0KCRkYXR1bSk7XG5cdH1cblxuXHQvKipcblx0KiBSZXRyaWV2ZSBhbGwgdGhlIGRhdHVtcyBpbiBhIGdpdmVuIGFyZWEgYXMgZGVmaW5lZCBpbiB0aGUgcmVnaXN0ZXJlZCBgU2hhcGV+aW5BcmVhYCBtZXRob2QuXG5cdCpcblx0KiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBhcmVhIGluIHdoaWNoIHRvIGZpbmQgdGhlIGVsZW1lbnRzXG5cdCogQHBhcmFtIHtOdW1iZXJ9IGFyZWEudG9wXG5cdCogQHBhcmFtIHtOdW1iZXJ9IGFyZWEubGVmdFxuXHQqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLndpZHRoXG5cdCogQHBhcmFtIHtOdW1iZXJ9IGFyZWEuaGVpZ2h0XG5cdCogQHJldHVybiB7QXJyYXl9IC0gbGlzdCBvZiB0aGUgZGF0dW1zIHByZXNlbnRzIGluIHRoZSBhcmVhXG5cdCovXG5cdGdldERhdHVtc0luQXJlYShhcmVhKSB7XG5cdFx0XG5cdFx0bGV0IHgxID0gYXJlYS5sZWZ0O1xuXHRcdGxldCB5MSA9IGFyZWEudG9wO1xuXHRcdGxldCB4MiA9IGFyZWEubGVmdCArIGFyZWEud2lkdGg7XG5cdFx0bGV0IHkyID0gYXJlYS50b3AgKyBhcmVhLmhlaWdodCArIHRoaXMucGFyYW1zLnRvcDtcblxuXHRcdGNvbnN0ICRmaWx0ZXJlZERhdHVtcyA9IG5ldyBTZXQoKTtcblxuXHRcdGNvbnN0ICRlbnRyaWVzID0gdGhpcy5fJGRhdHVtVG9TaGFwZS5lbnRyaWVzKCk7XG5cblx0XHRjb25zdCB0aGF0ID0gdGhpcztcblxuXHRcdHRoaXMuY29udGVudExheWVycy5mb3JFYWNoKChjb250ZW50TGF5ZXIpID0+IHtcblx0XHRcdGNvbnRlbnRMYXllci5jaGlsZHJlbi5mb3JFYWNoKChrb252YVNoYXBlKSA9PiB7XG5cdFx0XHRcdGNvbnN0ICRzaGFwZSA9IGtvbnZhU2hhcGUuc2hhcGU7XG5cdFx0XHRcdGNvbnN0ICRkYXR1bSA9IHRoYXQuZ2V0RGF0dW1Gcm9tU2hhcGUoJHNoYXBlKTtcblx0XHRcdFx0Y29uc3QgaW5BcmVhID0gJHNoYXBlLmluQXJlYSh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCAkZGF0dW0sIHgxLCB5MSwgeDIsIHkyKTtcblxuXHRcdFx0XHRpZiAoaW5BcmVhKSB7IFxuXHRcdFx0XHRcdCRmaWx0ZXJlZERhdHVtcy5hZGQoJGRhdHVtKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0cmV0dXJuICRmaWx0ZXJlZERhdHVtcztcblx0fVxuXG5cdHVwZGF0ZSgkZGF0dW1zKSB7XG5cblx0XHR0aGlzLnVwZGF0ZUNvbnRhaW5lcigpO1xuXG5cdFx0dGhpcy51cGRhdGVTaGFwZXMoJGRhdHVtcyk7XG5cdFx0XG5cdH1cblxuXG5cdHNvcnRfZGF0YShkYXRhKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdUaGUgZGV2ZWxvcGVyIG11c3QgYXNzaWduIGEgcHJvcGVyIGZ1bmN0aW9uJyk7XG5cdH1cblxuXHR2aXNpYmxlX2RhdGEodGltZUNvbnRleHQsIGRhdGEpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1RoZSBkZXZlbG9wZXIgbXVzdCBhc3NpZ24gYSBwcm9wZXIgZnVuY3Rpb24nKTtcblx0fVxuXG5cblx0dXBkYXRlU2hhcGVzKCRkYXR1bXMpIHtcblx0XHRjb25zdCB0aGF0ID0gdGhpcztcblx0XHRjb25zdCBjaGFuZ2VkQ29udGVudExheWVycyA9IG5ldyBTZXQoKTtcblx0XHR2YXIgdGFyZ2V0RGF0YSA9IG51bGw7XG5cdFx0dmFyIGludGVydmFsID0gbnVsbDtcblx0XHR2YXIgZXJhc2VDaGlsZHJlbiA9IHRydWU7XG5cblx0XHRpZiAoJGRhdHVtcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuX2NvbW1vblNoYXBlKSB7XG5cdFx0XHRpbnRlcnZhbCA9IHRoaXMudmlzaWJsZV9kYXRhKHRoaXMudGltZUNvbnRleHQsIHRoaXMuZGF0YSk7XG5cdFx0fVxuXG5cdFx0aWYgKCRkYXR1bXMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGFyZ2V0RGF0YSA9IHRoaXMuZGF0YS5zbGljZShpbnRlcnZhbFswXSwgTWF0aC5taW4oaW50ZXJ2YWxbMV0rMSwgdGhpcy5kYXRhLmxlbmd0aCkpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXREYXRhID0gJGRhdHVtcztcblx0XHRcdGVyYXNlQ2hpbGRyZW4gPSBmYWxzZTtcblx0XHR9XG5cblx0XHR0aGlzLmFsbG9jYXRlU2hhcGVzVG9Db250ZW50TGF5ZXJzKHRoaXMuX3N0YWdlLCB0YXJnZXREYXRhLCAnZGF0dW1zJywgZXJhc2VDaGlsZHJlbikuZm9yRWFjaCgoY2hhbmdlZENvbnRlbnRMYXllcikgPT4ge1xuXHRcdFx0Y2hhbmdlZENvbnRlbnRMYXllcnMuYWRkKGNoYW5nZWRDb250ZW50TGF5ZXIpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gY29uc29sZS5sb2coJ251bWJlciBvZiBjaGFuZ2VkQ29udGVudExheWVycyA6ICcgKyBjaGFuZ2VkQ29udGVudExheWVycy5zaXplKTtcblxuXHRcdGNoYW5nZWRDb250ZW50TGF5ZXJzLmZvckVhY2goKGNoYW5nZWRDb250ZW50TGF5ZXIpID0+IHtcblx0XHRcdGNoYW5nZWRDb250ZW50TGF5ZXJcblx0XHRcdFx0LnkodGhhdC5wYXJhbXMudG9wKVxuXHRcdFx0XHQub2Zmc2V0WCgtdGhhdC5fcmVuZGVyaW5nQ29udGV4dC5zdGFydFgpXG5cdFx0XHRcdC54KHRoYXQuX3JlbmRlcmluZ0NvbnRleHQub2Zmc2V0WClcblx0XHRcdFx0LmNsaXAoeyBcblx0XHRcdFx0XHR4OiAtdGhhdC5fcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYLCBcblx0XHRcdFx0XHR5OiAwLCBcblx0XHRcdFx0XHR3aWR0aDogdGhhdC5fcmVuZGVyaW5nQ29udGV4dC53aWR0aCwgXG5cdFx0XHRcdFx0aGVpZ2h0OiB0aGF0Ll9yZW5kZXJpbmdDb250ZXh0LmhlaWdodCBcblx0XHRcdFx0fSk7XG5cdFx0XHRjaGFuZ2VkQ29udGVudExheWVyLmNsZWFyKCk7XG5cdFx0XHRjaGFuZ2VkQ29udGVudExheWVyLmJhdGNoRHJhdygpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5fZHJhZ0xheWVyXG5cdFx0XHRcdC55KHRoYXQucGFyYW1zLnRvcClcblx0XHRcdFx0Lm9mZnNldFgoLXRoYXQuX3JlbmRlcmluZ0NvbnRleHQuc3RhcnRYKVxuXHRcdFx0XHQueCh0aGF0Ll9yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFgpXG5cdFx0XHRcdC5jbGlwKHsgXG5cdFx0XHRcdFx0eDogLXRoYXQuX3JlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCwgXG5cdFx0XHRcdFx0eTogMCwgXG5cdFx0XHRcdFx0d2lkdGg6IHRoYXQuX3JlbmRlcmluZ0NvbnRleHQud2lkdGgsIFxuXHRcdFx0XHRcdGhlaWdodDogdGhhdC5fcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgXG5cdFx0XHRcdH0pLmNsZWFyKCkuYmF0Y2hEcmF3KCk7XG5cblxuXHRcdGlmICh0aGlzLl9jb21tb25TaGFwZSkge1xuXHRcdFx0dGhpcy5fY29tbW9uU2hhcGUudXBkYXRlKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsIHRoYXQuZGF0YS5zbGljZShpbnRlcnZhbFswXSwgaW50ZXJ2YWxbMV0rMSkpO1xuXHRcdFx0dGhpcy5fY29tbW9uU2hhcGVMYXllclxuXHRcdFx0XHQueSh0aGF0LnBhcmFtcy50b3ApXG5cdFx0XHRcdC5vZmZzZXRYKC10aGF0Ll9yZW5kZXJpbmdDb250ZXh0LnN0YXJ0WClcblx0XHRcdFx0LngodGhhdC5fcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYKVxuXHRcdFx0XHQuY2xpcCh7IFxuXHRcdFx0XHRcdHg6IC10aGF0Ll9yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFgsIFxuXHRcdFx0XHRcdHk6IDAsIFxuXHRcdFx0XHRcdHdpZHRoOiB0aGF0Ll9yZW5kZXJpbmdDb250ZXh0LndpZHRoLCBcblx0XHRcdFx0XHRoZWlnaHQ6IHRoYXQuX3JlbmRlcmluZ0NvbnRleHQuaGVpZ2h0XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5iYXRjaERyYXcoKTtcblx0XHR9XG5cblx0XHR0aGlzLl9jb250ZXh0U2hhcGUudXBkYXRlKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsIHRoaXMudGltZUNvbnRleHQpO1xuXG5cdFx0dGhpcy5fY29udGV4dExheWVyXG5cdFx0XHRcdC55KHRoYXQucGFyYW1zLnRvcClcblx0XHRcdFx0LmJhdGNoRHJhdygpO1xuXHR9XG5cblx0dXBkYXRlQ29udGFpbmVyKCkge1xuXHRcdHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblx0XHRjb25zdCB0aGF0ID0gdGhpcztcblxuXHRcdHRoaXMuY29udGVudExheWVycy5mb3JFYWNoKChjb250ZW50TGF5ZXIpID0+IHtcblx0XHRcdGNvbnRlbnRMYXllclxuXHRcdFx0XHQub2Zmc2V0WCgtdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5zdGFydFgpXG5cdFx0XHRcdC54KHRoaXMuX3JlbmRlcmluZ0NvbnRleHQub2Zmc2V0WClcblx0XHRcdFx0LmNsaXAoeyBcblx0XHRcdFx0XHR4OiAtdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYLCBcblx0XHRcdFx0XHR5OiAwLCBcblx0XHRcdFx0XHR3aWR0aDogdGhpcy5fcmVuZGVyaW5nQ29udGV4dC53aWR0aCwgXG5cdFx0XHRcdFx0aGVpZ2h0OiB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LmhlaWdodCBcblx0XHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXG5cblx0YWxsb2NhdGVTaGFwZXNUb0NvbnRlbnRMYXllcnMoc3RhZ2UsIG9ianMsIHR5cGUsIGVyYXNlQ2hpbGRyZW4pIHtcblx0XHRjb25zdCBMSU1JVCA9IEluZmluaXR5OyAvLyBUT0RPOiBtYWtlIHRoZSBMSU1JVCBhIGR5bmFtaWMgdmFyaWFibGUsIGNvbnRyb2xsZWQgYnkgYSB1c2VyIGRlZmluZWQgZnVuY3Rpb24uXG5cblx0XHRjb25zdCBjaGFuZ2VkQ29udGVudExheWVycyA9IG5ldyBTZXQoKTtcblxuXHRcdGNvbnN0IGtvbnZhU2hhcGVzID0gbmV3IFNldCgpO1xuXG5cdFx0Lypcblx0XHQgKiBPZiBjb3Vyc2Ugb25lIGNvdWxkIHdyaXRlIGxlc3MgY29kZSBieSBpbmNsdWRpbmcgdGhlIHR5cGUgY2hlY2tpbmcgaW5zaWRlIHRoZSBmb3JFYWNoLlxuXHRcdCAqIEJ1dCB0aGF0IHdvdWxkIG1lYW4gYSBjaGVjayBmb3IgZWFjaCBvYmplY3QuIFRoaXMgd2F5LCB0aGUgcHJvZ3JhbSBjaGVja3Mgb25seSBvbmUgdGltZS5cblx0XHQgKiBUaGlzIGlzIG1lYW50IHRvIGJlIGEgc21hbGwgb3B0aW1pemF0aW9uLiBOb3QgcHJldHR5LCBvZiBjb3Vyc2UuXG5cdFx0ICogQW5vdGhlciB0aGluZzogaW4gb3JkZXIgdG8gdXNlIGp1c3Qgb25lIGZvckVhY2ggYXQgdXBkYXRlU2hhcGVzLCBJIGluY2x1ZGVkIHRoZSBzaGFwZSB1cGRhdGUgaW4gaGVyZVxuXHRcdCAqL1xuXHRcdGNvbnN0IHRoYXQgPSB0aGlzO1xuXHRcdGlmICh0eXBlID09ICdkYXR1bXMnKSB7XG5cdFx0XHRvYmpzLmZvckVhY2goKGRhdHVtKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHNoYXBlID0gdGhhdC5nZXRTaGFwZUZyb21EYXR1bShkYXR1bSk7XG5cdFx0XHRcdGlmIChzaGFwZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGRhdHVtJywgeyBkYXR1bTogZGF0dW0sIGxheWVyOiB0aGF0IH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNoYXBlLnVwZGF0ZSh0aGF0Ll9yZW5kZXJpbmdDb250ZXh0LCBkYXR1bSk7IFxuXHRcdFx0XHRpZiAoc2hhcGUuJGVsIGluc3RhbmNlb2YgQXJyYXkgfHwgc2hhcGUuJGVsIGluc3RhbmNlb2YgU2V0KSB7XG5cdFx0XHRcdFx0c2hhcGUuJGVsLmZvckVhY2goKGVsKSA9PiBrb252YVNoYXBlcy5hZGQoZWwpKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRrb252YVNoYXBlcy5hZGQoc2hhcGUuJGVsKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09ICdzaGFwZXMnKSB7XG5cdFx0XHRvYmpzLmZvckVhY2goKHNoYXBlKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGRhdHVtID0gdGhhdC5nZXREYXR1bUZyb21TaGFwZShzaGFwZSk7XG5cdFx0XHRcdGlmIChkYXR1bSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHNoYXBlJywgeyBzaGFwZTogc2hhcGUsIGxheWVyOiB0aGF0IH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNoYXBlLnVwZGF0ZSh0aGF0Ll9yZW5kZXJpbmdDb250ZXh0LCBkYXR1bSk7IFxuXHRcdFx0XHRpZiAoc2hhcGUuJGVsIGluc3RhbmNlb2YgQXJyYXkgfHwgc2hhcGUuJGVsIGluc3RhbmNlb2YgU2V0KSB7XG5cdFx0XHRcdFx0c2hhcGUuJGVsLmZvckVhY2goKGVsKSA9PiBrb252YVNoYXBlcy5hZGQoZWwpKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRrb252YVNoYXBlcy5hZGQoc2hhcGUuJGVsKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignVW5rbm93biBvYmplY3RzIHR5cGUnKTtcblx0XHR9XG5cblx0XHRjb25zdCBrc0l0ID0ga29udmFTaGFwZXMuZW50cmllcygpO1xuXG5cdFx0Y29uc3QgY2xJdCA9IHRoaXMuY29udGVudExheWVycy5lbnRyaWVzKCk7XG5cblx0XHR2YXIgY2xlID0gY2xJdC5uZXh0KCk7XG5cdFx0dmFyIGtzZSA9IGtzSXQubmV4dCgpO1xuXG5cdFx0dmFyIHByZXZpb3VzU2hhcGUgPSBudWxsO1xuXG5cdFx0d2hpbGUgKCFjbGUuZG9uZSkge1xuXHRcdFx0Y29uc3QgbGF5ZXIgPSBjbGUudmFsdWVbMV07XG5cdFx0XHR3aGlsZSAoIWtzZS5kb25lKSB7XG5cdFx0XHRcdGNvbnN0IGtvbnZhU2hhcGUgPSBrc2UudmFsdWVbMV07XG5cdFx0XHRcdGlmIChsYXllci5jaGlsZHJlbi5sZW5ndGggPj0gTElNSVQgJiYga29udmFTaGFwZS5zaGFwZSAhPSBwcmV2aW91c1NoYXBlKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGVyYXNlQ2hpbGRyZW4gJiYgIWNoYW5nZWRDb250ZW50TGF5ZXJzLmhhcyhsYXllcikpIHtcblx0XHRcdFx0XHRsYXllci5yZW1vdmVDaGlsZHJlbigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGtvbnZhU2hhcGUucmVtb3ZlKCk7XG5cdFx0XHRcdGxheWVyLmFkZChrb252YVNoYXBlKTtcblx0XHRcdFx0a3NlID0ga3NJdC5uZXh0KCk7XG5cdFx0XHRcdGNoYW5nZWRDb250ZW50TGF5ZXJzLmFkZChsYXllcik7XG5cdFx0XHR9XG5cdFx0XHRjbGUgPSBjbEl0Lm5leHQoKTtcblx0XHR9XG5cblx0XHR3aGlsZSAoIWtzZS5kb25lKSB7XG5cdFx0XHRjb25zdCBsYXllciA9IG5ldyBLb252YS5MYXllcih7fSk7XG5cdFx0XHRsYXllci5sYXllciA9IHRoaXM7XG5cdFx0XHRsYXllci5hZGROYW1lKCdjb250ZW50LWxheWVyJyk7XG5cdFx0XHRsYXllci5jbGVhckJlZm9yZURyYXcodHJ1ZSk7XG5cdFx0XHR0aGlzLmNvbnRlbnRMYXllcnMuYWRkKGxheWVyKTtcblx0XHRcdHN0YWdlLmFkZChsYXllcik7XG5cdFx0XHR3aGlsZSAoIWtzZS5kb25lICYmIGxheWVyLmNoaWxkcmVuLmxlbmd0aCA8IExJTUlUKSB7XG5cdFx0XHRcdGNvbnN0IGtvbnZhU2hhcGUgPSBrc2UudmFsdWVbMV07XG5cdFx0XHRcdGtvbnZhU2hhcGUucmVtb3ZlKCk7XG5cdFx0XHRcdGxheWVyLmFkZChrb252YVNoYXBlKTtcblx0XHRcdFx0a3NlID0ga3NJdC5uZXh0KCk7XG5cdFx0XHR9XG5cdFx0XHRjaGFuZ2VkQ29udGVudExheWVycy5hZGQobGF5ZXIpO1xuXHRcdH1cblxuXHRcdHJldHVybiBjaGFuZ2VkQ29udGVudExheWVycztcblx0fVxuXG5cdHNldChkYXRhKSB7XG5cdFx0Y29uc3QgdGhhdCA9IHRoaXM7XG5cblx0XHR0aGlzLmRhdGEuZm9yRWFjaCgoZGF0dW0pID0+IHtcblx0XHRcdGNvbnN0IHNoYXBlID0gdGhpcy5fJGRhdHVtVG9TaGFwZS5nZXQoZGF0dW0pO1xuXHRcdFx0c2hhcGUuZGVzdHJveSgpO1xuXHRcdH0pO1xuXHRcdHRoaXMuXyRkYXR1bVRvU2hhcGUuY2xlYXIoKTtcblx0XHR0aGlzLl8kc2hhcGVUb0RhdHVtLmNsZWFyKCk7XG5cblx0XHR0aGlzLmNvbnRlbnRMYXllcnMuZm9yRWFjaCgobGF5ZXIpPT4ge1xuXHRcdFx0bGF5ZXIuZGVzdHJveSgpO1xuXHRcdH0pO1xuXHRcdFxuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cblx0XHR0aGlzLmRhdGEuZm9yRWFjaCgoZGF0dW0pID0+IHtcblx0XHRcdHRoYXQuX2FkZChkYXR1bSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLnNvcnRfZGF0YSh0aGlzLmRhdGEpO1xuXG5cdFx0dGhpcy5lbWl0KCdzZXQnLCBkYXRhKTtcblx0fVxuXG5cdF9hZGQoZGF0dW0pIHtcblx0XHRjb25zdCBjdG9yID0gdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uLmN0b3I7XG5cdFx0Y29uc3QgYWNjZXNzb3JzID0gdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uLmFjY2Vzc29ycztcblx0XHRjb25zdCBvcHRpb25zID0gdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uLm9wdGlvbnM7XG5cblx0XHRjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuXHRcdHNoYXBlLmluc3RhbGwoYWNjZXNzb3JzKTtcblx0XHRzaGFwZS5yZW5kZXIodGhpcy5fcmVuZGVyaW5nQ29udGV4dCk7XG5cdFx0c2hhcGUubGF5ZXIgPSB0aGlzO1xuXHRcdHNoYXBlLmRhdHVtID0gZGF0dW07XG5cdFx0dGhpcy5fJGRhdHVtVG9TaGFwZS5zZXQoZGF0dW0sIHNoYXBlKTtcblx0XHR0aGlzLl8kc2hhcGVUb0RhdHVtLnNldChzaGFwZSwgZGF0dW0pO1xuXHR9XG5cblx0YWRkKGRhdHVtKSB7XG5cdFx0dGhpcy5fYWRkKGRhdHVtKTtcblx0XHR0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aF0gPSBkYXR1bTtcblx0XHR0aGlzLnNvcnRfZGF0YSh0aGlzLmRhdGEpO1xuXG5cdFx0dGhpcy5lbWl0KCdhZGQnLCBkYXR1bSk7XG5cdH1cblxuXHRyZW1vdmUoZGF0dW0pIHtcblx0XHRjb25zdCBzaGFwZSA9IHRoaXMuXyRkYXR1bVRvU2hhcGUuZ2V0KGRhdHVtKTtcblx0XHRpZiAoc2hhcGUpIHtcblx0XHRcdGNvbnN0IGNoYW5nZWRDb250ZW50TGF5ZXJzID0gbmV3IFNldCgpO1xuXHRcdFx0aWYgKHNoYXBlLiRlbCBpbnN0YW5jZW9mIEFycmF5IHx8IHNoYXBlLiRlbCBpbnN0YW5jZW9mIFNldCkge1xuXHRcdFx0XHRzaGFwZS4kZWwuZm9yRWFjaCgoZWwpID0+IGNoYW5nZWRDb250ZW50TGF5ZXJzLmFkZChlbCkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2hhbmdlZENvbnRlbnRMYXllcnMuYWRkKHNoYXBlLiRlbCk7XG5cdFx0XHR9XG5cdFx0XHRzaGFwZS5sYXllciA9IG51bGw7XG5cdFx0XHRzaGFwZS5kZXN0cm95KCk7XG5cdFx0XHR0aGlzLl8kZGF0dW1Ub1NoYXBlLmRlbGV0ZShkYXR1bSk7XG5cdFx0XHR0aGlzLl8kc2hhcGVUb0RhdHVtLmRlbGV0ZShzaGFwZSk7XG5cblx0XHRcdGNoYW5nZWRDb250ZW50TGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG5cdFx0XHRcdGlmIChsYXllci5jaGlsZHJlbiA9PT0gMCkge1xuXHRcdFx0XHRcdGxheWVyLmRlc3Ryb3koKTtcblx0XHRcdFx0XHR0aGlzLmNvbnRlbnRMYXllcnMuZGVsZXRlKGxheWVyKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5kYXRhLnNwbGljZSh0aGlzLmRhdGEuaW5kZXhPZihkYXR1bSksIDEpO1xuXG5cdFx0dGhpcy5lbWl0KCdyZW1vdmUnLCBkYXR1bSk7XG5cdH1cblxuXG5cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKiBFRElUSU9OICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG5cdC8qKlxuXHQgKiBFZGl0IGRhdHVtKHMpIGFjY29yZGluZyB0byB0aGUgYGVkaXRgIGRlZmluZWQgaW4gdGhlIHJlZ2lzdGVyZWQgYEJlaGF2aW9yYC5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3RbXX0gJGRhdHVtcyAtIFRoZSBkYXR1bShzKSB0byBlZGl0LlxuXHQgKiBAcGFyYW0ge051bWJlcn0gZHggLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB4IGF4aXMgKGluIHBpeGVscykuXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBkeSAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHkgYXhpcyAoaW4gcGl4ZWxzKS5cblx0ICogQHBhcmFtIHtFbGVtZW50fSAkdGFyZ2V0IC0gVGhlIHRhcmdldCBvZiB0aGUgaW50ZXJhY3Rpb24gKGZvciBleGFtcGxlLCBsZWZ0XG5cdCAqICAgIGhhbmRsZXIgRE9NIGVsZW1lbnQgaW4gYSBzZWdtZW50KS5cblx0ICovXG5cdGVkaXQoJGRhdHVtcywgZHgsIGR5LCAkdGFyZ2V0KSB7XG5cdFx0Y29uc3QgdGhhdCA9IHRoaXM7XG5cdFx0JGRhdHVtcy5mb3JFYWNoKChkYXR1bSkgPT4ge1xuXHRcdFx0Y29uc3Qgc2hhcGUgPSB0aGF0Ll8kZGF0dW1Ub1NoYXBlLmdldChkYXR1bSk7XG5cblx0XHRcdHRoaXMuX2JlaGF2aW9yLmVkaXQodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksICR0YXJnZXQpO1xuXHRcdH0pO1xuXHRcdHRoaXMuZW1pdCgnZWRpdCcsICRkYXR1bXMpO1xuXHR9XG5cblxuXHQvKipcblx0KiBFZGl0IHRoZSBsYXllciBhbmQgdGh1cyBpdHMgcmVsYXRlZCBgTGF5ZXJUaW1lQ29udGV4dGAgYXR0cmlidXRlcy5cblx0KlxuXHQqIEBwYXJhbSB7TnVtYmVyfSBkeCAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHggYXhpcyAoaW4gcGl4ZWxzKS5cblx0KiBAcGFyYW0ge051bWJlcn0gZHkgLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB5IGF4aXMgKGluIHBpeGVscykuXG5cdCogQHBhcmFtIHtFbGVtZW50fSAkdGFyZ2V0IC0gVGhlIHRhcmdldCBvZiB0aGUgZXZlbnQgb2YgdGhlIGludGVyYWN0aW9uLlxuXHQqL1xuXHRlZGl0Q29udGV4dChkeCwgZHksICR0YXJnZXQpIHtcblx0XHQvLyBUT0RPXG5cdFx0dGhpcy50aW1lQ29udGV4dEJlaGF2aW9yLmVkaXQodGhpcywgZHgsIGR5LCAkdGFyZ2V0KTtcblx0XHR0aGlzLmVtaXQoJ2VkaXQtY29udGV4dCcpO1xuXHR9XG5cblx0LyoqXG5cdCogU3RyZXRjaCB0aGUgbGF5ZXIgYW5kIHRodXMgaXRzIHJlbGF0ZWQgYExheWVyVGltZUNvbnRleHRgIGF0dHJpYnV0ZXMuXG5cdCpcblx0KiBAcGFyYW0ge051bWJlcn0gZHggLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB4IGF4aXMgKGluIHBpeGVscykuXG5cdCogQHBhcmFtIHtOdW1iZXJ9IGR5IC0gVGhlIG1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeSBheGlzIChpbiBwaXhlbHMpLlxuXHQqIEBwYXJhbSB7RWxlbWVudH0gJHRhcmdldCAtIFRoZSB0YXJnZXQgb2YgdGhlIGV2ZW50IG9mIHRoZSBpbnRlcmFjdGlvbi5cblx0Ki9cblx0c3RyZXRjaENvbnRleHQoZHgsIGR5LCAkdGFyZ2V0KSB7XG5cdFx0Ly8gVE9ET1xuXHRcdHRoaXMudGltZUNvbnRleHRCZWhhdmlvci5zdHJldGNoKHRoaXMsIGR4LCBkeSwgJHRhcmdldCk7XG5cdFx0dGhpcy5lbWl0KCdzdHJldGNoLWNvbnRleHQnKTtcblx0fVxuXG5cdG1pbmltaXplKCkge1xuXHRcdC8vIFRPRE9cblx0fVxuXG59Il19