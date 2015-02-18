'use strict';

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var path = require('path');

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

// AUTOLOAD: server/models/*
fs.readdirSync(path.resolve(__dirname, 'models')).forEach(function(file) {
	rek('server/models/' + file);
});

// load routes
// AUTOLOAD: server/routes/*
fs.readdirSync(path.resolve(conf.root, 'server/routes')).forEach(function(file) {
	var route = rek('server/routes/' + file);

	if (route instanceof Function) {
		route(app);
	}
});
