var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChallengeSchema   = new Schema({
    name: String,
    city: String
});

module.exports = mongoose.model('Challenge', ChallengeSchema);

