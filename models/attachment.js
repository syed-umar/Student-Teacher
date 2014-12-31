// app/models/class.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our class model
var attachmentSchema = mongoose.Schema({
    user_id: String,
    fileName: String,
    file: String 
});

// methods ======================


module.exports = mongoose.model('attachment', attachmentSchema);