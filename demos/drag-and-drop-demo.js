{
	var div = document.createElement('div');
	var p = document.createElement('p');
	p.innerHTML = "Element To Drag";
	p.draggable = true;
	p.id = "source";
	div.appendChild(p);
	document.body.appendChild(div);
}

master.innerHTML = "";

var width = master.getBoundingClientRect().width;
var height = 100;
var duration = 100;
var pixelsPerSecond = width / duration;

var timeline = new wavesUI.core.Timeline(pixelsPerSecond, width);
var timeContext = new wavesUI.core.LayerTimeContext(timeline.timeContext);
var track = new wavesUI.core.Track(master, height, width);
timeline.add(track, 'track-1');
track.update();


timeline.state = new wavesUI.states.DragAndDropState(timeline);
timeline.state.onDataAvailable = function(time, data, eventType) {
	switch(eventType) {
		case 'drag': 
			console.log('drag');
			return 10
		case 'drop':
			console.log('drop');
			break;
	}
};