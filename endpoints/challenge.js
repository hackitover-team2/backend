const express = require('express');
const router = express.Router();

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

module.exports = router;