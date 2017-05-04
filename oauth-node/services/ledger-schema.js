var mongoose = require('mongoose');

module.exports = mongoose.Schema({
    id: String,
    businessName: String,
    countryCode: String,
    email: String
});