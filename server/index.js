'use strict';

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var path = require('path');
var session = require('express-session');

var RedisStore = require('connect-redis')(session);

var conf = rek('env/profiles/all');

// connect database
// initialize db
mongoose.connect(conf.db);

var app = module.exports = express();

require('reverse-route')(app);

rek('env/view-engines').init(app);

rek('env/assets').init(app);

if (conf.env === 'development') {
	app.use(express.static(path.resolve(conf.root, 'build/public')));
	app.use(express.static(path.resolve(conf.root, 'upload')));
}

// use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '20mb'
}));

// use cookie-parser
app.use(cookieParser());

// use express session
app.use(session({
	store: new RedisStore({
		host: 'localhost',
		port: 6379,
		ttl: 3600
	}),
	name: conf.session.key,
	secret: conf.session.secret,
	unset: 'destroy',
	rolling: true,
	saveUninitialized: false,
	resave: false
}));

// AUTOLOAD: server/models/*
fs.readdirSync(path.resolve(__dirname, 'models')).forEach(function(file) {
	rek('server/models/' + file);
});

// use passport
var passport = rek('server/libs/passport');
app.use(passport.initialize());
app.use(passport.session());

// load routes
// AUTOLOAD: server/routes/*
fs.readdirSync(path.resolve(conf.root, 'server/routes')).forEach(function(file) {
	var route = rek('server/routes/' + file);

	if (route instanceof Function) {
		route(app);
	}
});
