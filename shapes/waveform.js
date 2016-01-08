'use strict'


class Waveform extends BaseShape {

  destroy() {
    this.$label.destroy();
    this.$label = null;

    this.$header.destroy();
    this.$header = null;

    this.$body.destroy();
    this.$body = null;

    this.$leftHandler.destroy();
    this.$leftHandler = null;

    this.$rightHandler.destroy();
    this.$rightHandler = null;

    this.$waveform.destroy();
    this.$waveform = null;

    super.destroy();
  }

  getClassName() { return 'waveform'; }

  _getAccessorList() {
    // return { y: 0 };
    // TODO: delete all but sampleRate.
    return { data: [], x: 0, width: 10000, bufferStart: 0, bufferEnd: 0, sampleRate: 44100, color: 'black', text: "" };
  }

  _getDefaults() {
    return {
      waveformQuality: 5000, 
      squaringFactor: 1, 
      displayHandlers: true, 
      headerHeightRatio: 0.1, // 10% of the body height
      waveform: {
        color: '#000000',
        opacity: 1, 
      },
      header: {
        color: 'green',
        opacity: 0.4, 
      },
      body: {
        color: 'yellow',
        opacity: 0.1, 
      },
      handler: {
        width: 2, 
        opacity: 1,
        color: 'orange'
      },
      highlight: {
        waveform: {
          color: '#000000',
          opacity: 1, 
        },
        header: {
          color: '#000000',
          opacity: 1, 
        },
        body: {
          color: '#000000',
          opacity: 1, 
        },
        handler: {
          width: 2, 
          opacity: 1,
          color: '#000000'
        },
      }
    };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }

    this.$el = [];

    this.$header = new Konva.Rect({});
    this.$header.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
    this.$header.on('mouseout', function() { document.body.style.cursor = 'default'; });    

    this.$body   = new Konva.Rect({});
    this.$body.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
    this.$body.on('mouseout', function() { document.body.style.cursor = 'default'; });

    this.$leftHandler = new Konva.Rect({});
    this.$leftHandler.on('mouseover', function() { document.body.style.cursor = 'ew-resize'; });
    this.$leftHandler.on('mouseout', function() { document.body.style.cursor = 'default'; });

    this.$rightHandler = new Konva.Rect({});
    this.$rightHandler.on('mouseover', function() { document.body.style.cursor = 'ew-resize'; });
    this.$rightHandler.on('mouseout', function() { document.body.style.cursor = 'default'; });

    this.$label = new Konva.Text({ listening: false });

    this.$waveform = new Konva.Path({ listening: false });

    this.$el.push(this.$body);
    this.$el.push(this.$waveform);
    this.$el.push(this.$header);
    this.$el.push(this.$label);
    this.$el.push(this.$leftHandler);
    this.$el.push(this.$rightHandler);

    return this.$el;
  }

  update(renderingContext, datum) {
    const d = datum || this.datum;

    this.$label.visible(this.visible);
    this.$body.visible(this.visible);
    this.$leftHandler.visible(this.visible && this.params.displayHandlers);
    this.$rightHandler.visible(this.visible && this.params.displayHandlers);
    this.$waveform.visible(this.visible);

    if (!this.visible)  return;


    const x = renderingContext.timeToPixel(this.x(d));
    const width = renderingContext.timeToPixel(this.width(d));
    const height = renderingContext.height;
    const color = this.params.waveform.color;

    for (var i in this.$el) {
      this.$el[i].x(x).y(0);
    }

    this.$label.text(this.text(d)).x(x+10).y(5);

    this.$header.width(Math.max(width, 0))
                .height(height * this.params.headerHeightRatio)
                .fill(this.params.header.color)
                .opacity(this.params.header.opacity);
    this.$body.width(Math.max(width, 0))
                .height(height)
                .fill(this.params.body.color)
                .opacity(this.params.body.opacity);

    this.$leftHandler.width(this.params.handler.width).height(height).fill(this.params.handler.color);

    this.$rightHandler.x(x + width - this.params.handler.width).width(this.params.handler.width).height(height).fill(this.params.handler.color);

    this.$waveform.fill(this.params.waveform.color).opacity(this.params.waveform.opacity).y(0);

    this.$waveform.perfectDrawEnabled(false);

    if (this.oldPixelsPerSecond == renderingContext.pixelsPerSecond) 
      return;
    else 
      this.oldPixelsPerSecond = renderingContext.pixelsPerSecond;


    this.$waveform.clearCache();

    // THIS VERSION GENERATES TWO PATHS, BOTH MIRROR OF THE OTHER, ALIGNED AT THE CENTER OF THE YDOMAIN.
    const arr = this.data(d).subarray(this.bufferStart(d), this.bufferEnd(d));
    const ORIGINSIZE = arr.length;
    const WANTEDSIZE = this.params.waveformQuality ;
    const that = this;
    const speed = ORIGINSIZE / WANTEDSIZE;
    const yDomain = renderingContext.valueToPixel.domain();
    const midY = (Math.max(yDomain[0], yDomain[1]) - Math.min(yDomain[0], yDomain[1])) / 2;
    const pMidY = renderingContext.valueToPixel(midY);

    let pathBottom = '';
    let pathUpper  = '';

    for (let i = 0; i < ORIGINSIZE; i += speed) {

      let x  = (i/ORIGINSIZE) * this.width(d) / this.params.squaringFactor;
      let px = renderingContext.timeToPixel(x);

      let Y  = this.linear_interpolation(arr, i);

      let yU  = (Math.abs(Y) / 2) + midY;
      let pyU = renderingContext.valueToPixel(yU);
      pathUpper  += `${px},${pyU}L`;

      let yB  = (-Math.abs(Y) / 2) + midY;
      let pyB = renderingContext.valueToPixel(yB);
      pathBottom += `${px},${pyB}L`;

    }

    let pWidth = renderingContext.timeToPixel(this.width(d));
    pathBottom = 'M' + `${0},${pMidY}L` + pathBottom + `${pWidth/ this.params.squaringFactor},${pMidY}` + 'z';
    pathUpper  = 'M' + `${0},${pMidY}L` + pathUpper  + `${pWidth/ this.params.squaringFactor},${pMidY}` + 'z';

    this.$waveform.data(pathUpper + pathBottom).cache();
    // TODO
  }

  inArea(renderingContext, datum, x1, y1, x2, y2) {
    const shapeX1 = renderingContext.timeToPixel(this.x(datum));
    const shapeX2 = renderingContext.timeToPixel(this.x(datum) + this.width(datum));
    const shapeY1 = renderingContext.valueToPixel(this.y(datum));
    const shapeY2 = renderingContext.valueToPixel(this.y(datum) + this.height(datum));

    // http://jsfiddle.net/uthyZ/ - check overlaping area
    const xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
    const yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
    const area = xOverlap * yOverlap;

    return area > 0;
  }

  linear_interpolation(arr, pos) {
    const first   = Math.floor(pos);
    const frac    = pos - first;
    const second  = (first + 1) < arr.length ? (first + 1) : 0;

    return arr[first] * (1 - frac) + arr[second] * frac;
  }
}