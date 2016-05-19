'use strict';
import BaseBehavior from './base-behavior';

export default class SnapBaseBehavior extends BaseBehavior {

	constructor() {
		super();
		
		this.snapFn = function(datum, accessor, value) {
			return value;
		};
	}
	
}