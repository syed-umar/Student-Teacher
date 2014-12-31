// app/models/class.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our class model
var classSchema = mongoose.Schema({
    className: String,
    classCategory: String,
    schoolName: String,
    description: String,
    packageName: String,
    classID: String	
});

// methods ======================


module.exports = mongoose.model('Class', classSchema);