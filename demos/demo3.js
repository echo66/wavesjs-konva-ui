var width = 1200;
var height = 200;

var stage = new Konva.Stage({
	container: 'container',
	width: width,
	height: height
});

var layer = new Konva.Layer({});

var duration = 10;

var pixelsPerSecond = 800 / duration;

var timeline = new wavesUI.core.Timeline(pixelsPerSecond, width);

var timeContext = new wavesUI.core.LayerTimeContext(timeline.timeContext);

var valueToPixel = wavesUI.utils.scales.linear()
      .domain([0, 10])
      .range([height, 0]);

var renderingContext = {};

renderingContext.timeToPixel = timeContext.timeToPixel;
renderingContext.valueToPixel = valueToPixel;

renderingContext.height = height;
renderingContext.width  = timeContext.timeToPixel(timeContext.duration);

renderingContext.offsetX = timeContext.timeToPixel(timeContext.offset);
renderingContext.startX = timeContext.parent.timeToPixel(timeContext.start);

renderingContext.trackOffsetX = timeContext.parent.timeToPixel(timeContext.parent.offset);
renderingContext.visibleWidth = timeContext.parent.visibleWidth;

var data = [
    { cx: 0, cy: 0.2 },
    { cx: 1, cy: 0.4 },
    { cx: 2, cy: 0.8 },
    { cx: 3, cy: 4, r: 2, color: 'red'},
    { cx: 4, cy: 5 },
];

for (var i=0; i<data.length; i++) {
    var s1 = new Dot({});
    var el1 = s1.render(renderingContext);
    s1.datum = data[i];
    s1.update(renderingContext);
    layer.add(el1);
}

stage.add(layer);
stage.draw();