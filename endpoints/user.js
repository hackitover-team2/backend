const express = require('express');
const router = express.Router();

var User = require('../model/user');

router.post('/', function (req, res) {
  var user = new User();
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
});

module.exports = router;
