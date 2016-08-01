var _ = require('lodash');
// Linux

function lookupLinuxVersion(res, next) {
	var appComs = _.get(res, 'pua.application.comments');
	var linux = appComs && appComs.find(s=>s.match(/Linux/i));
	var androidCom = appComs && appComs.find(s=>s.match(/Android/i));
	if ( linux && !androidCom ) {
		//_.set(res, 'detected.device.name', deviceName);
		_.set(res, 'detected.os', {
			name: 'Linux'
		});
		_.set(res, 'detected.device.platform', 'desktop');
	}
	return next(null, res);
}

module.exports = lookupLinuxVersion;
