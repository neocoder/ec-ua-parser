/*global describe it*/
var async = require('async');
var path = require('path');
var _ = require('lodash');
var expect = require('chai').expect;
var debug = require('debug')('test-ua-transform');

var UAParser = require(path.resolve(__dirname, '../index'));
var uap = new UAParser();


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
	},
	{
		ua: 'Celkon A98 Linux/3.0.13 Android/4.0.4 Release/01.30.2013 Browser/AppleWebKit534.30 Profile/MIDP-2.0 Configuration/CLDC-1.1 Mobile Safari/534.30 Android 4.0.1;',
		converted: 'Mozilla/5.0 (Linux; Android 4.0.4; Celkon A98 Release/01.30.2013) Linux/3.0.13  Browser/AppleWebKit534.30 Profile/MIDP-2.0 Configuration/CLDC-1.1 Mobile Safari/534.30 Android 4.0.1 '
	}
];

var transform = require('../lib/transformers/ua-string-stage-0');
var parse = require('../lib/transformers/ua-string-parser');

var detect = require('../rules');

/*
var iit = it;
it = function(){}
//*/


describe('Testing 0 stage ua string transformation', function(){
	it('should convert user agent strings to common standart', function(done){
		async.map(
			uaStrings,
			function(uaStrDef, next) {
				transform(uaStrDef.ua, function(err, transformedUA){
					if ( err ) { return next(err); }
					expect(transformedUA).to.be.equal(uaStrDef.converted);
					next(null, transformedUA);
				});
			},
			done);
	});

	//*
	it('should parse ua string into pua(parsed user-agent) object', function(done){
		parse(uaStrings[0].converted, function(err, pua){
			if ( err ) { return done(err); }

			//console.log(require('util').inspect(pua, { depth: null, colors: true }));
			done();
		});
	});

	it('shoud convert ua string of windows desktop machine into detected object', function(done){
		debug('Starting detection');
		detect(uaStrings[0].converted, function(err, result){
			if ( err ) { return done(err); }
			// console.log(require('util').inspect(result.pua, { depth: null, colors: true }));
			//console.log(require('util').inspect(result.detected, { depth: null, colors: true }));
			expect(result.detected.device.os).to.be.equal('Windows 7');
			debug('Detection finished');
			done();
		});
	});

	it('shoud convert ua string of ios device into detected object', function(done){
		debug('Starting detection');
		var uas = [
			'Mozilla/5.0 (iPod; U; CPU iPhone OS 4_2_1 like Mac OS X; fi-fi) AppleWebKit/533.17.9 (KHTML, like Gecko)',
			'Mozilla/5.0 (iPad; U; CPU OS 4_2_1 like Mac OS X; fi-fi) AppleWebKit/533.17.9 (KHTML, like Gecko)'
		];
		detect(uas[0], function(err, result){
			console.log(require('util').inspect(result.detected, { depth: null, colors: true }));
			expect(result.detected.device.name).to.be.equal('iPod');
			expect(result.detected.device.os).to.be.equal('iOS 4.2.1');
			done();
		});
	});

	it('shoud convert ua string of android device into detected object', function(done){
		debug('Starting detection');
		var uas = [
			'Mozilla/5.0 (Linux; Android 4.4.4; SM-A500G Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36',
			'Mozilla/5.0 (Linux; Android 4.4.4; SM-A500G Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36',
			'Mozilla/5.0 (Linux; Android 4.4.2; Micromax A120 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36',
			'Mozilla/5.0 (Linux; U; Android 4.1.1; en-in; HTC Desire 501 dual sim Build/JRO03H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
			'Mozilla/5.0 (Linux; U; Android 2.1-update1; fi-fi; GT-I9000 Build/ECLAIR) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17',
			'Mozilla/5.0 (Linux; U; Android 2.3.5; fi-fi; HTC Desire S Build/GRJ90) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
			'Mozilla/5.0 (Linux; U; Android 2.3.5; fi-fi; HTC Wildfire S A510e Build/GRJ90) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
			'Mozilla/5.0 (Linux; Android 5.1.1; SM-E500H Build/LMY47X; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.121 Mobile Safari/537.36',
			'Mozilla/5.0 (Linux; U; Android 2.3.6; fi-fi; GT-S5360 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
			'Mozilla/5.0 (Linux; U; Android 2.3.5; en-fi; HTC Desire HD A9191 Build/GRJ90) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
			'Mozilla/5.0 (Linux; Android 5.0.2; XT1033 Build/LXB22.46-28) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/37.0.0.0 Mobile Safari/537.36',
			'Mozilla/5.0 (Linux; Android 4.4.2; Q1010i Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36',
			'Mozilla/5.0 (Linux; U; Android 2.2.1; fi-fi; GT-S5660 Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
			'9220 Linux/2.6.35 Android/4.0.3 Release/11.29.2012 Browser/AppleWebKit533.1 Profile/MIDP-2.0 Configuration/CLDC-1.1 Mobile Safari/533.1',
			'9300-9300/1.0 Linux/2.6.35.7 Android/4.0.3 Release/04.02.2013 Browser/AppleWebKit533.1 (KHTML, like Gecko) Mozilla/5.0 Mobile',
			'AQUA 5.0 Linux/3.0.13 Android/4.0.4 Release/11.08.2012 Browser/AppleWebKit534.30 Profile/MIDP-2.0 Configuration/CLDC-1.1 Mobile Safari/534.30 Android 4.0.1;',
			'AQUA 5.0 Linux/3.0.13 Android/4.0.4 Release/12.26.2012 Browser/AppleWebKit534.30 Profile/MIDP-2.0 Configuration/CLDC-1.1 Mobile Safari/534.30 Android 4.0.1;',
			'Android',
			'AndroidDownloadManager',
			'AndroidDownloadManager/5.1.1 (Linux; U; Android 5.1.1; SAMSUNG-SM-G900A Build/LMY47X)',
			'Aqua Y2/V1 Linux/3.4.5 Android/4.2.2 Release/03.26.2013 Browser/AppleWebKit534.30 Mobile Safari/534.30 MBBMS/2.2;',
			'Athens15_TD/V2 Linux/3.0.13 Android/4.0 Release/02.15.2012 Browser/AppleWebKit534.30 Mobile Safari/534.30 MBBMS/2.2 System/Android 4.0.1;',
			'Celkon A98 Linux/3.0.13 Android/4.0.4 Release/01.30.2013 Browser/AppleWebKit534.30 Profile/MIDP-2.0 Configuration/CLDC-1.1 Mobile Safari/534.30 Android 4.0.1;',
			'Celkon A98 Linux/3.0.13 Android/4.0.4 Release/04.08.2013 Browser/AppleWebKit534.30 Profile/MIDP-2.0 Configuration/CLDC-1.1 Mobile Safari/534.30 Android 4.0.1;',
			'CoolPad8190_CMCC_TD/1.0 Linux/3.0.8 Android/4.0 Release/10.15.2012 Browser/AppleWebkit534.3',
			'Dalvik/1.2.0 (Linux; U; Android 2.2.1; PantechP8000 Build/FRG83)',
			'Dalvik/1.4.0 (Linux; U; Android 2.3.1; MW0812 Build/GINGERBREAD)',
			'Dalvik/1.4.0 (Linux; U; Android 2.3.3; C771 Build/C771M150)',
			'Dalvik/1.4.0 (Linux; U; Android 2.3.3; GT-I9100 Build/GINGERBREAD)',
			'Dalvik/1.4.0 (Linux; U; Android 2.3.4; ADR6300 Build/GRJ22)',
			'Dalvik/1.4.0 (Linux; U; Android 2.3.4; Kindle Fire Build/GINGERBREAD)',
			'Dalvik/1.4.0 (Linux; U; Android 2.3.4; MK16i Build/4.0.2.A.0.69)'
		];
		async.map(
			uas,
			function(ua, nextUA) {
				detect(ua, function(err, result){
					if ( err ) { return nextUA(err); }
					console.log('> ', _.get(result, 'detected.device.name'));
					nextUA();
				});
			},
			done
		);
	});

	//*/

});
