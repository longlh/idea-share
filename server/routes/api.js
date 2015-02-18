'use strict';

var auth = rek('server/middlewares/auth');

module.exports = function(app) {
	app.route('/api/sessions')
			.post(auth.signIn);

	app.route('/api/sessions/:token')
			.get(auth.validateSession)
			.delete(auth.destroySession);

	app.route('/api/ideas')
			.get(function getIdeas(req, res, next) {
				res.json([{
					id: 1,
					brief: 'idea 1'
				}, {
					id: 2,
					brief: 'idea 2'
				}]);
			})
			.post(function insertIdea(req, res, next) {
				res.json({
					id: 3,
					brief: 'idea 3'
				});
			});

	app.route('/api/ideas/:id')
			.get(function getIdea(req, res, next) {
				res.json({
					id: req.params.id,
					brief: 'xxx'
				});
			})
			.put(function updateIdea(req, res, next) {
				res.json(req.body);
			});
};
