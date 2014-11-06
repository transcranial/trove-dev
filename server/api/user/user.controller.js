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
        if (typeof data === "undefined") {
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

// Get count of all studies on a single date, by currentUser
exports.getNumberForACGME = function(req, res) {
    var cache_string = req.params.user + '/ACGME/' + req.params.study_index;
    var lifetime = 86400; 

    //hard-coded ACGME goals by study_index
    var exam_name_contains = '';
    var modalities = [];
    switch (parseInt(req.params.study_index)) {
        case 0:
            exam_name_contains = /CHEST/;
            modalities = [];
            break;
        case 1:
            exam_name_contains = /(CTA)|(MRA)|(ANGIO)/;
            modalities = ['CT', 'MRI'];
            break;
        case 2:
            exam_name_contains = /MAMMO/;
            modalities = [];
            break;
        case 3:
            exam_name_contains = /(ABD)|(PELVIS)/;
            modalities = ['CT'];
            break;
        case 4:
            exam_name_contains = /(ABD)|(PEL)/;
            modalities = ['US'];
            break;
        case 5:
            exam_name_contains = /BIOPSY/;
            modalities = [];
            break;
        case 6:
            exam_name_contains = /(FOOT)|(ANKLE)|(KNEE)|(HIP)/;
            modalities = ['MRI'];
            break;
        case 7:
            exam_name_contains = /BRAIN/;
            modalities = ['MRI'];
            break;
        case 8:
            exam_name_contains = /PET/;
            modalities = [];
            break;
        case 9:
            exam_name_contains = /(ABD)|(PEL)|(LIVER)|(MRCP)|(THIGH)|(LEG)|(ARM)|(HAND)|(EXT)/;
            modalities = ['MRI'];
            break;
        case 10:
            exam_name_contains = /SPINE/;
            modalities = ['MRI'];
            break;
    }

    return memcached.get(cache_string, function (err, data) {
        var criteria = {};
        if (err) { return handleError(res, err); }
        if (typeof data === "undefined") {

            if (modalities.length === 0) {
                criteria = {
                    assistant_radiologist: req.params.user,
                    exam_name: exam_name_contains
                };
            } else {
                criteria = {
                    assistant_radiologist: req.params.user,
                    exam_name: exam_name_contains,
                    modality: {$in: modalities}
                };
            }

            Study.count(criteria, function (err, count) {
                if (err) { return handleError(res, err); }
                if (typeof count === "undefined") { count = 0; }
                memcached.set(cache_string, count, lifetime, function (err) { });
                return res.json(count);
            });
        } else {
            return res.json(data);
        }
    });
};

function handleError(res, err) {
    return res.send(500, err);
}