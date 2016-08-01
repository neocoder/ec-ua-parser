/*global _*/

// Retrievers
// functions which retrive addition data like app versions and device name
// from parsed ua after the rule match

function rGetClient(pua) {
	return {
		name: 'Chrome',
		ver: 'Chrome 43'
	};
}

function rGetDevice(pua) {

}

/*
{
	"application": {
		"token": "Mozilla/4.0",
		"comments": [
			"compatible",
			"MSIE 6.0",
			"Windows NT 5.1",
			"SV1"
		],
		"name": "Mozilla",
		"version": {
			"major": 4,
			"minor": 0
		}
	},
	"vendors": [
		{
			"token": "Mozilla/4.0",
			"comments": [
				"compatible",
				"MSIE 6.0",
				"Windows NT 5.0",
				"FunWebProducts",
				"Orange 7.4",
				"NaviWoo1.1",
				"",
				"Embedded Web Browser from: http://bsalsa.com/"
			],
			"name": "Mozilla",
			"version": {
				"major": 4,
				"minor": 0
			}
		}
	]
}
*/

// Main rules
var rules = [
	{
		rule: {
			appcom: [
				'MSIE',
				'compatible'
			]
		},
		result: {
			platform: 'desktop', // mobile, desktop, tablet,
			client: {
				name: 'Chrome',
				ver: 'Chrome 43'
			},
			device: {
				name: 'iPhone', // iPad, Windows, Mac, Android, Other, Linux, ChromeOS, iPod, BlackBerry
				ver: 'iPhone 6'
			}
		}
	},
	'Internet Explorer - appcom:compatible, appcom:MSIE',
	'Opera - app:Opera',
	'Firefox - vendor:Firefox',
	'Google Chrome - vendor:chrome',
	'Safari - vendor:Safari',
	'Safari - vendor:AppleWebKit, app:Mozilla',
	'Safari - vendor:AppleWebKit, app:Mozilla',
	'Konqueror - app:Mozilla, appcom:compatible, appcom:Konqueror',

	'iOS/IPhone - app:Mozilla, appcom:iphone, vendor:AppleWebKit',
	'iOS/IPad - app:Mozilla, appcom:iphone, vendor:AppleWebKit',
	'iOS/IPod Touch - app:Mozilla, appcom:iphone, vendor:AppleWebKit',
	'Android Mobile Browser (Webkit) - app:Mozilla, appcom:Android, vendor:AppleWebKit',
	'Roundcube webmail/in {browser} - ref:roundcube',
	'Zimbra Mail/in {browser} - ref:zimbra',
	'Apple Mail - app:Mozilla, appcom:"mac os x", vendor:AppleWebKit, vendor:!safari, ref:false', //vendor:!chrome,
	'Postbox - app:Mozilla, vendor:posbox, ref:false',
	'Opera Mobile - app:Opera, appcom:"Opera Mobi"',
	'Opera Mobile - vendorcom:"Opera Mobi"',
	'Windows Mobile - app:mozilla, appcom:MSIE, appcom:"Windows Phone"',
	'Windows Mobile - vendor:mozilla, vendorcom:MSIE, vendorcom:"Windows Phone"',
	'HTC/Opera Mobile - app:HTC, vendor:Opera',
	'WebKit based mobile browser/SymbianOS - vendorcom:"SymbianOS", vendor:AppleWebKit',
	'BlackBerry/Blackberry Browser 4.6 on BlackBerry 8900 - app:BlackBerry8900/4.6',
	'BlackBerry - app:BlackBerry',
	'Eudora/Mac - app:Eudora, appcom:MacOS',
	'Eudora/Win - app:Eudora, appcom:Win',
	'Microsoft Outlook/Windows Live Mail - app:Outlook-Express/7.0',
	'Microsoft Outlook/Outlook-Express - app:Outlook-Express',
	'Microsoft Outlook/Outlook 2007 - app:Mozilla, appcom:"MSOffice 12"',
	'Microsoft Outlook/Outlook 2010 - app:Mozilla, appcom:"MSOffice 14"',
	'Microsoft Outlook/Outlook 2003 - app:Mozilla, appcom:compatible, appcom:MSIE, ref:false',
	'Mozilla Thunderbird - app:Mozilla, vendor:Thunderbird',
	'Lotus Notes/Lotus Notes 6.0 - app:Mozilla, appcom:!compatible, appcom:"Lotus-Notes/6.0"',
	'Lotus Notes/Lotus Notes 5.0 - app:Mozilla, appcom:compatible, appcom:"Lotus-Notes/5.0"',
	'Netscape/Netscape 7.2 - app:Mozilla, vendor:Gecko, vendor:"Netscape/7.2"',
	'Kopernikus T-Online eMail - app:"Kopernikus T-Online eMail"',
	'Opera Mobile - app:HTC_Touch_pro, vendor:Opera',
	// ------------------    all webmail should be after stand alone email clients
	'AOL webmail/in {browser} - email:"@aol.com"',
	'AOL webmail/in {browser} - email:"@mail.com"',
	'AOL webmail/in {browser} - email:"@cs.com"',
	'AOL webmail/in {browser} - email:"@compuserve.com"',
	'AOL webmail/in {browser} - email:"@unforgettable.com"',
	'AOL webmail/in {browser} - email:"@aim.com"',
	'Yahoo mail/in {browser} - email:"@yahoo."',
	'Yahoo mail/in {browser} - email:"@btinternet."',
	'Yahoo mail/in {browser} - email:"@btconnect."',
	'Yahoo mail/in {browser} - email:"@btopenworld."',
	'Yahoo mail/in {browser} - email:"@talk21."',
	'Yahoo mail/in {browser} - email:"@ruianjiulong.com"',
	'Hotmail/in {browser} - email:"@hotmail."',
	'Hotmail/in {browser} - email:"@live.com"',
	'Hotmail/in {browser} - email:"@msn."',

	'GMail/in {browser} - email:"@gmail."',
	'GMail/in {browser} - email:"@googlemail."',

	'GMail/in {browser} - ref:mail.google.com',

	// virgin media is usgin GMail since 2009,
	'GMail/in {browser} - email:"@virginmedia.com"',
	'GMail/in {browser} - email:"@blueyonder.co.uk"',
	'GMail/in {browser} - email:"@ntlworld.com"',
	'GMail/in {browser} - email:"@virgin.net"',
	// Google Apps users
	'GMail/in {browser} - email:"@sky.com"',
	'GMail/in {browser} - email:"@xquisitec.com"',
	'GMail/in {browser} - email:"@tridentglobal.com"',
	'GMail/in {browser} - email:"@kmistry.com"',
	'GMail/in {browser} - email:"@friedrichagency.com"',
	'GMail/in {browser} - email:"@intricity.com"',
	'GMail/in {browser} - email:"@scallywagtravel.com"',
	'GMail/in {browser} - email:"@mwt.in2i.net"',
	'GMail/in {browser} - email:"@hittraining.co.uk"',
	'GMail/in {browser} - email:"@sukhwani.com"',
	'GMail/in {browser} - email:"@worldofbachman.com"',
	'GMail/in {browser} - email:"@aerostrategy.com"',
	'GMail/in {browser} - email:"@cwt-ny.com"',
	'GMail/in {browser} - email:"@spasnstuff.com"',
	'GMail/in {browser} - email:"@sky138.com"',
	'GMail/in {browser} - email:"@micstock.com"',
	'GMail/in {browser} - email:"@somallc.com"',
	// -------------- QQ.com mail
	'QQ webmail/in {browser} - email:"@qq.com"',
	'QQ webmail/in {browser} - email:"@foxmail.com"',
	'QQ webmail/in {browser} - email:"@vip.qq.com"',
	// ----------------------------------------------------
	'Web-based Email client/in {browser} - app:/Mozilla|Opera|Safari/'
];

