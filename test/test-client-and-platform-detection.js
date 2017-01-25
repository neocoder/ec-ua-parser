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
		ua: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_5 like Mac OS X; en-gb) AppleWebKit/533.17.9 (KHTML, like Gecko)',
		clientName: 'Mail app'
	},
	{
		ua: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_5 like Mac OS X; en-gb) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8L1 Safari/6533.18.5',
		clientName: 'Safari'
	},
	{
		ua: 'Mozilla/5.0 (Windows; U; Windows NT 6.1; ru; rv:1.9.2.13) Gecko/20101207 Thunderbird/3.1.7',
		clientName: 'Thunderbird',
		clientVersion: '3.1.7'
	},
	{
		ua: 'Mozilla/5.0 (Windows; U; Windows NT 6.1; ru; rv:1.9.2.6) Gecko/20100625 MRA 5.6 (build 03402) Firefox/3.6.6 ( .NET CLR 3.5.30729) WebMoney Advisor',
		clientName: 'Firefox',
		clientVersion: '3.6.6'
	},
	// Internet Explorer
	{
		ua: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',
		clientName: 'Internet Explorer',
		clientVersion: '11'
	},
	{
		ua: 'Mozilla/5.0 (compatible; MSIE 10.6; Windows NT 6.1; Trident/5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp-gba UNTRUSTED/1.0',
		clientName: 'Internet Explorer',
		clientVersion: '9'
	},
	{
		ua: 'CamelHttpStream/1.0 Evolution/2.30.3',
		clientName: 'Evolution'
	},
	{
		ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
	},
	{
		ua: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows 98; Maxthon; SearchToolbar 1.2;  Embedded Web Browser from: http://bsalsa.com/; .NET CLR 2.0.50727; Alexa Toolbar)'
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
				debug('User-Agent', uaTest.ua);
				uap.parse(uaTest.ua, function(err, res){
					if ( err ) { return nextTest(err); }
					console.log(require('util').inspect(res, { depth: null, colors: true }));
					console.log();
					expect(_.get(res, 'detected.device.platform')).to.exist;
					expect(_.get(res, 'detected.client.name')).to.be.equal(uaTest.clientName);
					if ( uaTest.clientVersion ) {
						expect(_.get(res, 'detected.client.version')).to.be.equal(uaTest.clientVersion);
					}
					nextTest();
				});
			},
			done
		);

	});

});
