module.exports = (app, pdb, pdb_users, auth, PouchDB)->

	# Signup!
	app.get '/signup', (req, res) ->
		res.render "signup", {}