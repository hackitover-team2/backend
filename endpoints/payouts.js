const express = require('express');
const router = express.Router();
const request = require('request');

var settings = require('../settings.js');
var User = require('../model/user');

router.post('/', function (req, res) {
  User.find({
    email: req.body.email
  }, function (err, user) {
    if (err) console.log(err);
    else {
      var options = {
        method: 'POST',
        url: settings.payouts.url,
        headers: {
          'Cache-Control': 'no-cache',
          bearer: settings.payouts.token,
          'Content-Type': 'application/json'
        },
        body: {
          paymentProfileId: '7dy2ie6q6oekb7idvsb5fm6r',
          amount: {
            currency: 'EUR'
          },
          language: 'de',
          dueAt: '2018-04-29T14:35:33.274740859Z',
          contactMethod: 'Export',
          securityQuestions: [{
            question: 'What was the name of your first pet?',
            answer: 'Oscar'
          }],
          remittanceInfo: 'Lorem Ipsum'
        },
        json: true
      };


      options.url = settings.payouts.url;
      options.url = settings.payouts.url;
      options.body.recipientDetails = user;
      options.body.recipientText = req.body.text;
      options.body.amount.amount = req.body.amount;


      request(options, function (err, response, body) {
        if (err) res.json({
          err: err
        });
        else res.json({
          message: 'ok'
        });
      });
    }
  });
});

router.get('/', function (req, res) {
  var options = {
    method: 'GET',
    url: settings.payouts.url,
    headers: {
      'Cache-Control': 'no-cache',
      bearer: settings.payouts.token,
      'Content-Type': 'application/json'
    },
    body: {
      paymentProfileId: 'jtnwfmiutuyse5ih6gn4esjg',
      amount: {
        amount: '0.00',
        currency: 'EUR'
      },
      language: 'de',
      recipientText: 'Refund order #1000000001',
      recipientDetails: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.org',
        address: 'Test Street 123',
        additionalAddress: '',
        postalCode: '12345',
        city: 'TestCity',
        country: 'DE',
        telephone: '+4912312345678'
      },
      fallbackBankAccount: {
        accountHolder: 'John',
        iban: 'DE53834987777715948888',
        bic: 'BIWYYYYYXXX'
      },
      dueAt: '2016-02-08T14:35:33.274740859Z',
      contactMethod: 'Export',
      securityQuestions: [{
        question: 'What was the name of your first pet?',
        answer: 'Oscar'
      }],
      remittanceInfo: 'Lorem Ipsum'
    },
    json: true
  };
  request(options, function (err, response, body) {
    if (err) res.json({
      err: err
    });
    else res.json({
      message: 'ok'
    });
  });
});

module.exports = router;
