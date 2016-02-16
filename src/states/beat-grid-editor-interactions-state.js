'use strict';
import BrushController from '../helpers/brush-controller';
import BaseState from './base-state';

class BeatGridEditorInteractionsState extends BaseState {
	constructor(timeline, beatGridEditor) {
		super(timeline);
		this.beatGridEditor = beatGridEditor;
		this.brushController = new BrushController();
		this._state = "";
	}

	handleEvent(e) {
		const time = (-this.timeline.timeContext.offset) + this.timeline.timeContext.timeToPixel.invert(e.x);
		switch (e.type) {
			case 'keydown': this.onKeydown(e); break;
			case 'dblclick': this.onDblClick(e, time); break;
			case 'mousedown': this.onMouseDown(e, time); break;
			case 'mouseup': this.onMouseUp(e, time); break;
			case 'mousemove': this.onMouseMove(e, time); break;
		}
	}

	onKeydown(e) {
		const layer = this.beatGridEditor.beatGridLayer;
		if (e.keyCode == 46) { // Delete key
			var selectedDatums = layer.selectedDatums;
			this.beatGridEditor.remove_beats(selectedDatums);
			this.timeline.tracks.update(layer);
		} else if (e.keyCode == 65 && e.ctrlKey) { // Ctrl + A keys
			layer.select(layer.data);
		}
	}

	onDblClick(e, time) {
		if (!e.originalEvent.shiftKey && !e.originalEvent.ctrlKey) {
			this.beatGridEditor.add_beats([time]);
		}


	}

	onMouseDown(e, time) {

	}

	onMouseUp(e, time) {

	}

	onMouseMove(e, time) {
		if (e.originalEvent.ctrlKey) {
			this.beatGridEditor.set_current_time(time);
			return;
		}

		// VERIFICA SE TOCOU EM ALGUMA BATIDA.
		// SE TOCOU, A INTERAÇÃO É DE SELECÇÃO.

		// INICIA A POSSIBILIDADE DE DRAG.



		// keep target consistent with mouse down
		this.currentTarget = e.target;
		const layer = this.beatGridEditor.beatGridLayer;

		if (layer.hasElement(this.currentTarget)) {
			console.log("Touched a beat.");
			
			// SELECT THE TOUCHED BEAT
			if (!e.originalEvent.shiftKey) {
				layer.unselect();
			}
			var item = layer.getItemFromDOMElement(this.currentTarget);
			if (item === null) { 
				return; 
			}
			requestAnimationFrame(function() { 
				layer.select(item); 
			});
			this._state = "beats";
		} else {
			
			console.log("Touched nothing");

			if (!e.originalEvent.shiftKey) {
				layer.unselect();
			}
			
			this.currentTrack = this.timeline.getTrackFromDOMElement(e.target);
			if (!this.currentTrack) { 
				return; 
			}
			this.brushController.addBrush(this.currentTrack);

			this.layerSelectedItemsMap = new Map();
			this.layerSelectedItemsMap.set(layer, layer.selectedItems.slice(0));

			this._state = "empty";
		}
	}


}