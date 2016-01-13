'use strict'

class Layer extends events.EventEmitter {

	constructor(dataType, data, options) {
		super();

		if (!options) 
			options = {};

		const defaults = {
			height: 100,
			top: 0,
			opacity: 1,
			yDomain: [0, 1],
			className: null, // TODO
			selectedClassName: 'selected',
			context: {
				handlerWidth: 2,
				handlerOpacity: 0.2,
				opacity: 0.1, 
				color: '#787878',
			}, 
			hittable: true, // when false the layer is not returned by `BaseState.getHitLayers`
		};

		this._behavior = null;

		/**
		* Parameters of the layers, `defaults` overrided with options.
		* @type {Object}
		*/
		this.params = Object.assign({}, defaults, options);
		this.timeContextBehavior = new TimeContextBehavior();

		this._shapeConfiguration = null;			 // { ctor, accessors, options }
		this._commonShapeConfiguration = null; // { ctor, accessors, options }
		this._$datumToShape = new Map();
		this._$shapeToDatum = new Map();
		this._commonShape = null;
		this._renderingContext = {};
		this.data = [];

		this._isContextEditable = false;

		this._valueToPixel = scales.linear()
			.domain(this.params.yDomain)
			.range([this.params.height, 0]);

		this.contentLayers = new Set();

		this._commonShapeLayer = new Konva.FastLayer({});
		this._commonShapeLayer.addName('common-shape-layer');
		this._commonShapeLayer.layer = this;

		this._contextLayer = new Konva.Layer({});
		this._contextLayer.layer = this;
		this._contextLayer.addName('context-layer');

		this.setContextEditable(this._isContextEditable);
		
		this._contextShape = new Segment({});
		this._contextShape.install({
			opacity	: () => 1, 
			color	: () => this.params.context.color, 
			width	: () => this.timeContext.duration,
			height	: () => this._renderingContext.valueToPixel.domain()[1],
			y		: () => this._renderingContext.valueToPixel.domain()[0],
			x		: () => this.timeContext.start
		}); 
		this._contextShape.render(this._renderingContext);
		this._contextShape.layer = this;
		for (var i=0; i<this._contextShape.$el.length; i++) {
			this._contextLayer.add(this._contextShape.$el[i]);
		}

		this._stage = null;
	}

	createContainer(stage) {
		this._stage = stage;

		this._stage.add(this._contextLayer);
		this._stage.add(this._commonShapeLayer);
	}


	_destroy(it) {
		var entry = it.next();
		while (!entry.done) {
			var layer = entry.value;
			layer.destroy();
		}
	}

