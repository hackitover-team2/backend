var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChallengeSchema   = new Schema({
    name: String,
    city: String,
    description: String,
    startDate: Date,
    endDate: Date,
    image: String,
    goal: { 
        property: String,
        highOrLow: String
    },
    participants: Array,
    price: String,
    closed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);

