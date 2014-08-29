'use strict';

var express = require('express');
var security = require('./security');

var router = express.Router();


// Security and authentication
security.initialize('https://10.177.152.33/test');
// this is a proxy to the login server
router.post('/login', security.login);
router.post('/logout', security.logout);
router.get('/current-user', security.sendCurrentUser);


module.exports = router;