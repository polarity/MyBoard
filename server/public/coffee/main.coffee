$ = require("jquery")

# Loginform
$("#LoginForm").on "submit", (ev)->
	ev.preventDefault()
	el = $(ev.target)

	username = el.find("[name='username']").val()
	password = el.find("[name='password']").val()
	warningEl = el.find(".Warning")

	$.ajax("/api/login", {
		"type": "POST"
		"data": {
			username: username
			password: password
		}
	})
	.done (data, textStatus, jqXHR)->
		console.log(data.token)
		# redirect on success
		window.location = "/latest" if data.token

	.fail (jqXHR, textStatus, errorThrown)->
		warningEl.children("p").text(errorThrown)
		warningEl.show("slow")