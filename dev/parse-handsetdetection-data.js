var getSpecFromFile = require('../lib/spec-parser/handsetdetection');
var fs = require('fs');
var path = require('path');
var async = require('async');
var mongoose = require('mongoose');
var format = require('util').format;
var _ = require('lodash');

var Spec = require('../lib/models/spec');

var vendorsPath = '/Users/neocoder/projects/handsetdetection-mirror/www.handsetdetection.com/properties/devices';

var argv = require('optimist').argv;

mongoose.connect('mongodb://127.0.0.1/uaparser', function(err){
	if ( err ) { return console.error(err); }

	var paths = fs.readdirSync(vendorsPath);

	paths = _.filter(paths, function(p){ return !p.match(/\.html$/) && p !== '.DS_Store'; });

	if ( argv.single ) {
		var single = argv.single.split(/\s*,\s*/);
		getSpecByDeviceName(single[0], single[1], function(err, res, isFromCache){
			if ( err ) {
				console.log(err);
			} else {
				if ( isFromCache ) { console.log('FOUND IN CACHE'); }
				console.log(require('util').inspect(res, { depth: null, colors: true }));
			}
			mongoose.connection.close();
		});
		return;
	}


	//*
	async.eachLimit(
		paths,
		1,
		function(vendor, nextVendor) {
			console.log(vendor);
			console.log('-----------------------');

			fs.readdir(path.join(vendorsPath, vendor), function(err, models){
				console.log('Processing %s models', models.length);
				if ( err ) { return nextVendor(err); }

				models = _.filter(models,
					function(p) {
						//console.log('\t'+p);
						return !!p.match(/\.html$/);
					}
				).map(s=>s.replace(/\.html$/, ''));

				async.eachLimit(
					models,
					1,
					function(deviceName, nextDeviceName) {

						getSpecByDeviceName(vendor, deviceName, function(err, res, isFromCache){
							if ( err && ( err.notFound || err.code === 'ENOENT' ) ) {
								console.log(format('[ERROR] Spec file for %s: %s is not found!\n%s', vendor, deviceName, err.path));
								return nextDeviceName();
							}
							if ( err ) { return nextDeviceName(err); }
							var fic = isFromCache ? ' - FOUND IN CACHE' : '';
							console.log(format('%s: %s', vendor, res.names)+fic);

							nextDeviceName();
						});
					},
					nextVendor
				);
			});

		},
		function(err) {
			if ( err ) {
				console.log('Error:', err)
				console.log(require('util').inspect(err, { depth: null, colors: true }));
			} else {
				console.log('Done!');
			}
			mongoose.connection.close();
		}
	);

	//*/
});

function getSpecByDeviceName(vendor, deviceName, done) {
	var q = {
		vendor: vendor,
		$text: {
			$search: '"'+deviceName+'"'
		}
	};

	Spec.findOne(q, function(err, doc){
		if ( err ) { return done(err); }
		if ( doc ) { return done(null, doc, 'from_cache'); }

		var deviceFile = path.join(vendorsPath, vendor, decodeURIComponent(deviceName)+'.html');

		getSpecFromFile(deviceFile, function(err, res){

			if ( err ) { return done(err);  }
			if ( !res ) { return done(new Error('Spec for '+deviceName+' could not be found!')); }

			if ( !res.vendor || res.vendor.toLowerCase() !== vendor.toLowerCase() ) {
				res.vendor = [res.vendor, vendor];
				//console.log(require('util').inspect(res, { depth: null }));
				//return done(new Error(format('Vendor missmatch "%s" !== "%s"\n%s\n\n', res.vendor, vendor, deviceFile)))
			}

			if ( !_.isArray(res.vendor) ) {
				res.vendor = [res.vendor];
			}

			var s = new Spec(res);
			s.save(function(err, doc){
				if ( err ) { return done(err);  }
				done(null, doc);
			});

		});
	});
}
