'use strict';

var express = require('express');
var passport = require('passport');
var ProxyStrategy = require('./proxy-strategy');
var fs = require('fs');
var app = express();

var filterUser = function(user) {
	if ( user ) {
		return {
			// TODO adjust user here to mongoose schema
			user : {
				id        : user._id.$oid,
				email     : user.email,
				firstName : user.firstName,
				lastName  : user.lastName,
				admin     : user.admin
			}
		};
	} else {
		return { user: null };
	}
};

var security = {
	initialize: function(url) {
		passport.use(new ProxyStrategy(url));
	},

	authenticationRequired: function(req, res, next) {
		if (req.isAuthenticated()) {
			next();
		} else {
			res.json(401, req.user);
		}
	},
	// this may be deprecated
	adminRequired: function(req,res,next) {
		if (req.user && req.user.admin) {
			next();
		} else {
			res.json(401, req.user);
		}
	},
	sendCurrentUser: function(req, res, next) {
		if (req.user) {
			res.json(200, req.user);
		} else {
			// no user found associated with this session
			res.json(404, req.user);
		}

	},
	login : function(req, res, next) {
		function authenticationFailed(err, user, info) {
			if (!user) { console.log('no user found'); return res.json(401,{}); }
			console.log('in login');
			console.log(user);
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				return res.json(200,user);
			});
		}

		return passport.authenticate('proxy', authenticationFailed)(req, res, next);
	},
	logout: function(req, res, next) {
		req.logout();
		res.send(204);
	}
};

module.exports = security;