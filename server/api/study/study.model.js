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
    transcribed_report : { type: String, default: null },
    finalzied_report : { type: String, default: null },

    levenshtein_distance : { type: Number, default: 0 },

    word_count : { type: Number, default: 0 },
    transcribed_word_count : { type: Number, default: 0},
    finalized_word_count : { type: Number, default: 0},

    service_code: { type: String, default: null },
    exam_name : { type: String, default: null },
    modality: { type: String, default: null },

    last_result_time: { type: Number, default: null },
    completed_time: { type: Number, default: null },
    scheduled_time: { type: Number, default: null },
    transcribed_time: { type: Number, default: null },
    finalized_time: { type: Number, default: null },

    last_result_date : { type : Date, default: null },
    observation_start_date : { type : Date, default: null },
    transcribed_date : { type : Date, default: null },
    completed_date : { type : Date, default: null },
    finalized_date : { type : Date, default: null },

    hl7_json_history : [String]
});

module.exports = mongoose.model('Study', StudySchema, 'studies');