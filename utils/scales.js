scales = {};

scales.linear = function() {

	var _domain = [0, 1];
	var _range = [0, 1];

	var _slope = 1;
	var _intercept = 0;

	function _updateCoefs() {
		_slope = (_range[1] - _range[0]) / (_domain[1] - _domain[0]);
		_intercept = _range[0] - (_slope * _domain[0]);
	}

	function scale (value) {
		return (_slope * value) + _intercept;
	}

	scale.invert = function(value) {
		return (value - _intercept) / _slope;
	};

	scale.domain = function(arr) {
		if (arr === undefined) { return _domain; }

		_domain = arr;
		_updateCoefs();

		return scale;
	};

	scale.range = function(arr) {
		if (arr === undefined) { return _range; }

		_range = arr;
		_updateCoefs();

		return scale;
	};

	return scale;
}