'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*
var StudySchema = new Schema({
    radiologist: Number,
    exam_name: String,
    modality: String,
    word_count: Number,
    transcribed_time: Number
});
*/

var StudySchema = mongoose.Schema({
    accession : { type: String, default: null },
    // retro fields for for when we retroactively assign assistant_radiologist keys
    // as well as radiologist keys from our user collection
    assistant_radiologist : { type: Number, default: null },
    retro_assistant_radiologist : { type: String, default: null},
    radiologist : { type: Number, default: null },
    retro_radiologist : { type: String, default: null },

    report : { type: String, default: null },
    word_count : { type: Number, default: 0},
    service_code: { type: String, default: null },
    exam_name : { type: String, default: null },
    modality: { type: String, default: null },
    completed_time: { type: Number, default: null },
    scheduled_time: { type: Number, default: null },
    transcribed_time: { type: Number, default: null },
    observation_start_date : { type: Date, default: null },
    transcribed_date : { type: Date, default: null },
    completed_date : { type: Date, default: null }
});

module.exports = mongoose.model('Study', StudySchema, 'studies');