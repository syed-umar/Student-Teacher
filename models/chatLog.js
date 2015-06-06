// app/models/class.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our class model
var chatSchema = mongoose.Schema({
    sid: String,
    adminID: String,
    userID: String,
    log: []
});

// methods ======================


module.exports = mongoose.model('Chat', chatSchema);