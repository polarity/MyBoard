module.exports = function(app, pdb, pdb_users, auth, PouchDB) {

	// Root !
	app.get('/', function(req, res) {
		res.render("index", {});
	});

};