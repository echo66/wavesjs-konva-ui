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
    var duration = 100;

    var data = [
      { timestamp: 0, mean: 0.5, range: 0.4 },
      { timestamp: 4, mean: 0.3, range: 0.2 },
      { timestamp: 8, mean: 0.7, range: 0.5 },
      { timestamp: 12, mean: 0.6, range: 0.2 },
      { timestamp: 16, mean: 0.4, range: 0.4 },
      { timestamp: 20, mean: 0.5, range: 0.3 },
    ];

    var pixelsPerSecond = width / duration;

    var timeline = new Timeline(pixelsPerSecond, width);
    var track = new Track('container', height);

    var traceLayer = new Layer('collection', [], {
      height: height
    });

    var accessors = {
      x: function(d, v) {
        if (v !== undefined) { d.timestamp = v; }
        return d.timestamp;
      }
    };

    var shapesOptions = {
      meanColor: 'steelblue',
      rangeColor: 'steelblue'
    };

    traceLayer.sort_data = function(data) {
        data.sort(function(a, b) { 
            return a.timestamp - b.timestamp; 
        }); 
    }

    traceLayer.visible_data = function(timeContext, data) {
        const fn = function(a,b) {
            return a.timestamp - b.timestamp;
        };

        const t0 = { timestamp: -timeContext.offset };
        const t1 = { timestamp: -timeContext.offset + timeContext.duration };

        var i0 = find_index(data, t0, fn);
        var i1 = find_index(data, t1, fn);

        i0 = (i0.length > 1)? i0[0] : i0[0];
        i1 = (i1.length > 1)? i1[1] : i1[0];

        return [i0, i1];
    }

    var timeContext = new LayerTimeContext(timeline.timeContext);

    traceLayer.setTimeContext(timeContext);
    traceLayer.configureCommonShape(TracePath, accessors, shapesOptions);
    // dots can be removed by setting the layer type to 'entity' and use `TracePath` as the shape
    traceLayer.configureShape(TraceDots, accessors, shapesOptions);

    traceLayer.setBehavior(new TraceBehavior());

    traceLayer.set(data);

    timeline.state = new SimpleEditionState(timeline);

    track.add(traceLayer);
    timeline.add(track);
    
    timeline.tracks.update();