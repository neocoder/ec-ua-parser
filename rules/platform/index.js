var async = require('async');
var requireDir = require('require-dir');

var platformRules = requireDir();

var platformRulesFuncs = Object.keys(platformRules).map(key => platformRules[key]);

module.exports = async.seq.apply(async, platformRulesFuncs);
