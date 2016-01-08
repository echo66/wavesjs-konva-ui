var width = 1200;
var height = 200;

var duration = 1000;

var pixelsPerSecond = 800 / duration;

var timelineTimeContext = new TimelineTimeContext(pixelsPerSecond, width);

var track = new Track('container', height, width);
track.configure(timelineTimeContext);

var timeContext = new LayerTimeContext(timelineTimeContext);
timelineTimeContext.offset = 0;
timeContext.start = 0;
timeContext.offset = 0;

var data = [
//    { cx: 0, cy: 0.2 },
//    { cx: 1, cy: 0.4 },
//    { cx: 2, cy: 0.8 },
//    { cx: 3, cy: 4, r: 5, color: 'red'},
//    { cx: 4, cy: 1 },
//    { cx: 5, cy: 7 },
//    { cx: 6, cy: 5 },
//    { cx: 7, cy: 5, r: 10 },
];

data = new Array(10000);

for (var i=0; i<data.length; i++) {
	data[i] = {cx:i, cy:Math.random()*10 }
}

var accessors = {
    cx: function(d, v) {
        if (v !== undefined) { d.cx = v; }
        return d.cx;
    },
    cy: function(d, v) {
        if (v !== undefined) { d.cy = v; }
        return d.cy;
    }
};

var layer = new Layer(track, 'collection', [], {
	height: height,
	yDomain: [0, 10]
});

track.add(layer);

var commonShapeOptions = {};
commonShapeOptions.color = 'green';

layer.setTimeContext(timeContext);
layer.configureCommonShape(Line, accessors, commonShapeOptions);
layer.configureShape(Dot, accessors);

for (var i in data) {
	layer.add(data[i]);
}


layer.update();