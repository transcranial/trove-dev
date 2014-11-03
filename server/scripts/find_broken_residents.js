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

var getresidentids = function (db, callback) {
    db.collection('users').find({}, {fields:{'_id':0,'userId':1,'username':1,'full_name':1}}).toArray( function (err, ids) {
        return callback(null, db, ids, ids.length);
    });
};

var runupdates = function (db, ids, count, callback) {
    function updateItem (id, callback) {

        //console.log(parseInt(id.userId));
        var resident_id = parseInt(id.userId);
        db.collection('studies').count({'assistant_radiologist': resident_id}, function(err,count) {
            console.log(count);
            if (count == 0) {
                console.log(id);
            }
            return callback(null, true);
        });
        //console.log(count);


        /*
        db.collection('studies').update({'_id': new ObjectID(id._id.toString())}, {$set:{'icd9_codes' : icd9_codes,'cpt_codes':cpt_codes,'disease_labels':disease_labels}}, function (err, update) {
            if (err) {
                console.log(err) ;
            } 
        });

            return callback(null, true);
        });
        */
    }

    async.mapSeries(ids, updateItem, function (err, results) { 
        if (err) { console.log(err); } 
        return callback(err, results);
    });
    //return callback(err, results);
};

async.waterfall([openDB, getresidentids, runupdates], function (err, results) {
    /*
    console.log('undefined_count: ' + String(undefined_count));
    console.log('count: ' + String(total_count));
    console.log('%: ' + String(undefined_count/total_count));
    */
    if (err) { 
        console.log(err); 
        process.exit(code=1);
    } 
    return process.exit(code=0);
});
