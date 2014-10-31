var levenshtein = require('fast-levenshtein');
var async = require('async');
var _ = require('lodash');

function calcLevenshteinDist (report_1, report_2) {
    var distance = levenshtein.get(report_1, report_2);
    return distance;
}

function processReport (transcribed_report, report) {
    var footerIndexTranscribed = transcribed_report.toLowerCase().lastIndexOf("prepared by: ");
    var footerIndexFinal = report.toLowerCase().lastIndexOf("prepared by: ");
    var transcribed_report_processed = transcribed_report.substring(0, footerIndexTranscribed) + report.substring(footerIndexFinal);
    return transcribed_report_processed;
}

function formatReports(study) {
    var studyFormatted = study;
    studyFormatted.report = JSON.stringify(studyFormatted.report.replace(/(\|)|(\s+)/g, " ").trim()).replace(/^"?(.+?)"?$/g, '$1');
    studyFormatted.transcribed_report = JSON.stringify(studyFormatted.transcribed_report.replace(/(\|)|(\s+)/g, " ").trim()).replace(/^"?(.+?)"?$/g, '$1');
    return studyFormatted;
}

var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');

var i = 0;
var startTime = (new Date()).getTime();

// Open the connection to the server
var openDB = function (callback) {
    var mongoclient = new MongoClient(new Server("localhost", 27017), {native_parser: true});
    mongoclient.open(function(err, mongoclient) {
        return callback(null, mongoclient.db("trove-dev"));
    });
};

var getids = function (db, callback) {
    db.collection('studies').find({}, {fields:{'_id':1}}).toArray( function (err, ids) {
        return callback(null, db, ids, ids.length);
    });
};

var runupdates = function (db, ids, count, callback) {
    function updateItem (id, callback) {
        var report_1 = '',
            report_2 = '',
            dist = 0,
            studyFormatted;

        i += 1;

        db.collection('studies').findOne({'_id': new ObjectID(id._id.toString())}, function (err, study) {

            if (study.report !== null && study.transcribed_report !== null) {
                studyFormatted = formatReports(study);
                report_1 = studyFormatted.report;
                report_2 = processReport(studyFormatted.transcribed_report, studyFormatted.report);
                dist = calcLevenshteinDist(report_1, report_2);
            } else {
                dist = 0;
            }

            db.collection('studies').update({'_id': new ObjectID(id._id.toString())}, {$set:{'levenshtein_distance' : dist}}, function (err, update) {
                console.log( 'estimated time left: ' + Math.round(((new Date()).getTime() - startTime)*(count-i)/(1000*i)).toString() + ' seconds  |  ' + i.toString() + '/' + count.toString() + ': ' + dist.toString() );
                return callback(null, true);
            });

        });
    }

    async.mapSeries(ids, updateItem, function (err, results) { 
        if (err) { console.log(err); } 
        return callback(err, results);
    });
};

async.waterfall([openDB, getids, runupdates], function (err, results) {
    if (err) { 
        console.log(err); 
        process.exit(code=1);
    } 
    return process.exit(code=0);
});
