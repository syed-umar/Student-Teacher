var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var i18n = require('i18n-2')

//connect to db
var db = mongoose.connect('mongodb://localhost:27017/StudentTeacherDB');
// var db = mongoose.connect('mongodb://nodejitsu:827578fcbfc33e31bb2ef44d1342e88c@troup.mongohq.com:10066/nodejitsudb3278735468');

var app = express();

var cookiesession = require('cookie-session');
var session = require('express-session');

// required for passport
app.use(session({
    secret: 'secretkey',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash')
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('secret'));


i18n.expressBind(app, {
    locales: ['en', 'ch'],
    // set the default locale
    // defaultLocale: 'ch',
    defaultLocale: 'en',
    // set the cookie name
    cookieName: 'locale'
});

// set evaluator and admin
app.use(function(req, res, next) {

    // console.log(req.session.sessionLang);

    // language settings
    if (typeof req.session.sessionLang === "undefined") {
        req.i18n.setLocale('ch');

        if (typeof req.user !== "undefined") {
            if (req.user.local.prefered_lang == "ch") {
                req.i18n.setLocale('ch');
            } else if (req.user.local.prefered_lang == "en") {
                req.i18n.setLocale('en');
            }
        } else {
            req.i18n.setLocale('ch');
        }
    } else if (req.session.sessionLang && req.session.sessionLang == "ch") {
        req.i18n.setLocale('ch');
    } else if (req.session.sessionLang && req.session.sessionLang == "en") {
        req.i18n.setLocale('en');
    } 

    if (typeof req.user !== "undefined") {
        //set evaluator
        if (req.user.local.isEvaluator == "true") {
            res.locals.isEvaluator = true;
        } else {
            res.locals.isEvaluator = false;
        }

    } else {
        res.locals.isEvaluator = false;
    }

    if (req.session.isAdmin) {
        res.locals.isAdmin = true;
    }

    next();
});


//routes
// app.use('/', routes);
require('./routes/index')(app);
require('./routes/users')(app);
require('./routes/course')(app);
require('./routes/classReg')(app);
require('./routes/classSession')(app);
require('./routes/mainPage')(app);
require('./routes/wav')(app);

//Auth 
require('./config/passport')(app, passport);
require('./routes/passport')(app, passport);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/editclasses', express.static(__dirname + '/public'));
app.use('/classroom', express.static(__dirname + '/public'));
app.use('/adminEditUser', express.static(__dirname + '/public'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Make our db accessible to our router
app.use(function(req, res, next) {
    req.db = db;
    next();
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
