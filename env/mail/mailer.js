'use strict';

var _ = require('lodash');
var bird = require('bluebird');
var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');

var conf = rek('env/profiles/all');

var transporter = nodemailer.createTransport(ses({
	accessKeyId: conf.mail.accessKeyId,
	secretAccessKey: conf.mail.secretAccessKey,
	region: conf.mail.region
}));

var sendMail = bird.promisify(transporter.sendMail, transporter);

module.export.sendMail = function(options) {
	return sendMail(_.assign({
		from: conf.mail.sender
	}, options));
};
