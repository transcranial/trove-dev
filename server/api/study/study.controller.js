'use strict';

var Study = require('./study.model');
var User = require('./../user/user.model');

var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211');

var modalityMapper = require('./../modalityMapper');

function getTodayDateFormatted() {
    var today = new Date();
    return (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
}

function formatReports(studies) {
    var studiesFormatted = studies;
    for (var i = 0; i < studies.length; i++) {
        studiesFormatted[i].report = JSON.stringify(studiesFormatted[i].report.replace(/(\|)|(\s+)/g, " ").trim()).replace(/^"?(.+?)"?$/g, '$1');
        studiesFormatted[i].transcribed_report = JSON.stringify(studiesFormatted[i].transcribed_report.replace(/(\|)|(\s+)/g, " ").trim()).replace(/^"?(.+?)"?$/g, '$1');
    }
    return studiesFormatted;
}

// Get all studies on a single date, by currentUser
exports.allStudiesOnDate = function(req, res) {
    var cache_string = req.params.user + '/ALL/' + req.params.date;
    var lifetime = (new Date(getTodayDateFormatted()).getTime() === new Date(req.params.date).getTime()) ? 3600 : 0; // keep forever in cache if date already past
    return memcached.get(cache_string, function (err, data) {
        if(err) { return handleError(res, err); }
        if (!data) {
            Study.find({ 
                assistant_radiologist: req.params.user,
                transcribed_time: { 
                    $gte: (new Date(req.params.date).getTime()),
                    $lt: (new Date(req.params.date).getTime()) + 86400000
                }
            }, 'modality exam_name transcribed_time transcribed_report report', {sort: {transcribed_time: 1}}, function (err, studies) {
                if(err) { return handleError(res, err); }
                if(!studies) { return res.send(404); }
                memcached.set(cache_string, studies, lifetime, function (err) { });
                return res.json(formatReports(studies));
            });
        } else {
            return res.json(formatReports(data));
        }
    });
};

// Get all studies between two dates, by currentUser
exports.allStudiesBetweenDates = function(req, res) {
    var cache_string = req.params.user + '/ALL/' + req.params.startDate + '/' + req.params.endDate;
    var lifetime = (new Date(getTodayDateFormatted()).getTime() === new Date(req.params.startDate).getTime() || new Date(getTodayDateFormatted()).getTime() === new Date(req.params.endDate).getTime()) ? 3600 : 0; // keep forever in cache if date already past
    return memcached.get(cache_string, function (err, data) {
        if(err) { return handleError(res, err); }
        if (!data) {
            Study.find({ 
                assistant_radiologist: req.params.user,
                transcribed_time: { 
                    $gte: (new Date(req.params.startDate).getTime()),
                    $lt: (new Date(req.params.endDate).getTime()) + 86400000
                }
            }, function (err, studies) {
                if(err) { return handleError(res, err); }
                if(!studies) { return res.send(404); }
                memcached.set(cache_string, studies, lifetime, function (err) { });
                return res.json(formatReports(studies));
            });
        } else {
            return res.json(formatReports(data));
        }
    });
};

// Get studies for specified modality on a single date, by currentUser
exports.modalityStudiesOnDate = function(req, res) {
    var cache_string = req.params.user + '/' + req.params.modality + '/' + req.params.date;
    var lifetime = (new Date(getTodayDateFormatted()).getTime() === new Date(req.params.date).getTime()) ? 3600 : 0; // keep forever in cache if date already past
    return memcached.get(cache_string, function (err, data) {
        if(err) { return handleError(res, err); }
        if (!data) {
            Study.find({ 
                assistant_radiologist: req.params.user,
                transcribed_time: { 
                    $gte: (new Date(req.params.date).getTime()),
                    $lt: (new Date(req.params.date).getTime()) + 86400000
                },
                modality: modalityMapper.map(req.params.modality)
            }, null, {sort: {transcribed_time: 1}}, function (err, studies) {
                if(err) { return handleError(res, err); }
                if(!studies) { return res.send(404); }
                memcached.set(cache_string, studies, lifetime, function (err) { });
                return res.json(formatReports(studies));
            });
        } else {
            return res.json(formatReports(data));
        }
    });
};

// Get studies for specified modality between two dates, by currentUser
exports.modalityStudiesBetweenDates = function(req, res) {
    var cache_string = req.params.user + '/' + req.params.modality + '/' + req.params.startDate + '/' + req.params.endDate;
    var lifetime = (new Date(getTodayDateFormatted()).getTime() === new Date(req.params.startDate).getTime() || new Date(getTodayDateFormatted()).getTime() === new Date(req.params.endDate).getTime()) ? 3600 : 0; // keep forever in cache if date already past
    return memcached.get(cache_string, function (err, data) {
        if(err) { return handleError(res, err); }
        if (!data) {
            Study.find({ 
                assistant_radiologist: req.params.user,
                transcribed_time: { 
                    $gte: (new Date(req.params.startDate).getTime()),
                    $lt: (new Date(req.params.endDate).getTime()) + 86400000
                },
                modality: modalityMapper.map(req.params.modality)
            }, function (err, studies) {
                if(err) { return handleError(res, err); }
                if(!studies) { return res.send(404); }
                memcached.set(cache_string, studies, lifetime, function (err) { });
                return res.json(formatReports(studies));
            });
        } else {
            return res.json(formatReports(data));
        }
    });
};

// Get count of all studies on a single date, by currentUser
exports.allStudiesOnDateCount = function(req, res) {
    var cache_string = req.params.user + '/ALL/' + req.params.date + '/count';
    var lifetime = (new Date(getTodayDateFormatted()).getTime() === new Date(req.params.date).getTime()) ? 3600 : 0; // keep forever in cache if date already past
    return memcached.get(cache_string, function (err, data) {
        if (err) { return handleError(res, err); }
        if (typeof data === "undefined") {
            Study.count({ 
                assistant_radiologist: req.params.user,
                transcribed_time: { 
                    $gte: (new Date(req.params.date).getTime()),
                    $lt: (new Date(req.params.date).getTime()) + 86400000
                }
            }, function (err, count) {
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

// Get count of all studies between two dates, by currentUser
exports.allStudiesBetweenDatesCount = function(req, res) {
    var cache_string = req.params.user + '/ALL/' + req.params.startDate + '/' + req.params.endDate + '/count';
    var lifetime = (new Date(getTodayDateFormatted()).getTime() === new Date(req.params.startDate).getTime() || new Date(getTodayDateFormatted()).getTime() === new Date(req.params.endDate).getTime()) ? 3600 : 0; // keep forever in cache if date already past
    return memcached.get(cache_string, function (err, data) {
        if (typeof data === "undefined") {
            Study.count({ 
                assistant_radiologist: req.params.user,
                transcribed_time: { 
                    $gte: (new Date(req.params.startDate).getTime()),
                    $lt: (new Date(req.params.endDate).getTime()) + 86400000
                }
            }, function (err, count) {
                if(err) { return handleError(res, err); }
                if (typeof count === "undefined") { count = 0; }
                memcached.set(cache_string, count, lifetime, function (err) { });
                return res.json(count);
            });
        } else {
            return res.json(data);
        }
    });
};

// Get count of studies for specified modality on a single date, by currentUser
exports.modalityStudiesOnDateCount = function(req, res) {
    var cache_string = req.params.user + '/' + req.params.modality + '/' + req.params.date + '/count';
    var lifetime = (new Date(getTodayDateFormatted()).getTime() === new Date(req.params.date).getTime()) ? 3600 : 0; // keep forever in cache if date already past
    return memcached.get(cache_string, function (err, data) {
        if (typeof data === "undefined") {
            Study.count({ 
                assistant_radiologist: req.params.user,
                transcribed_time: { 
                    $gte: (new Date(req.params.date).getTime()),
                    $lt: (new Date(req.params.date).getTime()) + 86400000
                },
                modality: modalityMapper.map(req.params.modality)
            }, function (err, count) {
                if(err) { return handleError(res, err); }
                if (typeof count === "undefined") { count = 0; }
                memcached.set(cache_string, count, lifetime, function (err) { });
                return res.json(count);
            });
        } else {
            return res.json(data);
        }
    });
};

// Get count of studies for specified modality between two dates, by currentUser
exports.modalityStudiesBetweenDatesCount = function(req, res) {
    var cache_string = req.params.user + '/' + req.params.modality + '/' + req.params.startDate + '/' + req.params.endDate + '/count';
    var lifetime = (new Date(getTodayDateFormatted()).getTime() === new Date(req.params.startDate).getTime() || new Date(getTodayDateFormatted()).getTime() === new Date(req.params.endDate).getTime()) ? 3600 : 0; // keep forever in cache if date already past
    return memcached.get(cache_string, function (err, data) {
        if (typeof data === "undefined") {
            Study.count({ 
                assistant_radiologist: req.params.user,
                transcribed_time: { 
                    $gte: (new Date(req.params.startDate).getTime()),
                    $lt: (new Date(req.params.endDate).getTime()) + 86400000
                },
                modality: modalityMapper.map(req.params.modality)
            }, function (err, count) {
                if(err) { return handleError(res, err); }
                if (typeof count === "undefined") { count = 0; }
                memcached.set(cache_string, count, lifetime, function (err) { });
                return res.json(count);
            });
        } else {
            return res.json(data);
        }
    });
};

exports.processHL7JSON = function(req, res) {
    function getWordCount(report) {
        if (report) {
            var temp_report_array = report.split('|').slice(8);
            //var temp_report_array = temp_report_array.slice(0,temp_report_array.length-6);
            return temp_report_array.slice(0,temp_report_array.length-6).join(" ").split(/\s+/).length;
        } else {
            return 0;
        }
    }

    function getRadiologist(name) {
        var raw_name = name.replace('MD','').trim();
        var raw_name_array = raw_name.split(',');
        return (raw_name_array[1] + ' ' + raw_name_array[0]).trim();
    }

    function convertHL7DateToJavascriptDate(date_string) {
        if (date_string) {
            var year = date_string.slice(0,4);
            var month = String(parseInt(date_string.slice(4,6)) - 1);
            var date = date_string.slice(6,8);
            var hour = date_string.slice(8,10);
            var minutes = date_string.slice(10,12);
            var seconds = date_string.slice(12,14);
            var temp_date = new Date(year,month,date,hour,minutes,seconds);
            //return getUTCDate(temp_date);
            // it would appear that these times are already stored in UTC format
            return temp_date;
        }
    }

    function parseAssistantRadiologistFromReport(report) {
        var regex = /.*Prepared\sBy:(.*?)\|/;
        var match = regex.exec(report);
        var radiologist = getRadiologist(match[1])
        return radiologist || '';
    }

    function populateStudy(study,request_body) {
        study['modality']            = request_body['modality'].trim();
        study['service_description'] = request_body['service_description'].trim();
        study['service_code']        = request_body['service_code'].trim();
        study['report']              = request_body['report'].trim();
        study['accession']           = request_body['accession'].replace(/-\d+/,"").trim();
        study['service_code']        = request_body['service_code'].trim();
        study['exam_name']           = request_body['service_description'].trim();
    }

    var temp_radiologist_string = getRadiologist(req.body['radiologist']);
    var temp_assistant_radiologist_string = getRadiologist(req.body['assistant_radiologist']);
    var result_status = req.body['result_status'];

    var current_study = null;

    Study.findOne({
        accession:req.body.accession.replace(/-\d+/,""),
    },function (err, study) {
        if(err) { return handleError(res, err); }

        if(study) { 
            current_study = study;
        } else {
            current_study = new Study();
        }

        // need to check if these match -- the report rad name and the name stored in the hl7_json
        if (!temp_assistant_radiologist_string && req.body['report']) { 
            temp_assistant_radiologist_string = parseAssistantRadiologistFromReport(req.body['report']);
        }

        // Adding this to retroactively populate studies for users who have not been yet added to the db
        current_study['retro_assistant_radiologist'] = temp_assistant_radiologist_string;
        current_study['retro_radiologist'] = temp_radiologist_string;
        current_study['word_count'] = getWordCount(req.body['report']);

        User.findOne({ 
            full_name : temp_assistant_radiologist_string 
        }, function(err, user) {
            // assuming all users exist already
            // if they do not currently exist in the db, they are assigned the id of 0
            if (user) {
                console.log('resident found');
                current_study['assistant_radiologist'] = user['userId'];
            } else {
                console.log('no resident found for accession' + req.body.accession.replace(/-\d+/,""));
                // current_study['assistant_radiologist'] = 0;
            }

            // This is an incorrect assumption for loading data from James-mirth
            // Things will populate and save in an asynchronous manner
            // populateStudy will technically overwrite old values with the current
            // populateStudy will assign values as specified from the req.body
            // current_study['hl7_json_history'].push(JSON.stringify(req.body));

            if (req.body['result_time']) {
                var current_result_date = convertHL7DateToJavascriptDate(req.body['result_time']);
                var current_result_time = current_result_date.getTime();
                if ((current_study['last_result_time'] || 0) < current_result_time) {
                    current_study['last_result_date'] = current_result_date;
                    current_study['last_result_time'] = current_result_time;
                    console.log('update all values?');
                    // overwrite old values since the message is newer than the last stored update
                    // this method will most likely never be called more than once each time this route is fired,
                    // although it is shown to be called to populate a newly created study
                    populateStudy(current_study, req.body);

                   
                }
            }    

            if (req.body['scheduled_time']) {
                var scheduled_date = convertHL7DateToJavascriptDate(req.body['scheduled_time']);
                current_study['scheduled_date'] = scheduled_date;
                current_study['scheduled_time'] = scheduled_date.getTime();
            }

            if (req.body['completed_time']) {
                var completed_date = convertHL7DateToJavascriptDate(req.body['completed_time']);
                current_study['completed_date'] = completed_date;
                current_study['completed_time'] = completed_date.getTime();
            }

            // TODO: Workout better logic regarding how these get updated. As it is, a finalized json could come in before
            // a transcribed json
            if (result_status == 'P') {
                var transcribed_date = convertHL7DateToJavascriptDate(req.body['result_time']);
                current_study['transcribed_report'] = req.body['report'];
                current_study['transcribed_date'] = transcribed_date;
                current_study['transcribed_time'] = transcribed_date.getTime();
                current_study['transcribed_word_count'] = current_study['word_count'];
            }

            if (result_status == 'F') {
                var finalized_date = convertHL7DateToJavascriptDate(req.body['result_time']);
                current_study['finalized_report'] = req.body['report'];
                current_study['finalized_date'] = finalized_date;
                current_study['finalized_time'] = finalized_date.getTime();
                current_study['finalized_word_count'] = current_study['word_count'];
            }

            current_study.save();
        });
    });

    // just to send something back to numeria-mirth 
    res.json(req.body);
}

function handleError(res, err) {
    return res.send(500, err);
}