// app/models/class.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our class model
var courseSchema = mongoose.Schema({
    courseName: String,
    courseCategory: String,
    schoolName: String,
    description: String,
    packageName: String,
    courseID: String,
    numberof: String
});

// methods ======================


module.exports = mongoose.model('Course', courseSchema);