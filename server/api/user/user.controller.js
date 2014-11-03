'use strict';

var User = require('./user.model');
var Study = require('../study/study.model');
var badges = require('./badges');

var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211');

exports.getInfo = function(req, res) {
    User.findOne({ 
        username: req.params.username
    }, 'full_name alt_name userId username', function (err, user) {
        if(err) { return handleError(res, err); }
        if(!user) { return res.send(404); }
        return res.json(user);
    });
};

exports.getMinnies = function(req, res) {
    var cache_string = req.params.user + '/minnies';
    var lifetime = 3600;
    
    return memcached.get(cache_string, function (err, data) {
        if(err) { return handleError(res, err); }
        if (!data) {
            User.findOne({ 
                username: req.params.username
            }, 'userId minnies', function (err, user) {
                if(err) { return handleError(res, err); }
                if(!user) { return res.send(404); }
                return Study.find({
                    assistant_radiologist: parseInt(user.userId)
                }, 'word_count', function (err, studies) {
                    if(err) { return handleError(res, err); }
                    if(!studies) { return res.send(404); }

                    var minnies = 0;
                    for (var i=0; i<studies.length; i++) {
                        minnies += studies[i].word_count / 10;
                    }
                    minnies = Math.round(minnies);
                    if (user.minnies !== minnies) {
                        user.minnies = minnies;
                        user.save();
                    }

                    memcached.set(cache_string, minnies, lifetime, function (err) { });
                    return res.json(minnies);
                });
            });
        } else {
            return res.json(data);
        }
    });
    
};

exports.updateBadges = function(req, res) {
    User.findOne({ 
        username: req.params.username
    }, function (err, user) {
        if(err) { return handleError(res, err); }
        if(!user) { return res.send(404); }

        var success = true;
        success = success && badges.modalityNumberBadges(user);
        return res.json(success);
    });
};

exports.getBadges = function(req, res) {
    User.findOne({ 
        username: req.params.username
    }, 'badges', function (err, user) {
        if(err) { return handleError(res, err); }
        if(!user) { return res.send(404); }

        return res.json(user.badges);
    });
};

function handleError(res, err) {
    return res.send(500, err);
}