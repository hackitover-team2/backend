const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('underscore');
const logger = require('morgan');
const fs = require('fs');

var User = require('./model/user');

app.use(logger('dev'));
app.use(bodyParser.json());

mongoose.connection.on('connected', function () {

  var endpointPath = './endpoints/';
  var endpoints = fs.readdirSync(endpointPath);

  endpoints = endpoints.filter(x => x.split('.')[1] === 'js');

  endpoints.forEach(endpoint => {
    var route = require(endpointPath + endpoint);
    console.log(endpoint.split('.')[0]);
    app.use('/' + endpoint.split('.')[0], route);
  });

  app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
  });
});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/hackitover')
  .then(() => console.log('connection succesful'))
  .catch((err) => console.error(err));

var gracefulExit = function () {
  mongoose.connection.close(function () {
    console.log('> MongoDB disconnected through app termination');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
