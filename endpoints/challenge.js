var settings = require('../settings');

// dependencies

const express = require('express');
const router = express.Router();
const _ = require('underscore');
const request = require('request');

// models

var Challenge = require('../model/challenge');
var User = require('../model/user');

var createPayouts = require('../model/payouts').createPayouts;

// external

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

      const compare = (a, b, comp) => (comp === 'low') ? a > b : a < b;
      var best = scores.reduce((prev, curr) => compare(prev[property], curr[property], optimum) ? prev : curr);

      console.log(best);

      User.findOne({ telemetricsId: best.driverno }, function (err, user) {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(400).send('Winning user does not exist');

        user.wonChallenges.push(challenge._id);
        user.save(function (err) {
          if (err) return res.status(500).json(err);

          createPayouts(user, req, res);
        });
      });
    });

  });
});

router.post('/participate', function (req, res) {
  Challenge.findOne({ _id: req.body.challenge }, function (err, challenge) {
    if (err) res.send(err);
    else if (!challenge) res.send('no challenge called ' + req.body.challenge);
    else {

      User.findOne({ email: req.body.email }, function (err2, user) {

        if (challenge.participants.indexOf(user._id) === -1) {

          challenge.participants.push(user._id);
          challenge.save(function (err) {
            if (err) return res.status(500).send(err);

            user.participatingChallenges.push(challenge._id);
            user.save(function (err) {
              if (err) res.status(500).send(err);
              else res.json({ message: 'challenge accepted' });
            });

          });

        } else res.json({ message: 'challenge already accepted' });

      });

    }
  });
});

router.post('/leaderboard/', function (req, res) {
  var challengeId = req.body.challenge;
  Challenge.findOne({ _id: challengeId }, function (err, challenge) {

    var property = challenge.goal.property;
    var optimum = challenge.goal.highOrLow;

    getDriverScores(function (err, scores) {
      if (err) return req.statusCode(500).json(err);

      var source = scores.map(s => Object.assign({}, _.pick(s, property, 'drivername')));

      const compare = (a, b, comp) => (comp === 'low') ? a > b : a < b;
      source = source.sort((a, b) => compare(a[property], b[property], optimum));

      res.json(source);
    });

  });
});

module.exports = router;