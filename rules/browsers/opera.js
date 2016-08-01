var _ = require('lodash');

module.exports = function(res, next) {
	var app = _.get(res, 'pua.application');
	if ( app && app.name === 'Opera' ) {
		_.set(res, 'detected.client', {
			name: app.name,
			version: app.version.full
		});
	}
	next(null, res);
}
