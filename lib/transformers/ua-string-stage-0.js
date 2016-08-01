var async = require('async');
var debug = require('debug')('ua-string-stage-0');
var format = require('util').format;
var _ = require('lodash');
// /([^\/]+\/\S+)(?:\s+\(([^\(]*?)\)|)/g

// 1.1
function decodeURLEncodingIfNeeded(uaString, next) {
	var s = uaString;
	debug('decodeURLEncodingIfNeeded');

	if ( uaString.match(/\%[a-zA-Z0-9]{2}/ig) ) {
		try {
			s = decodeURIComponent(uaString);
		} catch(err) {
			s = uaString;
		}

	}
	debug(s);
	next(null, s);
}

// 1.2
function extractOriginalUAString(uaString, next) {
	var s = uaString;
	debug('extractOriginalUAString');

	var parts = [];
	var rx = /User\-agent\:(.*?)\s;\s/i;
	s = s.replace(rx, function(fullMatch, p1){
		parts.push(p1);
		return '';
	});

	if ( parts.length ) {
		s = s + parts.join(' ');
	}

	debug(s);
	next(null, s);
}

// 1.3

function fixTopLevelTokenDelimieter(uaString, next) {
	var s = uaString;
	debug('fixTopLevelTokenDelimieter');

	var sl = s.length,
		lvl = 0,
		output = [];

	for (var i = 0; i < sl; i++) {
		if ( s[i] === '(' ) {
			lvl++;
		} else if ( s[i] === ')' ) {
			lvl--;
		}

		if ( s[i] === ';' && lvl === 0 ) {
			output.push(' ');
		} else {
			output.push(s[i]);
		}
	}
	s = output.join('');

	debug(s);
	next(null, s);
}

// 1.4
function mergeIncorrectTokenCommentFormatting(uaString, next) {
	var s = uaString;
	debug('mergeIncorrectTokenCommentFormatting');

	//(x86_64) (MacBookAir4,2) -> (x86_64; MacBookAir4,2)
	var rx = /(\([^\(\)]+\)\s?){2,}/g;
	s = uaString.replace(rx, function(fullRxMatch){
		return fullRxMatch.replace(/\)\s*?\(/, '; ');
	});

	debug(s);
	next(null, s);
}

// 1.5
function extactTokensFromCommentToTheTopLevel(uaString, next) {
	var s = uaString;
	debug('extactTokensFromCommentToTheTopLevel');

	// Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; FunWebProducts; Orange 7.4 ; NaviWoo1.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ;  Embedded Web Browser from: http://bsalsa.com/)
	// Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; FunWebProducts; Orange 7.4 ; NaviWoo1.1; Embedded Web Browser from: http://bsalsa.com/) Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ;
	var rx = /;\s+(\S+\s+\([^\(\)]+\))\s+/g,
		parts = [],
		transformed;
	if ( uaString.match(rx) ) {
		transformed = uaString.replace(rx, function(fullMatch, p1){
			parts.push(p1);
			return '';
		})+' '+parts.join(' ');
		s = transformed;
	}

	debug(s);
	next(null, s);
}

function transformSlashDivideUA(uaString, next) {
	var s = uaString;
	debug('transformSlashDivideUA');

	// TODO: check regexps agains
	// Mozilla/5.0 (Linux; Android 4.0.4; Celkon A98 Release/01.30.2013) Linux/3.0.13  Browser/AppleWebKit534.30 Profile/MIDP-2.0 Configuration/CLDC-1.1 Mobile Safari/534.30 Android 4.0.1;

	if ( uaString.match(/^BBIdentity/) && uaString.match(/^([^\(\)]+?\/)+[^\/\(\)]+$/) ) {
		var u = uaString.split('/');
		var conv = u[0]+'/'+u[1]+' ('+u.slice(2).join('; ')+')';
		s = conv;
	}

	debug(s);
	next(null, s);
}

