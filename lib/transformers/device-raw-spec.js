var async = require('async');
var _ = require('lodash');

function _formatKVMapString(str) {
	return str.split(';').reduce(function(res, mat){
		var m = mat.split(':');
		res[_.camelCase(m[0])] = _.trim(m[1]);
		return res;
	}, {});
}

function _formatMainVersionFeaturesList(str, mainVersionLabel) {
	mainVersionLabel = mainVersionLabel || 'version';
	return str.split('\n').reduce(function(bt, feature, i){
		var key, val;
		if ( i === 0 ) {
			key = mainVersionLabel;
			val = feature;
		} else {
			var pf = feature.split(':');
			key = _.camelCase(pf[0].replace('/ ', '/'));
			val = pf[1].trim();
			if ( val.match(/yes|no/i) ) {
				val = val === 'yes';
			} else {
				val = val.split(/\s*,\s*/);
			}

		}
		bt[key] = val;
		return bt;
	}, {});
}

function _formatTime(str) {
	var m = str.match(/^(\d+)\./);
	if ( m ) {
		return parseInt(m[1], 10)
	}
	return str;
}

function formatDesigSection(spec, next) {

/*
	"device_type": "smart phone",
	"os": "Android (5.0, 4.4.4), Samsung TouchWiz UI",
	"form_factor": "Candybar",
	"dimensions": "5.57 x 2.76 x 0.29 inches  (141.6 x 70.2 x 7.3 mm)",
	"weight": "4.94 oz  (140 g)the average is 5.3 oz (151 g)",
	"materials": "Main body: plastic; Accents: metal",
	"keys": "Left: Volume control; Right: Lock/Unlock key",
	"colors": "Black, Brown, White"
*/

	var s = spec.design;
	if ( !s ) { return next(null, spec); }

	if ( s.deviceType ) {
		s.deviceType = s.deviceType.toLowerCase();
		s.deviceType = ( s.deviceType === 'smart phone' )
			? 'mobile'
			: s.deviceType;
	}

	if ( s.deviceType ) {
		s.deviceType = s.deviceType.toLowerCase();
		s.deviceType = ( s.deviceType === 'Candybar' )
			? 'bar'
			: s.deviceType;
	}

	if ( s.formFactor ) s.formFactor = s.formFactor.toLowerCase();

	if ( s.dimensions ) {
		s.dimensions = s.dimensions.split('inches').reduce(function(dim, val, i){
			if ( i === 0 ) {
				dim.inches = val.split(/\s*x\s*/).map(s => s.trim());
			} else if ( i === 1 ) {
				dim.mm = val.replace(/[^\d\.x]+/g, '').split('x');
			}
			return dim;
		}, {});
	}

	if ( s.weight ) {
		s.weight = s.weight.split('the average')[0].split(/\s+\(/).map(r => r.replace(')', ''));
	}

	if ( s.materials ) s.materials = _formatKVMapString(s.materials);
	if ( s.keys ) s.keys = _formatKVMapString(s.keys);
	if ( s.colors ) s.colors = s.colors.split(/\s*,\s*/);

	next(null, spec);
}

function formateDisplaySection(spec, next) {
	// "display": {
	// 	"physical_size": "5.0 inches",
	// 	"resolution": "720 x  1280 pixels",
	// 	"pixel_density": "294 ppi",
	// 	"technology": "Super AMOLED",
	// 	"screen_to_body_ratio": "69.49 %",
	// 	"colors": "16 777 216",
	// 	"touchscreen": "Capacitive, Multi-touch",
	// 	"features": "Light sensor, Proximity sensor, Scratch-resistant glass (Corning Gorilla Glass 4)"
	// },
	var s = spec.display;
	if ( !s ) { return next(null, spec); }

	if ( s.touchscreen ) s.touchscreen = s.touchscreen.split(/\s*,\s*/);
	if ( s.features ) s.features = s.features.split(/\s*,\s*/);

	next(null, spec);
}

function formatCameraSection(spec, next) {
	// "camera": {
	// 	"camera": "8 megapixels\nFlash:LED\nHardware Features:Autofocus, CMOS image sensor\nSoftware Features:Face detection, Smile detection, Digital zoom, Voice activation, Self-timer, Touch to focus, Geo tagging\nSettings:Exposure compensation, ISO control, White balance presets\nShooting Modes:Burst mode, High Dynamic Range mode (HDR), Panorama, Night mode, Effects",
	// 	"camcorder": "1920x1080 (1080p HD) (30 fps)\nFeatures:Video calling, Video sharing",
	// 	"front_facing_camera": "5 megapixels"
	// },
	var s = spec.camera;
	if ( !s ) { return next(null, spec); }

	if ( s.camera ) {
		s.camera = s.camera.split('\n').reduce(function(cam, feature, i){
			if ( i === 0 ){
				cam.resolution = feature;
			} else {
				var pf = feature.split(':');

				cam[_.camelCase(pf[0].trim())] = pf[1].trim();
			}

			return cam;
		}, {});
	}

	if ( s.camcorder ) s.camcorder = _formatMainVersionFeaturesList(s.camcorder, 'resolution');

	next(null, spec);
}

function formatHardwareSection(spec, next){
	// "hardware": {
	// 	"system_chip": "Qualcomm Snapdragon 410\nModel:8916",
	// 	"processor": "Quad-core, 1200 MHz, ARM Cortex-A53",
	// 	"graphics_processor": "Adreno 306",
	// 	"system_memory": "1536 MB RAM (533 MHz)",
	// 	"built_in_storage": "16 GB",
	// 	"storage_expansion": "microSD, microSDHC, microSDXC up to 64 GB"
	// },

	var s = spec.hardware;
	if ( !s ) { return next(null, spec); }

	if ( s.systemChip ) {
		s.systemChip = s.systemChip.split('\n').reduce(function(c, feature, i){
			if ( i === 0 ) {
				c.name = feature;
			} else {
				var pf = feature.split(':');
				c[_.camelCase(pf[0])] = pf[1];
			}
			return c;
		}, {});
	}

	next(null, spec);
}

function formatBatterySection(spec, next) {
	// "battery": {
	// 	"capacity": "2400 mAh",
	// 	"talk_time_3g": "16.00 hoursthe average is 16 h (978 min)",
	// 	"music_playback": "71.00 hours",
	// 	"videoPlayback": "12.00 hours"
	// },

	var s = spec.battery;
	if ( !s ) { return next(null, spec); }

	if ( s.talkTime3G ) s.talkTime3G = _formatTime(s.talkTime3G.split('the average')[0]);
	if ( s.musicPlayback ) s.musicPlayback = _formatTime(s.musicPlayback);
	if ( s.videoPlayback ) s.videoPlayback = _formatTime(s.videoPlayback);

	next(null, spec);
}

function formatMultimediaSection(spec, next) {
	// "multimedia": {
	// 	"music_player": "Filter by:Album, Artist, Playlists\nFeatures:Album art cover, Background playback\nSupported formats:MP3",
	// 	"video_playback": "Supported formats:MPEG4, H.263, H.264",
	// 	"speakers": "Earpiece, Loudspeaker",
	// 	"headphones_connector": "3.5mm"
	// },
	var s = spec.multimedia;
	if ( !s ) { return next(null, spec); }

	if ( s.musicPlayer ) s.musicPlayer = _formatKVMapString(s.musicPlayer);
	if ( s.videoPlayback ) s.videoPlayback = _formatKVMapString(s.videoPlayback);
	if ( s.speakers ) s.speakers = s.speakers.split(/\s*,\s*/);

	next(null, spec);
}

function formatBrowsingSection(spec, next) {
	// "browsing": {
	// 	"browser": "supports:HTML, HTML5",
	// 	"built_in_online_services_support": "YouTube (upload), Picasa/Google+"
	// },
	var s = spec.browsing;
	if ( !s ) { return next(null, spec); }

	if ( s.browser ) s.browser = _formatKVMapString(s.browser);
	if ( s.builtInOnlineServicesSupport ) s.builtInOnlineServicesSupport = s.builtInOnlineServicesSupport.split(/\s*,\s*/);

	next(null, spec);
}

function formatCellularSection(spec, next) {
	// "cellular": {
	// 	"gsm": "850, 900, 1800, 1900 MHz",
	// 	"umts": "850, 900, 1900, 2100 MHz",
	// 	"data": "HSDPA+ (4G) 42.2 Mbit/s, HSUPA 5.76 Mbit/s",
	// 	"2g_data": "EDGE, GPRS",
	// 	"nano_sim": "Yes",
	// 	"global_roaming": "Yes"
	// },

	console.log(spec);

	var s = spec.cellular;
	if ( !s ) { return next(null, spec); }

	if ( s.nanoSim ) s.nanoSim = s.nanoSim.toLowerCase().trim() === 'yes';
	if ( s.globalRoaming ) s.globalRoaming = s.globalRoaming.toLowerCase().trim() === 'yes';

	next(null, spec);
}

function formatConnectivitySection(spec, next) {
	// "connectivity": {
	// 	"bluetooth": "4.0\nProfiles/ Protocols:Advanced Audio Distribution (A2DP), Attribute Protocol, Audio/Video Control Transport Protocol (AVCTP), Audio/Video Distribution Transport Protocol (AVDTP), Audio/Visual Remote Control Profile (AVRCP), Bluetooth Network Encapsulation Protocol (BNEP), Device ID Profile (DID), Generic Access (GAP), Generic Attribute Profile (GATT), Generic Audio/Video Distribution (GAVDP), Handsfree (HFP), Headset (HSP), HID over GATT Profile, Human Interface Device (HID), Logical Link Control and Adaptation Protocol, Message Access Profile (MAP), Multi-Channel Adaptation Protocol, Object Push (OPP), Personal Area Networking Profile (PAN), Phone Book Access (PBAP), Scan Parameters Profile, Security Manager Protocol, Serial Port (SPP), Service Discovery Protocol (SDP), SIM Access (SAP)",
	// 	"wi_fi": "802.11 b, g, n\nWi-Fi Direct:Yes",
	// 	"usb": "USB 2.0\nConnector:microUSB\nFeatures:Mass storage device, USB charging",
	// 	"charging_connector": "microUSB",
	// 	"positioning": "GPS, A-GPS, Glonass",
	// 	"navigation": "Yes",
	// 	"other": "Tethering, Computer sync, OTA sync"
	// },

	var s = spec.connectivity;
	if ( !s ) { return next(null, spec); }

	if ( s.bluetooth ) s.bluetooth = _formatMainVersionFeaturesList(s.bluetooth);
	if ( s.usb ) s.usb = _formatMainVersionFeaturesList(s.usb);
	if ( s.positioning ) s.positioning.split(/\s*,\s*/);
	if ( s.navigation ) s.navigation = s.navigation.toLowerCase().trim() === 'yes';
	if ( s.other ) s.other.split(/\s*,\s*/);
	if ( s.wiFi ) s.wiFi = _formatMainVersionFeaturesList(s.wiFi, 'standards');

	next(null, spec);
}

module.exports = async.seq(
	formatDesigSection,
	formateDisplaySection,
	formatCameraSection,
	formatHardwareSection,
	formatBatterySection,
	formatMultimediaSection,
	formatBrowsingSection,
	formatCellularSection,
	formatConnectivitySection
);
