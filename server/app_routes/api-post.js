var logged = require('connect-ensure-login');
var urlify = require('urlify').create({
	addEToUmlauts: true,
	szToSs: true,
	spaces: "-",
	nonPrintable: "-",
	trim: true
});

module.exports = function(app, pdb, pdb_users, auth, PouchDB) {

	// root !
	app.post('/api/post', logged.ensureLoggedIn(), function(req, res) {

		var created = Date.now();
		var text = req.body.post_text;

		if (req.body.id) {
			var comment = {
				forId: req.body.id,
				created: created,
				user: req.user.username,
				post_text: text,
			};

			// update existing post
			pdb.get(req.body.id).then(function(doc) {
				doc.comments.push(comment);
				// write to db
				pdb.put(doc).then(function(response) {
					res.json(response);
				});
			});

		} else {
			// create new inital post
			var title = req.body.post_title;
			var first = (req.body.first) ? true : false;
			var id = created + '-' + urlify(title);
			var threadDoc = {
				_id: id,
				created: created,
				user: req.user.username,
				firstPost: first,
				post_title: title,
				post_text: text,
				comments: []
			};
			// write to db
			pdb.put(threadDoc).then(function(response) {
				res.json(response);
			});
		}
	});

};