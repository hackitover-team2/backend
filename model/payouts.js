const settings = require('../settings');

function createPayouts(user, challenge, req, res) {
  var options = {
    method: 'POST',
    url: settings.payouts.url,
    headers: {
      'Cache-Control': 'no-cache',
      bearer: settings.payouts.token,
      'Content-Type': 'application/json'
    },
    body: {
      recipientText: 'Siegprämie: ' + challenge.name,
      paymentProfileId: user.paymentProfileId,
      amount: {
        currency: 'EUR',
        amount: challenge.price.amount.toFixed(2) + '',
      },
      language: 'de',
      dueAt: '2018-04-29T14:35:33.274740859Z',
      contactMethod: 'Export',
      securityQuestions: [{
        question: 'Wer ist der Held deiner Jugend?',
        answer: 'Batman'
      }],
      remittanceInfo: 'DROOVE Preisgeld'
    },
    json: true
  };

  options.url = settings.payouts.url;
  options.body.recipientDetails = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    address: user.address,
    additionalAddress: user.additionalAddress,
    postalCode: user.postalCode,
    city: user.city,
    country: user.country,
    telephone: user.telephone
  };

  request(options, function (err, response, body) {
    if (err) res.status(500).json(err);
    else res.json({ message: 'ok' });
  });
}

function getPayouts(user, req, res) {
  var options = {
    method: 'GET',
    url: settings.payouts.url,
    headers: {
      'Cache-Control': 'no-cache',
      bearer: settings.payouts.token,
      'Content-Type': 'application/json'
    },
    json: true
  };

  options.body.recipientDetails = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    address: user.address,
    additionalAddress: user.additionalAddress,
    postalCode: user.postalCode,
    city: user.city,
    country: user.country,
    telephone: user.telephone
  };

  request(options, function (err, response, body) {
    if (err) res.status(500).json(err);
    else res.json({ message: 'ok' });
  });
}

module.exports = {
  createPayouts: createPayouts
}