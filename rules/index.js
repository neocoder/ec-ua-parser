/*
{
	platform: 'desktop', // mobile, desktop, tablet,
	client: {
		name: 'Internet Explorer'
	}
	device: {
		name: 'iPhone', // iPad, Windows, Mac, Android, Other, Linux, ChromeOS, iPod, BlackBerry
		os: 'iPhone 6'
	}
}
*/

var preParser = require('../lib/transformers/ua-string-stage-0');
var uaParse = require('../lib/transformers/ua-string-parser');

var async = require('async');
var requireDir = require('require-dir');

var rules = requireDir();

var rulesFuncs = Object.keys(requireDir()).map(key => rules[key]);

rulesFuncs.push(require('./platform'));
rulesFuncs.push(require('./browsers'));
rulesFuncs.push(require('./email-clients'));

module.exports = async.seq(
	preParser,
	uaParse,
	function(params, next){
		// Rule functions expect result object to be passesed as first argument
		// preparing it here
		params.detected = {};// this will be the object with detection result
		next(null, params);
	},
	async.seq.apply(async, rulesFuncs)
);
