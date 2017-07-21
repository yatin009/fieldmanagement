'use strict';

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
//let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let cors = require('cors');

let index = require('./routes/index');
let users = require('./routes/users');
let dashboard = require('./routes/dashboard');

let compression = require(`compression`);
let helmet = require(`helmet`);

require('dotenv').config({path: './secret.env'})

let app = express();

app.use(cors());

app.use(compression());
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/dashboard', dashboard);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

let mongoURL;
let databaseHost;
// Openshift V2 DB URL
if (process.env.OPENSHIFT_MONGODB_DB_USERNAME) {
    mongoURL = `mongodb://` +
            `${process.env.OPENSHIFT_MONGODB_DB_USERNAME}:` +
            `${process.env.OPENSHIFT_MONGODB_DB_PASSWORD}@` +
            `${process.env.OPENSHIFT_MONGODB_DB_HOST}:` +
            `${process.env.OPENSHIFT_MONGODB_DB_PORT}/` +
            process.env.OPENSHIFT_APP_NAME;
    databaseHost = "Openshift V2";
}
// Mongolab URL
if (!mongoURL) {
    mongoURL = `mongodb://${process.env.MLAB_USER}:${process.env.MLAB_PASSWORD}@ds159662.mlab.com:59662/fieldmangement`;
    databaseHost = "mlab";
}

if (!mongoURL) {
    mongoURL = `mongodb://127.0.0.1:27017/fieldmanagement`; // Local Node.js, local DB
    databaseHost = "local";
}

mongoose.Promise = global.Promise;
mongoose.connect(mongoURL, {
    useMongoClient: true
});
mongoose.connection.once('connected', function() {
    console.log(`Connected to database hosted by ${databaseHost}`);
});

module.exports = app;
