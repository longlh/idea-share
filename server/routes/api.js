'use strict';

var auth = rek('server/middlewares/auth');
var comment = rek('server/middlewares/comment');
var idea = rek('server/middlewares/idea');

module.exports = function(app) {
	app.route('/api/sessions')
			.post(auth.signIn);

	app.route('/api/sessions/:token')
			.get(auth.validateSession)
			.delete(auth.destroySession);

	app.route('/api/ideas')
			.get(
					auth.identifySession,
					idea.query
			)
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

	app.route('/api/ideas/:id/fragments')
			.post(
					auth.identifySession,
					idea.get({
						identifier: 'id'
					}),
					idea.saveFragment
			);

	app.route('/api/ideas/:ideaId/fragments/:id')
			.get(
					auth.identifySession,
					idea.get({
						identifier: 'ideaId'
					}),
					idea.getFragment
			)
			.post(
					auth.identifySession,
					idea.get({
						identifier: 'ideaId'
					}),
					idea.saveFragment
			)
			.delete(
					auth.identifySession,
					idea.get({
						identifier: 'ideaId'
					}),
					idea.deleteFragment
			);

	app.route('/api/ideas/:id/comments')
			.get(
					auth.identifySession,
					idea.get({
						identifier: 'id'
					}),
					comment.query
			)
			.post(
					auth.identifySession,
					idea.get({
						identifier: 'id'
					}),
					comment.save
			);
};
