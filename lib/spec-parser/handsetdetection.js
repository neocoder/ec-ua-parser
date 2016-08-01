var jsdom = require('jsdom');
var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('lodash');
var debug = require('debug')('ua-parser:spec')
var format  = require('util').format;

var jquery = fs.readFileSync(path.resolve(__dirname,'../../node_modules/jquery/dist/jquery.js'), 'utf-8');

var formatSpec = require('../transformers/device-raw-spec');

var defaultJSDomConfig = {
	userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36',
	headers: {
		Origin: 'http://www.handsetdetection.com'
	}
}

var baseUrl = 'http://www.handsetdetection.com';

var sectionsParsers = {};

sectionsParsers.vendor = function (window, $, res) {
	return $('td[title="general_vendor"]+td>strong').text();
};

sectionsParsers.names = function (window, $, res) {
	return _.filter([
		$('td[title="general_model"]+td>strong').text(),
		$('td[title="general_aliases"]+td>strong').text()
	], x=>!!x);
};

sectionsParsers.design = function (window, $, res) {
	var os = $('td[title="general_platform"]+td>strong').text();
	var osVerMax = $('td[title="general_platform_version_max"]+td>strong').text();
	var osVerMin = $('td[title="general_platform_version"]+td>strong').text();

	var versions = [];
	if ( osVerMax ) { versions.push(osVerMax); }
	if ( osVerMin ) { versions.push(osVerMin); }

	var dimensions = $('td[title="design_dimensions"]+td>strong').text().split(' x ');

	var dimensionsInches = dimensions.map(x=>x*0.0393701).map(x=>x.toFixed(2));

	var whightG = $('td[title="design_weight"]+td>strong').text()
	var whightOz = (whightG*0.035274).toFixed(2);

	return {
		'deviceType': $('td[title="general_type"]+td>strong').text().toLowerCase(),
		'os': format('%s (%s)', os, versions.join(', ')),
		'formFactor': $('td[title="design_formfactor"]+td>strong').text().toLowerCase(),
		'dimensions': {
			'inches': dimensionsInches,
			'mm': dimensions
		},
		'weight': [whightOz+' oz', whightG+' g'],
		'materials': {},
		'keys': {},
		'colors': []
	};
};

sectionsParsers.display = function (window, $, res) {
	var os = $('td[title="general_platform"]+td>strong').text();

	var displayX = $('td[title="display_x"]+td>strong').text();
	var displayY = $('td[title="display_y"]+td>strong').text();

	return {
		physicalSize: $('td[title="display_size"]+td>strong').text().replace('"', 'inches'),
		resolution: format('%s x %s pixels', displayX, displayY),
		pixelDensity: format('%s ppi', $('td[title="display_ppi"]+td>strong').text()),
		technology: $('td[title="display_type"]+td>strong').text(),
		//screenToBodyRatio: '69.49 %',
		colors: $('td[title="display_colors"]+td>strong').text(),
		touchscreen: _.without($('td[title="display_other"]+td>strong').text().split(/\s*,\s*/), ['TouchWiz']),
		features: $('td[title="features"]+td>strong').text().split(/\s*,\s*/)
	};
};

function parseCamResolution(cam) {
	var m;

	if ( ( m = cam.match(/(\d+)MP/) ) ) {
		cam = m[1]+' megapixels';
	}
	return cam;
}

sectionsParsers.camera = function(window, $, res) {
	var camFeatures = $('td[title="media_other"]+td>strong').text().split(/\s*,\s*/);
	var parsedCamFeatures = [];
	var flash = camFeatures.reduce(function(r, feature){
		if ( r ) { return r; }
		if ( feature.match(/flash/i) ) {
			parsedCamFeatures.push(feature);
			return feature.replace(/flash/i, '').trim()
		}
	}, null);

	camFeatures = _.without.apply(_,[camFeatures].concat(parsedCamFeatures));//.join(', ');

	// Yes, 1080p @60fps, 720p@240fps
	//media_videocapture
	var videocapture = $('td[title="media_videocapture"]+td>strong').text();

	return {
		camera: {
			resolution: parseCamResolution($('td[title="media_camera"]+td>strong').text()),
			flash: flash,
			features: camFeatures
		},
		camcorder: {
			resolution: videocapture
		},
		frontFacingCamera: parseCamResolution($('td[title="media_secondcamera"]+td>strong').text())
	}
}

