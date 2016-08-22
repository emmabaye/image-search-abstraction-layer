'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SearchTermSchema = new Schema({
	term: String,
	when: Date
});

module.exports = mongoose.model('SearchTerm', SearchTermSchema);