'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Symbol$iterator = require('babel-runtime/core-js/symbol/iterator')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _interactionsKeyboard = require('../interactions/keyboard');

var _interactionsKeyboard2 = _interopRequireDefault(_interactionsKeyboard);

var _layerTimeContext = require('./layer-time-context');

var _layerTimeContext2 = _interopRequireDefault(_layerTimeContext);

var _interactionsKonvaMouseSurface = require('../interactions/konva-mouse-surface');

var _interactionsKonvaMouseSurface2 = _interopRequireDefault(_interactionsKonvaMouseSurface);

var _timelineTimeContext = require('./timeline-time-context');

var _timelineTimeContext2 = _interopRequireDefault(_timelineTimeContext);

var _track = require('./track');

var _track2 = _interopRequireDefault(_track);

var _trackCollection = require('./track-collection');

var _trackCollection2 = _interopRequireDefault(_trackCollection);

var Timeline = (function (_events$EventEmitter) {
  _inherits(Timeline, _events$EventEmitter);

  /**
   * @param {Number} [pixelsPerSecond=100] - the default scaling between time and pixels.
   * @param {Number} [visibleWidth=1000] - the default visible area for all registered tracks.
   */

  function Timeline(pixelsPerSecond, visibleWidth, opts) {
    _classCallCheck(this, Timeline);

    _get(Object.getPrototypeOf(Timeline.prototype), 'constructor', this).call(this);

    if (pixelsPerSecond === undefined) pixelsPerSecond = 100;
    if (visibleWidth === undefined) visibleWidth = 1000;
    if (opts === undefined) {
      opts = { registerKeyboard: true };
    } else if (opts.registerKeyboard === undefined) {
      opts.registerKeyboard = true;
    }

    this._tracks = new _trackCollection2['default'](this);
    this._state = null;

    // default interactions
    this._surfaceCtor = _interactionsKonvaMouseSurface2['default'];

    if (opts.registerKeyboard) {
      this.createInteraction(_interactionsKeyboard2['default'], document);
    }

    // stores
    this._trackById = {};
    this._groupedLayers = {};

    /** @type {TimelineTimeContext} - master time context for the visualization. */
    this.timeContext = new _timelineTimeContext2['default'](pixelsPerSecond, visibleWidth);
  }

  /**
   * Returns `TimelineTimeContext`'s `offset` time domain value.
   *
   * @type {Number} [offset=0]
   */

  _createClass(Timeline, [{
    key: 'configureSurface',

    /**
     * Overrides the default `Surface` that is instanciated on each `Track`
     * instance. This methos should be called before adding any `Track` instance
     * to the current `timeline`.
     *
     * @param {EventSource} ctor - The constructor to use in order to catch mouse
     *    events on each `Track` instances.
     */
    value: function configureSurface(ctor) {
      this._surfaceCtor = ctor;
    }

    /**
     * Factory method to add interaction modules the timeline should listen to.
     * By default, the timeline instanciate a global `Keyboard` instance and a
     * `Surface` instance on each container.
     * Should be used to install new interactions implementing the `EventSource` interface.
     *
     * @param {EventSource} ctor - The contructor of the interaction module to instanciate.
     * @param {Element} $el - The DOM element which will be binded to the `EventSource` module.
     * @param {Object} [options={}] - Options to be applied to the `ctor`.
     */
  }, {
    key: 'createInteraction',
    value: function createInteraction(ctor, $el, options) {
      var _this = this;

      if (options === undefined) options = {};
      var interaction = new ctor($el, options);
      interaction.on('event', function (e) {
        return _this._handleEvent(e);
      });
    }

    /**
     * Returns a list of the layers situated under the position of a `WaveEvent`.
     *
     * @param {WavesEvent} e - An event triggered by a `WaveEvent`
     * @return {Array} - Matched layers
     */
  }, {
    key: 'getHitLayers',
    value: function getHitLayers(e) {
      var x = e.originalEvent.offsetX;
      var y = e.originalEvent.offsetY;

      var layers = [];

      this.layers.forEach(function (layer) {
        var ctxX = layer._contextShape.$segment.getAbsolutePosition().x;
        var ctxY = layer._contextShape.$segment.getAbsolutePosition().y;
        var ctxW = layer._contextShape.$segment.width();
        var ctxH = layer._contextShape.$segment.height();

        if (x >= ctxX && x <= ctxX + ctxW && y >= ctxY && y <= ctxY + ctxH) layers.push(layer);
      });

      return layers;
    }

    /**
     * The callback that is used to listen to interactions modules.
     *
     * @param {WaveEvent} e - An event generated by an interaction modules (`EventSource`).
     */
  }, {
    key: '_handleEvent',
    value: function _handleEvent(e) {
      var hitLayers = e.source === 'surface' ? this.getHitLayers(e) : null;
      // emit event as a middleware
      this.emit('event', e, hitLayers);
      // propagate to the state
      if (!this._state) {
        return;
      }
      this._state.handleEvent(e, hitLayers);
    }

    /**
     * Updates the state of the timeline.
     *
     * @type {BaseState}
     */
  }, {
    key: 'add',

    /**
     * Adds a new track to the timeline.
     *
     * @param {Track} track - The new track to be registered in the timeline.
     * @param {String} [trackId=null] - Optionnal unique id to associate with
     *    the track, this id only exists in timeline's context and should be used
     *    in conjonction with `addLayer` method.
     */
    value: function add(track, trackId) {
      if (trackId === undefined) trackId = null;

      if (this.tracks.indexOf(track) !== -1) {
        throw new Error('track already added to the timeline');
      }

      this._registerTrackId(track, trackId);
      track.configure(this.timeContext);

      this.tracks.push(track);
      this.createInteraction(this._surfaceCtor, track);

      this.emit('add', track, trackId);
    }

    /**
     * Removes a track from the timeline and destroys that track.
     *
     * @param {Track} track - the track to remove from the timeline.
     * @todo not implemented.
     */
  }, {
    key: 'remove',
    value: function remove(track) {
      var index = this.tracks.indexOf(track);
      var trackId;
      if (this.tracks.indexOf(track) !== -1) {
        track.destroy();
        delete this._trackById[track.id];
        trackId = track.id;
        track.id = null;
      }
      this.emit('remove', track, trackId);
    }

    /**
     * Helper to create a new `Track` instance. The `track` is added,
     * rendered and updated before being returned.
     *
     * @param {Element} $el - The DOM element where the track should be inserted.
     * @param {Number} trackHeight - The height of the newly created track.
     * @param {String} [trackId=null] - Optionnal unique id to associate with
     *    the track, this id only exists in timeline's context and should be used in
     *    conjonction with `addLayer` method.
     * @return {Track}
     */
  }, {
    key: 'createTrack',
    value: function createTrack($el, trackHeight, trackId) {
      if (trackHeight === undefined) trackHeight = 100;
      if (trackId === undefined) trackId = null;

      var track = new _track2['default']($el, trackHeight);
      // Add track to the timeline
      this.add(track, trackId);
      track.render();
      track.update();

      return track;
    }

    /**
     * If track id is defined, associate a track with a unique id.
     */
  }, {
    key: '_registerTrackId',
    value: function _registerTrackId(track, trackId) {
      if (trackId !== null) {
        if (this._trackById[trackId] !== undefined) {
          throw new Error('trackId: "' + trackId + '" is already used');
        }
        track.id = trackId;
        this._trackById[trackId] = track;
      }
    }

    /**
     * Helper to add a `Layer` instance into a given `Track`. Is designed to be
     * used in conjonction with the `Timeline~getLayersByGroup` method. The
     * layer is internally rendered and updated.
     *
     * @param {Layer} layer - The `Layer` instance to add into the visualization.
     * @param {(Track|String)} trackOrTrackId - The `Track` instance (or its `id`
     *    as defined in the `createTrack` method) where the `Layer` instance should be inserted.
     * @param {String} [groupId='default'] - An optionnal group id in which the
     *    `Layer` should be inserted.
     * @param {Boolean} [isAxis] - Set to `true` if the added `layer` is an
     *    instance of `AxisLayer` (these layers shares the `TimlineTimeContext` instance
     *    of the timeline).
     */
  }, {
    key: 'addLayer',
    value: function addLayer(layer, trackOrTrackId, groupId, isAxis) {

      if (groupId === undefined) groupId = 'default';
      if (isAxis === undefined) isAxis = false;

      var track = trackOrTrackId;

      if (typeof trackOrTrackId === 'string') {
        track = this.getTrackById(trackOrTrackId);
      }

      // creates the `LayerTimeContext` if not present
      if (!layer.timeContext) {
        var timeContext = isAxis ? this.timeContext : new _layerTimeContext2['default'](this.timeContext);

        layer.setTimeContext(timeContext);
      }

      // we should have a Track instance at this point
      track.add(layer);

      if (!this._groupedLayers[groupId]) {
        this._groupedLayers[groupId] = [];
      }

      this._groupedLayers[groupId].push(layer);

      layer.render();
      layer.update();
    }

    /**
     * Removes a layer from its track. The layer is detatched from the DOM but
     * can still be reused later.
     *
     * @param {Layer} layer - The layer to remove.
     */
  }, {
    key: 'removeLayer',
    value: function removeLayer(layer) {
      this.tracks.forEach(function (track) {
        var index = track.layers.indexOf(layer);
        if (index !== -1) {
          track.remove(layer);
        }
      });

      // clean references in helpers
      for (var groupId in this._groupedLayers) {
        var group = this._groupedLayers[groupId];
        var index = group.indexOf(layer);

        if (index !== -1) {
          group.splice(layer, 1);
        }

        if (!group.length) {
          delete this._groupedLayers[groupId];
        }
      }
    }

    /**
     * Returns a `Track` instance from it's given id.
     *
     * @param {String} trackId
     * @return {Track}
     */
  }, {
    key: 'getTrackById',
    value: function getTrackById(trackId) {
      return this._trackById[trackId];
    }

    /**
     * Returns the track containing a given DOM Element, returns null if no match found.
     *
     * @param {Element} $el - The DOM Element to be tested.
     * @return {Track}
     */
  }, {
    key: 'getTrackFromDOMElement',
    value: function getTrackFromDOMElement($el) {

      for (var i = 0; i < this.tracks.length; i++) {
        if (this.tracks[i].$stage.content === $el) return track;
      }

      return undefined;
    }

    /**
     * Returns an array of layers from their given group id.
     *
     * @param {String} groupId - The id of the group as defined in `addLayer`.
     * @return {(Array|undefined)}
     */
  }, {
    key: 'getLayersByGroup',
    value: function getLayersByGroup(groupId) {
      return this._groupedLayers[groupId];
    }

    /**
     * Iterates through the added tracks.
     */
  }, {
    key: _Symbol$iterator,
    value: _regeneratorRuntime.mark(function value() {
      return _regeneratorRuntime.wrap(function value$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.delegateYield(_getIterator(this.tracks), 't0', 1);

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, value, this);
    })
  }, {
    key: 'offset',
    get: function get() {
      return this.timeContext.offset;
    },

    /**
     * Updates `TimelineTimeContext`'s `offset` time domain value.
     *
     * @type {Number} [offset=0]
     */
    set: function set(value) {
      this.timeContext.offset = value;
    }

    /**
     * Returns the `TimelineTimeContext`'s `zoom` value.
     *
     * @type {Number} [offset=0]
     */
  }, {
    key: 'zoom',
    get: function get() {
      return this.timeContext.zoom;
    },

    /**
     * Updates the `TimelineTimeContext`'s `zoom` value.
     *
     * @type {Number} [offset=0]
     */
    set: function set(value) {
      this.timeContext.zoom = value;
    }

    /**
     * Returns the `TimelineTimeContext`'s `pixelsPerSecond` ratio.
     *
     * @type {Number} [offset=0]
     */
  }, {
    key: 'pixelsPerSecond',
    get: function get() {
      return this.timeContext.pixelsPerSecond;
    },

    /**
     * Updates the `TimelineTimeContext`'s `pixelsPerSecond` ratio.
     *
     * @type {Number} [offset=0]
     */
    set: function set(value) {
      this.timeContext.pixelsPerSecond = value;
    }

    /**
     * Returns the time interval of the visible area in the timeline.
     *
     * @type {Object} 
     */
  }, {
    key: 'visibleInterval',
    get: function get() {
      return this.timeContext.visibleInterval;
    },

    /**
     * Focus the timeline visible area in the provided time interval.
     *
     * @type {Object} 
     */
    set: function set(value) {
      this.timeContext.visibleInterval = value;
    }

    /**
     * Returns the `TimelineTimeContext`'s `visibleWidth` pixel domain value.
     *
     * @type {Number} [offset=0]
     */
  }, {
    key: 'visibleWidth',
    get: function get() {
      return this.timeContext.visibleWidth;
    },

    /**
     * Updates the `TimelineTimeContext`'s `visibleWidth` pixel domain value.
     *
     * @type {Number} [offset=0]
     */
    set: function set(value) {
      this.timeContext.visibleWidth = value;
    }

    /**
     * Returns `TimelineTimeContext`'s `timeToPixel` transfert function.
     *
     * @type {Function}
     */
  }, {
    key: 'timeToPixel',
    get: function get() {
      return this.timeContext.timeToPixel;
    }

    /**
     * Returns `TimelineTimeContext`'s `visibleDuration` helper value.
     *
     * @type {Number}
     */
  }, {
    key: 'visibleDuration',
    get: function get() {
      return this.timeContext.visibleDuration;
    }

    /**
     * Updates the `TimelineTimeContext`'s `maintainVisibleDuration` value.
     * Defines if the duration of the visible area should be maintain when
     * the `visibleWidth` attribute is updated.
     *
     * @type {Boolean}
     */
  }, {
    key: 'maintainVisibleDuration',
    set: function set(bool) {
      this.timeContext.maintainVisibleDuration = bool;
    },

    /**
     * Returns `TimelineTimeContext`'s `maintainVisibleDuration` current value.
     *
     * @type {Boolean}
     */
    get: function get() {
      return this.timeContext.maintainVisibleDuration;
    }

    /**
     * Object maintaining arrays of `Layer` instances ordered by their `groupId`.
     * Is used internally by the `TrackCollection` instance.
     *
     * @type {Object}
     */
  }, {
    key: 'groupedLayers',
    get: function get() {
      return this._groupedLayers;
    }
  }, {
    key: 'state',
    set: function set(state) {
      if (this._state) {
        this._state.exit();
      }
      this._state = state;
      if (this._state) {
        this._state.enter();
      }
    },

    /**
     * Returns the current state of the timeline.
     *
     * @type {BaseState}
     */
    get: function get() {
      return this._state;
    }

    /**
     * Returns the `TrackCollection` instance.
     *
     * @type {TrackCollection}
     */
  }, {
    key: 'tracks',
    get: function get() {
      return this._tracks;
    }

    /**
     * Returns the list of all registered layers.
     *
     * @type {Array}
     */
  }, {
    key: 'layers',
    get: function get() {
      return this._tracks.layers;
    }
  }]);

  return Timeline;
})(_events2['default'].EventEmitter);

