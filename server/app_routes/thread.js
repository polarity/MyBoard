module.exports = function(app, pdb, pdb_users, auth, PouchDB) {

	// Root !
	app.get('/thread/:id', function(req, res) {

		var options = {
			include_docs: true
		};

		var docId = req.params.id;

		// query db
		pdb.get(docId, options).then(function(response) {
			res.render("thread", {
				thread: response
			});
		});


	});

};