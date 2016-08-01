var _ = require('lodash');

module.exports = function(res, next) {
	var appName = _.get(res, 'pua.application.name');
	if ( appName === 'Airmail' || appName === 'Airmail Beta' ) {
		_.set(res, 'detected.client', {
			name: 'Airmail',
			version: _.get(res, 'pua.application.version.full')
		});
	}
	next(null, res);
}
