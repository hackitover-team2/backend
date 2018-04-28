const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  additionalAddress: String,
  postalCode: String,
  city: String,
  country: String,
  telephone: String
});

module.exports = mongoose.model('User', UserSchema);
