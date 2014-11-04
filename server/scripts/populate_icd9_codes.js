var async = require('async');
var _ = require('lodash');
var icd9ToDiseaseMapper = require('../api/icd9DiseaseMapper');
var accession_to_icd9_codes_table = require('./accession_to_icd9_codes');

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

var found_count = 0;
var	total_count = 0; 
//console.log(study_icd9_codes);
var regex = /(.*?)\{(.*?)\}/g;

var runupdates = function (db, ids, count, callback) {
    function updateItem (id, callback) {
        var report_1 = '',
            report_2 = '',
            dist = 0,
            studyFormatted;

        db.collection('studies').findOne({'_id': new ObjectID(id._id.toString())}, function (err, study) {
			var study_icd9_codes_string = accession_to_icd9_codes_table[study.accession];
			var match = null;
    		var cpt_codes = [];
    		var icd9_codes = [];
    		var disease_labels = [];
    		//console.log(study_icd9_codes_string);

        	if (study_icd9_codes_string != undefined) {
        		//parseCodes(study_icd9_codes);
				//console.log(study_icd9_codes_string);
				while (match = regex.exec(study_icd9_codes_string)) {
					cpt_codes.push(match[1].trim())
					icd9_codes = icd9_codes.concat(match[2].split(' '));
				}
				cpt_codes = _.uniq(cpt_codes);
				icd9_codes = _.uniq(icd9_codes)
                for (var i = 0; i < icd9_codes.length; i++) {
                    disease_labels.push(icd9ToDiseaseMapper.map(icd9_codes[i]));
                }
                disease_labels = _.uniq(disease_labels);

                found_count++;
				//console.log(cpt_codes);
				//console.log(icd9_codes);
                //console.log(disease_labels);
        	}

            total_count++;

			db.collection('studies').update({'_id': new ObjectID(id._id.toString())}, {$set:{'icd9_codes' : icd9_codes,'cpt_codes':cpt_codes,'disease_labels':disease_labels}}, function (err, update) {
                if (err) {
                    console.log(err) ;
                } 
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
	console.log('found_count: ' + String(found_count));
	console.log('count: ' + String(total_count));
	console.log('%: ' + String(found_count/total_count));
    if (err) { 
        console.log(err); 
        process.exit(code=1);
    } 
    return process.exit(code=0);
});