	destroy() {
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
	static configureTimeContextBehavior(ctor) {
		timeContextBehaviorCtor = ctor;
	}

	/**
	 * Returns `LayerTimeContext`'s `start` time domain value.
	 *
	 * @type {Number}
	 */
	get start() {
		return this.timeContext.start;
	}

	/**
	 * Sets `LayerTimeContext`'s `start` time domain value.
	 *
	 * @type {Number}
	 */
	set start(value) {
		this.timeContext.start = value;
	}

	/**
	 * Returns `LayerTimeContext`'s `offset` time domain value.
	 *
	 * @type {Number}
	 */
	get offset() {
		return this.timeContext.offset;
	}

	/**
	 * Sets `LayerTimeContext`'s `offset` time domain value.
	 *
	 * @type {Number}
	 */
	set offset(value) {
		this.timeContext.offset = value;
	}

	/**
	 * Returns `LayerTimeContext`'s `duration` time domain value.
	 *
	 * @type {Number}
	 */
	get duration() {
		return this.timeContext.duration;
	}

	/**
	 * Sets `LayerTimeContext`'s `duration` time domain value.
	 *
	 * @type {Number}
	 */
	set duration(value) {
		this.timeContext.duration = value;
	}

	/**
	 * Returns `LayerTimeContext`'s `stretchRatio` time domain value.
	 *
	 * @type {Number}
	 */
	get stretchRatio() {
		return this.timeContext.stretchRatio;
	}

	/**
	 * Sets `LayerTimeContext`'s `stretchRatio` time domain value.
	 *
	 * @type {Number}
	 */
	set stretchRatio(value) {
		this.timeContext.stretchRatio = value;
	}

	/**
	 * Set the domain boundaries of the data for the y axis.
	 *
	 * @type {Array}
	 */
	set yDomain(domain) {
		this.params.yDomain = domain;
		this._valueToPixel.domain(domain);
	}

	/**
	 * Returns the domain boundaries of the data for the y axis.
	 *
	 * @type {Array}
	 */
	get yDomain() {
		return this.params.yDomain;
	}

	/**
	 * Sets the opacity of the whole layer.
	 *
	 * @type {Number}
	 */
	set opacity(value) {
		this.params.opacity = value;
	}

	/**
	 * Returns the opacity of the whole layer.
	 *
	 * @type {Number}
	 */
	get opacity() {
		return this.params.opacity;
	}

	/**
	 * Returns the transfert function used to display the data in the x axis.
	 *
	 * @type {Number}
	 */
	get timeToPixel() {
		return this.timeContext.timeToPixel;
	}

	/**
	 * Returns the transfert function used to display the data in the y axis.
	 *
	 * @type {Number}
	 */
	get valueToPixel() {
		return this._valueToPixel;
	}







	/**
	 * Register the behavior to use when interacting with a shape.
	 *
	 * @param {BaseBehavior} behavior
	 */
	setBehavior(behavior) {
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

	
	get selectedDatums() {
		return this._behavior ? this._behavior.selectedDatums : new Set();
	}

	isSelected(datum) {
		return this._behavior._selectedDatums.has(datum);
	}

	select($datums) {
		if ($datums == undefined || ($datums.length == undefined && $datums.size == undefined))
			$datums = this.data;

		const that = this;
		$datums.forEach((datum) => {
			const shape = that._$datumToShape.get(datum)
			if (shape) {
				this._behavior.select(datum);
				this._toFront(datum);
				that.emit('select', layer, datum);
			} else {
				throw new Error('No shape for this datum in this layer', { datum: datum, layer, that });
			}
		});
	}

	unselect($datums) {
		if ($datums == undefined || ($datums.length == undefined && $datums.size == undefined))
			$datums = this.data;
		
		const that = this;
		$datums.forEach((datum) => {
			const shape = that._$datumToShape.get(datum)
			if (shape) {
				this._behavior.unselect(datum);
				that.emit('unselect', layer, datum);
			} else {
				throw new Error('No shape for this datum in this layer', { datum: datum, layer, that });
			}
		});
	}

	_toFront($datum) {
		const $shape = this._$datumToShape.get($datum);
		if ($shape) {
			if ($shape.$el instanceof Array) {
				$shape.$el.forEach((el) => el.moveToTop());
			} else {
				$shape.$el.moveToTop();
			}
		} else {
			throw new Error('No shape for this datum in this layer', { datum: datum, layer, that });
		}
	}


	
	toggleSelection($datums) {
		const that = this;
		$datums.forEach((datum) => {
			const shape = that._$datumToShape.get(datum)
			if (shape) {
				this._behavior.toggleSelection(datum);
				that.emit('toggle-select', layer, datum);
			} else {
				throw new Error('No shape for this datum in this layer', { datum: datum, layer, that });
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
	setTimeContext(timeContext) {
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
	configureShape(ctor, accessors, options) {
		if (!accessors) 
			accessors = {};
		if (!options) 
			options = {};
		this._shapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
	}

	/**
	* Optionnaly register a shape to be used accros the entire collection.
	*
	* @param {BaseShape} ctor - The constructor of the shape to be used.
	* @param {Object} [accessors={}] - Defines how the shape should adapt to a particular data struture.
	* @param {Object} [options={}] - Global configuration for the shapes, is specific to each `Shape`.
	*/
	configureCommonShape(ctor, accessors, options) {
		if (!accessors)	accessors = {};
		if (!options)	options = {};
		this._commonShapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
		this._commonShape = new ctor(options);
		this._commonShape.install(accessors);
		this._commonShape.render(this._renderingContext);
		this._commonShapeLayer.add(this._commonShape.$el);
	}

	/**
	* Defines if the `Layer`, and thus the `LayerTimeContext` is editable or not.
	*
	* @params {Boolean} [bool=true]
	*/
	setContextEditable(editable) {
		if (editable == undefined)
			editable = true;
		// this._contextLayer.visible(editable);
		this._contextLayer.opacity((editable)? this.params.context.opacity : 0);
		this._contextLayer.listening(true);
		this._isContextEditable = editable;
	}
	


	/**
	* Updates the values stored int the `_renderingContext` passed	to shapes
	* for rendering and updating.
	*/
	_updateRenderingContext() {

		this._renderingContext.timeToPixel = this.timeContext.timeToPixel;
		this._renderingContext.valueToPixel = this._valueToPixel;

		this._renderingContext.height = this.params.height;
		this._renderingContext.width  = this.timeContext.timeToPixel(this.timeContext.duration);
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

	getDatumFromShape($shape) {
		return this._$shapeToDatum.get($shape);
	}

	getShapeFromDatum($datum) {
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
	getDatumsInArea(area) {
		
		let x1 = area.left;
		let y1 = area.top;
		let x2 = area.left + area.width;
		let y2 = area.top + area.height;

		const $filteredDatums = new Set();

		const $entries = this._$datumToShape.entries();


		const that = this;

		this.contentLayers.forEach((contentLayer) => {
			contentLayer.children.forEach((konvaShape) => {
				const $shape = konvaShape.shape;
				const $datum = that.getDatumFromShape($shape);
				const inArea = $shape.inArea(this._renderingContext, $datum, x1, y1, x2, y2);

				if (inArea) { 
					$filteredDatums.add($datum);
				}
			});
		});
		
		return $filteredDatums;
	}




	update() {

		// this.track.$stage.clear();

		this.updateContainer();

		this.updateShapes();
		
	}


	sort_data(data) {
		throw new Error('The developer must assign a proper function');
	}

	visible_data(timeContext, data) {
		throw new Error('The developer must assign a proper function');
	}


	updateShapes($datums) {
		const that = this;
		const changedContentLayers = new Set();
		var targetData = null;
		var interval = null;
		var eraseChildren = true;

		if ($datums == undefined || this._commonShape) {
			interval = this.visible_data(this.timeContext, this.data);
		}

		if ($datums == undefined) {
			targetData = this.data.slice(interval[0], Math.min(interval[1]+1, this.data.length))
		} else {
			targetData = $datums;
			eraseChildren = false;
		}

		this._allocateShapesToLayers(this._stage, targetData, 'datums', eraseChildren).forEach((changedContentLayer) => {
			changedContentLayers.add(changedContentLayer);
		});

		// console.log('number of changedContentLayers : ' + changedContentLayers.size);

		changedContentLayers.forEach((changedContentLayer) => {
			changedContentLayer.clear();
			changedContentLayer.batchDraw();
		});

		if (this._commonShape) {
			this._commonShape.update(this._renderingContext, data.slice(interval[0], interval[1]+1));
			this._commonShapeLayer.batchDraw();
			this._commonShapeLayer.moveToBottom();
		}
	}

	updateContainer() {
		this._updateRenderingContext();

		this.contentLayers.forEach((contentLayer) => {
			contentLayer
				.offsetX(-this._renderingContext.startX)
				.x(this._renderingContext.offsetX)
				.clip({x:-this._renderingContext.offsetX, y:0, width: this._renderingContext.width, height: this._renderingContext.height})
		});

		this._commonShapeLayer
				.offsetX(-this._renderingContext.startX)
				.x(this._renderingContext.offsetX)
				.clip({x:-this._renderingContext.offsetX, y:0, width: this._renderingContext.width, height: this._renderingContext.height})
				
		this._contextShape.update(this._renderingContext, this.timeContext, 0);

		this._contextLayer.batchDraw();
		this._contextLayer.moveToBottom();
	}



	_allocateShapesToLayers(stage, objs, type, eraseChildren) {
		const LIMIT = 50;

		const changedContentLayers = new Set();

		const konvaShapes = new Set();

		/*
		 * Of course one could write less code by including the type checking inside the forEach.
		 * But that would mean a check for each object. This way, the program checks only one time.
		 * This is meant to be a small optimization. Not pretty, of course.
		 * Another thing: in order to use just one forEach at updateShapes, I included the shape update in here
		 */
		const that = this;
		if (type == 'datums') {
			objs.forEach((datum) => {
				const shape = that.getShapeFromDatum(datum);
				shape.update(that._renderingContext, datum); 
				if (shape.$el instanceof Array) {
					shape.$el.forEach((el) => konvaShapes.add(el))
				} else {
					konvaShapes.add(shape.$el);
				}
			})
		} else if (type == 'shapes') {
			objs.forEach((shape) => {
				const datum = that.getDatumFromShape(shape);
				shape.update(that._renderingContext, datum); 
				if (shape.$el instanceof Array) {
					shape.$el.forEach((el) => konvaShapes.add(el))
				} else {
					konvaShapes.add(shape.$el);
				}
			});
		} else {
			throw new Error('Unknown objects type');
		}

		const ksIt = konvaShapes.entries();

		const clIt = this.contentLayers.entries();

		var cle = clIt.next();
		var kse = ksIt.next();

		while (!cle.done) {
			const layer = cle.value[1];
			while (!kse.done && layer.children.length < LIMIT) {
				if (eraseChildren && !changedContentLayers.has(layer)) {
					layer.removeChildren();
				}
				const konvaShape = kse.value[1];
				konvaShape.remove();
				layer.add(konvaShape);
				kse = ksIt.next();
				changedContentLayers.add(layer);
			}
			cle = clIt.next();
		}

		while (!kse.done) {
			const layer = new Konva.Layer({});
			layer.layer = this;
			layer.addName('content-layer');
			layer.clearBeforeDraw(true);
			this.contentLayers.add(layer);
			stage.add(layer);
			while (!kse.done && layer.children.length < LIMIT) {
				const konvaShape = kse.value[1];
				konvaShape.remove();
				layer.add(konvaShape);
				kse = ksIt.next();
			}
			changedContentLayers.add(layer);
		}

		return changedContentLayers;
	}

	set(data) {
		const that = this;

		this.data.forEach((datum) => {
			const shape = this._$datumToShape.get(datum);
			shape.destroy();
		});
		this._$datumToShape.clear();
		this._$shapeToDatum.clear();

		this.contentLayers.forEach((layer)=> {
			layer.destroy();
		});
		
		this.data = data;

		this.data.forEach((datum) => {
			that._add(datum);
		});

		this.sort_data(this.data);

		this.emit('set', data);
	}

	_add(datum) {
		const ctor = this._shapeConfiguration.ctor;
		const accessors = this._shapeConfiguration.accessors;
		const options = this._shapeConfiguration.options;

		const shape = new ctor(options);
		shape.install(accessors);
		shape.render(this._renderingContext);
		shape.layer = this;
		shape.datum = datum;
		this._$datumToShape.set(datum, shape);
		this._$shapeToDatum.set(shape, datum);
	}

	add(datum) {
		this._add(datum);
		this.data[this.data.length] = datum;
		this.sort_data(this.data);

		this.emit('add', datum);
	}

	remove(datum) {
		const shape = this._$datumToShape.get(datum);
		if (shape) {
			const changedContentLayers = new Set();
			if (shape.$el instanceof Array) {
				shape.$el.forEach((el) => changedContentLayers.add(el));
			} else {
				changedContentLayers.add(el);
			}
			shape.layer = null;
			shape.destroy();
			this._$datumToShape.delete(datum);
			this._$shapeToDatum.delete(shape);

			changedContentLayers.forEach((layer) => {
				if (layer.children == 0) {
					layer.destroy();
					this.contentLayers.delete(layer);
				}
			});
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
	edit($datums, dx, dy, $target) {
		const that = this;
		$datums.forEach((datum) => {
			const shape = that._$datumToShape.get(datum);

			this._behavior.edit(this._renderingContext, shape, datum, dx, dy, $target);

			this.emit('edit', shape, datum);
		});
	}


	/**
	* Edit the layer and thus its related `LayerTimeContext` attributes.
	*
	* @param {Number} dx - The modification to apply in the x axis (in pixels).
	* @param {Number} dy - The modification to apply in the y axis (in pixels).
	* @param {Element} $target - The target of the event of the interaction.
	*/
	editContext(dx, dy, $target) {
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
	stretchContext(dx, dy, $target) {
		// TODO
		this.timeContextBehavior.stretch(this, dx, dy, $target);
		this.emit('stretch-context');
	}

	minimize() {
		// TODO
	}

}