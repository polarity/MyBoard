nodemailer = require('nodemailer')
smtpTransport = require('nodemailer-smtp-transport')

module.exports = ()->
	# create reusable transporter object using SMTP transport
	return nodemailer.createTransport(smtpTransport({
		host: 'corvus.uberspace.de'
		port: 587
		auth: {
			user: process.env.EMAIL_SMTP_USER
			pass: process.env.EMAIL_SMTP_PASSWORD
		}
	}))
