'use strict';

var invitation = rek('server/middlewares/invitation');

module.exports = function(app) {
	app._route('page.index', '/').get(function render(req, res, next) {
		res.render('index');
	});

	app._route('page.invitation', '/invitation/:code')
			.get(invitation.render)
			.post(invitation.process);
};
