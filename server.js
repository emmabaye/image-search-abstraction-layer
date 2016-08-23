//'use strict';
var express = require('express');
var mongoose = require('mongoose');
var SearchTermController = require('./app/controllers/searchTermController.js');

var app = express();

require('dotenv').load();

mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind('console', 'connection error'));
db.once('open', function(){
	console.log("Connected to database");
	
});


app.use('/public', express.static('public'));

var searchTermController = new SearchTermController();

app.get('/', function(req, res){
 res.sendFile(process.cwd() + '/views/index.htm');
});
app.get('/api/latest/imagesearch',searchTermController.getLatest);
app.get('/api/imagesearch/:searchterm?', searchTermController.saveSearchTerm, searchTermController.getSearchResults);

var port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log("Node.js is listening on port " + port + "...");
});