'use strict';

var Study = require('./study.model');

// Get all studies on a single date, by currentUser
exports.allStudiesOnDate = function(req, res) {
    Study.find({ 
        radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.date).valueOf()) / 1000,
            $lt: (new Date(req.params.date).valueOf()) / 1000 + 86400
        }
    }, null, {sort: {transcribed_time: 1}}, function (err, studies) {
        if(err) { return handleError(res, err); }
        if(!studies) { return res.send(404); }
        return res.json(studies);
    });
};

// Get all studies between two dates, by currentUser
exports.allStudiesBetweenDates = function(req, res) {
    Study.find({ 
        radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.startDate).valueOf()) / 1000,
            $lt: (new Date(req.params.endDate).valueOf()) / 1000 + 86400
        }
    }, function (err, studies) {
        if(err) { return handleError(res, err); }
        if(!studies) { return res.send(404); }
        return res.json(studies);
    });
};

// Get studies for specified modality on a single date, by currentUser
exports.modalityStudiesOnDate = function(req, res) {
    Study.find({ 
        radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.date).valueOf()) / 1000,
            $lt: (new Date(req.params.date).valueOf()) / 1000 + 86400
        },
        modality: req.params.modality
    }, null, {sort: {transcribed_time: 1}}, function (err, studies) {
        if(err) { return handleError(res, err); }
        if(!studies) { return res.send(404); }
        return res.json(studies);
    });
};

// Get studies for specified modality between two dates, by currentUser
exports.modalityStudiesBetweenDates = function(req, res) {
    Study.find({ 
        radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.startDate).valueOf()) / 1000,
            $lt: (new Date(req.params.endDate).valueOf()) / 1000 + 86400
        },
        modality: req.params.modality
    }, function (err, studies) {
        if(err) { return handleError(res, err); }
        if(!studies) { return res.send(404); }
        return res.json(studies);
    });
};

// Get count of all studies on a single date, by currentUser
exports.allStudiesOnDateCount = function(req, res) {
    Study.count({ 
        radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.date).valueOf()) / 1000,
            $lt: (new Date(req.params.date).valueOf()) / 1000 + 86400
        }
    }, function (err, count) {
        if(err) { return handleError(res, err); }
        if(!count) { return res.json(0) }
        return res.json(count);
    });
};

// Get count of all studies between two dates, by currentUser
exports.allStudiesBetweenDatesCount = function(req, res) {
    Study.count({ 
        radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.startDate).valueOf()) / 1000,
            $lt: (new Date(req.params.endDate).valueOf()) / 1000 + 86400
        }
    }, function (err, count) {
        if(err) { return handleError(res, err); }
        if(!count) { return res.json(0) }
        return res.json(count);
    });
};

// Get count of studies for specified modality on a single date, by currentUser
exports.modalityStudiesOnDateCount = function(req, res) {
    Study.count({ 
        radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.date).valueOf()) / 1000,
            $lt: (new Date(req.params.date).valueOf()) / 1000 + 86400
        },
        modality: req.params.modality
    }, function (err, count) {
        if(err) { return handleError(res, err); }
        if(!count) { return res.json(0) }
        return res.json(count);
    });
};

// Get count of studies for specified modality between two dates, by currentUser
exports.modalityStudiesBetweenDatesCount = function(req, res) {
    Study.count({ 
        radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.startDate).valueOf()) / 1000,
            $lt: (new Date(req.params.endDate).valueOf()) / 1000 + 86400
        },
        modality: req.params.modality
    }, function (err, count) {
        if(err) { return handleError(res, err); }
        if(!count) { return res.json(0) }
        return res.json(count);
    });
};

function handleError(res, err) {
    return res.send(500, err);
}