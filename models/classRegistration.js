// app/models/classRegistration.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our class model
var classRegSchema = mongoose.Schema({
    students: [],
    teachers: [],
    class_id: String,
    classStartTime: String,
    classEndTime: String
});

// methods ======================


module.exports = mongoose.model('ClassRegistration', classRegSchema);