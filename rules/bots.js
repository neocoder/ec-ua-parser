var _ = require('lodash');

module.exports = function(res, next) {
	var appName = _.get(res, 'pua.application.name');
	var appComs = _.get(res, 'pua.application.comments');
	var vendors = _.get(res, 'pua.vendors');
	var fristVendorName = _.get(res, 'pua.vendors[0].name');
	if ( vendors ) {
		var googleImageProxy = vendors.find(v=>v.comments && v.comments.find(c=>!!c.match(/GoogleImageProxy/)));

		if ( googleImageProxy ) {
			_.set(res, 'detected.client.name','GMail');
			_.set(res, 'detected.device.platform', 'service');
			_.set(res, 'detected.flags', ['imageproxy', 'bot']);
		}
	}

	if ( appComs && appComs.find(c=>!!c.match(/Googlebot/)) ) {
		_.set(res, 'detected.client.name','Googlebot');
		_.set(res, 'detected.device.platform', 'service');
		_.set(res, 'detected.flags', ['bot']);
	}

	if ( appName === 'X-Litmus-Image-Check' ) {
		_.set(res, 'detected.device.platform', 'service');
		_.set(res, 'detected.flags', ['bot']);
		_.set(res, 'detected.client.name','Litmus Image Check');
	}

	if ( appName === 'ClamAV' ) {
		_.set(res, 'detected.device.platform', 'service');
		_.set(res, 'detected.client.name','ClamAV open source antivirus');
	}

	if ( appName === 'Java' || fristVendorName === 'Java' || appName === 'Apache-HttpClient' ) {
		_.set(res, 'detected.device.platform', 'service');
		_.set(res, 'detected.flags', ['bot']);
		_.set(res, 'detected.client.name','Java Based Crawler');
	}
	next(null, res);
}
