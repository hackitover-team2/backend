var settings = require('../settings');

// dependencies

const express = require('express');
const router = express.Router();
const _ = require('underscore');
const request = require('request');

// models

var Challenge = require('../model/challenge');
var User = require('../model/user');

// Routes

router.get('/', function (req, res) {
  User.find(function (err, users) {
    if (err) res.send(err);
    else {
        const compare = (a, b) => a.length < b.length;
        const property = "wonChallenges"
        res.json(
            users.sort((prev, curr) => compare(prev[property], curr[property]))
        );
    }
  });
});


module.exports = router;