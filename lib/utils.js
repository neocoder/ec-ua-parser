var _ = require('lodash');

var supplant = function (str, o) {
	return str.replace(/{([^{}]*)}/g,
		function (a, b) {
			var r = o[b];
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		}
	);
};

var regexQuote = function(str) {
	return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}=!<>\|\:])/g, function(s, p1){
		return '\\'+p1;
	});
};

var sanitize = function(rawKey, space) {
	space = space || ' ';
	return _.trim((rawKey+'').replace(/[\W]+/g, space), space).toLowerCase();
}

function without(arr, withoutValues) {
	var args = [arr].concat(withoutValues);
	return _.without.apply(_, args);
}

module.exports = {
	supplant,
	regexQuote,
	sanitize,
	without
};
