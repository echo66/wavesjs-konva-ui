'use strict'

class Layer extends events.EventEmitter {

	constructor(stage, dataType, data, options) {
		super();

		if (!options) 
			options = {};

		const defaults = {
			height: 100,
			top: 0,
			opacity: 1,
			yDomain: [0, 1],
			className: null,
			selectedClassName: 'selected',
			context: {
				handlerWidth: 2,
				handlerOpacity: 0.2,
				opacity: 0.1, 
			}, 
			contextHandlerWidth: 2, // TODO
			hittable: true, // when false the layer is not returned by `BaseState.getHitLayers`
			id: '', // used ?
			overflow: 'hidden', // usefull ?
		};

		this.track = { stage: stage }; //TODO

		/**
		* Parameters of the layers, `defaults` overrided with options.
		* @type {Object}
		*/
		this.params = Object.assign({}, defaults, options);
		this.timeContextBehavior = new TimeContextBehavior();

		this._shapeConfiguration = null;			 // { ctor, accessors, options }
		this._commonShapeConfiguration = null; // { ctor, accessors, options }
		this._$dataToShape = new Map();
		this._$shapeToData = new Map();
		this._commonShape = null;
		this._renderingContext = {};
		// this._data = data;

		this._isContextEditable = false;

		this._valueToPixel = scales.linear()
			.domain(this.params.yDomain)
			.range([this.params.height, 0]);


		this._commonShapeLayer = new Konva.FastLayer({});
		this._commonShapeLayer.addName('common-shape-layer');

		this._dragLayer = new Konva.FastLayer({});
		this._dragLayer.addName('drag-layer');

		this._contextLayer = new Konva.FastLayer({});
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
		
		stage.add(this._contextLayer);
		stage.add(this._commonShapeLayer);

		const that = this;

		// this._contentLayer.on('mousedown', (o) => that.track.stage.fire('event', that.createEventObj(o, layer, 'mousedown')));
		// this._contentLayer.on('mousemove', (o) => that.track.stage.fire('event', that.createEventObj(o, layer, 'mousemove')));
		// this._contentLayer.on('mouseup', (o) => that.track.stage.fire('event', that.createEventObj(o, layer, 'mouseup')));
		// this._contentLayer.on('mouseover', (o) => that.track.stage.fire('event', that.createEventObj(o, layer, 'mouseover')));
		// this._contentLayer.on('mouseout', (o) => that.track.stage.fire('event', that.createEventObj(o, layer, 'mouseout')));
		// this._contentLayer.on('dblclick', (o) => that.track.stage.fire('event', that.createEventObj(o, layer, 'dblclick')));

		// TODO: use a dynamic number of content layers in order to balance the work load!!!
		
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
		return this._$dataToShape.get($shape);
	}

	getShapeFromDatum($datum) {
		return this._$shapeToData.get($datum);
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

		const $entries = this._$dataToShape.entries();

		for (var i=0; i < $this._$dataToShape.size; i++) {
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

		this.track.stage.find('.content-layer').forEach((layer) => layer.draw());
		this.track.stage.find('.context-layer').forEach((layer) => layer.draw());
		this._commonShapeLayer.draw();
	}

	updateShapes() {

		const data = new Array(this._$dataToShape.size);
		const $entries = this._$dataToShape.entries();

		for (var i=0; i < this._$dataToShape.size; i++) {
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

		const stage = this.track.stage;



		this.track.stage.find('.content-layer').forEach((layer) => {
			layer.x(this.timeContext.parent.timeToPixel(this.timeContext.start))
				.offsetX(offset)
				.clip({x:offset, y:0, width: width, height: this.params.height});
		});
		this.track.stage.find('.context-layer').forEach((layer) => {
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

	toDragLayer(shape) {
		if (shape.$el instanceof Array) {
			// TODO
		} else {
			this._dragLayer.add(shape.$el);
		}
	}

	_add(stage, shape) {
		const LIMIT = 100;
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
		this._add(this.track.stage, shape);
		this._$dataToShape.set(datum, shape);
		this._$shapeToData.set(shape, datum);

	}

	remove(datum) {
		const shape = this._$dataToShape.get(datum);
		if (shape) {
			shape.layer = null;
			shape.destroy();
			this._$dataToShape.delete(datum);
			this._$shapeToData.delete(shape);

			this.track.stage.find('.content-layer').forEach((layer) => {
				if (layer.children == 0)
					layer.destroy();
			});
		}
	}

	get data() {
		const data = new Array(this._$dataToShape.size);
		
		const $entries = this._$dataToShape.entries();

		for (var i=0; i < this._$dataToShape.size; i++) {
			var entry = $entries.next();
			if (entry.done)	break;
			var $datum = entry.value[0];
			data[i] = $datum;
		}

		return data;
	}

	edit($item, dx, dy, $target) {
		// TODO
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