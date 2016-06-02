var logged = require('connect-ensure-login');
var urlify = require('urlify').create({
	addEToUmlauts: true,
	szToSs: true,
	spaces: "-",
	nonPrintable: "-",
	trim: true
});
vali = require('validator');

module.exports = function(app, pdb, pdb_users, auth, PouchDB) {

	// root !
	app.post('/api/post', logged.ensureLoggedIn(), function(req, res) {

		var created = Date.now();
		var text = req.body.post_text;
		var error = [];

		// check for min length of text
		if (!vali.isLength(text, {
					min: 3
				})) {
			error.push({
				par: "text", err: "tooShort"
			});
		}

		// proceed on error free
		if (error.length === 0) {
			if (req.body.id) {
				var comment = {
					forId: req.body.id,
					created: created,
					user: req.user,
					post_text: text,
				};

				// update existing post
				pdb.get(req.body.id).then(function(doc) {
					doc.comments.push(comment);
					// write to db
					pdb.put(doc).then(function(response) {
						//res.json(response);
						res.redirect("/thread/" + req.body.id);
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
					user: req.user,
					firstPost: first,
					post_title: title,
					post_text: text,
					comments: []
				};
				// write to db
				pdb.put(threadDoc).then(function(response) {
					//res.json(response);
					res.redirect("/thread/" + id);
				});
			}

		} else {
			res.json({
				err: error
			});
		}
	});

};