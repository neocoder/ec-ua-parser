// Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_5 like Mac OS X; en-gb) AppleWebKit/533.17.9 (KHTML, like Gecko)
// Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_5 like Mac OS X; en-gb) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8L1 Safari/6533.18.5

var _ = require('lodash');

module.exports = function(res, next) {
	var vendors = _.get(res, 'pua.vendors');
	if ( vendors ) {
		var thirdPartyVendorNames = _.without(vendors.map(v=>v.name), 'AppleWebKit', 'Version', 'Mobile');
		var safariToken = vendors.find(v=>v.name === 'Safari');

		if ( !safariToken && thirdPartyVendorNames.length === 0 ) {
			_.set(res, 'detected.client', {
				name: 'Mail app'
			});
		}
	}
	next(null, res);
}
