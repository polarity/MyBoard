$ = require("jquery")

# Loginform
$("#LoginForm").on "submit", (ev)->
	ev.preventDefault()
	el = $(ev.target)

	username = el.find("[name='username']").val()
	password = el.find("[name='password']").val()

	$.ajax("/api/login", {
		"type": "POST"
		"data": {
			username: username
			password: password
		}
	})
	.done (data, textStatus, jqXHR)->
		console.log(data)

	.fail (jqXHR, textStatus, errorThrown)->
		console.log(textStatus)