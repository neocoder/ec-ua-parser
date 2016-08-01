var async = require('async');
var _ = require('lodash');
var mongoose = require('mongoose');
var debug = require('debug')('ua-parser:os');

var VENDORS = require('../../vendors.json');

VENDORS = VENDORS.sort(function(a, b){
	return b.length - a.length;
});

var Spec = mongoose.model('Spec');


function sanitizeDeviceName(deviceName) {
	var arr = [];
	// NokiaE90-1/400.34.93
	arr = deviceName.split('/');
	if ( deviceName.length > 1 ) {
		deviceName = arr[0]
	}
	// NokiaE90-1

	deviceName = deviceName.split('-').sort((a,b)=>b.length-a.length)[0];

	// NokiaE90

	return deviceName;
}

function findSpecByDeviceName(params, next) {
	if ( params.spec ) { return next(null, params); }

	var q = {
		vendor: new RegExp(params.vendor, 'i'),
		$text: {
			$search: '"'+params.deviceName+'"'
		}
	};



	Spec.findOne(q, function(err, doc){
		if ( err ) { return next(err); }
		params.spec = doc && doc.spec || null;
		next(null, params);
	});
}

function findSpecByAltDeviceName(params, next) {
	if ( params.spec ) { return next(null, params); }

	var altQ = {
		vendor: new RegExp(params.vendor, 'i'),
		names: new RegExp(params.altDeviceName, 'i')
	};



	Spec.findOne(altQ, function(err, doc){
		if ( err ) { return next(err); }
		params.spec = doc && doc.spec || null;
		next(null, params);
	});
}

var findSpec = async.seq(
	findSpecByDeviceName,
	findSpecByAltDeviceName,
	function(params, next) {
		next(null, params.spec ? params.spec : null)
	}
);

module.exports = function(res, next) {
	var coms = _.get(res, 'pua.application.comments');
	if ( !coms ) { return next(null, res); }

	var symbianVersion = coms.reduce(function(ver, com){
		if ( ver ) { return ver; }
		var m;
		if ( ( m = com.match(/^Symbian(?:OS|)\/([\d\.]+)+/i) ) ) {
			return m[1];
		}
		return ver;
	}, null);

	if ( !symbianVersion ) { return next(null, res); }

	//*
	var deviceName = coms.reduce(function(devName, com){
		if ( devName ) { return devName; }
		var m, parts, d;
		if ( ( m = com.match(/^Series\d+/) ) ) {
			// Series60/3.1 NokiaE90-1/400.34.93 Profile/MIDP-2.0 Configuration/CLDC-1.1
			// to
			// NokiaE90-1
			d = com.split(/\s+/)[1];
			if ( !d ) { return devName; }
			return sanitizeDeviceName( d );
		}

		return devName;
	}, '');

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
		vendor,
		deviceName,
		altDeviceName
	}, function(err, doc){
		_.set(res, 'dbSpecLookup', true);

		_.set(res, 'detected.device.name', deviceName);

		_.set(res, 'detected.os', {
			name: 'Symbian',
			version: symbianVersion
		});
		_.set(res, 'detected.device.platform', _.get(doc, 'design.deviceType') || 'other');

		next(null, res);
	});
	//*/
};
