/*global describe it*/
var async = require('async');
var expect = require('chai').expect;
var debug = require('debug')('test-spec-parser');

var _ = require('lodash');


var argv = require('minimist')(process.argv.slice(3));

var fs = require('fs');
var path = require('path');

var mongojs = require('mongojs');

var uaTests = [
	{
		ua: 'Mozilla/5.0 (iPod; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko)',
		osName: 'iOS',
		osVersion: '5.1'
	},
	{
		ua: 'Outlook-Express/7.0 (MSIE 7.0; Windows NT 6.2; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; MAARJS; TmstmpExt)',
		osName: 'Windows',
		osVersion: 'Windows 8'
	},
	{
		ua: 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.51 Safari/534.3',
		osName: 'Windows',
		osVersion: 'Windows 7'
	},
	{
		ua: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; FunWebProducts; Orange 7.4 ; NaviWoo1.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ;  Embedded Web Browser from: http://bsalsa.com/)',
		osName: 'Windows',
		osVersion: 'Windows 2000'
	},
	{
		ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D201',
		osName: 'iOS',
		osVersion: '7.1.1'
	},
	{
		ua: 'BBIdentity IOS Blend/1.4.3/8.3/iPad/49',
		osName: 'iOS',
		osVersion: '8.3'
	},
	{
		ua: 'MQBrowser/5.0 (iPhone; CPU iPhone OS 6.1.4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Safari/7534.48.3',
		osName: 'iOS',
		osVersion: '6.1.4'
	},
	{
		ua: 'MQQBrowser/2.4 Mozilla/5.0 (iPad; U; CPU OS 4_3_5 like Mac OS X; zh-cn) AppleWebKit/533.17.9 (KHTML, like Gecko) Mobile/8L1 Safari/7534.48.3',
		osName: 'iOS',
		osVersion: '4.3.5'
	},
	{
		ua: 'Airmail%20Beta/341 CFNetwork/673.6 Darwin/13.4.0 (x86_64) (MacBookAir4%2C2)',
		osName: 'macOS',
		osVersion: 'Mavericks v10.9'

	},
	{
		ua: 'Box for Office/4.0.1011.0 (Outlook 14.0.0.7113);Windows/6.1.7601.65536;AMD64',
		osName: 'Windows',
		osVersion: 'Windows 7'
	},
	// {
	// 	ua: 'CoolPad8190_CMCC_TD/1.0 Linux/3.0.8 Android/4.0 Release/10.15.2012 Browser/AppleWebkit534.3',
	// 	osName: 'Android',
	// 	osVersion: '4.0'
	// },
	{
		ua: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_5 like Mac OS X; en-gb) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8L1 Safari/6533.18.5',
		osName: 'iOS',
		osVersion: '4.3.5'
	}
];

var UAParser = require('../');

var uap = new UAParser();

describe('Testing OS detection', function(done){

	this.timeout(0);

	it('should detect os versions', function(done){

		async.eachSeries(
			uaTests,
			function(uaTest, nextTest){
				uap.parse(uaTest.ua, function(err, res){
					if ( err ) { return nextTest(err); }
					console.log(res.detected);
					expect(_.get(res, 'detected.os.name')).to.be.equal(uaTest.osName);
					expect(_.get(res, 'detected.os.version')).to.be.equal(uaTest.osVersion);
					nextTest();
				});
			},
			done
		);

	});

});
