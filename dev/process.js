/*global describe it*/
var async = require('async');
var expect = require('chai').expect;
var debug = require('debug')('test-spec-parser');
var format = require('util').format;
var colors = require('colors');
var _ = require('lodash');

var utils = require('../lib/utils');


var argv = require('minimist')(process.argv.slice(2));

var fs = require('fs');
var path = require('path');

var mongojs = require('mongojs');

var UAParser = require('../');

var uap = new UAParser();

	//*
var parse = function(done){

	//var ua = 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.13 (KHTML, like Gecko) Chrome/9.0.597.83 Safari/534.13';
	//var ua = 'Outlook-Express/7.0 (MSIE 7.0; Windows NT 6.2; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; MAARJS; TmstmpExt)';
	//var ua = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_5 like Mac OS X; en-gb) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8L1 Safari/6533.18.5';
	//var ua = 'Box for Office/4.0.1011.0 (Outlook 14.0.0.7113);Windows/6.1.7601.65536;AMD64';
	//var ua = 'BBIdentity IOS Blend/1.4.3/8.3/iPad/49';
	//var ua = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_5 like Mac OS X; en-gb) AppleWebKit/533.17.9 (KHTML, like Gecko)';
	//var ua = 'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.2.10) Gecko/20100914 YFF35 Firefox/3.6.10 ( .NET CLR 3.5.30729; .NET4.0C)';
	// var ua = 'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.2.10) Gecko/20100914 YFF35 Firefox/3.6.10 ( .NET CLR 3.5.30729; .NET4.0C)';
	// var ua = 'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SGH-T999L Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30';

	//var ua = 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; QQDownload 667; WebMoney Advisor; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; staticlogin:product=cboxf2010&act=login&info=ZmlsZW5hbWU9UG93ZXJXb3JkMjAxME94Zl9VbHRpbWF0ZS5leGUmbWFjPTAwMDc0RTY3QTI3NTQ3NThCNDA2MTFBNjk0NjZCODBCJnBhc3Nwb3J0PSZ2ZXJzaW9uPTIwMTAuNi4zLjYuMiZjcmFzaHR5cGU9MQ==&verify=934101e4839982acf0b42e756b1c2206; .NET4.0C; .NET4.0E; SE 2.X MetaSr 1.0 Mozilla/4.0 compatible; MSIE 6.0; Windows NT 5.1; SV1';
	//var ua = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.13) Gecko/20101203 AlexaToolbar/alxf-1.54 YFF35 Firefox/3.6.13';
	//var ua = 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.13) Gecko/20101203 AskTbGOM2/3.9.1.14019 Firefox/3.6.13';
	//var ua = 'Outlook-Express/7.0 (MSIE 7.0; Windows NT 5.1; Trident/4.0; GTB7.4; User-agent: Mozilla/4.0 ; MSIE 6.0; Windows NT 5.1; SV1; http://bsalsa.com; ; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727; BO1IE8_v1; ENUS; TmstmpExt)';
	//var ua = 'Mozilla/5.0 (SymbianOS/9.4; Series60/5.0 Nokia5230/51.0.002; Profile/MIDP-2.1 Configuration/CLDC-1.1 ) AppleWebKit/533.4 (KHTML, like Gecko) NokiaBrowser/7.3.1.33 Mobile Safari/533.4 3gpp-gba';
	//var ua = 'Mozilla/5.0 (SymbianOS/9.2; U; Series60/3.1 NokiaN95/21.0.016; Profile/MIDP-2.0 Configuration/CLDC-1.1 ) AppleWebKit/413 (KHTML, like Gecko) Safari/413';
	//var ua = 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.13) Gecko/20110221 Postbox/2.1.4b1';
	//var ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:7.0.1) Gecko/20120826 Postbox/3.0.5';
	//var ua = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-us) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4';
	//var ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/534.51.22 (KHTML, like Gecko)';
	//var ua = 'Mozilla/5.0 (Windows NT 5.1; rv:11.0) Gecko Firefox/11.0 (via ggpht.com GoogleImageProxy)';
	// ??? var ua = 'Mozilla/4.0 (compatible; Lotus-Notes/6.0; Windows-NT)';
	//var ua = 'X-Litmus-Image-Check';
	//var ua = 'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.1.7) Gecko/20091221 Ant.com Toolbar 1.5 Firefox/3.5.7 (.NET CLR 3.5.30729) FBSMTWB';
	//var ua = '() { :;};echo Content-type:text/plain;echo;echo "8"6ff49a7d633f829bbbfadc7c40d26bf;echo;exit';
	//var ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 520) UCBrowser/4.2.1.541 Mobile';
	//var ua = 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; Trident/7.0; Touch; MSAppHost/2.0; rv:11.0) like Gecko BMID/E679BDEF4A';
	//var ua = 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; GTB7.3; MS-RTC LM 8; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; BRI/1)';

	//var ua = 'Mozilla/5.0 (Linux; Android 5.0.2; LG-H630D Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36';
	//var ua = 'Mozilla/5.0 (Linux; U; Android 2.3.4; en-nz; LG-P970 Build/GRJ22) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1';
	//var ua = 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-gb; SAMSUNG GT-S7500/S7500BULE2 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1';

	//var ua = 'Airmail 1.3.2 rv:231 (Macintosh; Mac OS X 10.9.3; cs_CZ)';
	// var ua = 'BlackBerry9000/5.0.0.900 Profile/MIDP-2.1 Configuration/CLDC-1.1 VendorID/107';
	//var ua = 'ClamAV 0.95.3';
	//var ua = 'CamelHttpStream/1.0 Evolution/3.4.2';
	//var ua = 'Airmail%20Beta/250 CFNetwork/673.3 Darwin/13.3.0 (x86_64) (MacBookPro11%2C3)';
	//var ua = 'Microsoft Office/16.0 (Microsoft Outlook Mail 16.0.6322; Pro)';
	//var ua = 'Java/1.8.0_60';
	//var ua = 'Java/1.8.0_60';
	// var ua = 'Apache-HttpClient/4.2.6 (java 1.5)';

	// var ua = 'Barca/2.8.4400';
	// var ua = 'Mozilla/4.0(compatible;MSIE 7.0;Windows NT 6.1;SV1;.NET CLR 1.0.3705;.NET CLR 3.0.30618)';
	var ua = 'Inky Mail iOS Client';


	//var ua = 'AdsBot-Google (+http://www.google.com/adsbot.html)';


	debug('Starting parse');
	uap.parse(ua, function(err, res){
		if ( err ) { throw err; }
		debug('Parsing done!');
		console.log(require('util').inspect(res, { depth: null, colors:true }));
		uap.close();
	});
}

