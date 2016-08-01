// Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.13) Gecko/20110221 Postbox/2.1.4b1
// Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:7.0.1) Gecko/20120826 Postbox/3.0.5
var _ = require('lodash');

module.exports = function(res, next) {
	var appName = _.get(res, 'pua.application.name');
	if ( appName && appName === 'Barca' ) {
		_.set(res, 'detected.client', 'Barca');
		_.set(res, 'detected.device.platform', 'desktop');
		var ver = _.get(res, 'pua.application.version.full');
		if ( ver ) {
			_.set(res, 'detected.client.version', ver);
		}
	}
	next(null, res);
}
