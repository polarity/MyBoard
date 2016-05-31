transporter = require("./create_mail_transporter.coffee")()

# send mail to a mail.
# needs a transport object
module.exports = (mailOptions)->
	# sendmail
	transporter.sendMail mailOptions, (error, info)->
		if error
			console.log(error)
		else
			console.log('Message sent: ' + info.response)
