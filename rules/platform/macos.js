var _ = require('lodash');
var macosRelease = require('macos-release');

// MacOS

function reduceMacName(macName, darwinComm) {
	if ( macName && macName !== 'unknown' ) { return macName; }

	if ( darwinComm.match(/mac/i) ) {
		return darwinComm;
	}
	return macName;
}

module.exports = function(res, next) {
	var appComs = _.get(res, 'pua.application.comments');
	var vendors = _.get(res, 'pua.vendors');

	if ( appComs ) {

		if ( appComs.find(c=>c === 'Macintosh PPC') ) {
			_.set(res, 'detected.os.name', 'macOS');
			_.set(res, 'detected.device.platform', 'desktop');
			return next(null, res);
		}

	}

	if ( vendors ) {
		var darwinVendor = res.pua.vendors.find(v=>v.name==='Darwin');

		if ( darwinVendor ) {
			if ( darwinVendor.comments ) {
				_.set(res, 'detected.device.name', darwinVendor.comments.reduce(reduceMacName, 'unknown'));
			}
			_.set(res, 'detected.device.platform', 'desktop');

			var darwinVersion = darwinVendor.token.split('/')[1];

			var os = macosRelease(darwinVersion);

			if ( os ) {
				_.set(res, 'detected.os', {
					name: 'macOS',
					version: os.name+' v'+os.version
				});
			}
		}
	}

	// ppc
	if ( appComs ) {

		var osVersion = appComs.reduce(function(osVersion, com){
			var m;
			if ( ( m = com.match(/Mac OS X\s*([\d\.\_]+|)/i) ) && !com.match('like') ) {
				return m[1].replace(/\_/g,'.');
			}
			return osVersion;
		}, '');

		if ( osVersion ) {
			//_.set(res, 'detected.device.name', darwinVendor.comments.reduce(reduceMacName, 'unknown'));
			_.set(res, 'detected.device.platform', 'desktop');
			_.set(res, 'detected.os', {
				name: 'macOS',
				version: osVersion
			});
		}
	}

	next(null, res);
};
