require("coffee-script/register");
var express = require('express');
var PouchDB = require('pouchdb').defaults({
	include: [
		'fauxton'
	], prefix: __dirname + '/_pouchdb'
});
var dotenv = require("dotenv");
var favicon = require('serve-favicon');
var expressPouchdb = require('express-pouchdb');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpack = require("webpack");
var sass = require("node-sass-middleware");
var path = require('path');
var bodyParser = require("body-parser");
var jstat = require('json-status');
var esession = require("express-session");

// init express app
var app = express();

// serve sass files as static css files
// domain.de/css/*.css -> public/src/scss/*.scss
app.use(sass({
	src: __dirname + '/public/scss',
	dest: __dirname + '/public/css',
	prefix: "/css",
	debug: true
}));

// template engine
app.set('view engine', 'jade');
app.set('views', __dirname + '/public/jade/');
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/fonts', express.static(__dirname + '/public/fonts'));
app.use('/css', express.static(__dirname + '/public/css'));

// serve the favicon
app.use(favicon(__dirname + '/public/favicon.ico'));

// compiler
var compiler = webpack({
	context: __dirname,
	entry: "./public/coffee/main.coffee",
	output: {
		path: __dirname,
		filename: "complete.js"
	},
	module: {
		loaders: [
			{
				test: /\.coffee$/, loader: "coffee-loader"
			},
			{
				test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate"
			}
		]
	},
	resolve: {
		root: [
			path.resolve('../node_modules'),
		]
	}
});

app.use(webpackDevMiddleware(compiler, {
	publicPath: '/js'
}));

// init database
var pdb = new PouchDB("db"); // database init
var pdb_users = new PouchDB("_users"); // database init
var auth = require("./app_modules/auth.js")(pdb_users);

// load environment file and store it
// in "process.env.*" for usage
dotenv.load({
	path: __dirname + "/.env"
});

// express use stuff
// app.use(express.logger('tiny'));
app.use(esession({
	secret: process.env.SESSION_SECRET
}));
app.use(auth.initialize());
app.use(auth.session());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json({
	limit: '5mb'
}));

// use "json-status" for better respond error codes
// https://www.npmjs.com/package/json-status
app.use(jstat.connectMiddleware({
	onError: function(data) {
		console.log("error: ", data.type, data.message, data.detail);
	}
}));

require("./app_routes/api-signup.coffee")(app, pdb, pdb_users, auth, PouchDB);
require("./app_routes/api-login.coffee")(app, pdb, pdb_users, auth, PouchDB);
require("./app_routes/api-confirm-email.coffee")(app, pdb, pdb_users, auth, PouchDB);
require("./app_routes/api-post.js")(app, pdb, pdb_users, auth, PouchDB);

require("./app_routes/signup.coffee")(app, pdb, pdb_users, auth, PouchDB);
require("./app_routes/login.coffee")(app, pdb, pdb_users, auth, PouchDB);
require("./app_routes/root.js")(app, pdb, pdb_users, auth, PouchDB);
require("./app_routes/profile.coffee")(app, pdb, pdb_users, auth, PouchDB);

require("./app_routes/latest.js")(app, pdb, pdb_users, auth, PouchDB);
require("./app_routes/thread.js")(app, pdb, pdb_users, auth, PouchDB);


// show all user data
pdb.allDocs({
	include_docs: true,
	attachments: true
})
	.then(function(result) {
		console.log(result);
	})
	.catch(function(err) {
		console.log(result);
	});

// start the server
console.log("Listening on " + process.env.APP_PORT);
app.listen(process.env.APP_PORT);
