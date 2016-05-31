vali = require('validator')

# validates the user input on signup!
module.exports = (username, email, password)->
	error = []

	# check for username, email & password
	error.push {par: "username", err:"isNot"} if !username
	error.push {par: "username", err:"isNotAlpha"} if !vali.isAlpha(username)
	error.push {par: "username", err:"tooShort"} if !vali.isLength(username, 3, 20)

	error.push {par: "email", err:"isNot"} if !email
	error.push {par: "email", err:"noEmail"} if !vali.isEmail(email)

	error.push {par: "password", err:"isNot"} if !password
	error.push {par: "password", err:"tooShort"} if !vali.isLength(password, 8,100)
	error.push {par: "password", err:"isNotAlphaNum"} if !vali.isAlphanumeric(password)

	return error
