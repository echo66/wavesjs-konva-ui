function interval(timeline, layer, start, duration) {
	const timeContext = layer.timeContext;
	timeContext.lockedToParentInterval = false;
	//layer.setContextEditable(true);
	timeline.visibleInterval = {start: start, duration: duration}
	timeline.tracks.update()
	timeContext.start = start
	timeContext.visibleInterval = {start: start, duration: duration}
	timeline.tracks.update()
	layer.updateShapes(layer.selectedDatums)
}

function find_index(values, target, compareFn) {
	if (values.length == 0 || compareFn(target,values[0]) < 0) { 
		return [0]; 
	}
	return modified_binary_search(values, 0, values.length - 1, target, compareFn);
}

function modified_binary_search(values, start, end, target, compareFn) {
	// if the target is bigger than the last of the provided values.
	if (start > end) { return [end]; } 

	var middle = Math.floor((start + end) / 2);
	var middleValue = values[middle];

	if (compareFn(middleValue, target) < 0 && values[middle+1] && compareFn(values[middle+1], target) > 0)
		// if the target is in between the two halfs.
		return [middle, middle+1];
	else if (compareFn(middleValue, target) > 0)
		return modified_binary_search(values, start, middle-1, target, compareFn); 
	else if (compareFn(middleValue, target) < 0)
		return modified_binary_search(values, middle+1, end, target, compareFn); 
	else 
		return [middle]; //found!
}

var width = 1200;
var height = 200;

var duration = 10;

var pixelsPerSecond = width / duration;


var timeline = new Timeline(pixelsPerSecond, width);

var track = new Track('container', height, width);
timeline.add(track);

var timeContext = new LayerTimeContext(timeline.timeContext);
timeContext.duration = duration;

var layer = new Layer('collection', [], {
	height: height/2,
	yDomain: [0, 10]
});
layer.setBehavior(new BreakpointBehavior())
layer.setTimeContext(timeContext);
layer.configureCommonShape(Line, {}, {
		color: 'green'
});
layer.configureShape(Dot, {
	x: function(d, v) {
        if (v !== undefined) { d.x = v; }
        return d.x;
    },
    y: function(d, v) {
        if (v !== undefined) { d.y = v; }
        return d.y;
    },
    r: function() { return 5; }
});


layer.sort_data = function(data) {
	data.sort(function(a, b) { 
		return a.x - b.x; 
	}); 
}

layer.visible_data = function(timeContext, data) {
	const fn = function(a,b) {
		return a.x - b.x;
	};

	const t0 = { x: -timeContext.offset };
	const t1 = { x: -timeContext.offset + timeContext.duration };

	var i0 = find_index(data, t0, fn);
	var i1 = find_index(data, t1, fn);

	i0 = (i0.length > 1)? i0[0] : i0[0];
	i1 = (i1.length > 1)? i1[1] : i1[0];

	return [i0, i1];
}

track.add(layer);

layer.set(data);

layer.update();

timeline.state = new BreakpointState(timeline, function(x, y) {
	// this callback allow to create a datum from values represented by the new dot
	return { x: x, y: y };
});

timeline.state = new SelectionState(timeline);

timeline.state = new BrushZoomState(timeline);

timeline.state = new CenteredZoomState(timeline);

timeline.state = new HorizontalSelectionState(timeline);