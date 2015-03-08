// app/models/classRegistration.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our class model
var audioFileSchema = mongoose.Schema({
    student_id: String,
    audioFile: String,
    score: String,
    status: String, // New, in evaluation, scored
    added: Date
});

// methods ======================


module.exports = mongoose.model('AudioFile', audioFileSchema);