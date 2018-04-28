const express = require('express');
const router = express.Router();
const _ = require('underscore');
const request = require('request');

var Challenge = require('../model/challenge');
var settings = require('../settings');

function getDriverScores(callback) {
  var options = {
    method: 'GET',
    url: 'https://csv.telematics.tomtom.com/extern',
    qs: {
      lang: 'eng',
      account: 'CM-Test',
      username: 'API',
      password: settings.telemetrics.password,
      apikey: settings.telemetrics.token,
      outputformat: 'json',
      action: 'showOptiDriveIndicator',
      range_pattern: 'w-3',
    },
  };

  request(options, function (error, response, body) {
    try {
      var json = JSON.parse(body);
      callback(null, json);
    } catch (e) {
      callback(e);
    }

  });
}

// Routes

router.get('/', function (req, res) {
  Challenge.find(function (err, challenges) {
    if (err) res.send(err);
    else res.json(challenges);
  });
});

router.post('/', function (req, res) {
  var challenge = new Challenge();
  challenge = _.extend(challenge, req.body);
  challenge.save(function (err) {
    if (err) res.send(err);
    else res.json({
      message: 'challenge created'
    });
  });
});

router.post('/close/', function (req, res) {
  var challengeId = req.body.challenge;
  Challenge.findOne({ _id: challengeId }, function (err, challenge) {

    var property = challenge.goal.property;
    var optimum = challenge.goal.highOrLow;

    getDriverScores(function (err, scores) {
      if (err) return req.statusCode(500).json(err);

      const compare = (a, b, comp) => comp === 'low' ? a < b : a > b;
      var best = scores.reduce((prev, curr) => compare(prev[property], curr[property], optimum) ? prev : curr);
      
      res.send(best);
    });

  });
});

module.exports = router;