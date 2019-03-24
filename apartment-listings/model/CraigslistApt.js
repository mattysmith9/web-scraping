const mongoose = require('mongoose');

const craigslistAptSchema = new mongoose.Schema({
  url: String,
  timestamp: Date,
  title: String,
  price: {},
  neighborhood: {},
  size: {}
});

const CraigslistApt = mongoose.model('CraigslistApt', craigslistAptSchema);

module.exports = CraigslistApt;
