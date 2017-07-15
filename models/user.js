/**
 * Created by yatin on 14/07/17.
 */
var mongoose = require('mongoose');
var schema = mongoose.Schema;

// Create the schema used for the Login model
var userSchema = new schema({
    username:           String,
    password:           String,
    email:          String,
}, {autoIndex: false});

// Create a Staff model
var User = mongoose.model("User", userSchema);

module.exports = User;
