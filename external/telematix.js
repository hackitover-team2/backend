var settings = require('../settings');

// dependencies
const request = require('request');

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
        range_pattern: 'w-3'
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

  module.exports = { getDriverScores };