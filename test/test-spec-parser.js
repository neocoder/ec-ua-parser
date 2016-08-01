/*global describe it*/
var async = require('async');
var expect = require('chai').expect;
var debug = require('debug')('test-spec-parser');

var fs = require('fs');
var path = require('path');
var deviceRawSpecObject = fs.readFileSync(path.resolve(__dirname, 'raw-spec.json'))+'';

var uaStrings = [
	{
		ua: 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.51 Safari/534.3',
		converted: 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.51 Safari/534.3'
	},
	{
		ua: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; FunWebProducts; Orange 7.4 ; NaviWoo1.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ;  Embedded Web Browser from: http://bsalsa.com/)',
		converted: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; FunWebProducts; Orange 7.4 ; NaviWoo1.1;  Embedded Web Browser from: http://bsalsa.com/) Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)'
	},
	{
		ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D201',
		converted: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D201'
	},
	{
		ua: 'BBIdentity IOS Blend/1.4.3/8.3/iPad/49',
		converted: 'BBIdentity IOS Blend/1.4.3 (8.3; iPad; 49)'
	},
	{
		ua: 'MQBrowser/5.0 (iPhone; CPU iPhone OS 6.1.4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Safari/7534.48.3',
		converted: 'MQBrowser/5.0 (iPhone; CPU iPhone OS 6.1.4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Safari/7534.48.3'
	},
	{
		ua: 'MQQBrowser/2.4 Mozilla/5.0 (iPad; U; CPU OS 4_3_5 like Mac OS X; zh-cn) AppleWebKit/533.17.9 (KHTML, like Gecko) Mobile/8L1 Safari/7534.48.3',
		converted: 'MQQBrowser/2.4 Mozilla/5.0 (iPad; U; CPU OS 4_3_5 like Mac OS X; zh-cn) AppleWebKit/533.17.9 (KHTML, like Gecko) Mobile/8L1 Safari/7534.48.3'
	},
	{
		ua: 'Airmail/249 CFNetwork/673.3 Darwin/13.4.0 (x86_64) (MacBookPro10%2C1)',
		converted: 'Airmail/249 CFNetwork/673.3 Darwin/13.4.0 (x86_64; MacBookPro10,1)'
	},
	{
		ua: 'Airmail%20Beta/341 CFNetwork/673.6 Darwin/13.4.0 (x86_64) (MacBookAir4%2C2)',
		converted: 'Airmail Beta/341 CFNetwork/673.6 Darwin/13.4.0 (x86_64; MacBookAir4,2)'
	},
	{
		ua: 'Box for Office/4.0.1011.0 (Outlook 14.0.0.7113);Windows/6.1.7601.65536;AMD64',
		converted: 'Box for Office/4.0.1011.0 (Outlook 14.0.0.7113) Windows/6.1.7601.65536 AMD64'
	},
	{
		ua: 'Citrix%20Viewer/241823 CFNetwork/596.4.3 Darwin/12.4.1 (x86_64) (MacBookAir6%2C2)',
		converted: 'Citrix Viewer/241823 CFNetwork/596.4.3 Darwin/12.4.1 (x86_64; MacBookAir6,2)'
	},
	{
		ua: 'CoolPad8190_CMCC_TD/1.0 Linux/3.0.8 Android/4.0 Release/10.15.2012 Browser/AppleWebkit534.3',
		converted: 'CoolPad8190_CMCC_TD/1.0 Linux/3.0.8 Android/4.0 Release/10.15.2012 Browser/AppleWebkit534.3'
	}
];

var getSpec = require('../lib/spec-parser/phonearena');
var formatSpec = require('../lib/transformers/device-raw-spec');

describe('Testing 0 stage ua string transformation', function(done){

	this.timeout(0);

	it('should find spec by device name', function(done){
		// getSpec('Amazon Kindle Fire', function(err, result){
		getSpec('SM-E500H', function(err, result){
			if ( err ) { return done(err); }

			console.log(require('util').inspect(result, { depth: null, colors: true }));
			//console.log(JSON.stringify(result));

			// formatSpec(result, function(err, spec2){
			// 	if ( err ) { return done(err); }
			//
			// 	console.log(require('util').inspect(spec2, { depth: null, colors: true }));
			// 	done();
			// });
		});
	});

	// it('should format raw spec object', function(done){
	// 	var spec1 = deviceRawSpecObject;
	// 	try {
	// 		spec1 = JSON.parse(spec1);
	// 	} catch (err) {
	// 		return done(err);
	// 	}
	//
	// 	formatSpec(spec1, function(err, spec2){
	// 		if ( err ) { return done(err); }
	//
	// 		console.log(require('util').inspect(spec2, { depth: null, colors: true }));
	// 	});
	// });

});
