// Outlook-Express/7.0
var _ = require('lodash');


// 'Microsoft Outlook/Windows Live Mail - app:Outlook-Express/7.0',
// 'Microsoft Outlook/Outlook-Express - app:Outlook-Express',
// 'Microsoft Outlook/Outlook 2007 - app:Mozilla, appcom:"MSOffice 12"',
// 'Microsoft Outlook/Outlook 2010 - app:Mozilla, appcom:"MSOffice 14"',
// 'Microsoft Outlook/Outlook 2003 - app:Mozilla, appcom:compatible, appcom:MSIE, ref:false',

module.exports = function(res, next) {
	var appToken = _.get(res, 'pua.application.token'),
		appName = _.get(res, 'pua.application.name'),
		appComs = _.get(res, 'pua.application.comments'),
		MSOfficeCom;

	if ( appToken && appToken === 'Outlook-Express/7.0' ) {
		_.set(res, 'detected.client', {
			name: 'Outlook',
			version: 'Windows Live Mail'
		});
	}

	if ( appComs ) {
		var m, rx = /(?:MSOffice|Microsoft\s+Outlook\s+Mail)\s+(\d+)/;
		MSOfficeCom = appComs.find(com=>!!com.match(rx));
		if ( MSOfficeCom && ( m = MSOfficeCom.match(rx) ) ) {
			var OutlookNumVersionsMap = {
				'12': 'Outlook 2007',
				'14': 'Outlook 2010',
				'15': 'Outlook 2013',
				'16': 'Outlook 2016'
			}
			_.set(res, 'detected.client', {
				name: 'Outlook',
				version: OutlookNumVersionsMap[m[1]] || 'Unknown'
			});
			return next(null, res);
		}
	}


	next(null, res);
}