sectionsParsers.hardware = function(window, $, res) {
	var soc = $('td[title="general_cpu"]+td>strong').text().split(/\s*,\s*/);
	var gpu = soc.pop();
	var cpu = soc.join(', ');

	var mem = $('td[title="memory_internal"]+td>strong').text().split(/\s*,\s*/);

	//16GB ROM, 64GB ROM, 128GB ROM, 1GB RAM
	mem = mem.reduce(function(m, str){
		if ( str.match(/RAM/i) ) {
			m.systemMemory = str;
		} else if ( str.match(/ROM/i) ) {
			if ( !m.builtInStorage ) {
				m.builtInStorage = str;
			} else {
				if ( !_.isArray(m.builtInStorage) ) {
					m.builtInStorage = [m.builtInStorage];
				}
				m.builtInStorage.push(str);
			}
		}
		return m;
	}, {});
	return _.merge({
		systemChip: cpu,
		//"processor": "Quad-core, 1200 MHz, ARM Cortex-A53",
		graphicsProcessor: gpu,
		storageExpansion: $('td[title="memory_slot"]+td>strong').text()
	}, mem)
}

sectionsParsers.battery = function(window, $, res) {
	var m, capacity = $('td[title="general_battery"]+td>strong').text();

	if ( ( m = capacity.match(/(\d+)\s*mAh/i) ) ) {
		capacity = m[1]+' mAh';
	}

	return {
		capacity
		// talkTime3G: '16.00 hoursthe average is 16 h (978 min)',
		// musicPlayback: '71.00 hours',
		// videoPlayback: '12.00 hours'
	}
};

sectionsParsers.multimedia = function(window, $, res) {

	var connectors = $('td[title="connectors"]+td>strong').text()

	var has35mmJack = !!connectors.match(/3\.5/);

	return {
		// "musicPlayer": "Filter by:Album, Artist, Playlists\nFeatures:Album art cover, Background playback\nSupported formats:MP3",
		// "videoPlayback": "Supported formats:MPEG4, H.263, H.264",
		// "speakers": ["Earpiece", "Loudspeaker"],
		headphonesConnector: has35mmJack ? '3.5mm' : ''
	}
};

function getSpecFromFile(file, aliases, done) {

	debug('JSDOM Loading '+file);

	if ( _.isFunction(aliases) ) {
		done = aliases,
		aliases = [];
	}

	fs.stat(file, function(err, stat){
		if ( err ) { return done(err); }
		if ( !stat ){
			err = new Error('File not found '+file);
			err.notFound = true;
			return done(err);
		}

		jsdom.env(_.merge(defaultJSDomConfig, {
			file,
			src: [ jquery ],
			done: function(err, window) {
				if ( !window || !window.$ ) {
					return done(new Error('Environment was not loaded for file '+file));
				}
				var $ = window.$;
				if ( err ) { return done(err); }

				// if we are at the devices list page( i.e. the page that
				// lists device under a common name  )
				if ( $('.devicelist').get(0) ) {
					// .et_pb_row h1
					var devicelistEls = $('.devicelist > li > a');
					// var devicelistEls = $('.devicelist > li > a').toArray().map(el=>{
					// 	return {
					// 		deviceName: $(el)
					// 		file
					// 	}
					// });
					var devicelist = devicelistEls.toArray().map(el=>$(el).text());

					var hrefArr = devicelistEls.get(0).href.split('/');

					var fileArr = file.split('/').slice(0, -2);
					fileArr = fileArr.concat(hrefArr.slice(-2));

					return getSpecFromFile(fileArr.join('/')+'.html', devicelist, done);
				}

				// $('.devicelist > li > a').map((i, el)=>{var arr = el.href.split('/'); return arr.pop() })

				var sections = [
					'design', 'display', 'camera', 'hardware', 'battery',
					'multimedia', 'browsing', 'cellular', 'connectivity',
					'other', 'availability'
				];

				var spec = sections.reduce(function(res, sectionName) {
					res[sectionName] = sectionsParsers[sectionName]
						? sectionsParsers[sectionName](window, $, res)
						: {};
					return res;
				}, {});

				var result = {
					vendor: sectionsParsers.vendor(window, $, spec),
					names: aliases.concat(sectionsParsers.names(window, $, spec)),
					spec
				};

				done(null, result);
			}
		}));

	});
}


module.exports = getSpecFromFile;
