'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StudySchema = new Schema({
    radiologist: Number,
    exam_name: String,
    modality: String,
    word_count: Number,
    transcribed_time: Number
});

module.exports = mongoose.model('Study', StudySchema, 'studies');