exports['default'] = Timeline;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb3JlL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQW1CLFFBQVE7Ozs7b0NBRU4sMEJBQTBCOzs7O2dDQUNsQixzQkFBc0I7Ozs7NkNBQ3JCLHFDQUFxQzs7OzttQ0FDbkMseUJBQXlCOzs7O3FCQUN2QyxTQUFTOzs7OytCQUNDLG9CQUFvQjs7OztJQUUzQixRQUFRO1lBQVIsUUFBUTs7Ozs7OztBQUtoQixXQUxRLFFBQVEsQ0FLZixlQUFlLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRTswQkFMOUIsUUFBUTs7QUFNekIsK0JBTmlCLFFBQVEsNkNBTWpCOztBQUVSLFFBQUksZUFBZSxLQUFLLFNBQVMsRUFDL0IsZUFBZSxHQUFHLEdBQUcsQ0FBQztBQUN4QixRQUFJLFlBQVksS0FBSyxTQUFTLEVBQzVCLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDdEIsUUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO0FBQ3RCLFVBQUksR0FBRyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxDQUFDO0tBQ25DLE1BQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxFQUFFO0FBQzlDLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7S0FDOUI7O0FBRUQsUUFBSSxDQUFDLE9BQU8sR0FBRyxpQ0FBb0IsSUFBSSxDQUFDLENBQUM7QUFDekMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7OztBQUduQixRQUFJLENBQUMsWUFBWSw2Q0FBb0IsQ0FBQzs7QUFFdEMsUUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7QUFDekIsVUFBSSxDQUFDLGlCQUFpQixvQ0FBVyxRQUFRLENBQUMsQ0FBQztLQUM1Qzs7O0FBR0QsUUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDckIsUUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7OztBQUd6QixRQUFJLENBQUMsV0FBVyxHQUFHLHFDQUF3QixlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUM7R0FDM0U7Ozs7Ozs7O2VBbENrQixRQUFROzs7Ozs7Ozs7OztXQXNMWCwwQkFBQyxJQUFJLEVBQUU7QUFDckIsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7S0FDMUI7Ozs7Ozs7Ozs7Ozs7O1dBWWdCLDJCQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFOzs7QUFDcEMsVUFBSSxPQUFPLEtBQUssU0FBUyxFQUN2QixPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2YsVUFBTSxXQUFXLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLGlCQUFXLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLENBQUM7ZUFBSyxNQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDdEQ7Ozs7Ozs7Ozs7V0FRVyxzQkFBQyxDQUFDLEVBQUU7QUFDZCxVQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztBQUNsQyxVQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQzs7QUFFbEMsVUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDOztBQUVoQixVQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUM3QixZQUFNLElBQUksR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsRSxZQUFNLElBQUksR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsRSxZQUFNLElBQUksR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNsRCxZQUFNLElBQUksR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFbkQsWUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxJQUFJLEVBQ2hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDdEIsQ0FBQyxDQUFDOztBQUVILGFBQU8sTUFBTSxDQUFDO0tBQ2Y7Ozs7Ozs7OztXQU9XLHNCQUFDLENBQUMsRUFBRTtBQUNkLFVBQU0sU0FBUyxHQUFHLEFBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxTQUFTLEdBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDOztBQUU5QixVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRWpDLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQUUsZUFBTztPQUFFO0FBQzdCLFVBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztLQUN2Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBZ0RFLGFBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtBQUNsQixVQUFJLE9BQU8sS0FBSyxTQUFTLEVBQ3ZCLE9BQU8sR0FBRyxJQUFJLENBQUM7O0FBRWpCLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDckMsY0FBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO09BQ3hEOztBQUVELFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDdEMsV0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRWxDLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVqRCxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDbEM7Ozs7Ozs7Ozs7V0FRSyxnQkFBQyxLQUFLLEVBQUU7QUFDWixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QyxVQUFJLE9BQU8sQ0FBQztBQUNaLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDckMsYUFBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2hCLGVBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakMsZUFBTyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7QUFDbkIsYUFBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7T0FDakI7QUFDRCxVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDckM7Ozs7Ozs7Ozs7Ozs7OztXQWFVLHFCQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFO0FBQ3JDLFVBQUksV0FBVyxLQUFLLFNBQVMsRUFDM0IsV0FBVyxHQUFHLEdBQUcsQ0FBQztBQUNwQixVQUFJLE9BQU8sS0FBSyxTQUFTLEVBQ3ZCLE9BQU8sR0FBRyxJQUFJLENBQUM7O0FBRWpCLFVBQU0sS0FBSyxHQUFHLHVCQUFVLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQzs7QUFFMUMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekIsV0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2YsV0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUVmLGFBQU8sS0FBSyxDQUFDO0tBQ2Q7Ozs7Ozs7V0FLZSwwQkFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQy9CLFVBQUksT0FBTyxLQUFLLElBQUksRUFBRTtBQUNwQixZQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssU0FBUyxFQUFFO0FBQzFDLGdCQUFNLElBQUksS0FBSyxnQkFBYyxPQUFPLHVCQUFvQixDQUFDO1NBQzFEO0FBQ0QsYUFBSyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUM7QUFDbkIsWUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUM7T0FDbEM7S0FDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBZ0JPLGtCQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTs7QUFFL0MsVUFBSSxPQUFPLEtBQUssU0FBUyxFQUN2QixPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLFVBQUksTUFBTSxLQUFLLFNBQVMsRUFDdEIsTUFBTSxHQUFHLEtBQUssQ0FBQzs7QUFFakIsVUFBSSxLQUFLLEdBQUcsY0FBYyxDQUFDOztBQUUzQixVQUFJLE9BQU8sY0FBYyxLQUFLLFFBQVEsRUFBRTtBQUN0QyxhQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztPQUMzQzs7O0FBR0QsVUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7QUFDdEIsWUFBTSxXQUFXLEdBQUcsTUFBTSxHQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLGtDQUFxQixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTVELGFBQUssQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7T0FDbkM7OztBQUdELFdBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWpCLFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ2pDLFlBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO09BQ25DOztBQUVELFVBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV6QyxXQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDZixXQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDaEI7Ozs7Ozs7Ozs7V0FRVSxxQkFBQyxLQUFLLEVBQUU7QUFDakIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBUyxLQUFLLEVBQUU7QUFDbEMsWUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUMsWUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUU7T0FDM0MsQ0FBQyxDQUFDOzs7QUFHSCxXQUFLLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDdkMsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzQyxZQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVuQyxZQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtBQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQUU7O0FBRTdDLFlBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ2pCLGlCQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDckM7T0FDRjtLQUNGOzs7Ozs7Ozs7O1dBUVcsc0JBQUMsT0FBTyxFQUFFO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqQzs7Ozs7Ozs7OztXQVFxQixnQ0FBQyxHQUFHLEVBQUU7O0FBRTFCLFdBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN2QyxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sS0FBSyxHQUFHLEVBQ3ZDLE9BQU8sS0FBSyxDQUFDO09BQ2hCOztBQUVELGFBQU8sU0FBUyxDQUFDO0tBQ2xCOzs7Ozs7Ozs7O1dBUWUsMEJBQUMsT0FBTyxFQUFFO0FBQ3hCLGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNyQzs7Ozs7OztvQ0FLaUI7Ozs7MERBQ1QsSUFBSSxDQUFDLE1BQU07Ozs7Ozs7S0FDbkI7OztTQXBiUyxlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztLQUNoQzs7Ozs7OztTQU9TLGFBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUNqQzs7Ozs7Ozs7O1NBT08sZUFBRztBQUNULGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7S0FDOUI7Ozs7Ozs7U0FPTyxhQUFDLEtBQUssRUFBRTtBQUNkLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztLQUMvQjs7Ozs7Ozs7O1NBT2tCLGVBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztLQUN6Qzs7Ozs7OztTQU9rQixhQUFDLEtBQUssRUFBRTtBQUN6QixVQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7S0FDMUM7Ozs7Ozs7OztTQU9rQixlQUFHO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUM7S0FDekM7Ozs7Ozs7U0FPa0IsYUFBQyxLQUFLLEVBQUU7QUFDekIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO0tBQzFDOzs7Ozs7Ozs7U0FPZSxlQUFHO0FBQ2pCLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUM7S0FDdEM7Ozs7Ozs7U0FPZSxhQUFDLEtBQUssRUFBRTtBQUN0QixVQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7S0FDdkM7Ozs7Ozs7OztTQU9jLGVBQUc7QUFDaEIsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQztLQUNyQzs7Ozs7Ozs7O1NBT2tCLGVBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztLQUN6Qzs7Ozs7Ozs7Ozs7U0FTMEIsYUFBQyxJQUFJLEVBQUU7QUFDaEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUM7S0FDakQ7Ozs7Ozs7U0FPMEIsZUFBRztBQUM1QixhQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUM7S0FDakQ7Ozs7Ozs7Ozs7U0FRZ0IsZUFBRztBQUNsQixhQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7S0FDNUI7OztTQTRFUSxhQUFDLEtBQUssRUFBRTtBQUNmLFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUFFLFlBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7T0FBRTtBQUN4QyxVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNwQixVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFBRSxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO09BQUU7S0FDMUM7Ozs7Ozs7U0FPUSxlQUFHO0FBQ1YsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3BCOzs7Ozs7Ozs7U0FPUyxlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ3JCOzs7Ozs7Ozs7U0FPUyxlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztLQUM1Qjs7O1NBdlJrQixRQUFRO0dBQVMsb0JBQU8sWUFBWTs7cUJBQXBDLFFBQVEiLCJmaWxlIjoic3JjL2NvcmUvdGltZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cbmltcG9ydCBLZXlib2FyZCBmcm9tICcuLi9pbnRlcmFjdGlvbnMva2V5Ym9hcmQnO1xuaW1wb3J0IExheWVyVGltZUNvbnRleHQgZnJvbSAnLi9sYXllci10aW1lLWNvbnRleHQnO1xuaW1wb3J0IEtvbnZhTW91c2VTdXJmYWNlIGZyb20gJy4uL2ludGVyYWN0aW9ucy9rb252YS1tb3VzZS1zdXJmYWNlJztcbmltcG9ydCBUaW1lbGluZVRpbWVDb250ZXh0IGZyb20gJy4vdGltZWxpbmUtdGltZS1jb250ZXh0JztcbmltcG9ydCBUcmFjayBmcm9tICcuL3RyYWNrJztcbmltcG9ydCBUcmFja0NvbGxlY3Rpb24gZnJvbSAnLi90cmFjay1jb2xsZWN0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbcGl4ZWxzUGVyU2Vjb25kPTEwMF0gLSB0aGUgZGVmYXVsdCBzY2FsaW5nIGJldHdlZW4gdGltZSBhbmQgcGl4ZWxzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3Zpc2libGVXaWR0aD0xMDAwXSAtIHRoZSBkZWZhdWx0IHZpc2libGUgYXJlYSBmb3IgYWxsIHJlZ2lzdGVyZWQgdHJhY2tzLlxuICAgKi9cbiAgY29uc3RydWN0b3IocGl4ZWxzUGVyU2Vjb25kLCB2aXNpYmxlV2lkdGgsIG9wdHMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKHBpeGVsc1BlclNlY29uZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgcGl4ZWxzUGVyU2Vjb25kID0gMTAwO1xuICAgIGlmICh2aXNpYmxlV2lkdGggPT09IHVuZGVmaW5lZClcbiAgICAgIHZpc2libGVXaWR0aCA9IDEwMDA7XG4gICAgaWYgKG9wdHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0cyA9IHsgcmVnaXN0ZXJLZXlib2FyZDogdHJ1ZSB9O1xuICAgIH0gZWxzZSBpZiAob3B0cy5yZWdpc3RlcktleWJvYXJkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdHMucmVnaXN0ZXJLZXlib2FyZCA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5fdHJhY2tzID0gbmV3IFRyYWNrQ29sbGVjdGlvbih0aGlzKTtcbiAgICB0aGlzLl9zdGF0ZSA9IG51bGw7XG5cbiAgICAvLyBkZWZhdWx0IGludGVyYWN0aW9uc1xuICAgIHRoaXMuX3N1cmZhY2VDdG9yID0gS29udmFNb3VzZVN1cmZhY2U7XG5cbiAgICBpZiAob3B0cy5yZWdpc3RlcktleWJvYXJkKSB7XG4gICAgICB0aGlzLmNyZWF0ZUludGVyYWN0aW9uKEtleWJvYXJkLCBkb2N1bWVudCk7XG4gICAgfVxuXG4gICAgLy8gc3RvcmVzXG4gICAgdGhpcy5fdHJhY2tCeUlkID0ge307XG4gICAgdGhpcy5fZ3JvdXBlZExheWVycyA9IHt9O1xuXG4gICAgLyoqIEB0eXBlIHtUaW1lbGluZVRpbWVDb250ZXh0fSAtIG1hc3RlciB0aW1lIGNvbnRleHQgZm9yIHRoZSB2aXN1YWxpemF0aW9uLiAqL1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBuZXcgVGltZWxpbmVUaW1lQ29udGV4dChwaXhlbHNQZXJTZWNvbmQsIHZpc2libGVXaWR0aCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgb2Zmc2V0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5vZmZzZXQ7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgb2Zmc2V0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQub2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHpvb21gIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC56b29tO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGB6b29tYCB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgc2V0IHpvb20odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lnpvb20gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgcGl4ZWxzUGVyU2Vjb25kYCByYXRpby5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgZ2V0IHBpeGVsc1BlclNlY29uZCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHBpeGVsc1BlclNlY29uZGAgcmF0aW8uXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRpbWUgaW50ZXJ2YWwgb2YgdGhlIHZpc2libGUgYXJlYSBpbiB0aGUgdGltZWxpbmUuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9IFxuICAgKi9cbiAgZ2V0IHZpc2libGVJbnRlcnZhbCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC52aXNpYmxlSW50ZXJ2YWw7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXMgdGhlIHRpbWVsaW5lIHZpc2libGUgYXJlYSBpbiB0aGUgcHJvdmlkZWQgdGltZSBpbnRlcnZhbC5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH0gXG4gICAqL1xuICBzZXQgdmlzaWJsZUludGVydmFsKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC52aXNpYmxlSW50ZXJ2YWwgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgdmlzaWJsZVdpZHRoYCBwaXhlbCBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIGdldCB2aXNpYmxlV2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudmlzaWJsZVdpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGB2aXNpYmxlV2lkdGhgIHBpeGVsIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgc2V0IHZpc2libGVXaWR0aCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQudmlzaWJsZVdpZHRoID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgdGltZVRvUGl4ZWxgIHRyYW5zZmVydCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHZpc2libGVEdXJhdGlvbmAgaGVscGVyIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYG1haW50YWluVmlzaWJsZUR1cmF0aW9uYCB2YWx1ZS5cbiAgICogRGVmaW5lcyBpZiB0aGUgZHVyYXRpb24gb2YgdGhlIHZpc2libGUgYXJlYSBzaG91bGQgYmUgbWFpbnRhaW4gd2hlblxuICAgKiB0aGUgYHZpc2libGVXaWR0aGAgYXR0cmlidXRlIGlzIHVwZGF0ZWQuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgc2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKGJvb2wpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lm1haW50YWluVmlzaWJsZUR1cmF0aW9uID0gYm9vbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGBtYWludGFpblZpc2libGVEdXJhdGlvbmAgY3VycmVudCB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBnZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQubWFpbnRhaW5WaXNpYmxlRHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogT2JqZWN0IG1haW50YWluaW5nIGFycmF5cyBvZiBgTGF5ZXJgIGluc3RhbmNlcyBvcmRlcmVkIGJ5IHRoZWlyIGBncm91cElkYC5cbiAgICogSXMgdXNlZCBpbnRlcm5hbGx5IGJ5IHRoZSBgVHJhY2tDb2xsZWN0aW9uYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGdldCBncm91cGVkTGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl9ncm91cGVkTGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyB0aGUgZGVmYXVsdCBgU3VyZmFjZWAgdGhhdCBpcyBpbnN0YW5jaWF0ZWQgb24gZWFjaCBgVHJhY2tgXG4gICAqIGluc3RhbmNlLiBUaGlzIG1ldGhvcyBzaG91bGQgYmUgY2FsbGVkIGJlZm9yZSBhZGRpbmcgYW55IGBUcmFja2AgaW5zdGFuY2VcbiAgICogdG8gdGhlIGN1cnJlbnQgYHRpbWVsaW5lYC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudFNvdXJjZX0gY3RvciAtIFRoZSBjb25zdHJ1Y3RvciB0byB1c2UgaW4gb3JkZXIgdG8gY2F0Y2ggbW91c2VcbiAgICogICAgZXZlbnRzIG9uIGVhY2ggYFRyYWNrYCBpbnN0YW5jZXMuXG4gICAqL1xuICBjb25maWd1cmVTdXJmYWNlKGN0b3IpIHtcbiAgICB0aGlzLl9zdXJmYWNlQ3RvciA9IGN0b3I7XG4gIH1cblxuICAvKipcbiAgICogRmFjdG9yeSBtZXRob2QgdG8gYWRkIGludGVyYWN0aW9uIG1vZHVsZXMgdGhlIHRpbWVsaW5lIHNob3VsZCBsaXN0ZW4gdG8uXG4gICAqIEJ5IGRlZmF1bHQsIHRoZSB0aW1lbGluZSBpbnN0YW5jaWF0ZSBhIGdsb2JhbCBgS2V5Ym9hcmRgIGluc3RhbmNlIGFuZCBhXG4gICAqIGBTdXJmYWNlYCBpbnN0YW5jZSBvbiBlYWNoIGNvbnRhaW5lci5cbiAgICogU2hvdWxkIGJlIHVzZWQgdG8gaW5zdGFsbCBuZXcgaW50ZXJhY3Rpb25zIGltcGxlbWVudGluZyB0aGUgYEV2ZW50U291cmNlYCBpbnRlcmZhY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnRTb3VyY2V9IGN0b3IgLSBUaGUgY29udHJ1Y3RvciBvZiB0aGUgaW50ZXJhY3Rpb24gbW9kdWxlIHRvIGluc3RhbmNpYXRlLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBET00gZWxlbWVudCB3aGljaCB3aWxsIGJlIGJpbmRlZCB0byB0aGUgYEV2ZW50U291cmNlYCBtb2R1bGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBPcHRpb25zIHRvIGJlIGFwcGxpZWQgdG8gdGhlIGBjdG9yYC5cbiAgICovXG4gIGNyZWF0ZUludGVyYWN0aW9uKGN0b3IsICRlbCwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpIFxuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIGNvbnN0IGludGVyYWN0aW9uID0gbmV3IGN0b3IoJGVsLCBvcHRpb25zKTtcbiAgICBpbnRlcmFjdGlvbi5vbignZXZlbnQnLCAoZSkgPT4gdGhpcy5faGFuZGxlRXZlbnQoZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBsaXN0IG9mIHRoZSBsYXllcnMgc2l0dWF0ZWQgdW5kZXIgdGhlIHBvc2l0aW9uIG9mIGEgYFdhdmVFdmVudGAuXG4gICAqXG4gICAqIEBwYXJhbSB7V2F2ZXNFdmVudH0gZSAtIEFuIGV2ZW50IHRyaWdnZXJlZCBieSBhIGBXYXZlRXZlbnRgXG4gICAqIEByZXR1cm4ge0FycmF5fSAtIE1hdGNoZWQgbGF5ZXJzXG4gICAqL1xuICBnZXRIaXRMYXllcnMoZSkge1xuICAgIGNvbnN0IHggPSBlLm9yaWdpbmFsRXZlbnQub2Zmc2V0WDtcbiAgICBjb25zdCB5ID0gZS5vcmlnaW5hbEV2ZW50Lm9mZnNldFk7XG5cbiAgICBsZXQgbGF5ZXJzID0gW107XG5cbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgY29uc3QgY3R4WCA9IGxheWVyLl9jb250ZXh0U2hhcGUuJHNlZ21lbnQuZ2V0QWJzb2x1dGVQb3NpdGlvbigpLng7XG4gICAgICBjb25zdCBjdHhZID0gbGF5ZXIuX2NvbnRleHRTaGFwZS4kc2VnbWVudC5nZXRBYnNvbHV0ZVBvc2l0aW9uKCkueTtcbiAgICAgIGNvbnN0IGN0eFcgPSBsYXllci5fY29udGV4dFNoYXBlLiRzZWdtZW50LndpZHRoKCk7XG4gICAgICBjb25zdCBjdHhIID0gbGF5ZXIuX2NvbnRleHRTaGFwZS4kc2VnbWVudC5oZWlnaHQoKTtcblxuICAgICAgaWYgKHggPj0gY3R4WCAmJiB4IDw9IGN0eFggKyBjdHhXICYmIHkgPj0gY3R4WSAmJiB5IDw9IGN0eFkgKyBjdHhIKVxuICAgICAgICBsYXllcnMucHVzaChsYXllcik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayB0aGF0IGlzIHVzZWQgdG8gbGlzdGVuIHRvIGludGVyYWN0aW9ucyBtb2R1bGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge1dhdmVFdmVudH0gZSAtIEFuIGV2ZW50IGdlbmVyYXRlZCBieSBhbiBpbnRlcmFjdGlvbiBtb2R1bGVzIChgRXZlbnRTb3VyY2VgKS5cbiAgICovXG4gIF9oYW5kbGVFdmVudChlKSB7XG4gICAgY29uc3QgaGl0TGF5ZXJzID0gKGUuc291cmNlID09PSAnc3VyZmFjZScpID9cbiAgICAgIHRoaXMuZ2V0SGl0TGF5ZXJzKGUpIDogbnVsbDtcbiAgICAvLyBlbWl0IGV2ZW50IGFzIGEgbWlkZGxld2FyZVxuICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBlLCBoaXRMYXllcnMpO1xuICAgIC8vIHByb3BhZ2F0ZSB0byB0aGUgc3RhdGVcbiAgICBpZiAoIXRoaXMuX3N0YXRlKSB7IHJldHVybjsgfVxuICAgIHRoaXMuX3N0YXRlLmhhbmRsZUV2ZW50KGUsIGhpdExheWVycyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgc3RhdGUgb2YgdGhlIHRpbWVsaW5lLlxuICAgKlxuICAgKiBAdHlwZSB7QmFzZVN0YXRlfVxuICAgKi9cbiAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlKSB7IHRoaXMuX3N0YXRlLmV4aXQoKTsgfVxuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgaWYgKHRoaXMuX3N0YXRlKSB7IHRoaXMuX3N0YXRlLmVudGVyKCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSB0aW1lbGluZS5cbiAgICpcbiAgICogQHR5cGUge0Jhc2VTdGF0ZX1cbiAgICovXG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRyYWNrQ29sbGVjdGlvbmAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEB0eXBlIHtUcmFja0NvbGxlY3Rpb259XG4gICAqL1xuICBnZXQgdHJhY2tzKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFja3M7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbGlzdCBvZiBhbGwgcmVnaXN0ZXJlZCBsYXllcnMuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gIGdldCBsYXllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrcy5sYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5ldyB0cmFjayB0byB0aGUgdGltZWxpbmUuXG4gICAqXG4gICAqIEBwYXJhbSB7VHJhY2t9IHRyYWNrIC0gVGhlIG5ldyB0cmFjayB0byBiZSByZWdpc3RlcmVkIGluIHRoZSB0aW1lbGluZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFt0cmFja0lkPW51bGxdIC0gT3B0aW9ubmFsIHVuaXF1ZSBpZCB0byBhc3NvY2lhdGUgd2l0aFxuICAgKiAgICB0aGUgdHJhY2ssIHRoaXMgaWQgb25seSBleGlzdHMgaW4gdGltZWxpbmUncyBjb250ZXh0IGFuZCBzaG91bGQgYmUgdXNlZFxuICAgKiAgICBpbiBjb25qb25jdGlvbiB3aXRoIGBhZGRMYXllcmAgbWV0aG9kLlxuICAgKi9cbiAgYWRkKHRyYWNrLCB0cmFja0lkKSB7XG4gICAgaWYgKHRyYWNrSWQgPT09IHVuZGVmaW5lZClcbiAgICAgIHRyYWNrSWQgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMudHJhY2tzLmluZGV4T2YodHJhY2spICE9PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0cmFjayBhbHJlYWR5IGFkZGVkIHRvIHRoZSB0aW1lbGluZScpO1xuICAgIH1cblxuICAgIHRoaXMuX3JlZ2lzdGVyVHJhY2tJZCh0cmFjaywgdHJhY2tJZCk7XG4gICAgdHJhY2suY29uZmlndXJlKHRoaXMudGltZUNvbnRleHQpO1xuXG4gICAgdGhpcy50cmFja3MucHVzaCh0cmFjayk7XG4gICAgdGhpcy5jcmVhdGVJbnRlcmFjdGlvbih0aGlzLl9zdXJmYWNlQ3RvciwgdHJhY2spO1xuXG4gICAgdGhpcy5lbWl0KCdhZGQnLCB0cmFjaywgdHJhY2tJZCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIHRyYWNrIGZyb20gdGhlIHRpbWVsaW5lIGFuZCBkZXN0cm95cyB0aGF0IHRyYWNrLlxuICAgKlxuICAgKiBAcGFyYW0ge1RyYWNrfSB0cmFjayAtIHRoZSB0cmFjayB0byByZW1vdmUgZnJvbSB0aGUgdGltZWxpbmUuXG4gICAqIEB0b2RvIG5vdCBpbXBsZW1lbnRlZC5cbiAgICovXG4gIHJlbW92ZSh0cmFjaykge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy50cmFja3MuaW5kZXhPZih0cmFjayk7XG4gICAgdmFyIHRyYWNrSWQ7XG4gICAgaWYgKHRoaXMudHJhY2tzLmluZGV4T2YodHJhY2spICE9PSAtMSkge1xuICAgICAgdHJhY2suZGVzdHJveSgpO1xuICAgICAgZGVsZXRlIHRoaXMuX3RyYWNrQnlJZFt0cmFjay5pZF07XG4gICAgICB0cmFja0lkID0gdHJhY2suaWQ7XG4gICAgICB0cmFjay5pZCA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMuZW1pdCgncmVtb3ZlJywgdHJhY2ssIHRyYWNrSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciB0byBjcmVhdGUgYSBuZXcgYFRyYWNrYCBpbnN0YW5jZS4gVGhlIGB0cmFja2AgaXMgYWRkZWQsXG4gICAqIHJlbmRlcmVkIGFuZCB1cGRhdGVkIGJlZm9yZSBiZWluZyByZXR1cm5lZC5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgRE9NIGVsZW1lbnQgd2hlcmUgdGhlIHRyYWNrIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRyYWNrSGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgbmV3bHkgY3JlYXRlZCB0cmFjay5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFt0cmFja0lkPW51bGxdIC0gT3B0aW9ubmFsIHVuaXF1ZSBpZCB0byBhc3NvY2lhdGUgd2l0aFxuICAgKiAgICB0aGUgdHJhY2ssIHRoaXMgaWQgb25seSBleGlzdHMgaW4gdGltZWxpbmUncyBjb250ZXh0IGFuZCBzaG91bGQgYmUgdXNlZCBpblxuICAgKiAgICBjb25qb25jdGlvbiB3aXRoIGBhZGRMYXllcmAgbWV0aG9kLlxuICAgKiBAcmV0dXJuIHtUcmFja31cbiAgICovXG4gIGNyZWF0ZVRyYWNrKCRlbCwgdHJhY2tIZWlnaHQsIHRyYWNrSWQpIHtcbiAgICBpZiAodHJhY2tIZWlnaHQgPT09IHVuZGVmaW5lZClcbiAgICAgIHRyYWNrSGVpZ2h0ID0gMTAwO1xuICAgIGlmICh0cmFja0lkID09PSB1bmRlZmluZWQpXG4gICAgICB0cmFja0lkID0gbnVsbDtcblxuICAgIGNvbnN0IHRyYWNrID0gbmV3IFRyYWNrKCRlbCwgdHJhY2tIZWlnaHQpO1xuICAgIC8vIEFkZCB0cmFjayB0byB0aGUgdGltZWxpbmVcbiAgICB0aGlzLmFkZCh0cmFjaywgdHJhY2tJZCk7XG4gICAgdHJhY2sucmVuZGVyKCk7XG4gICAgdHJhY2sudXBkYXRlKCk7XG5cbiAgICByZXR1cm4gdHJhY2s7XG4gIH1cblxuICAvKipcbiAgICogSWYgdHJhY2sgaWQgaXMgZGVmaW5lZCwgYXNzb2NpYXRlIGEgdHJhY2sgd2l0aCBhIHVuaXF1ZSBpZC5cbiAgICovXG4gIF9yZWdpc3RlclRyYWNrSWQodHJhY2ssIHRyYWNrSWQpIHtcbiAgICBpZiAodHJhY2tJZCAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuX3RyYWNrQnlJZFt0cmFja0lkXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgdHJhY2tJZDogXCIke3RyYWNrSWR9XCIgaXMgYWxyZWFkeSB1c2VkYCk7XG4gICAgICB9XG4gICAgICB0cmFjay5pZCA9IHRyYWNrSWQ7XG4gICAgICB0aGlzLl90cmFja0J5SWRbdHJhY2tJZF0gPSB0cmFjaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIGFkZCBhIGBMYXllcmAgaW5zdGFuY2UgaW50byBhIGdpdmVuIGBUcmFja2AuIElzIGRlc2lnbmVkIHRvIGJlXG4gICAqIHVzZWQgaW4gY29uam9uY3Rpb24gd2l0aCB0aGUgYFRpbWVsaW5lfmdldExheWVyc0J5R3JvdXBgIG1ldGhvZC4gVGhlXG4gICAqIGxheWVyIGlzIGludGVybmFsbHkgcmVuZGVyZWQgYW5kIHVwZGF0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gVGhlIGBMYXllcmAgaW5zdGFuY2UgdG8gYWRkIGludG8gdGhlIHZpc3VhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7KFRyYWNrfFN0cmluZyl9IHRyYWNrT3JUcmFja0lkIC0gVGhlIGBUcmFja2AgaW5zdGFuY2UgKG9yIGl0cyBgaWRgXG4gICAqICAgIGFzIGRlZmluZWQgaW4gdGhlIGBjcmVhdGVUcmFja2AgbWV0aG9kKSB3aGVyZSB0aGUgYExheWVyYCBpbnN0YW5jZSBzaG91bGQgYmUgaW5zZXJ0ZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbZ3JvdXBJZD0nZGVmYXVsdCddIC0gQW4gb3B0aW9ubmFsIGdyb3VwIGlkIGluIHdoaWNoIHRoZVxuICAgKiAgICBgTGF5ZXJgIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbaXNBeGlzXSAtIFNldCB0byBgdHJ1ZWAgaWYgdGhlIGFkZGVkIGBsYXllcmAgaXMgYW5cbiAgICogICAgaW5zdGFuY2Ugb2YgYEF4aXNMYXllcmAgKHRoZXNlIGxheWVycyBzaGFyZXMgdGhlIGBUaW1saW5lVGltZUNvbnRleHRgIGluc3RhbmNlXG4gICAqICAgIG9mIHRoZSB0aW1lbGluZSkuXG4gICAqL1xuICBhZGRMYXllcihsYXllciwgdHJhY2tPclRyYWNrSWQsIGdyb3VwSWQsIGlzQXhpcykge1xuXG4gICAgaWYgKGdyb3VwSWQgPT09IHVuZGVmaW5lZClcbiAgICAgIGdyb3VwSWQgPSAnZGVmYXVsdCc7XG4gICAgaWYgKGlzQXhpcyA9PT0gdW5kZWZpbmVkKVxuICAgICAgaXNBeGlzID0gZmFsc2U7XG5cbiAgICBsZXQgdHJhY2sgPSB0cmFja09yVHJhY2tJZDtcblxuICAgIGlmICh0eXBlb2YgdHJhY2tPclRyYWNrSWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cmFjayA9IHRoaXMuZ2V0VHJhY2tCeUlkKHRyYWNrT3JUcmFja0lkKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGVzIHRoZSBgTGF5ZXJUaW1lQ29udGV4dGAgaWYgbm90IHByZXNlbnRcbiAgICBpZiAoIWxheWVyLnRpbWVDb250ZXh0KSB7XG4gICAgICBjb25zdCB0aW1lQ29udGV4dCA9IGlzQXhpcyA/XG4gICAgICAgIHRoaXMudGltZUNvbnRleHQgOiBuZXcgTGF5ZXJUaW1lQ29udGV4dCh0aGlzLnRpbWVDb250ZXh0KTtcblxuICAgICAgbGF5ZXIuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIH1cblxuICAgIC8vIHdlIHNob3VsZCBoYXZlIGEgVHJhY2sgaW5zdGFuY2UgYXQgdGhpcyBwb2ludFxuICAgIHRyYWNrLmFkZChsYXllcik7XG5cbiAgICBpZiAoIXRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF0pIHtcbiAgICAgIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdLnB1c2gobGF5ZXIpO1xuXG4gICAgbGF5ZXIucmVuZGVyKCk7XG4gICAgbGF5ZXIudXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxheWVyIGZyb20gaXRzIHRyYWNrLiBUaGUgbGF5ZXIgaXMgZGV0YXRjaGVkIGZyb20gdGhlIERPTSBidXRcbiAgICogY2FuIHN0aWxsIGJlIHJldXNlZCBsYXRlci5cbiAgICpcbiAgICogQHBhcmFtIHtMYXllcn0gbGF5ZXIgLSBUaGUgbGF5ZXIgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlTGF5ZXIobGF5ZXIpIHtcbiAgICB0aGlzLnRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHRyYWNrKSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRyYWNrLmxheWVycy5pbmRleE9mKGxheWVyKTtcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHsgdHJhY2sucmVtb3ZlKGxheWVyKTsgfVxuICAgIH0pO1xuXG4gICAgLy8gY2xlYW4gcmVmZXJlbmNlcyBpbiBoZWxwZXJzXG4gICAgZm9yIChsZXQgZ3JvdXBJZCBpbiB0aGlzLl9ncm91cGVkTGF5ZXJzKSB7XG4gICAgICBjb25zdCBncm91cCA9IHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gICAgICBjb25zdCBpbmRleCA9IGdyb3VwLmluZGV4T2YobGF5ZXIpO1xuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7IGdyb3VwLnNwbGljZShsYXllciwgMSk7IH1cblxuICAgICAgaWYgKCFncm91cC5sZW5ndGgpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBgVHJhY2tgIGluc3RhbmNlIGZyb20gaXQncyBnaXZlbiBpZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRyYWNrSWRcbiAgICogQHJldHVybiB7VHJhY2t9XG4gICAqL1xuICBnZXRUcmFja0J5SWQodHJhY2tJZCkge1xuICAgIHJldHVybiB0aGlzLl90cmFja0J5SWRbdHJhY2tJZF07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdHJhY2sgY29udGFpbmluZyBhIGdpdmVuIERPTSBFbGVtZW50LCByZXR1cm5zIG51bGwgaWYgbm8gbWF0Y2ggZm91bmQuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gVGhlIERPTSBFbGVtZW50IHRvIGJlIHRlc3RlZC5cbiAgICogQHJldHVybiB7VHJhY2t9XG4gICAqL1xuICBnZXRUcmFja0Zyb21ET01FbGVtZW50KCRlbCkge1xuICAgIFxuICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLnRyYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMudHJhY2tzW2ldLiRzdGFnZS5jb250ZW50ID09PSAkZWwpXG4gICAgICAgIHJldHVybiB0cmFjaztcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgbGF5ZXJzIGZyb20gdGhlaXIgZ2l2ZW4gZ3JvdXAgaWQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBncm91cElkIC0gVGhlIGlkIG9mIHRoZSBncm91cCBhcyBkZWZpbmVkIGluIGBhZGRMYXllcmAuXG4gICAqIEByZXR1cm4geyhBcnJheXx1bmRlZmluZWQpfVxuICAgKi9cbiAgZ2V0TGF5ZXJzQnlHcm91cChncm91cElkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgdGhyb3VnaCB0aGUgYWRkZWQgdHJhY2tzLlxuICAgKi9cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHlpZWxkKiB0aGlzLnRyYWNrc1tTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cbn1cbiJdfQ==