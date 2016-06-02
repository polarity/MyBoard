jwt = require('jwt-simple')

module.exports = (app, pdb, pdb_users, auth)->
	# login!
	app.post '/api/login',auth.authenticate('local',{}),(req, res) ->
		# send token back!
		#res.redirect("/latest")
		res.json({
			username: req.user.username,
			email: req.user.email,
			token: jwt.encode({
				username: req.user.username,
				password: req.user.password
			},
			process.env.SECRET)
		})
