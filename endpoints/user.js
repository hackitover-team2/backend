import { createSecureServer } from 'http2';

const express = require('express');
const router = express.Router();

var User = require('../model/user');

function updateUser(req, res, user) {
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.address = req.body.address;
  user.additionalAddress = req.body.additionalAddress;
  user.postalCode = req.body.postalCode;
  user.city = req.body.city;
  user.country = req.body.country;
  user.telephone = req.body.telephone;
  user.save(function (err) {
    if (err) res.send(err);
    else res.json({
      message: 'user created'
    });
  });
}

function createUser(req, res) {
  var user = new User();
  updateUser(req, res, user);
}

router.post('/', function (req, res) {
  User.find({email: req.body.email}, function(err, user) {
    if (err) res.send(err);
    if (user.length === 0) createUser(req, res);
    else updateUser(req, res, user);
  });
});

router.get('/', function(req, res) {
  User.find({email: req.body.email}, function(err, user) {
    if (err) res.send(err);
    else {

    }
  });
});

module.exports = router;
