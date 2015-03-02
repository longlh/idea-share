'use strict';

var session = rek('server/middlewares/api-session');

var self = module.exports;

self.render = function(req, res, next) {
	session.create(req.user).then(function(session) {
		res.render('app', session);
	});
};
