var _ = require('lodash');

module.exports = function(res, next) {
	var appName = _.get(res, 'pua.application.name');
	if ( appName && appName.match(/^BlackBerry/) ) {
		_.set(res, 'detected.client', {
			name: 'BlackBerry'
		});
	}
	next(null, res);
}
