var _ = require('lodash');
// Windows

var widnowsVersionsMap = {
	'10.0': 'Windows 10',
	'6.3': 'Windows 8.1',
	'6.2': 'Windows 8',
	'6.1': 'Windows 7',
	'6.0': 'Windows Vista',
	'5.2': 'Windows XP Professional x64',
	'5.1': 'Windows XP',
	'4.9': 'Windows ME',
	'5.0': 'Windows 2000'
};

function reduceWindowsVersion(ver, str) {
	if ( ver ) { return ver; }

	var r;
	if ( ( r = str.match(/(Windows\s+NT\s+|windows\/)(\d{1,2}\.\d{1})/i) ) ) {
		return widnowsVersionsMap[r[2]] || ver;
	}

	return ver;
}

module.exports = function(res, next) {
	var coms = _.get(res, 'pua.application.comments');

	if ( !coms ) { return next(null, res); }

	var ver = coms.reduce(reduceWindowsVersion, null);
	if ( !ver && res.pua.vendors ) {

		ver = res.pua.vendors
			.map(pt=>pt.token)
			.reduce(reduceWindowsVersion, null);
	}
	if ( ver ) {
		_.set(res, 'detected.os', {
			name: 'Windows',
			version: ver
		});
		_.set(res, 'detected.device.platform', 'desktop');
	}
	next(null, res);
};
