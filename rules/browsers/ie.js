var _ = require('lodash');
var utils = require('../../lib/utils');

module.exports = function(res, next) {
	var vendors = _.get(res, 'pua.vendors') || [],
		appComs = _.get(res, 'pua.application.comments') || [];

	var tridentVersionToIEVersion = {
		'7.0': '11',
		'6.0': '10',
		'5.0': '9',
		'4.0': '8'
	}

	var toolbarVendors = [
		'BMID', // ???
		'CSVT',
		'Core',
		'Mozilla' // another Mozilla token appears after the broken UA fixture
	]

	var vendorNames = utils.without(vendors.map(v=>v.name), toolbarVendors);

	var ieVersion = appComs.reduce(function(ieVersion, com){
		var m;
		if ( ( m = com.match(/Trident\/([\d\.]+)/) ) ) {
			return tridentVersionToIEVersion[m[1]] || null;
		}

		return ieVersion;
	}, null);

	if ( !ieVersion ) {
		ieVersion = appComs.reduce(function(ieVersion, com){
			var m;
			if ( ( m = com.match(/MSIE\s([\d\.]+)/) ) ) {
				return parseInt(m[1], 10) || null;
			}

			return ieVersion;
		}, null);
	}

	if ( ieVersion && !vendorNames.length ) {
		_.set(res, 'detected.client', {
			name: 'Internet Explorer',
			version: ieVersion || 'Unknown'
		});
	}

	next(null, res);
}
