var async = require('async');
var _ = require('lodash');
var mongoose = require('mongoose');
var debug = require('debug')('ua-parser:os');

var VENDORS = require('../../vendors.json');

VENDORS = VENDORS.sort(function(a, b){
	return b.length - a.length;
});

var Spec = mongoose.model('Spec');

// Windows Phone
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

module.exports = function (res, next) {
	var coms = _.get(res, 'pua.application.comments');
	if ( !coms ) { return next(null, res); }

	var osVersion = coms.reduce(function(ver, com){
		if ( ver ) { return ver; }
		var m;
		if ( ( m = com.match(/^Windows Phone\s*(?:OS|)\s*([\d\.]+)/i) ) ) {
			return m[1];
		}
		return ver;
	}, null);

	if ( !osVersion ) { return next(null, res); }

	var filteredComs = coms.filter(function(com){
		return !com.match(/^(compatible|MSIE|Windows Phone|Trident|IEMobile|NOKIA|ARM|rv:|Touch)/)
	});

	var deviceName = filteredComs[0];

	_.set(res, 'detected.device.os.name', 'Windows Phone');
	_.set(res, 'detected.device.os.version', osVersion);
	_.set(res, 'detected.device.platform', 'mobile');

	if ( !deviceName ) { return next(null, res); }

	var vendor;

	VENDORS.some(v=>{
		// we don't go for names like "DL" or "umi"
		if ( v.length < 4 ) { return true; }

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

		_.set(res, 'detected.device.platform', _.get(doc, 'design.deviceType') || 'other');

		next(null, res);
	});
	//*/
}
