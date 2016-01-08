var width = 1200;
var height = 200;

var stage = new Konva.Stage({
	container: 'container',
	width: width,
	height: height
});

var duration = 20;

var pixelsPerSecond = 800 / duration;

var timelineTimeContext = new TimelineTimeContext(pixelsPerSecond, width);

var timeContext = new LayerTimeContext(timelineTimeContext);

var arr1 = new Float32Array(44100000);
for (var i=0; i<arr1.length; i++) 
    arr1[i] = ((Math.random() > 0.5)? 1 : -1)* Math.random() * Math.random();

var arr2 = new Float32Array(44100000);
for (var i=0; i<arr2.length; i++) 
    arr2[i] = ((Math.random() > 0.5)? 1 : -1)* Math.random() * Math.random();

var layer = new Layer(stage, 'collection', [], {
	height: height,
	yDomain: [0, 1]
});

var commonShapeOptions = {};
commonShapeOptions.color = 'green';

layer.setTimeContext(timeContext);
//layer.configureCommonShape(Line, accessors, commonShapeOptions);
layer.configureShape(Waveform, {});

layer.add({data:arr1, color:'green'})
layer.add({data:arr2, color:'red'})


layer.update();