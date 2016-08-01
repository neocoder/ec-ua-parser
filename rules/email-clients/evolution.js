var _ = require('lodash');

module.exports = function(res, next) {
	var vendors = _.get(res, 'pua.vendors');
	if ( vendors ) {
		var token = vendors.find(v=>v.name.toLowerCase() === 'evolution');

		if ( token ) {
			_.set(res, 'detected.client', {
				name: 'Evolution',
				version: token.version.full
			});
		}
	}
	next(null, res);
}
