// app/models/classRegistration.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our class model
var classRegSchema = mongoose.Schema({
    students: [],
    teachers: [],
    course_id: String,
    classID: String,
    startDate: Date,
    endDate: Date,
    classDay: String,
    startTime: String,
    duration: String,
    class_name: String
});

// methods ======================


module.exports = mongoose.model('ClassRegistration', classRegSchema);