md5 = require("md5")
jwt = require('jwt-simple')
checkCredentials = require("../app_modules/check_credentials.coffee")
epSendMail = require("../app_modules/ep_send_mail.coffee")

# signgup process
# gets user data and validates it
# makes entry in db witch flag: waiting for verification
# sends verification email to user email
module.exports = (app, pdb, pdb_users, auth, PouchDB)->

	# Signup!
	app.post '/api/signup', (req, res) ->

		# check user send data
		# end return empty array on passsing
		# all tests. on error array with error
		# details
		error = checkCredentials(
			req.body.username,
			req.body.email,
			req.body.password
		)

		# proceed on no errors
		if error.length == 0
			# create hash to identify user
			# and create a link in the email
			seed = "12883uh1hasduUUhasdjHJAalsk3"
			hash = md5(req.body.username+req.body.email+seed)
			link = process.env.APP_DOMAIN+'api/confirm-email/'+hash

			# setup e-mail data with unicode symbols
			mailOptions = {
				from: 'Producer Network Signup <info@producer-network.de>', #sender address
				to: req.body.email, # list of receivers
				subject: 'Deine PN Registrierung ✔', # Subject line
				text: 'Hello world ✔', # plaintext body
				html: '<p>Willkommen im PN. Bitte klicken Sie diesen Link damit wir wissen wer sie sind:</p>\
					<p><a href="'+link+'"">'+link+'</a></p>' # html body
			}

			# create new user
			user = {
				_id: "org.couchdb.user:"+req.body.username
				username: req.body.username
				email: req.body.email
				tobeconfirmed: hash
				password: md5(req.body.password)
				type: "user"
				roles: ["user"] # admin, user, premium?
			}

			# query db for existing users
			map = (doc, emit)-> emit(doc.email)
			options = {include_docs: true, key: user.email}
			pdb_users.query(map, options)
				.then (docs)->
					# users found?
					if docs.rows.length > 0
						# some users found! return fail
						res.status.conflict([{err:"user already in db"}])
					else
						# no users found, proceed with adding a new one
						# insert user to db
						pdb_users.put(user)
							.then (response)->
								epSendMail(mailOptions)
								# doc saved?
								res.json(response)
							.catch (err)->
								res.status.internalServerError([{err:"couldnt save new user"}])
				.catch ()->
					res.status.internalServerError([{err:"some db problem on signup"}])
		else
			res.status.notAcceptable(error)
