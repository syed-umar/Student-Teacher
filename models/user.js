// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local: {
        email: { type: 'string', unique : true },
        password: String,
        firstName: String,
        lastName: String,
        phone: String,
        skype: String,
        userType: { type: String, default: "student" }, //student, teacher
        isEvaluator: { type: String, default: "false" },
        prefered_lang: { type: String, default: "ch" },
        userID: { type: 'string', unique : true },
        screenName: String,
        weChatID: String,
        QQID: String,
        zipCode: String,
        comments: String,
        student_schoolName: String,
        student_guardianInfo: String,
        student_grade: String,
        teacher_availability: String,
        teacher_qualification: String,
        teacher_description: String,
        regDate: { type: Date, default: Date.now }
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);