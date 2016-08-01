var _ = require('lodash');

module.exports = function(res, next) {
	var vendors = _.get(res, 'pua.vendors');
	if ( vendors ) {
		var chromeToken = vendors.find(v=>v.name === 'Chrome');
		if ( chromeToken ) {
			_.set(res, 'detected.client', {
				name: chromeToken.name,
				version: chromeToken.version.full
			});
		}
	}
	next(null, res);
}
