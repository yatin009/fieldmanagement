var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/register_user', function (req, res, next) {
    var user = new User(req.body);
    user.save(function (err, user) {
        if (err) {
            res.status(500).send('Was not able to create user. Please try again');
        }
        res.status(200).send('User profile created successfully');
    });
});

router.post('/login_user', function (req, res, next) {
    var user = new User(req.body);
    User.findOne({ username: user.username, password: user.password}, function (err, user) {
        if (err) {
            res.status(500).send('Unable to verify. Please try again.');
        }
        if (user) {
            console.log('%s %s is a %s.', user.username, user.password, user.email)
            console.log(user._id);
        }
        res.status(200).send(user);
    })
});


module.exports = router;
