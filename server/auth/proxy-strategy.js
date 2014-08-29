'use strict';

var util          = require('util');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var request       = require('request');
var fs            = require('fs');

// url = localhost?
function ProxyStrategy(url) {
	this.url = url;
	LocalStrategy.call(this, { usernameField: 'username'}, this.verifyUser.bind(this));

	passport.serializeUser(function(user,done) {
		//console.log('in serializeUser');
		//console.log(user);
		// store/serialize the user._id in the session cookie
		done(null, user._id);
	});

	// deserialize user from cookie
	passport.deserializeUser(function(id, done) {
		//console.log('in deserialize user');
		//console.log(id);
		var options = {
			uri: 'https://10.177.152.33/getUserById',
			//hostname: '67.244.2.107',
			method: 'GET',
			key: fs.readFileSync('server/auth/keys/userA.key'),
			cert: fs.readFileSync('server/auth/certs/userA.crt'),
			ca: fs.readFileSync('server/auth/ca/numeriaMirth.crt'),
			//strictSSL:false,
			rejectUnauthorized:false,
			json: {
				_id: id,//'James',
			},
			headers: {}
		};
		//this.get.bind(this);
		request(options, function(error,res,body){
			// not currently using the 401 passed back from the central
			// auth server. We now serve our own 401 if user is 'null' from the
			// proxy
			if (res && res.statusCode == 401) {
				//error = {error:401};
			}
			var user = res.body
			done(error, user);
		}); 

		//done(null,id);
	});

	this.name = 'proxy';
}

util.inherits(ProxyStrategy, LocalStrategy);

ProxyStrategy.name = 'proxy';

ProxyStrategy.prototype.verifyUser = function(username, password, done) {
	var options = {
		uri: 'https://10.177.152.33/test',
		//hostname: '67.244.2.107',
		method: 'POST',
		key: fs.readFileSync('server/auth/keys/userA.key'),
		cert: fs.readFileSync('server/auth/certs/userA.crt'),
		ca: fs.readFileSync('server/auth/ca/numeriaMirth.crt'),
		//strictSSL:false,
		rejectUnauthorized:false,
		json: {
			username: username,//'James',
			password: password//'neptune'
		},
		headers: {}
	};
	
	request(options, function(error,res,body){
		// not currently using the 401 passed back from the central
		// auth server. We now serve our own 401 if user is 'null' from the
		// proxy
		if (res.statusCode == 401) {
			//console.log('401 luls');
			//error = {error:401};
		}

		//console.log('in verifyUser');
		var user = res.body
		//console.log(error);
		//console.log(user);
		done(error, user);
	}); 

};

module.exports = ProxyStrategy;

