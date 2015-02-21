'use strict';

var auth = rek('server/middlewares/auth');
var idea = rek('server/middlewares/idea');

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
			.post(
					auth.identifySession,
					idea.save
			);

	app.route('/api/ideas/:id')
			.get(
					auth.identifySession,
					idea.get({
						identifier: 'id',
						finally: true
					})
			)
			.post(
					auth.identifySession,
					idea.get({
						identifier: 'id'
					}),
					idea.save
			);

	app.route('/api/ideas/:ideaId/fragments')
			.post(
					auth.identifySession,
					idea.get({
						identifier: 'ideaId'
					}),
					idea.saveFragment
			);

	app.route('/api/ideas/:ideaId/fragments/:id')
			.post(
					auth.identifySession,
					idea.get({
						identifier: 'ideaId'
					}),
					idea.saveFragment
			);
};
