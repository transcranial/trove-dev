'use strict';

var userController = require('./../api/user/user.controller');

var usernames = ['akb7001', 'sae2007', 'jem9205', 'grl9017', 'trs7005', 'djh2004', 'jes9218', 'krc9028', 'ked9042', 'nob9027', 'gkr9002', 'jgb9001', 'jar9120', 'brd9049', 'knf9004', 'map9234', 'ekw9005', 'naa9045', 'heb2017', 'rac9069', 'ird7002', 'jai9018', 'chp9024', 'fas2002', 'apv7002', 'als9119', 'yhc9003', 'qdh2001', 'jjk9004', 'sak9068', 'zam7001', 'sun2003', 'kas7010', 'ajw9001', 'shm2024', 'lic9093'];

var userIds = ['348', '358', '338', '335', '337', '340', '347', '341', '257', '259', '264', '269', '274', '275', '279', '252', '253', '167', '162', '161', '169', '158', '187', '188', '173', '160', '57', '69', '68', '9', '118', '76', '128', '20', '251', '355'];


/**
* Updates user minnies
*/
var CronJob = require('cron').CronJob;
// runs jobs every day at 1:00 AM
new CronJob('00 00 01 * * *', function() {
    for (var i=0; i<usernames.length; i++) {
        userController.updateMinnies(
            { 
                params: { username: usernames[i] }
            },
            { 
                send: function (statuscode, contents) {}
            }
        );
    }
}, null, true);


/**
* Updates user badges
*/
var CronJob = require('cron').CronJob;
// runs jobs every day at 1:30 AM
new CronJob('00 30 01 * * *', function() {
    for (var i=0; i<usernames.length; i++) {
        userController.updateBadges(
            { 
                params: { username: usernames[i] }
            },
            { 
                send: function (statuscode, contents) {}
            }
        );
    }
}, null, true);


/**
* Updates user ACGME goals
*/
var CronJob = require('cron').CronJob;
// runs jobs every day at 2:00 AM
new CronJob('00 00 02 * * *', function() {
    for (var i=0; i<userIds.length; i++) {
        for (var j=0; j<=10; j++) {
            userController.getNumberForACGME(
                { 
                    params: { 
                        user: userIds[i],
                        study_index: j 
                    }
                },
                { 
                    send: function (statuscode, contents) {},
                    json: function (contents) {}
                }
            );
        }
    }
}, null, true);