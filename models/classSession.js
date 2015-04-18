var mongoose = require('mongoose');

// define the schema for our class model
var classSessionSchema = mongoose.Schema({
    classID: String,
    sessionID: String,
    sessionDate: String, 
    startTime: String, 
    duration: String, 
    comments: String,
    notification: String
});

// methods ======================

classSessionSchema.methods.randomStr = function() {
    var Str = '';
    var availableSymbols = "abcdefghijklmnopqrstuvwxyz0987654321";
    for (var i = 0; i < 6; i++) {
        var symbol = availableSymbols[(Math.floor(Math.random() * availableSymbols.length))];
        Str += symbol;
    }
    return Str;
}

module.exports = mongoose.model('ClassSession', classSessionSchema);