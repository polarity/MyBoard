var passport = require('passport');
var md5 = require("md5");
var jwt = require('jwt-simple');

var LocalStrategy = require('passport-local').Strategy;
var TokenStrategy = require('passport-token').Strategy;

module.exports = function(pdb_users) {

	// Passport session setup.
	// To support persistent login sessions, Passport needs to be able to
	// serialize users into and deserialize users out of the session.  Typically,
	// this will be as simple as storing the user ID when serializing, and finding
	// the user by ID when deserializing.
	passport.serializeUser(function(user, done) {
		return done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		pdb_users.get(id).then(function(user) {
			return done(null, user);
		}).catch(function(err) {
			console.log("Login fail: ", err);
			return done(err, null);
		});
	});

	// define the app auth strategy
	var localStrategy = new LocalStrategy(function(username, password, done) {
		return pdb_users.get("org.couchdb.user:" + username).then(function(user) {
			if (user.password === md5(password)) {
				return done(null, user);
			} else {
				return done(null, false, {
					message: 'Incorrect password.'
				});
			}
		}).catch(function(err) {
			return done(null, false, {
				message: 'No User Found'
			});
		});
	});

	// define the app auth strategy
	var tokenStrategy = new TokenStrategy(function(username, token, done) {
		var decodedToken;
		decodedToken = jwt.decode(token, process.env.SECRET);
		return pdb_users.get("org.couchdb.user:" + username).then(function(user) {
			if (user.password === decodedToken.password) {
				return done(null, user);
			} else {
				return done(null, false, {
					message: 'Incorrect password.'
				});
			}
		}).catch(function(err) {
			return done(null, false, {
				message: 'No User Found'
			});
		});
	});

	passport.use(localStrategy);
	passport.use(tokenStrategy);
	return passport;
};
