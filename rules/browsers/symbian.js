var _ = require('lodash');

module.exports = function(res, next) {
	var coms = _.get(res, 'pua.application.comments');
	if ( !coms ) { return next(null, res); }

	var seriesVer = coms.reduce(function(ver, com){
		if ( ver ) { return ver; }

		var m;
		if ( ( m = com.match(/^Series\d+/i) ) ) {
			return m[0];
		}

		return ver;
	}, null);

	var vendors = _.get(res, 'pua.vendors') || [];

	var isNokiaBrowser = vendors.find(v=>v.name === 'NokiaBrowser');

	if ( _.get(res, 'detected.os.name') === 'Symbian' ) {
		if ( isNokiaBrowser ) {
			_.set(res, 'detected.client', {
				name: 'Nokia Browser'
			});
		} else {
			_.set(res, 'detected.client', {
				name: 'Browser for '+(seriesVer || 'Symbian')
			});
		}
	}

	next(null, res);
}
