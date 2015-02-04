'use strict';

module.exports = function(app) {
	app._route('static.index', '/').get(function(req, res, next) {
		res.render('index');
	});
};