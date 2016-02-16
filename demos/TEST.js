'use strict'

var sdata = new Array(100);
for (var i=0; i<sdata.length; i++) {
	sdata[i] = {x:i, width: Math.max(Math.random(), 0.5), height: Math.max(Math.random(), 0.5) }
}

var wdata = new Float32Array(441000);
for (var i=0; i<wdata.length; i++) 
    wdata[i] = ((Math.random() > 0.5)? 1 : -1)* Math.random() * Math.random();



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

function sort_data(data) {
	data.sort(function(a, b) { 
		return a.x - b.x; 
	}); 
}

function visible_data(timeContext, data) {
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



master.innerHTML = "";

var width = master.getBoundingClientRect().width;
var height = 100;
var duration = 100;
var pixelsPerSecond = width / duration;
var timeline = new wavesUI.core.Timeline(pixelsPerSecond, width);

for (var i=0; i<10; i++) {
	var t = document.createElement('div');
	t.classList.add("track-div");
	master.appendChild(t);
	let track = new wavesUI.core.Track(t, height, width);
	track.i = i;
	timeline.add(track);

	let markersLayer = new wavesUI.core.Layer('collection', [], {
		height: height,
		yDomain: [0, 1]
	});
	markersLayer.setBehavior(new wavesUI.behaviors.MarkerBehavior())
	markersLayer.setTimeContext(new wavesUI.core.LayerTimeContext(timeline.timeContext));
	markersLayer.configureShape(wavesUI.shapes.Marker, {});
	markersLayer.timeContext.lockedToParentInterval = true;
	markersLayer.sort_data = sort_data;
	markersLayer.visible_data = visible_data;

	markersLayer.set(sdata.slice(0));

	track.add(markersLayer);


	let wavLayer = new wavesUI.core.Layer('collection', [], {
		height: height,
		yDomain: [0, 1]
	});
	wavLayer.setBehavior(new wavesUI.behaviors.WaveformBehavior());
	wavLayer.setTimeContext(new wavesUI.core.LayerTimeContext(timeline.timeContext));
	wavLayer.configureShape(wavesUI.shapes.Waveform, {}, {});
	wavLayer.visible_data = visible_data;
	wavLayer.sort_data = sort_data;
	wavLayer.timeContext.lockedToParentInterval = true

	wavLayer.add({
		data: wdata,
		bufferStart: 0, 
		bufferEnd: wdata.length, 
		x: 0 , 
		width: Math.max(1, 4*Math.random()), 
		text: "W"+0
	});

	// track.add(wavLayer);
	
}
timeline.tracks.update()

timeline.state = new wavesUI.states.CenteredZoomState(timeline);
timeline.state = new wavesUI.states.SimpleEditionState(timeline)
timeline.state = new wavesUI.states.DropAndAddState(timeline)



var scroller = new wavesUI.helpers.Scroller(master, timeline, pixelsPerSecond, width, 20);