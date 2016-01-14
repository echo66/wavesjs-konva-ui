function interval(timeline, pointsLayer, start, duration) {
	const timeContext = pointsLayer.timeContext;
	timeContext.lockedToParentInterval = false;
	//pointsLayer.setContextEditable(true);
	timeline.visibleInterval = {start: start, duration: duration}
	timeline.tracks.update()
	timeContext.start = start
	timeContext.visibleInterval = {start: start, duration: duration}
	timeline.tracks.update()
	pointsLayer.updateShapes(pointsLayer.selectedDatums)
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



var sdata = new Array(10000);
for (var i=0; i<sdata.length; i++) {
	sdata[i] = {x:i, width: Math.max(Math.random(), 0.5), height: Math.max(Math.random(), 0.5) }
}

var pdata = new Array(10000);
for (var i=0; i<pdata.length; i++) {
	pdata[i] = {x:i, y:Math.random()*10 }
}

var mdata = new Array(10000);
for (var i=0; i<mdata.length; i++) {
	mdata[i] = {x:i + Math.random()*0.5 }
}



var width = 1200;
var height = 200;
var duration = 10;
var pixelsPerSecond = width / duration;

var timeline = new Timeline(pixelsPerSecond, width);
var track = new Track('container', height, width);
timeline.add(track);









var pointsLayer = new Layer('collection', [], {
	top: 0,
	height: height,
	yDomain: [0, 10]
});
pointsLayer.setBehavior(new BreakpointBehavior())
pointsLayer.setTimeContext(new LayerTimeContext(timeline.timeContext));
pointsLayer.configureCommonShape(Line, {}, { color: 'green' });
pointsLayer.configureShape(Dot, {
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


pointsLayer.sort_data = function(data) {
	data.sort(function(a, b) { 
		return a.x - b.x; 
	}); 
}

pointsLayer.visible_data = function(timeContext, data) {
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

pointsLayer.set(pdata);

track.add(pointsLayer);








var segmentsLayer = new Layer('collection', [], {
	height: height,
	yDomain: [0, 1]
});
segmentsLayer.setBehavior(new SegmentBehavior())
segmentsLayer.setTimeContext(new LayerTimeContext(timeline.timeContext));
segmentsLayer.configureShape(Segment, {});


segmentsLayer.sort_data = function(data) {
	data.sort(function(a, b) { 
		return a.x - b.x; 
	}); 
}

segmentsLayer.visible_data = function(timeContext, data) {
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

segmentsLayer.set(sdata);

track.add(segmentsLayer);


timeline.tracks.update();





var markersLayer = new Layer('collection', [], {
	height: height,
	yDomain: [0, 1]
});
markersLayer.setBehavior(new MarkerBehavior())
markersLayer.setTimeContext(new LayerTimeContext(timeline.timeContext));
markersLayer.configureShape(Marker, {});


markersLayer.sort_data = function(data) {
	data.sort(function(a, b) { 
		return a.x - b.x; 
	}); 
}

markersLayer.visible_data = function(timeContext, data) {
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

track.add(markersLayer);

markersLayer.set(mdata);

timeline.tracks.update();