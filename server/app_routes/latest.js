module.exports = function(app, pdb, pdb_users, auth, PouchDB) {

	// Root !
	app.get('/latest', function(req, res) {

		var map = function(doc) {
			if (doc.firstPost) {
				emit(doc._id);
			}
		};
		var options = {
			include_docs: true
		};

		// query db
		pdb.query(map, options).then(function(response) {
			res.render("latest", {
				threads: response.rows
			});
		});


	});

};