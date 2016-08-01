/*global it describe*/
var assert = require('assert'),
	Parser = require('../../lib/parser'),
	requireDir = require('require-dir'),
	iosUAStrings = require('./ios.json'),
	colors = require('colors'),
	async = require('async'),
	expect = require('chai').expect,
	format = require('util').format,
	inspect = require('util').inspect;

var parserOptions = { debug: true };

// var x = {
// 	platform: 'mobile', // mobile, desktop, tablet,
// 	client: {
// 		name: 'Unknown'
// 	},
// 	device: {
// 		name: 'iPhone', // iPad, Windows, Mac, Android, Other, Linux, ChromeOS, iPod, BlackBerry
// 		ver: 'iPhone 6'
// 	},
// 	renderingEngine: {
// 		name: 'Mobile Safari'
// 	}
//
// }


describe('Testing iOS Devices Detection', function(){

	// it('Detect iOS devices', function(){
	// 	var p = new Parser(parserOptions);
	// 		//str = 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.51 Safari/534.3';
	// 		//str = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; FunWebProducts; Orange 7.4 ; NaviWoo1.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ;  Embedded Web Browser from: http://bsalsa.com/)';
	// 		//str = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D201';
	//
	// 	var uas = iosUAStrings.slice(0, 10);
	//
	// 	uas.forEach(u=>{
	// 		var r = p.detect(u._id, parserOptions);
	// 		if ( !u.shouldMatch ) {
	// 			console.log('User-agent definition does not have corresponding shouldMatch property'.red);
	// 		} else {
	// 			expect(r.formatedResult).to.deep.equal(u.shouldMatch);
	// 		}
	// 		var resultMsg = ( r.matchResult.matcherPoints !== r.matchResult.points )
	// 			? format('Partial rule match! Rule gained %s out of %s points. Please check the rule.', r.matchResult.points, r.matchResult.matcherPoints).red
	// 			: 'OK'.green;
	// 		console.log(u._id.yellow+' - '+resultMsg);
	// 		if ( !u.shouldMatch || r.matchResult.matcherPoints !== r.matchResult.points ) {
	// 			console.log(inspect(r, { colors: true, depth: 10 }));
	// 			console.log('\n');
	// 		}
	// 	});
	// });

	it('should transforms uaString', function(){

		var uaStrings = [
			'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.51 Safari/534.3',
			'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; FunWebProducts; Orange 7.4 ; NaviWoo1.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ;  Embedded Web Browser from: http://bsalsa.com/)',
			'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D201',
			'BBIdentity IOS Blend/1.4.3/7.1.2/iPad/32',
			'BBIdentity IOS Blend/1.4.3/8.3/iPad/49',
			'MQBrowser/5.0 (iPhone; CPU iPhone OS 6.1.4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Safari/7534.48.3',
			'MQQBrowser/2.4 Mozilla/5.0 (iPad; U; CPU OS 4_3_5 like Mac OS X; zh-cn) AppleWebKit/533.17.9 (KHTML, like Gecko) Mobile/8L1 Safari/7534.48.3',
			'MQQBrowser/2.5 Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206 Safari/7534.48.3',
			'MQQBrowser/28 Mozilla/5.0 (iPhone; CPU iPhone OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206 Safari/7534.48.3'
		];

		// transformations

		function parseUAString(state, next) {
			// 1. transform ua string to a common format
			// 2. parse ua string into an object
			//state.uaString
		}

		// -transformations

		function testUAString(uaString, next) {
			var transformations = [];

			transformations.push(parseUAString);

			transformations[0] = async.apply({ uaString: uaString }, transformations[0]);
			async.waterfall(transformations, function(err, result){
				if ( err ) { return next(err); }
				next(null, result);
			});
		}

		async.map(uaStrings, testUAString, function(err, results){
			console.log(results);
		});

	});
});
