var Rule = require('../lib/rule');
var _ = require('lodash');

var rule = new Rule('IE', {
	application: {
		comments: [
			/MSIE/,
			'compatible'
		]
	}
});

rule.result({
	platform: 'desktop', // mobile, desktop, tablet,
	client: {
		name: 'Internet Explorer'
	}
	// device: {
	// 	name: 'iPhone', // iPad, Windows, Mac, Android, Other, Linux, ChromeOS, iPod, BlackBerry
	// 	ver: 'iPhone 6'
	// }
});

function reduceIEVersion(ver, str) {
	var r;
	if ( ( r = str.match(/MSIE\s+([\d\.]+)/i) ) ) {
		return r[1];
	}
	return ver;
}
// Windows NT 5.1
function reduceWindowsVersion(ver, str) {
	var r,
		map = {
			'10.0': 'Windows 10',
			'6.3': 'Windows 8.1',
			'6.2': 'Windows 8',
			'6.1': 'Windows 7',
			'5.2': 'Windows XP Professional x64',
			'5.1': 'Windows XP',
			'4.9': 'Windows ME',
			'5.0': 'Windows 2000'
		};
		
	if ( ( r = str.match(/Windows\s+NT\s+([\d\.]+)/i) ) ) {
		return map[r[1]] || ver;
	}
	return ver;
}

rule.formatResult(function(pua, result) {
	return {
		client: {
			ver: pua.application.comments.reduce(reduceIEVersion, 'Unknown')
		},
		device: {
			name: 'Windows',
			os: pua.application.comments.reduce(reduceWindowsVersion, 'Windows')
		}
	};
});


module.exports = rule;
