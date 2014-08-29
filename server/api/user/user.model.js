'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    full_name: String,
    alt_name: String,
    userId: Number,
    username: String,
    minnies: { type: Number, default: 0 },
    badges: [{
        desc: String,
        number: Number,
        iconURL: String,
        dateAchieved: Date
    }]
});

module.exports = mongoose.model('User', UserSchema, 'users');