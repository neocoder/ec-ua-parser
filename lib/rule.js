var _ = require('lodash');

function getActualType(o) {
	var t = typeof o;
	if ( t === 'object' ) {
		if ( _.isArray(o) ) {
			return 'array';
		} else if ( o instanceof RegExp ) {
			return 'regexp';
		} else {
			return 'object';
		}
	}
	return t;
}

function matchArrays(ruleArr, puaArr) {
	var points = 0;

	ruleArr.forEach(function(ruleArrItem){

		var ruleArrItemType = getActualType(ruleArrItem);

		points += puaArr.reduce(function(prevPoints, puaArrItem){
			var puaArrItemType = getActualType(puaArrItem);
			var matchPoints = 0;

			if ( ruleArrItemType !== puaArrItemType && ruleArrItemType !== 'regexp' ) {
				return prevPoints;
			}

			switch ( puaArrItemType ) {
				case 'object':
					matchPoints = matchObjects(ruleArrItem, puaArrItem);
					break;
				case 'array':
					matchPoints = matchArrays(ruleArrItem, puaArrItem);
					break;
				case 'string':
					if ( ruleArrItemType === 'regexp' ) {
						matchPoints = ruleArrItem.exec(puaArrItem) ? 1 : 0;
						//if ( matchPoints ) { console.log('ro(%s) === po(%s)', ruleArrItem, puaArrItem); }
					} else if ( puaArrItem.toLowerCase() === ruleArrItem.toLowerCase() ) {
						//console.log('ro(%s) === po(%s)', ruleArrItem, puaArrItem);
						matchPoints = 1;
					}
					break;
			}

			return prevPoints+matchPoints;
		}, 0);
	});
	return points;
}

function matchObjects(ruleObj, puaObj) {
	if ( getActualType(ruleObj) !==  getActualType(puaObj) ) { return 0; }

	return Object.keys(ruleObj).reduce(function(prevPoints, key){
		var ro = ruleObj[key],
			po = puaObj[key],
			rot = getActualType(ruleObj[key]),
			pot = getActualType(puaObj[key]);

		if ( rot !== pot ) { return prevPoints; }

		switch ( rot ) {
			case 'object':
				return prevPoints+matchObjects(ro, po);

			case 'array':
				return prevPoints+matchArrays(ro, po);
			default:
				if ( ro === po ) {
					//console.log('ro(%s) === po(%s)', ro, po);
					return prevPoints+1
				} else {
					return prevPoints;
				}
				//return ( ro === po ) ? prevPoints+1 : prevPoints;
		}


	}, 0);
}

function countMatcherPointsReducer(prevPoints, val) {
	var kt = getActualType(val);

	switch ( kt ) {
		case 'object':
			return prevPoints+countObjectPoints(val);
		case 'array':
			return prevPoints+countArrPoints(val);
		default:
			return prevPoints+1;
	}
}

function countArrPoints(arr){
	return arr.reduce(countMatcherPointsReducer, 0);
}

function countObjectPoints(obj) {
	return Object.keys(obj)
		.map(function(key){ return obj[key]; })
		.reduce(countMatcherPointsReducer, 0);
}


var Rule = function(ruleName, matcher, opts) {
	this.ruleName = ruleName;
	this.options = _.extend({}, opts);
	this.matcher = matcher;
	this.resultObject;
	this.formatResultCallback = null;
	this.matcherPoints = countObjectPoints(matcher);
	console.log('matcher: ', matcher);
	console.log('this.matcherPoints: ', this.matcherPoints);
}

var r = Rule.prototype;

r.formatResult = function(callback){
	this.formatResultCallback = callback;
};

r.result = function(resultObject){
	this.resultObject = resultObject;
};

r.getResult = function(pua, opts){
	if ( this.formatResultCallback ) {
		return _.merge({}, this.resultObject, this.formatResultCallback(pua, this.resultObject));
	}
	return this.resultObject;
};

/* pua example
{
	"application": {
		"token": "Mozilla/4.0",
		"comments": [
			"compatible",
			"MSIE 6.0",
			"Windows NT 5.1",
			"SV1"
		],
		"name": "Mozilla",
		"version": {
			"major": 4,
			"minor": 0
		}
	},
	"vendors": [
		{
			"token": "Mozilla/4.0",
			"comments": [
				"compatible",
				"MSIE 6.0",
				"Windows NT 5.0",
				"FunWebProducts",
				"Orange 7.4",
				"NaviWoo1.1",
				"",
				"Embedded Web Browser from: http://bsalsa.com/"
			],
			"name": "Mozilla",
			"version": {
				"major": 4,
				"minor": 0
			}
		}
	]
}
*/

r.test = function(pua) {
	var that = this;
	var points = 0;

	return {
		ruleName: this.ruleName,
		matcherPoints: this.matcherPoints,
		points: matchObjects(this.matcher, pua)
	}
};


module.exports = Rule;
