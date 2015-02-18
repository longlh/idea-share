'use strict';

var rev = rek('build/rev.json');
var origNames = Object.keys(rev);
var assets = {
		img: {},
		css: {},
		js: {}
	};

var PREFIXES = {
		IMG: 'client/assets/img/',
		CSS: 'build/.tmp/cssmin/',
		JS: 'build/.tmp/jsmin/'
	};

var i = 0;
var length = origNames.length;
var name;

for (; i < length; i++) {
	name = origNames[i];

	if (name.indexOf(PREFIXES.IMG) === 0) {
		assets.img[name.replace(PREFIXES.IMG, '')] = rev[name];
	} else if (name.indexOf(PREFIXES.CSS) === 0) {
		assets.css[name.replace(PREFIXES.CSS, '')] = rev[name];
	} else if (name.indexOf(PREFIXES.JS) === 0) {
		assets.js[name.replace(PREFIXES.JS, '')] = rev[name];
	}
}

module.exports.init = function(app) {
	app.use(function(req, res, next) {
		res.locals.__img = function(path) {
			return assets.img[path];
		};
		res.locals.__css = function(path) {
			return assets.css[path];
		};
		res.locals.__js = function(path) {
			return assets.js[path];
		};
		next();
	});
};
