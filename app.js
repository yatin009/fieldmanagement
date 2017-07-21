'use strict';

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let cors = require('cors');

let index = require('./routes/index');
let users = require('./routes/users');
let dashboard = require('./routes/dashboard');

let compression = require('compression');
let helmet = require('helmet');
let uuid = require('uuid');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let url = require('url');

require('dotenv').config({path: './secret.env'})

let app = express();

let environment = app.get('env');

if (environment == 'production') {
    
    app.set('trust proxy', 1);

    app.use(function(req, res, next) {

        if (!req.secure) {

            let fullUrl = url.format({
                protocol: req.protocol,
                host: req.get('host'),
                pathname: req.originalUrl
            });

            res.redirect(fullUrl(req).replace('http:', 'https:'));
        }
    });

}

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
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

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
    res.locals.error = environment === 'development' ? err : {};

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
    databaseHost = 'Openshift V2';
}
// Mongolab URL
if (!mongoURL && process.env.MLAB_USER) {
    mongoURL = `mongodb://${process.env.MLAB_USER}:${process.env.MLAB_PASSWORD}`
             + `@ds159662.mlab.com:59662/fieldmangement`;
    databaseHost = 'mlab';
}

if (!mongoURL) {
    mongoURL = `mongodb://127.0.0.1:27017/fieldmanagement`; // Local Node.js, local DB
    databaseHost = 'local';
}

mongoose.Promise = global.Promise;
mongoose.connect(mongoURL, {
    useMongoClient: true
});
mongoose.connection.once('connected', function() {

    console.log(`Connected to database hosted on ${databaseHost}`);

    let sess = {
        name: 'field_management',
        genid: function(req) {
            return uuid.v1(); // use unique id for sessions
        },
        secret: 'Signed by ryan652',
        resave: true,
        saveUninitialized: true,
        rolling: true,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            autoRemove: 'interval',
            autoRemoveInterval: 30 // 30 mins
        }),
        unset: 'destroy',
        cookie: {
            secure: false,
            httpOnly: false,
            //expires: new Date(Date.now() + 30 * 60 * 1000), // 30 mins
            maxAge: 30 * 60 * 1000 // 30 mins
        }
    }

    if (process.env.IS_SECURE === '1') {
        sess.cookie.secure = true; // serve secure cookies
        sess.cookie.httpOnly = true;
    }

    app.use(session(sess));

});

module.exports = app;