var processItems = function(done){
	var db = mongojs('analytics', ['allhits3']);

	db.allhits3.count(function(err, totalUAS){
		if ( err ) { return done(err); }
		console.log('Getting ready to process '+totalUAS+' User-Agent strings');

		// find everything
		var cur = db.allhits3.find({});

		var otherCount = 0;
		var totalCount = 0;
		var counters = {};

		var undetectedUAS = [];

		process.on('SIGINT', () => {
			undetectedUAS = undetectedUAS.sort(function(a,b){ return b.count-a.count });
			console.log('\n');
			undetectedUAS.forEach(u=>{
				console.log((u.count+'').yellow+' - '+u.ua.green);
			});
			process.exit();
		});


		var tStart,
			tLapsed,
			totalTimeTook = 0,
			tMin = null,
			tMax = null,
			tAvg = null,
			processingLimitMS = 10,
			processingLimitMSDBLookup = 55;

		function dropCounters() {
			tMin = null;
			tMax = null;
			tAvg = null;
		}

		function recTime(t) {
			totalTimeTook += t;
			var r = false;
			//if ( tAvg !== null && (t > processingLimitMS || t > tAvg*2) ) { r = true; }
			if ( tAvg !== null && t > processingLimitMS ) { r = true; }

			if ( tMax === null || t > tMax ) { tMax = t; }

			if ( tMin === null || t < tMin ) { tMin = t; }

			tAvg = tMin+tMax / 2;
			//tAvg = totalCount/totalTimeTook;
			return r;
		}

		function doneDocs(err) {
			if ( err ) { throw err; }

			var pct = (otherCount/totalUAS*100).toFixed(2);
			console.log('\nFound %s% of undetected platform UAs from %s items batch', pct, totalUAS);
			console.log(require('util').inspect(counters, { depth: null, colors: true }));
		}

		function nextDoc(err) {
			if ( err ) { return doneDocs(err); }

			cur.next(function(err, doc){
				// console.log('X - '+doc._id);
				if ( err ) { return doneDocs(err); }

				if ( !doc ) { return doneDocs(null); }

				totalCount++;

				if ( !doc._id ) { return nextDoc(); }

				if ( totalCount % 1000 === 0 ) {
					console.log(format('Processed %s(%s%) UAs - processing time: min:%sms, max:%sms, avg:%sms. undetected: %s', totalCount, (totalCount/totalUAS*100).toFixed(2), tMin, tMax, tAvg, undetectedUAS.length));
					dropCounters();
				}

				tStart = Date.now();

				uap.parse(doc._id, function(err, res){
					if ( err ) { return doneDocs(err); }
					tLapsed = Date.now() - tStart;

					var dbSpecLookup = _.get(res, 'dbSpecLookup') || false;

					recTime(tLapsed);
					if ( argv.findslow ) {
						if (
							( tLapsed > processingLimitMS && !dbSpecLookup ) ||
							tLapsed > processingLimitMSDBLookup
						) {
							console.log(format('Warning! Slow UA detection. Took %sms. Avg: %sms. Used DB spec lookup: %s\nUA: %s', tLapsed, tAvg, dbSpecLookup, doc._id));
						}
					}

					var app = (_.get(res, 'detected.client.name') || 'Other');

					if ( typeof counters[app] === 'undefined' ) {
						counters[app] = 1;
					} else {
						counters[app]++;
					}

					if ( argv.ie ) {
						var toolbarVendors = [
							'BMID', // ???
							'CSVT',
							'Core',
							'Mozilla' // another Mozilla token appears after the broken UA fixture
						];

						var vendors = utils.without((_.get(res, 'pua.vendors') || []).map(v=>v.name), toolbarVendors).join(',');
						if ( app === 'Internet Explorer' && vendors ) {
							console.log(app+' '+doc.value.count+'\t-\t'+doc._id+'\n>>>'+vendors);
						}
					}

					if ( argv.other && app === 'Other' ) {
						undetectedUAS.push({ count: doc.value.count, ua: doc._id });
						//console.log(app+' '+doc.value.count+'\t-\t'+doc._id);
						otherCount++;
					}
					nextDoc();
				});

			})
		}

		nextDoc();

	});
};


if ( argv.parse ) {
	parse();
} else {
	processItems();
}
