var jsdom = require('jsdom');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var debug = require('debug')('ua-parser:spec')

var jquery = fs.readFileSync(path.resolve(__dirname,'../../node_modules/jquery/dist/jquery.js'), 'utf-8');

var formatSpec = require('../transformers/device-raw-spec');

var defaultJSDomConfig = {
	userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36',
	headers: {
		Origin: 'http://www.phonearena.com'
	}
}

function parseSpecsPage(specsPageUrl, done) {
	jsdom.env(_.merge(defaultJSDomConfig, {
		url: specsPageUrl+'/fullspecs',
		src: [ jquery ],
		headers: {
			Referer: specsPageUrl
		},
		done: function(err, window) {
			var $ = window.$;
			if ( err ) { return done(err); }

			var ulsToParse = {
				// selector: "result object prop name"
				'h2:contains("Design")+ul': 'design',
				'h2:contains("Display")+ul': 'display',
				'h2:contains("Camera")+ul': 'camera',
				'h2:contains("Hardware")+ul': 'hardware',
				'h2:contains("Battery")+ul': 'battery',
				'h2:contains("Multimedia")+ul': 'multimedia',
				'h2:contains("Internet browsing")+ul': 'browsing',
				'h2:contains("Cellular")+ul': 'cellular',
				'h2:contains("Connectivity")+ul': 'connectivity',
				'h2:contains("Other features")+ul': 'other',
				'h2:contains("Availability")+ul': 'availability'
			};

			var spec = Object.keys(ulsToParse).reduce(function(r, selector){
				var propName = ulsToParse[selector];

				r[propName] = r[propName] || {};

				var ulObj = r[propName];

				var ul = $(selector);
				if ( !ul ) { return done(new Error(propName+'('+selector+') UL element is not found')); }

				var c = 0;

				ul.children().each(function(i, el){
					var key,
						keyEl = $('> strong', el),
						keyTextEl;

					keyTextEl = ( keyEl.children().length )
						? keyEl.find('span').first()
						: keyEl;

					key = _.camelCase(keyTextEl.text());

					if ( !key ) {
						key = propName+(++c);
					}

					var val = _.trim($('> ul', el).text());

					if ( key === 'device-type' ) {
						val = val.toLowerCase();
					}

					ulObj[key] = val;
				});

				return r;
			}, {});

			var result = { spec };

			var vendorArr = $($('.s_breadcrumbs li:not(.s_sep,.selected)').toArray().pop()).text().split(/\s+/);
			vendorArr.pop();

			result.vendor = vendorArr.join(' ');


			result.names = _.toArray($('p.smallvars strong').add('#phone > h1 > span'))
				.map(el => $(el).text())
				.map(s => s.replace(/\s+/, ' '));

			formatSpec(result.spec, function(err, newSpec){
				if ( err ) { return done(err); }
				result.spec = newSpec;
				return done(null, result);
			});
		}
	}));
}

var baseUrl = 'http://www.phonearena.com'

module.exports = function getSpec(name, done) {
	var url = baseUrl+'/search/?query="'+name+'"&params=&page=1';
	debug('Loading '+url);
	jsdom.env(_.merge(defaultJSDomConfig, {
		url,
		src: [ jquery ],
		done: function(err, window) {
			if ( err ) { return done(err); }
			var lnk = window.$('#phones .s_listing a.s_thumb').get(0);
			if ( !lnk ) {
				return done(new Error('Link to device specs page is not found'));
			}
			var specsUrl = lnk.href;
			debug('Loading specs url: ', specsUrl);
			return parseSpecsPage(specsUrl, done);
		}
	}));
};
