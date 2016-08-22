'use strict';
var SearchTerm = require('../models/searchterms.js');
var Search = require('bing.search');

function SearchTermController() {

	//GET Latest search term
	this.getLatest = function(req, res) {
		SearchTerm.find().sort('-when').limit(10).exec(function(err, terms) {
			if (err) {
				throw err;
			}

			var latest = [];

			for (var i = 0; i < terms.length; i++) {
				latest.push({
					term: terms[i].term,
					when: terms[i].when
				});
			}
			res.json(latest);

		});
	}

	//GET save search term
	this.saveSearchTerm = function(req, res, next) {
		var date = new Date();
		console.log(new Date().toISOString())

		var searchTerm = new SearchTerm({
			term: req.params.searchterm,
			when: new Date().toISOString()
		});

		searchTerm.save(function(err) {
			if (err) {
				throw err;
			}
			console.log("Search Term Saved");
		});
		next()
	}

	//GET get search results
	this.getSearchResults = function(req, res) {
		var search = new Search(process.env.BING_KEY);

		var searchTerm = req.params.searchterm;
		var offset = req.query.offset;

		search.images(searchTerm, {
				top: 10,
				skip: offset
			},
			function(err, results) {

				if (!results) {
					return res.send("<b>There seems to be a connection problem</b>")
				}

				var imgs = [];
				for (var i = 0; i < results.length; i++) {
					var img = {};

					img.url = results[i].url;
					img.snippet = results[i].title;
					img.thumbnail = results[i].thumbnail.url;
					img.context = results[i].sourceUrl;

					imgs.push(img);

				}
				res.json(imgs);
			}
		);
	}

}

module.exports = SearchTermController;