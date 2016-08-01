var _ = require('lodash');

// iOS

function reduceiOSVersion(prevVendor, com) {
	var m = com.match(/((?:\d+[_\.]?)+)\s+like Mac OS X/);
	if ( m ) {
		return m[1].replace(/_/g, '.')
	}

	return prevVendor;
}

function findIOSSpecComments(commentsArr) {
	var iosSpecComs = null;
	commentsArr.some(function(coms){
		// TODO: optimize this to not have unnecessary .match
		var m = coms.find(c=>c.match(/^iPhone|iPad|iPod/))
		if ( m ) { m = m.match(/^iPhone|iPad|iPod/); }
		if ( m ) {
			iosSpecComs = {
				comments: coms,
				deviceName: m[0]
			};
			return true;
		}
	});
	return iosSpecComs;
}

function lookupiOSVersion(res, next) {

	var appName = _.get(res, 'pua.application.name');

	// Collecting all comments arrays from the parsed ua
	var commentsArr = [];
	if ( res.pua.vendors ) {
		commentsArr = res.pua.vendors.map(v=>v.comments || null).filter(a=>a!==null);
	}

	var appComs = _.get(res, 'pua.application.comments');

	if ( appComs ) {
		commentsArr.push(appComs)
	}
	// looking for comments with ios specs
	var iosSpecComs = findIOSSpecComments(commentsArr);

	if ( !iosSpecComs ) { return next(null, res); }

	var platformsMap = {
		'iPhone': 'mobile',
		'iPod': 'mobile',
		'iPad': 'tablet'
	}

	_.set(res, 'detected.device.name', iosSpecComs.deviceName);
	_.set(res, 'detected.device.platform', platformsMap[iosSpecComs.deviceName] || 'unknown');

	var iosVersion = iosSpecComs.comments.slice(0, 3).reduce(reduceiOSVersion, null);

	if ( iosVersion ) {
		_.set(res, 'detected.os', {
			name: 'iOS',
			version: iosVersion
		});
	} else if ( appName === 'BBIdentity IOS Blend' ) {
		_.set(res, 'detected.os', {
			name: 'iOS',
			version: appComs[0] || 'Unknown'
		});

	}



	next(null, res);
}

module.exports = lookupiOSVersion;
