logged = require('connect-ensure-login')

module.exports = (app, pdb, pdb_users, auth, PouchDB)->

	# Signup!
	app.get '/profile',logged.ensureLoggedIn(), (req, res) ->
		res.render "profile", {}