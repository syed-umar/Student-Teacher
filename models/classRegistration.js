// app/models/classRegistration.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our class model
var classRegSchema = mongoose.Schema({
    students: [String],
    teachers: [String],
    class_id: String,
    classStartTime: String,
    classEndTime: String,
    classID: String
});

// methods ======================


module.exports = mongoose.model('ClassRegistration', classRegSchema);