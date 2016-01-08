'use strict'

class Layer extends events.EventEmitter {

	constructor(track, dataType, data, options) {
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
			}, 
			hittable: true, // when false the layer is not returned by `BaseState.getHitLayers`
			id: '', // used ?
		};

		this._behavior = null;

		this.track = track;

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
		// this._data = data;

		this._isContextEditable = false;

		this._valueToPixel = scales.linear()
			.domain(this.params.yDomain)
			.range([this.params.height, 0]);

		this.Ls = new Set();

		this._commonShapeLayer = new Konva.Layer({});
		this._commonShapeLayer.addName('common-shape-layer');
		this._commonShapeLayer.layer = this;

		this._dragLayer = new Konva.Layer({});
		this._dragLayer.addName('drag-layer');
		this._dragLayer.layer = this;

		this._contextLayer = new Konva.Layer({});
		this._contextLayer.layer = this;
		this._contextLayer.addName('context-layer');
		this._contextLayer.visible(this._isContextEditable);
		this._contextShape = new Segment({});
		this._contextShape.install({
			opacity	: () => 0.1, // TODO
			color	: () => '#787878', // TODO
			width	: () => this.timeContext.duration,
			height	: () => this._renderingContext.valueToPixel.domain()[1],
			y		: () => this._renderingContext.valueToPixel.domain()[0],
			x		: () => this.timeContext.start
		}); // TODO
		this._contextShape.render(this._renderingContext);
		this._contextShape.layer = this;
		for (var i=0; i<this._contextShape.$el.length; i++) {
			this._contextLayer.add(this._contextShape.$el[i]);
		}
		
		this.track.$stage.add(this._contextLayer);
		this.track.$stage.add(this._commonShapeLayer);

		const that = this;

		this.Ls.add(this._contextLayer);
		this.Ls.add(this._dragLayer);
		this.Ls.add(this._commonShapeLayer);
		
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
		this._destroy(this.Ls.values);
		this.Ls.clear();

		this._commonShapeLayer = null;
		this._dragLayer = null;
		this._contextLayer = null;
		this._contextShape = null;
		this.track = track;
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

	createEventObj(o, layer, type) {
		var evtObj = { 
			target: o.target, 
			shape: o.target.shape, 
			layer: layer, 
			originalEvent: o.evt, 
			eventType: type
		};
		return evtObj;
	}
	
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
		this._contextLayer.visible(editable);
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
		return this._$datumToShape.get($shape);
	}

	getShapeFromDatum($datum) {
		return this._$shapeToDatum.get($datum);
	}

	/**
	* Retrieve all the items in a given area as defined in the registered `Shape~inArea` method.
	*
	* @param {Object} area - The area in which to find the elements
	* @param {Number} area.top
	* @param {Number} area.left
	* @param {Number} area.width
	* @param {Number} area.height
	* @return {Array} - list of the items presents in the area
	*/
	getItemsInArea(area) {
		const start		= this.timeContext.parent.timeToPixel(this.timeContext.start);
		const duration = this.timeContext.timeToPixel(this.timeContext.duration);
		const offset	 = this.timeContext.timeToPixel(this.timeContext.offset);
		const top			= this.params.top;
		// be aware af context's translations - constrain in working view
		let x1 = Math.max(area.left, start);
		let x2 = Math.min(area.left + area.width, start + duration);
		x1 -= (start + offset);
		x2 -= (start + offset);
		// keep consistent with context y coordinates system
		let y1 = this.params.height - (area.top + area.height);
		let y2 = this.params.height - area.top;

		y1 += this.params.top;
		y2 += this.params.top;

		const $filteredItems = [];

		const $entries = this._$datumToShape.entries();

		for (var i=0; i < $this._$datumToShape.size; i++) {
			var entry = $entries.next();

			if (entry.done)	break;

			var $datum = entry.value[0];
			var $shape = entry.value[1];

			const inArea = $shape.inArea(this._renderingContext, $datum, x1, y1, x2, y2);

			if (inArea) { $filteredItems.push($item); }
		}

		return $filteredItems;
	}




	update() {
		this.updateShapes();
		this.updateContainer();

		this.track.$stage.find('.content-layer').forEach((layer) => layer.draw());
		this.track.$stage.find('.context-layer').forEach((layer) => layer.draw());
		this._commonShapeLayer.draw();
	}

	updateShapes() {

		const data = new Array(this._$datumToShape.size);
		const $entries = this._$datumToShape.entries();

		for (var i=0; i < this._$datumToShape.size; i++) {
			var entry = $entries.next();

			if (entry.done)	break;

			var $datum = entry.value[0];
			var $shape = entry.value[1];

			$shape.update(this._renderingContext, $datum);

			data[i] = $datum;
		}

		if (this._commonShape)
			this._commonShape.update(this._renderingContext, data);
	}

	updateContainer() {
		this._updateRenderingContext();

		const timeContext = this.timeContext;
		const width  = timeContext.timeToPixel(timeContext.duration);
		// x is relative to timeline's timeContext
		const x      = timeContext.parent.timeToPixel(timeContext.start);
		const offset = timeContext.timeToPixel(timeContext.offset);
		const top    = this.params.top;
		const height = this.params.height;

		const stage = this.track.$stage;



		this.track.$stage.find('.content-layer').forEach((layer) => {
			layer.x(this.timeContext.parent.timeToPixel(this.timeContext.start))
				.offsetX(offset)
				.clip({x:offset, y:0, width: width, height: this.params.height});
		});
		this.track.$stage.find('.context-layer').forEach((layer) => {
			layer.x(this.timeContext.parent.timeToPixel(this.timeContext.start))
				.offsetX(offset)
				.clip({x:offset, y:0, width: width, height: this.params.height});
		});
		this._dragLayer.x(this.timeContext.parent.timeToPixel(this.timeContext.start))
							.offsetX(offset)
							.clip({x:offset, y:0, width: width, height: this.params.height});
		this._commonShapeLayer.x(this.timeContext.parent.timeToPixel(this.timeContext.start))
								.offsetX(offset)
								.clip({x:offset, y:0, width: width, height: this.params.height});
		

		this._contextShape.update(this._renderingContext, this.timeContext, 0);
	}




	select(datum) {
		const shape = this.$dataToShape.get(datum);
		if (shape) {
			shape.highlight = true;
		}
		// TODO: use Behavior
	}

	unselect(datum) {
		const shape = this.$dataToShape.get(datum);
		if (shape) {
			shape.highlight = false;
		}
		// TODO: use Behavior
	}

	toDrag(shape) {
		if (shape.$el instanceof Array) {
			for (var i=0; i<shape.$el.length; i++) 
				this._dragLayer.add(shape.$el[i]);
		} else {
			this._dragLayer.add(shape.$el);
		}
	}

	_shapeElementsStageAllocation(stage, shape) {
		// TODO: remove empty layers
		const LIMIT = 1000;
		const contentLayers = stage.find('.content-layer');
		var els = (shape.$el instanceof Array)? shape.$el : [shape.$el];
		var it = els.entries();
		for (var i=0; i < contentLayers.length; i++) {
			while (contentLayers[i].children.length < LIMIT) {
				var entry = it.next();
				if (entry.done)	return;
				var el = entry.value[1];
				contentLayers[i].add(el);
			}
		}
		var entry = it.next();
		const that = this;
		while (!entry.done) {
			const L = new Konva.Layer({});
			L.layer = this;
			L.addName('content-layer');
			var el = entry.value[1];
			L.on('mousedown', (o) => stage.fire('event', that.createEventObj(o, L, 'mousedown')));
			L.on('mousemove', (o) => stage.fire('event', that.createEventObj(o, L, 'mousemove')));
			L.on('mouseup', (o) => stage.fire('event', that.createEventObj(o, L, 'mouseup')));
			L.on('mouseover', (o) => stage.fire('event', that.createEventObj(o, L, 'mouseover')));
			L.on('mouseout', (o) => stage.fire('event', that.createEventObj(o, L, 'mouseout')));
			L.on('dblclick', (o) => stage.fire('event', that.createEventObj(o, L, 'dblclick')));
			L.add(el);
			stage.add(L);
			entry = it.next();
		}
	}

	add(datum) {

		const ctor = this._shapeConfiguration.ctor;
		const accessors = this._shapeConfiguration.accessors;
		const options = this._shapeConfiguration.options;

		const shape = new ctor(options);
		shape.install(accessors);
		shape.render(this._renderingContext);
		shape.layer = this;
		shape.datum = datum;
		this._shapeElementsStageAllocation(this.track.$stage, shape);
		this._$datumToShape.set(datum, shape);
		this._$shapeToDatum.set(shape, datum);

	}

	remove(datum) {
		const shape = this._$datumToShape.get(datum);
		if (shape) {
			shape.layer = null;
			shape.destroy();
			this._$datumToShape.delete(datum);
			this._$shapeToDatum.delete(shape);

			this.track.$stage.find('.content-layer').forEach((layer) => {
				if (layer.children == 0) {
					layer.destroy();
					this.Ls.delete(layer);
				}
			});
		}
	}

	get data() {
		const data = new Array(this._$datumToShape.size);
		
		const $entries = this._$datumToShape.entries();

		for (var i=0; i < this._$datumToShape.size; i++) {
			var entry = $entries.next();
			if (entry.done)	break;
			var $datum = entry.value[0];
			data[i] = $datum;
		}

		return data;
	}

	edit($item, dx, dy, $target) {
		throw new Error("deprecated");
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
	}

}