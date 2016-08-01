var _ = require('lodash');

function isBlackBerryUA(str) {
	return str.match(/(PlayBook|BlackBerry|BB10)/i);
}

module.exports = function(res, next) {

	var appToken = _.get(res, 'pua.application.token') || '';
	var appComs = _.get(res, 'pua.application.comments') || [];

	var blackBerryAppToken = appComs.find(isBlackBerryUA);
	var isBlackBerry = ( appToken && isBlackBerryUA(appToken) ) || blackBerryAppToken;

	var deviceName = appComs.reduce(function(deviceName, com){
		if ( deviceName ) { return deviceName; }

		if ( com.match(/PlayBook/i) ) { return 'PlayBook'; }

		var m;
		if ( ( m = com.match(/BlackBerry[\s\d\.]+/i) ) ) {
			return m[0];
		}

		if ( com == 'BB10' ) {
			return 'BB10 Smartphone';
		}

		return deviceName;
	}, '');

	var m;
	if ( !deviceName && ( m = appToken.match(/(BlackBerry)(\d+)/) ) ) {
		deviceName = m[1]+' '+m[2];
	}

	if ( !isBlackBerry ) { return next(null, res); }

	_.set(res, 'detected.device.name', deviceName || 'unknown');
	_.set(res, 'detected.device.platform', blackBerryAppToken === 'PlayBook' ? 'tablet' : 'mobile');

	if ( appComs.length && appComs[0] === 'BB10' ) {
		_.set(res, 'detected.os', {
			name: 'BB10',
			version: '10'
		});
	}

	next(null, res);
};
