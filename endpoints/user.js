const express = require('express');
const router = express.Router();

var User = require('../model/user');

function updateUser(req, res, user) {
  var body = req.body;
  if (body.firstName) user.firstName = body.firstName;
  if (body.lastName) user.lastName = body.lastName;
  if (body.email) user.email = body.email;
  if (body.address) user.address = body.address;
  if (body.additionalAddress) user.additionalAddress = body.additionalAddress;
  if (body.postalCode) user.postalCode = body.postalCode;
  if (body.city) user.city = body.city;
  if (body.country) user.country = body.country;
  if (body.telephone) user.telephone = body.telephone;
  if (body.telemetricsId) user.telemetricsId = body.telemetricsId;
  user.save(function (err) {
    if (err) res.send(err);
    else res.json(user);
  });
}

function createUser(req, res) {
  var user = new User();
  updateUser(req, res, user);
}

router.post('/', function (req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) res.send(err);
    if (!user) createUser(req, res); 
    else updateUser(req, res, user);
  });
});

router.get('/', function(req, res) {
  User.findOne({email: req.query.email}, function(err, user) {
    if (err) res.send(err);
    else {
      res.json(user);
    }
  });
});

module.exports = router;
