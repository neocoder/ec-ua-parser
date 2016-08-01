var _ = require('lodash');
var debug = require('debug')('ua-parser:browser');

module.exports = function(res, next) {
	var vendors = _.get(res, 'pua.vendors') || [];
	var isAndroid = _.get(res, 'detected.os.name') === 'Android';

	debug('isAndroid %s', isAndroid);

	if ( isAndroid ) {
		var vendorNames = vendors.map(v=>v.name).sort();

		if ( _.difference(vendorNames, ['AppleWebKit', 'Mobile Safari', 'Version']).length === 0 ) {
			var token = vendors.find(v=>v.name === 'Mobile Safari');
			_.set(res, 'detected.client.name', 'Android Browser');
			if ( token ) {
				_.set(res, 'detected.client.version', token.version.full);
			}
		}
	}
	next(null, res);
}
