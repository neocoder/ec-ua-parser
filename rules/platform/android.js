var async = require('async');
var _ = require('lodash');
var debug = require('debug')('ua-parser:os');

var VENDORS = require('../../vendors.json');

VENDORS = VENDORS.sort(function(a, b){
	return b.length - a.length;
});

var RegExpQuote = function(str) {
	return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
};

// Android
function findSpecByDeviceName(params, next) {
	if ( params.spec ) { return next(null, params); }
	debug('findSpecByDeviceName');
	var q = {
		vendor: new RegExp(params.vendor, 'i'),
		$text: {
			$search: '"'+params.deviceName+'"'
		}
	};

	var Spec = params.conn.model('Spec');

	Spec.findOne(q, function(err, doc){
		if ( err ) { return next(err); }
		debug('findSpecByDeviceName done!');
		params.spec = doc && doc.spec || null;
		next(null, params);
	});
}

function findSpecByAltDeviceNameNoRx4Names(params, next) {
	if ( params.spec ) { return next(null, params); }
	debug('findSpecByAltDeviceNameNoRx4Names');
	var altQ = {
		vendor: new RegExp('^'+RegExpQuote(params.vendor), 'i'),
		names: params.altDeviceName
	};

	var Spec = params.conn.model('Spec');

	Spec.findOne(altQ, function(err, doc){
		if ( err ) { return next(err); }
		debug('findSpecByAltDeviceNameNoRx4Names done!');
		params.spec = doc && doc.spec || null;
		next(null, params);
	});
}

function findSpecByAltDeviceName(params, next) {
	if ( params.spec ) { return next(null, params); }
	debug('findSpecByAltDeviceName');

	var altQ = {
		vendor: new RegExp(RegExpQuote(params.vendor), 'i'),
		names: new RegExp(RegExpQuote(params.altDeviceName), 'i')
	};

	var Spec = params.conn.model('Spec');

	Spec.findOne(altQ, function(err, doc){
		if ( err ) { return next(err); }
		debug('findSpecByAltDeviceName done!');
		params.spec = doc && doc.spec || null;
		next(null, params);
	});
}

var findSpec = async.seq(
	findSpecByAltDeviceNameNoRx4Names,
	findSpecByAltDeviceName,
	findSpecByDeviceName,
	function(params, next) {
		next(null, params.spec ? params.spec : null)
	}
);

module.exports = function(res, next) {
	var coms = _.get(res, 'pua.application.comments');
	if ( !coms ) { return next(null, res); }

	var androidVersion = coms.slice(0, 3).reduce(function(ver, com){
		if ( ver ) { return ver; }
		var m;
		if ( ( m = com.match(/^Android\s+([\d\.]+)/) ) ) {
			return m[1];
		}
		return ver;
	}, null);

	if ( !androidVersion ) { return next(null, res); }

	var deviceName = coms.reduce(function(devName, com){
		if ( devName ) { return devName; }
		var rx = /\s+(Build|Release)\/\S+/i;

		return com.match(rx) ? com.replace(rx, '').trim() : devName;
	}, '');


	deviceName = deviceName.replace(/\/\S+$/, '').replace(/_/g, ' ');

	var vendor;

	VENDORS.some(v=>{
		// we don't go for names like "DL"
		if ( v.length < 3 ) { return true; }

		var idx = deviceName.toLowerCase().indexOf(v);
		var nextChar = deviceName[idx+v.length];
		if ( idx !== -1 ) {
			vendor = v;
			if ( nextChar !== ' ' && nextChar !== '-' ) {
				deviceName = deviceName.substr(0, idx+v.length) + ' '+ deviceName.substr(idx+v.length);
			}
			return true;
		}
	});

	if ( deviceName.indexOf(' ') !== -1 ) {
		deviceName = _.without(deviceName.split(' '), 'dual', 'sim', 'CMCC', 'TD').join(' ');
	}

	var altDeviceName = deviceName.replace(new RegExp(vendor, 'i'), '').trim();

	// var platformsMap = {
	// 	'iPhone': 'mobile',
	// 	'iPod': 'mobile',
	// 	'iPad': 'tablet'
	// }
	//

	findSpec({
		conn: res.conn,
		vendor,
		deviceName,
		altDeviceName
	}, function(err, doc){

		_.set(res, 'dbSpecLookup', true);

		_.set(res, 'detected.device.name', deviceName);

		if ( androidVersion ) {
			_.set(res, 'detected.os', {
				name: 'Android',
				version: androidVersion
			});
		}

		_.set(res, 'detected.device.platform', _.get(doc, 'design.deviceType') || 'other');

		next(null, res);
	});

}
