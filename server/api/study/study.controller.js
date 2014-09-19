'use strict';

var Study = require('./study.model');
var User = require('./../user/user.model')

var alternateModalityMapper = {
    'XR':/DX|XR/i,
    'FLUORO':/GI|GU|FLUORO/i
}

function getModality(modality) {
    return alternateModalityMapper[modality] || new RegExp(".*"+modality+".*");
}

// Get all studies on a single date, by currentUser
exports.allStudiesOnDate = function(req, res) {
    Study.find({ 
        assistant_radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.date).getTime()),
            $lt: (new Date(req.params.date).getTime()) + 86400000
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
        assistant_radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.startDate).getTime()),
            $lt: (new Date(req.params.endDate).getTime()) + 86400000
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
        assistant_radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.date).getTime()),
            $lt: (new Date(req.params.date).getTime()) + 86400000
        },
        modality: getModality(req.params.modality)
    }, null, {sort: {transcribed_time: 1}}, function (err, studies) {
        if(err) { return handleError(res, err); }
        if(!studies) { return res.send(404); }
        return res.json(studies);
    });
};

// Get studies for specified modality between two dates, by currentUser
exports.modalityStudiesBetweenDates = function(req, res) {
    Study.find({ 
        assistant_radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.startDate).getTime()),
            $lt: (new Date(req.params.endDate).getTime()) + 86400000
        },
        modality: getModality(req.params.modality)
    }, function (err, studies) {
        if(err) { return handleError(res, err); }
        if(!studies) { return res.send(404); }
        return res.json(studies);
    });
};

// Get count of all studies on a single date, by currentUser
exports.allStudiesOnDateCount = function(req, res) {
    Study.count({ 
        assistant_radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.date).getTime()),
            $lt: (new Date(req.params.date).getTime()) + 86400000
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
        assistant_radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.startDate).getTime()),
            $lt: (new Date(req.params.endDate).getTime()) + 86400000
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
        assistant_radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.date).getTime()),
            $lt: (new Date(req.params.date).getTime()) + 86400000
        },
        modality: getModality(req.params.modality)
    }, function (err, count) {
        if(err) { return handleError(res, err); }
        if(!count) { return res.json(0) }
        return res.json(count);
    });
};

// Get count of studies for specified modality between two dates, by currentUser
exports.modalityStudiesBetweenDatesCount = function(req, res) {
    Study.count({ 
        assistant_radiologist: req.params.user,
        transcribed_time: { 
            $gte: (new Date(req.params.startDate).getTime()),
            $lt: (new Date(req.params.endDate).getTime()) + 86400000
        },
        modality: getModality(req.params.modality)
    }, function (err, count) {
        if(err) { return handleError(res, err); }
        if(!count) { return res.json(0) }
        return res.json(count);
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
            // arbitrarily assigning radiologists to 0 for now
            current_study['radiologist'] = 0;
        }

        // populateStudy will technically overwrite old values with the current
        // populateStudy will assign values as specified from the req.body
        populateStudy(current_study, req.body);

        if (!temp_assistant_radiologist_string && req.body['report']) { 
            temp_assistant_radiologist_string = parseAssistantRadiologistFromReport(req.body['report']);
            console.log('temp assistant radiologist string second pass');
            console.log(temp_assistant_radiologist_string);
        }

        // Adding this to retroactively populate studies for users who have not been yet added to the db
        current_study['retro_assistant_radiologist'] = temp_assistant_radiologist_string;
        current_study['retro_radiologist'] = temp_radiologist_string;
        current_study['word_count'] = getWordCount(req.body['report']);
        console.log(current_study['word_count']);

        User.findOne({ 
            full_name : temp_assistant_radiologist_string 
        }, function(err, user) {
            // assuming all users exist already
            // if they do not currently exist in the db, they are assigned the id of 0
            if (user) {
                console.log('resident found');
                console.log(user);
                current_study['assistant_radiologist'] = user['userId'];
            } else {
                console.log('no resident found for accession' + req.body.accession.replace(/-\d+/,""));
                current_study['assistant_radiologist'] = 0;
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

            if (result_status == 'P') {
                var transcribed_date = convertHL7DateToJavascriptDate(req.body['result_time']);
                current_study['transcribed_date'] = transcribed_date;
                current_study['transcribed_time'] = transcribed_date.getTime();
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