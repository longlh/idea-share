'use strict';

var session = rek('server/middlewares/api-session');
var comment = rek('server/middlewares/comment');
var idea = rek('server/middlewares/idea');

module.exports = function(app) {
	// app.route('/api/sessions')
	// 		.post(auth.signIn);

	app.route('/api/sessions/:token')
			.get(session.validate)
			.delete(session.destroy);

	app.route('/api/ideas')
			.get(session.identify, idea.query)
			.post(session.identify, idea.save);

	app.route('/api/ideas/:id')
			.get(session.identify, idea.get({
				identifier: 'id',
				finally: true
			}))
			.post(session.identify, idea.get({
				identifier: 'id'
			}), idea.save);

	app.route('/api/ideas/:ideaId/fragments')
			.post(session.identify, idea.get({
				identifier: 'ideaId'
			}), idea.saveFragment);

	app.route('/api/ideas/:ideaId/fragments/:id')
			.get(session.identify, idea.get({
				identifier: 'ideaId'
			}), idea.getFragment)
			.post(session.identify, idea.get({
				identifier: 'ideaId'
			}), idea.saveFragment)
			.delete(session.identify, idea.get({
				identifier: 'ideaId'
			}), idea.deleteFragment);

	app.route('/api/ideas/:id/comments')
			.get(session.identify, idea.get({
				identifier: 'id'
			}), comment.query)
			.post(session.identify,	idea.get({
				identifier: 'id'
			}), comment.save);
};
