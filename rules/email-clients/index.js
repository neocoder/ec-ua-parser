var async = require('async');
var requireDir = require('require-dir');

var rules = requireDir();

var rulesFuncs = Object.keys(rules).map(key => rules[key]);

module.exports = async.seq.apply(async, rulesFuncs);