function transformOLDAndroidUA(uaString, next) {
	var s = uaString,
		m,
		rx = /(.*?)\s+(Linux\/[\d\.]+)\s+Android\/([\d\.]+)\s+(Release\/\S+)/;

	debug('transformOLDAndroidUA');

	if ( ( m = rx.exec(uaString) ) ) {
		var restOfUA = uaString.substring(m[0].length);
		s = format('Mozilla/5.0 (Linux; Android %s; %s %s) %s %s', m[3], m[1], m[4], m[2], restOfUA);
	}
	// old 'Celkon A98 Linux/3.0.13 Android/4.0.4 Release/01.30.2013 Browser/AppleWebKit534.30 Profile/MIDP-2.0 Configuration/CLDC-1.1 Mobile Safari/534.30 Android 4.0.1',
	// new 'Mozilla/5.0 (Linux; Android 4.4.2; Q1010i Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36',
	debug(s);
	next(null, s);
}

function removeBracketsFromCommentsValues(uaString, next) {
	var s = uaString;
	debug('removeBracketsFromCommentsValues');

	var sl = s.length,
		chr,
		lvl = 0,
		curLvl = 0,
		output = [];

	for (var i = 0; i < sl; i++) {
		chr = s[i];

		if ( chr === '(' ) {
			lvl++;
			if ( lvl > 1 ) { chr = ''; }
		} else if ( chr === ')' ) {
			if ( lvl > 1 ) { chr = ''; }
			lvl--;
		}

		output.push(chr);
	}
	s = output.join('');

	debug(s);
	next(null, s);
}

// YFF35 -> YFF/35
// function transformVersionlessTokens(uaString, next) {
// 	var s = uaString;
// 	debug('transformVersionlessTokens');
//
// 	// TODO: this regex is way too heavy for stage 0 processing
// 	// need to think of something faster
//
// 	var rx = /((?:\w+\s?)+\/[^\s\(\)\/]+|\w+\s[\d\.]+|(?:\w+\s)+)(\s\((?:[^\(]*?)\)|)/g;
// 	s = s.replace(rx, function(fullMatch, p1, p2){
// 		p1 = p1.replace(/\b([a-zA-Z]+)(\d+)(\s|$)/, ' $1/$2 ');
// 		return p1+p2;
// 	});
//
// 	debug(s);
// 	next(null, s);
//
// }

function countChars(str, char) {
	for (var c = 0, i = 0; i < str.length; i++) {
		if ( str[i] === char ) { c++ }
	}
	return c;
}

function matchBrackets(uaString, next) {
	var s = uaString;
	debug('matchBrackets');

	var openCount = countChars(s, '(');
	var closeCount = countChars(s, ')');
	var missingClose = openCount - closeCount;

	if ( missingClose > 0 ) {
		s = s+ _.repeat(')', missingClose);
	}

	debug(s);
	next(null, s);
}

function fixBrokenTokens(uaString, next){
	var s = uaString;
	debug('fixBrokenTokens');

	var airmailRx = /Airmail\s+([\d\.]+)(\s*rv:\d+|)/;

	s = s.replace(airmailRx, function(fullMatch, p1, p2){
		return 'Airmail/'+p1;
	});

	var bigRx = /(Ant\.com\s+Toolbar\s+(?:[\d\.]+)|BTRS\d+|YFF\d+|sputnik\s+\d+|Dealio\s+Toolbar\s+(?:[\d\.]+)|like\s+Gecko|ClamAV\s*(?:[\d\.]+))/ig;

	s = s.replace(bigRx, function(fullMatch, p1){
		if ( p1 === 'like Gecko' ) { return ''; }
		if ( p1.match(/^Airmail/i) ) {
			p1.replace('rv')
		}
		return p1
			.replace(/\s+/g, '-')
			.replace(/([a-zA-Z]+)(\d+)/, ' $1/$2 ')
			.replace(/\-([\d\.]+)/,'\/$1');
	});

	debug(s);
	next(null, s);

}

var transform = async.seq(
	// function(ua, next) {
	// 	debug(ua);
	// 	debug('-------------------------------------------');
	// 	next(null, ua);
	// },
	decodeURLEncodingIfNeeded,
	matchBrackets,
	extractOriginalUAString,
	transformOLDAndroidUA,
	transformSlashDivideUA,
	fixTopLevelTokenDelimieter,
	mergeIncorrectTokenCommentFormatting,
	extactTokensFromCommentToTheTopLevel,
	removeBracketsFromCommentsValues,
	fixBrokenTokens
	//transformVersionlessTokens
	// function(ua, next) {
	// 	debug(ua);
	// 	debug('-------------------------------------------');
	// 	next(null, ua);
	// }
);

// function transform(uaString, next) {
//
// }

module.exports = transform;
