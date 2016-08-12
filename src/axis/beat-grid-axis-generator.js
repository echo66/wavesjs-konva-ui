'use strict';


export default function beatGridAxisGenerator(beatGrid, signature) {
  const _beatGrid =  beatGrid;
  signature = signature || '4/4';
  const _unit = 1 / parseInt(signature.split('/')[1], 10);
  const _nbrUnitsPerMesure = parseInt(signature.split('/')[0], 10);

  return function(timeContext) {

    const pixelsPerSecond = timeContext.computedPixelsPerSecond;
    const minStep = 5;
    
    let start = Math.round(Math.max(0, _beatGrid.beats(-timeContext.offset)));
    let end = Math.round(_beatGrid.beats(-timeContext.offset + timeContext.visibleDuration));
    let focused = false;
    let data = [];

    var previousTime;

    for (let beat = start; beat < end; beat++) {
      let time = _beatGrid.seconds(beat);

      // if (previousTime !== undefined) {
      //   var dif = timeContext.timeToPixel(time - previousTime);
      //   if (dif < 20 * pixelsPerSecond) {
      //     continue;
      //   } else {
      //     previousTime = time;
      //   }
      // } else {
      //   previousTime = time;
      // }
      
      let label = "" + beat;
      // let focused = (beat % 4 === 0)? true : false;
      data.push({ time, focused, label });
    }

    return data;
  };
}

module.exports = beatGridAxisGenerator;