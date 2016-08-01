// Mozilla/5.0 (Windows NT 5.1; rv:11.0) Gecko Firefox/11.0 (via ggpht.com GoogleImageProxy)
var _ = require('lodash');

module.exports = function(res, next) {
	// var appComs = _.get(res, 'pua.application.comments');
	// if ( appComs ) {
	// 	//v=>v.name.mamtch === 'Lotus-Notes'
	// 	var notesVersion = appComs.reduce(function(version, com){
	// 		if ( version ) { return version; }
	//
	// 		var m;
	// 		if ( ( m = com.match(/Lotus-Notes\/([\d\.]+)/) ) ) {
	// 			return m[1];
	// 		}
	//
	// 		return version;
	// 	}, null);
	//
	// 	if ( notesVersion ) {
	// 		_.set(res, 'detected.client', {
	// 			name: 'Lotus-Notes',
	// 			version: notesVersion
	// 		});
	// 	}
	// }
	next(null, res);
}
