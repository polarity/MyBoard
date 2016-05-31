var passport = require('passport');
var md5 = require("md5");
var jwt = require('jwt-simple');
var LocalStrategy = require('passport-local').Strategy;
var TokenStrategy = require('passport-token').Strategy;

module.exports = function(pdb_users) {
	passport.serializeUser(function(user, done) {
		return done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		return done(err, user);
	});
	var localStrategy = new LocalStrategy(function(username, password, done) {
		return pdb_users.get("org.couchdb.user:" + username).then(function(user) {
			if (user.password === md5.digest_s(password)) {
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