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
		console.log(user);
		done(null, user.username);
	});

	// deserialize user from cookie
	passport.deserializeUser(function(username, done) {
		console.log('in deserializeUser');
		console.log(username);
		//console.log('in deserialize user');
		//console.log(id);
		/*
		var options = {
			uri: 'https://wcmcradiology.org/getUserByUsername?username=' + username,
			//hostname: '67.244.2.107',
			method: 'GET',
			//strictSSL:false,
			rejectUnauthorized:false,
		};
		//this.get.bind(this);
		request(options, function(error,res,body){
			// not currently using the 401 passed back from the central
			// auth server. We now serve our own 401 if user is 'null' from the
			// proxy
			if (res && res.statusCode == 401) {
				//error = {error:401};
			}
			var user = JSON.parse(res.body);
			console.log(user);
			done(error, user.username);
		}); 
		*/

		done(null,username);
	});

	this.name = 'proxy';
}

util.inherits(ProxyStrategy, LocalStrategy);

//ProxyStrategy.name = 'proxy';

ProxyStrategy.prototype.verifyUser = function(username, password, done) {
	var options = {
		uri: 'https://wcmcradiology.org/apps/legacy_api/test',
		//hostname: '67.244.2.107',
		method: 'POST',
		strictSSL:false,
		rejectUnauthorized:false,
		form:{	
			username:username,
			password:password
		},
		headers: {
	        'content-type' : 'application/x-www-form-urlencoded'
	    }
	};

	request(options, function(error,res,body){
		// not currently using the 401 passed back from the central
		// auth server. We now serve our own 401 if user is 'null' from the
		// proxy

		if (res.statusCode == 401) {
			console.log('401 luls');
			//error = {error:401};
		}

		//console.log('in verifyUser');
		var user = JSON.parse(res.body);
		//console.log(error);
		//console.log(user);
		done(error, user);
	}); 

};

module.exports = ProxyStrategy;

