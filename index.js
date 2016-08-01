var mongoose = require('mongoose');

require('./lib/models/spec');

var defaultOptions = {
	db: 'mongodb://127.0.0.1/uaparser'
}

var detect = require('./rules');

class UAParser {
	constructor(opts = defaultOptions) {
		this.opts = opts;
		mongoose.connect(opts.db);
	}

	parse(uaString, done) {
		detect(uaString, done);
	}

	close(){
		mongoose.connection.close();
	}
}

module.exports = UAParser;
