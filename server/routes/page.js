'use strict';

module.exports = function(app) {
	app._route('page.index', '/').get(function render(req, res, next) {
		res.render('index');
	});
};