function transformValue(value) {
	var mParam, rxParams;

	if (value[0] == '/') {

		rxParams = value.split('/');
		return function(str){
			var rx = new RegExp(this[1],this[2] || '');
			var r = rx.test(str);

			return r;
		}.bind(rxParams);

	} else if (value[0] == '!') {

		mParam = value.substr(1);

		return function(str) {
			return str != this;
		}.bind(mParam);

	} else if (value === 'true') {

		return function(str) {
			if (str) {
				return true;
			} else {
				return false;
			}
		};

	} else if (value === 'false') {
		return function(str) {
			if (!str) {
				return true;
			} else {
				return false;
			}
		};
	} else {
		return value;
	}
}

function parseMatch(match) {
	var rxStr = '(\\w+)(?:\\:([^"\'].*?(?=,|$)|(?:[^\\\\]{0,1})(\'|")((?:\\\\\'|\\\\"|.)+?)\\3)|)';

	var rx = new RegExp(rxStr,'g');
	var matchObj = {}, res, key, val;

	while ( (res = rx.exec(match)) ) {
		key = res[1];
		val = res[4] || res[2] || true;

		// this function transforms values like "!compatible" or "ref:false" into matcher functions

		if ( _.isString(val) ) {
			val = transformValue(val);
		} else if (_.isArray(val)) {
			val = val.map(transformValue);
		}

		if ( matchObj[key] ) {
			if ( _.isArray(matchObj[key]) ) {
				//console.log('array: '+sys.inpect(matchObj[key]));
				matchObj[key].push(val);
			} else {
				matchObj[key] = [matchObj[key]];
				matchObj[key].push(val);
			}

		} else {
			matchObj[key] = val;
		}
	}

	return matchObj;
}


function buildRulesTable(rulesArray) {
	var table = [];
	rulesArray.forEach(function(ruleString){
		var rx = new RegExp('([^/]+?)(?:/([^/]+?)|)\\s-\\s(.*)');
		var res = rx.exec(ruleString);
		if (res) {
			table.push({
				maj: res[1],
				min: res[2] || '',
				rule: parseMatch(res[3])
			});
		}
	});
	return table;
}
