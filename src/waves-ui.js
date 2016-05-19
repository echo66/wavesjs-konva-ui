// axis
import AxisLayer from './axis/axis-layer';
import timeAxisGenerator from './axis/time-axis-generator';
import gridAxisGenerator from './axis/grid-axis-generator';

// behaviors
import BaseBehavior from './behaviors/base-behavior';
import SnapBaseBehavior from './behaviors/snap-base-behavior';
import BeatGridSnapSegmentBehavior from './behaviors/beat-grid-snap-segment-behavior';
import BreakpointBehavior from './behaviors/breakpoint-behavior';
import MarkerBehavior from './behaviors/marker-behavior';
import ScrollSegmentBehavior from './behaviors/scroll-segment-behavior';
import SegmentBehavior from './behaviors/segment-behavior';
import SiblingLockedSegmentBehavior from './behaviors/sibling-locked-segment-behavior';
import SimpleSnapSegmentBehavior from './behaviors/simple-snap-segment-behavior';
import TimeContextBehavior from './behaviors/time-context-behavior';
import TraceBehavior from './behaviors/trace-behavior';
import WaveformBehavior from './behaviors/waveform-behavior';
import NoBehavior from './behaviors/no-behavior';
import NoHorizontalOverlappingSegmentsBehavior from './behaviors/no-horizontal-overlapping-segments-behavior';

// core
import LayerTimeContext from './core/layer-time-context';
import Layer from './core/layer';
import TimelineTimeContext from './core/timeline-time-context';
import Timeline from './core/timeline';
import TrackCollection from './core/track-collection';
import Track from './core/track';

// helpers
import AnnotatedMarkerLayer from './helpers/annotated-marker-layer';
import AnnotatedSegmentLayer from './helpers/annotated-segment-layer';
import BreakpointLayer from './helpers/breakpoint-layer';
import CursorLayer from './helpers/cursor-layer';
import GridAxisLayer from './helpers/grid-axis-layer';
import MarkerLayer from './helpers/marker-layer';
import SegmentLayer from './helpers/segment-layer';
import TickLayer from './helpers/tick-layer';
import TimeAxisLayer from './helpers/time-axis-layer';
import TraceLayer from './helpers/trace-layer';
import WaveformLayer from './helpers/waveform-layer';
import BeatGridLayer from './helpers/beat-grid-layer';
import Scroller from './helpers/scroller';
import BeatGridAxisLayer from './helpers/beat-grid-axis-layer';
import BrushController from './helpers/brush-controller';

// interactions
import EventSource from './interactions/event-source';
import Keyboard from './interactions/keyboard';
import Surface from './interactions/konva-surface';
import KonvaWaveEvent from './interactions/konva-wave-event';
import WaveEvent from './interactions/wave-event';

// shapes
// import AnnotatedMarker from './shapes/annotated-marker';
import AnnotatedSegment from './shapes/annotated-segment';
import AnnotatedDot from './shapes/annotated-dot';
import BaseShape from './shapes/base-shape';
import Cursor from './shapes/cursor';
import Dot from './shapes/dot';
import Line from './shapes/line';
import Marker from './shapes/marker';
import Segment from './shapes/segment';
import Ticks from './shapes/ticks';
import TraceDots from './shapes/trace-dots';
import TracePath from './shapes/trace-path';
import Waveform from './shapes/waveform';

// states
import BaseState from './states/base-state';
import BreakpointState from './states/breakpoint-state';
import BrushZoomState from './states/brush-zoom-state';
import CenteredZoomState from './states/centered-zoom-state';
import CenteredScrollState from './states/centered-scroll-state';
import ContextEditionState from './states/context-edition-state';
import DropAndAddState from './states/drop-and-add-state';
import EditionState from './states/edition-state';
import HorizontalSelectionState from './states/horizontal-selection-state';
import SelectionState from './states/selection-state';
import ShapeInsertionState from './states/shape-insertion-state';
import SimpleEditionState from './states/simple-edition-state';
import DragToCreateIntervalState from './states/drag-to-create-interval-state';
// import BeatGridEditorInteractionsState from './states/beat-grid-interactions-state';
import DragAndDropState from './states/drag-and-drop-state';



// utils
import format from './utils/format';
import OrthogonalData from './utils/orthogonal-data';
import scales from './utils/scales';

export default {
  axis: {
    AxisLayer, timeAxisGenerator, gridAxisGenerator, 
  }, 

  behaviors: {
    BaseBehavior, SnapBaseBehavior, BeatGridSnapSegmentBehavior, 
    BreakpointBehavior, MarkerBehavior, 
    ScrollSegmentBehavior, SegmentBehavior, 
    SiblingLockedSegmentBehavior, SimpleSnapSegmentBehavior, 
    TimeContextBehavior, TraceBehavior, WaveformBehavior, 
    NoBehavior, NoHorizontalOverlappingSegmentsBehavior
  }, 

  core: {
    LayerTimeContext, Layer, TimelineTimeContext, Timeline, 
    TrackCollection, Track, 
  }, 

  helpers: {
    BeatGridAxisLayer, 
    AnnotatedMarkerLayer, 
    AnnotatedSegmentLayer, 
    BreakpointLayer, 
    CursorLayer, 
    GridAxisLayer, 
    MarkerLayer, 
    SegmentLayer, 
    TickLayer, 
    TimeAxisLayer, 
    TraceLayer, 
    WaveformLayer, 
    BeatGridLayer, 
    Scroller, 
    BrushController
  },

  interactions: {
    EventSource, Keyboard, 
    Surface, KonvaWaveEvent, WaveEvent, 
  },

  shapes: {
    // AnnotatedMarker, 
    AnnotatedSegment, AnnotatedDot, BaseShape, Cursor, 
    Dot, Line, Marker, Segment, 
    Ticks, TraceDots, TracePath, Waveform, 
  },

  states: {
    BaseState, BreakpointState, BrushZoomState, CenteredZoomState, 
    CenteredScrollState, ContextEditionState, DropAndAddState, EditionState, 
    SelectionState, HorizontalSelectionState, ShapeInsertionState, SimpleEditionState, 
    DragToCreateIntervalState, DragAndDropState
  },

  utils: {
    format, OrthogonalData, scales,
  } 
};
