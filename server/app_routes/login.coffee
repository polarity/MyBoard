module.exports = (app, pdb, pdb_users, auth, PouchDB)->

	# Signup!
	app.get '/login', (req, res) ->
		res.render "login", {}