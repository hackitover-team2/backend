const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({

  // Stammdaten
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  additionalAddress: String,
  postalCode: String,
  city: String,
  country: String,
  telephone: String,

  // activity
  participatingChallenges: Array,
  wonChallenges: Array,

  // external ids
  paymentProfileId: {
    type: 'String',
    default: '7dy2ie6q6oekb7idvsb5fm6r',
  },
  telemetricsId: {
    type: 'String',
    default: '003',
  },
});

UserSchema.index({ telemetricsId: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
