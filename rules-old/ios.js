var Rule = require('../lib/rule');
var _ = require('lodash');

//uaString = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D201',
//uaString = 'Mozilla/5.0 (iPhone 6; CPU iPhone OS 8_1_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/6.0 MQQBrowser/5.8 Mobile/12B440 Safari/8536.25';

// Chrome on iOS
// { "_id" : "Mozilla/5.0 (iPad; CPU OS 7_1 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) CriOS/30.0.1599.12 Mobile/11D167 Safari/8536.25", "value" : 1 }

var rule = new Rule('iOS', {
	application: {
		token: 'Mozilla/5.0',
		comments: [
			// TODO: write the result of regexp into variable
			/^iPhone|iPad|iPod/,
			/like Mac OS X/
		]
	}
});

rule.result({
	platform: 'mobile', // mobile, desktop, tablet,
	client: {
		name: 'Unknown'
	}
	// device: {
	// 	name: 'iPhone', // iPad, Windows, Mac, Android, Other, Linux, ChromeOS, iPod, BlackBerry
	// 	ver: 'iPhone 6'
	// }
});

function formatIOSVersion(com) {
	var m = com.match(/((?:\d+[_\.]?)+)/);
	return m ?  'iOS '+m[1].replace(/_/g, '.') : com;
}

var knownVendors = {
	'Safari': 'Safari',
	'MQQBrowser': 'QQ Browser',
	'CriOS': 'Google Chrome',
	'Facebook': 'Facebook App'
};

var unknownClient = { name: 'Unknown' };

function reduceIOSClient(prevVendor, vendor) {
	// if already detected
	if ( prevVendor !== unknownClient ) { return prevVendor; }

	return knownVendors[vendor.name] || prevVendor;
}

rule.formatResult(function(pua, result) {
	return {
		platform: pua.application.comments[0].match(/iPad/) ? 'tablet' : 'mobile',
		client: pua.vendors ? pua.vendors.reduce(reduceIOSClient, unknownClient) : unknownClient,
		device: {
			name: pua.application.comments[0].replace(/GLOBAL$/, ''),
			os: pua.application.comments.length > 1 ? formatIOSVersion(pua.application.comments[1]) : 'Unknown'
			//ver: pua.application.comments.reduce(reduceWindowsVersion, 'Unknown')
		}
	};
});


module.exports = rule;
