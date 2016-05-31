md5 = require("md5")
_ = require("lodash")

module.exports = (app, pdb, pdb_users, auth, PouchDB)->
	# user wants to confirm a registration via link
	# in the email
	app.get '/api/confirm-email/:hash', (req, res) ->

		# query map
		map = (doc)=> emit(doc._id) if doc.tobeconfirmed
		options = {include_docs: true}

		# query db
		pdb_users.query(map, options)
			.then (response)->
				# found unconfirmed users!
				console.log("\nUsers to be confirmed found: %j", response)

				# find the user with the delivered hash in the url
				# search for hash inside the result
				# of uncofirmed users
				if response.total_rows > 0
					found = _.find(response.rows, {doc:{tobeconfirmed: req.params.hash}})

					console.log("\nUser that wants to confirm: %j", found)

					# we have this unconfirmed user
					if found
						# register user -> delete hash from db
						found.doc.tobeconfirmed = undefined
						pdb_users.put(found.doc)
						# user with this hash found
						# res.json({success: "User found -> removing tobeconfirmed tag. Try to login!", found})
						res.render "confirm-email", {
							domain: process.env.APP_DOMAIN
						}

					else
						# no user with this hash found
						# res.json({error: "Kein User gefunden!"})
						# no confirmed users in db
						# res.json({error: "No unconfirmed Users in DB!"})
						res.render "confirm-email-fail", {
							domain: process.env.APP_DOMAIN
						}

				else
					# no confirmed users in db
					#res.json({error: "No unconfirmed Users in DB!"})
					res.render "confirm-email-fail", {
						domain: process.env.APP_DOMAIN
					}

			.catch (err)->
				#res.json({error: "no user found!"})
				# no confirmed users in db
				#res.json({error: "No unconfirmed Users in DB!"})
				res.render "confirm-email-fail", {
					domain: process.env.APP_DOMAIN
				}
