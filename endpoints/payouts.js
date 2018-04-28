const express = require('express');
const router = express.Router();
const request = require('request');

var settings = require('../settings.js');
var User = require('../model/user');
var createPayouts = require('../model/payouts').createPayouts;
var getPayouts = require('../model/payouts').getPayouts;

router.post('/', function (req, res) {
  User.find({
    email: req.body.email
  }, function (err, user) {
    if (err) console.log(err);
    else {
      createPayouts(user, req, res);
    }
  });
});

router.get('/', function (req, res) {
  User.find({
    email: req.body.email
  }, function (err, user) {
    if (err) console.log(err);
    if (user.length === 0) res.send('unknown user');
    else {
      getPayouts(user, req, res);
    }
  });
});

module.exports = router;
