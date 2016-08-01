var mongoose = require('mongoose');
var debug = require('debug');
require('./lib/models/spec')(mongoose);

var defaultOptions = {
	db: 'mongodb://127.0.0.1/uaparser'
}

var detect = require('./rules');

class UAParser {
	constructor(opts = defaultOptions) {
		this.opts = opts;
		this.conn = mongoose.createConnection(opts.db);
	}

	parse(uaString, done) {
		debug('UAParser.conn: ', this.conn);
		detect({ uaString, conn: this.conn }, done);
	}

	close(){
		this.conn.close();
	}
}

module.exports = UAParser;
