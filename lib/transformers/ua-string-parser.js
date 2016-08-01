var async = require('async');
var _ = require('lodash');

function parseToken(token) {
	var res = {},
		sp = token.split('/'),
		parsedVersion = sp[1] ? sp[1].split('.') : [],
		versionsMapping = ['major', 'minor', 'bugfix', 'build'];

	res.name = sp[0];
	res.version = {
		full: sp[1]
	};

	var restOfVersion = [];
	parsedVersion.forEach(function(v, i){
		if ( versionsMapping[i] ) {
			var n = parseInt(v, 10);
			res.version[versionsMapping[i]] = isNaN(n) ? v : n;
		} else {
			restOfVersion.push(v);
		}
	});

	if ( restOfVersion.length ) {
		res.version.ver = restOfVersion.join('.');
	}

	return res;
}


function splitIntoTokens(params, next){
	var uaString = params.uaString;
	var m, t, tokens = [],
		rx = /([^\/]+\/\S+)(?:\s+\(([^\(]*?)\)|)/g; // v1
		// rx = /([^\/\s\(\)]+(?:\/|\s)[^\s\(\)]+)(?:\s\(([^\(]*?)\)|)/g; // v2
		//rx = /([^\/\(\)]+(?:\/|\s)[^\s\(\)]+)(?:\s\(([^\(]*?)\)|)/g; // v3
		//rx = /((?:\w+\s?)+\/[^\s\(\)\/]+|\w+\s[\d\.]+|(?:\w+\s)+)(?:\s\(([^\(]*?)\)|)/g; // v4

	while ( ( m = rx.exec(uaString) ) ) {
		t = { token: m[1].trim() };
		if ( m[2] ) {
			t.comments = m[2].trim().split(/\s*;\s*/);
		}
		tokens.push(_.extend(t, parseToken(t.token)));
	}

	if ( !tokens.length ) {
		tokens.push({ token: uaString });
	}
	params.tokens = tokens;
	next(null, params);
}


function parseIntoPUAObject(params, next) {
	var tokens = params.tokens
	var pua = {};
	pua.application = tokens.shift();
	pua.application = _.extend(pua.application, parseToken(pua.application.token));
	if ( tokens.length ) {
		pua.vendors = tokens;
	}
	params.pua = pua;
	next(null, params);
}


module.exports = async.seq(
	splitIntoTokens,
	parseIntoPUAObject
);
