'use strict';

var studyController = require('./../api/study/study.controller');

var userIds = ['348', '358', '338', '335', '337', '340', '347', '341', '257', '259', '264', '269', '274', '275', '279', '252', '253', '167', '162', '161', '169', '158', '187', '188', '173', '160', '57', '69', '68', '9', '118', '76', '128', '20', '251', '355'];

var modalities = ['CT', 'XR', 'NM', 'MRI', 'FLUORO', 'US'];

var diseases = require('./../api/diseaseICD9MapperRegex').keys;

function getTodayDateFormatted() {
    var today = new Date();
    return (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
}

function getWeekDatesFormatted() {
    var today = new Date();
    var dayOfTheWeek = today.getDay();
    if (dayOfTheWeek === 0) dayOfTheWeek = 7;
    var startDate = new Date();
    startDate.setDate(today.getDate() - dayOfTheWeek + 1);

    var dates = [];
    dates.push((startDate.getMonth()+1) + '-' + startDate.getDate() + '-' + startDate.getFullYear());
    for (var i = 1; i < 7; i++) {
        startDate.setDate(startDate.getDate() + 1);
        dates.push((startDate.getMonth()+1) + '-' + startDate.getDate() + '-' + startDate.getFullYear());
    }

    return dates;
}

/**
* Caches study disease counts
*/
var CronJob = require('cron').CronJob;
// runs jobs every day at 2:30 AM
new CronJob('00 30 02 * * *', function() {
    for (var i=0; i<userIds.length; i++) {
        for (var j=0; j<diseases.length; j++) {
            studyController.diseaseStudiesCount(
                { 
                    params: { 
                        user: userIds[i],
                        disease: diseases[j]
                    },
                    setCache: true
                },
                { 
                    send: function (statuscode, contents) {},
                    json: function (contents) {}
                }
            );
        }
    }
}, null, true);

/**
* Caches modalityStudiesBetweenDatesCount
*/
var CronJob = require('cron').CronJob;
// runs jobs every 6 hours
new CronJob('00 00 */6 * * *', function() {
    var todayDate = getTodayDateFormatted();
    var weekDates = getWeekDatesFormatted();

    for (var i=0; i<userIds.length; i++) {
        for (var k=0; k<weekDates.length; k++) {
            studyController.allStudiesOnDateCount(
                { 
                    params: { 
                        user: userIds[i],
                        date: weekDates[k]
                    },
                    setCache: true
                },
                { 
                    send: function (statuscode, contents) {},
                    json: function (contents) {}
                }
            );
        }
    }

    for (var i=0; i<userIds.length; i++) {
        for (var j=0; j<modalities.length; j++) {

            for (var k=0; k<weekDates.length; k++) {
                studyController.modalityStudiesOnDateCount(
                    { 
                        params: { 
                            user: userIds[i],
                            modality: modalities[j],
                            date: weekDates[k]
                        },
                        setCache: true
                    },
                    { 
                        send: function (statuscode, contents) {},
                        json: function (contents) {}
                    }
                );
            }

            studyController.modalityStudiesBetweenDatesCount(
                { 
                    params: { 
                        user: userIds[i],
                        modality: modalities[j],
                        startDate: weekDates[0],
                        endDate: weekDates[6]
                    },
                    setCache: true
                },
                { 
                    send: function (statuscode, contents) {},
                    json: function (contents) {}
                }
            );

        }
    }
}, null, true);