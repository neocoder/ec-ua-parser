var _ = require('lodash');

module.exports = function(res, next) {
	var vendors = _.get(res, 'pua.vendors');
	if ( vendors ) {
		var token = vendors.find(v=>v.name === 'Swing');

		if ( token ) {
			_.set(res, 'detected.client.name', 'Swing');
			_.set(res, 'detected.client.version', token.version.major+'.'+token.version.minor);

		}
	}
	next(null, res);
}
