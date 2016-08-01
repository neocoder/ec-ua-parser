var _ = require('lodash');
var supplant = require('./utils').supplant;
var regexQuote = require('./utils').regexQuote;

var	requireDir = require('require-dir');

var rules = requireDir('../rules');
var async = require('async');

// {
// 	matcher: {
// 		'application.token': 'Mozilla/5.0',
// 		'application.version':
// 		app: 'Mozilla',
// 		appcom: [
// 			{ com: 'iPhone' }
// 		],
// 		vendors: [
// 			{ vendor: 'AppleWebKit' }
// 		]
// 	},
// 	result: {
// 		platform: 'mobile', // mobile, desktop, tablet,
// 		client: {
// 			name: 'Chrome',
// 			ver: 'Chrome 43'
// 		},
// 		device: {
// 			name: 'iPhone', // iPad, Windows, Mac, Android, Other, Linux, ChromeOS, iPod, BlackBerry
// 			ver: 'iPhone 6'
// 		},
//
// 	}
// }



// rulesTable = buildRulesTable(rules);
// browserRulesTable = buildRulesTable(browserRules);

var Parser = function(opts) {
	this.options = _.extend({
		// deafaults
		browser: false // whether to datect browser from UA string
	}, opts || {});
};

var pp = Parser.prototype;

pp._parseToken = function(token) {
	var res = {},
		sp = token.split('/'),
		parsedVersion = sp[1] ? sp[1].split('.') : [],
		versionsMapping = ['major', 'minor', 'bugfix', 'build'];

	res.name = sp[0];
	res.version = {};

	var restOfVersion = [];
	parsedVersion.forEach(function(v, i){
		if ( versionsMapping[i] ) {
			var n = parseInt(v, 10);
			res.version[versionsMapping[i]] = isNaN(n) ? v : n;
		} else {
			restOfVersion.push(v);
		}
	});

	if ( restOfVersion.length ) {
		res.version.ver = restOfVersion.join('.');
	}

	return res;
};

pp._parseUAString = function(uaString) {
	var that = this,
		first = true,
		rx = /([\S]+)(?:\s+\(([^\(]*?)\)|)/g;

	var ua = uaString;

	//*

	// token ( comments, ... ) regex
	var tcRx = /([^\(\)\s]+)\s+\(([^\(\)]+)\)(?:;|)/;

	var sections = [],
		uaobj = {};


	while ( ua.match(/[\(\)]+/) ) {
		ua = ua.replace(tcRx, function(str, token, comments){
			tmp = {
				token: token,
				comments: comments
			};

			sections.push(_.extend(tmp, that._parseToken(token)));
			return '';
		}).trim();
	}

	if ( ua ) {
		ua.split(/\s+/).forEach(function(token){
			tmp = {
				token: token
			};
			sections.push(_.extend(tmp, that._parseToken(token)));
		});
	}

	uaobj.application = sections.shift();
	uaobj.vendors = sections;

	if ( uaobj.application.comments ) {
		uaobj.application.comments = uaobj.application.comments.split(/\s*;\s*/);
	}

	uaobj.vendors.forEach(function(v){
		if ( v.comments ) {
			v.comments = v.comments.split(/\s*;\s*/);
		}
	});

	//*/


	return uaobj;
};

pp.matchRule = function(uaString) {
	var pua = this._parseUAString(uaString);

	var r = Object.keys(rules).map(function(name){
		var testResult = rules[name].test(pua);
		return {
			rule: rules[name],
			testResult: testResult
		};
	});

	var matchingRule = _.orderBy(r, ['testResult.points'],['desc'])[0];

	var mr = matchingRule.testResult && matchingRule.testResult.points > 0 ? matchingRule : null;

	var result = {};
	if ( this.options.debug ) {
		result.pua = pua;
		result.matcher = mr.rule.matcher;
	}

	return mr ? _.extend(result, {
		matchResult: mr.testResult,
		formatedResult: mr.rule.getResult(pua)
	}) : mr;
};

pp.matchString = function(needle, heystack) {
	return !!new RegExp(regexQuote(needle), 'i').exec(heystack);
};

pp.matchSpecialObj = function(obj, val) {
	var rx, match = false;
	if ( obj.$ne ) {
		rx = new RegExp(regexQuote(obj.$ne), 'i');
		if ( !rx.exec(val) ) {
			match = true;
		}
	}
	return match;
}

pp.isSpecialObj = function(obj) {
	for ( var p in obj ) {
		if ( obj.hasOwnProperty(p) && p.match(/^$.+/) ) {
			return true;
		}
	}
	return false;
}

pp.detect = function(uaString, opts) {
	opts = opts || {};

	var matchingRule = this.matchRule(uaString);

	return matchingRule || 'Unknown';
};

module.exports = Parser;
