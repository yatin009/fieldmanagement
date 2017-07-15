/**
 * Created by yatin on 14/07/17.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET dashboard. */
router.post('/', function (req, res, next) {
    var user = User(req.body);
    res.render('dashboard', {title: user.username});
});

// router.get('/', function (req, res, next) {
//     res.render('dashboard');
// });

module.exports = router;
