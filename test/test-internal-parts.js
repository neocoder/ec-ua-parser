/*global it describe*/
var assert = require('assert'),
	Parser = require('../lib/parser'),
	requireDir = require('require-dir'),
	parse = require('../lib/transformers/ua-string-parser');

/*
var iit = it;
it = function(){}
//*/

var parse = require('../lib/transformers/ua-string-parser');

describe('Testing Parser library', function(){

	it('should parse token', function(done){
		var p = new Parser(),
			str = 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.51 Safari/534.3';

		parse(str, function(err, pua){
			if ( err ) { return done(err); }

			var pt1 = pua.vendors[1]; // ('Chrome/6.0.472.51');
			var pt2 = pua.vendors[0]; // ('AppleWebKit/534.3');
			var pt3 = pua.application;

			assert(pt1.name == 'Chrome');
			assert(pt1.version.major == '6');
			assert(pt1.version.minor == '0');
			assert(pt1.version.bugfix == '472');
			assert(pt1.version.build == '51');


			assert(pt2.name == 'AppleWebKit');
			assert(pt2.version.major == '534');
			assert(pt2.version.minor == '3');
			assert(typeof pt2.version.bugfix == 'undefined');
			assert(typeof pt2.version.build == 'undefined');


			assert(pt3.name == 'Mozilla');
			assert(pt3.version.major == '5');
			assert(pt3.version.minor == '0');
			assert(typeof pt3.version.bugfix == 'undefined');
			assert(typeof pt3.version.build == 'undefined');

			done();
		});
	});

	it('should match rule', function(){
		var p = new Parser();
			//uaString = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D201',
			//uaString = 'Mozilla/5.0 (iPhone 6; CPU iPhone OS 8_1_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/6.0 MQQBrowser/5.8 Mobile/12B440 Safari/8536.25';
		var uaString = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; FunWebProducts; Orange 7.4 ; NaviWoo1.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ;  Embedded Web Browser from: http://bsalsa.com/)';
		var rules = requireDir('../rules');
		var pua = p._parseUAString(uaString);

		var r = Object.keys(rules).reduce(function(result, name){
			result[name] = rules[name].test(pua);
			return result;
		},{});

		console.log(r);
		console.log(JSON.stringify(rules.ie.getResult(pua), null, '\t'));
	});

});
