const express = require('express');
const router = express.Router();
const _ = require('underscore');

var User = require('../model/user');
const telematix = require('../external/telematix');

function updateUser(req, res, user) {
  var body = req.body;
  _.keys(body).filter(e => {if (e !== 'email') return e;}).forEach(e => {user[e] = body[e];});
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

router.get('/score', function(req, res) {
  User.findOne({email: req.query.email}, function(err, user) {
    if (err) res.send(err);
    else {
      // user.telemetricsId;
      
      telematix.getDriverScores(function (err, scores) {
        if (err) return req.statusCode(500).json(err);

        const byID = (element) => element.driverno==user.telemetricsId;

        console.log(scores);
        var userIndex = scores.findIndex(byID);
        res.json(scores[userIndex]);
      });


    }
  });
});


module.exports = router;
