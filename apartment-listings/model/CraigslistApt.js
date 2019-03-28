const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const craigslistAptSchema = new Schema({
  url: String,
  timestamp: Date,
  title: String,
  price: {},
  neighborhood: {},
  size: {}
});

const CraigslistApt = mongoose.model('CraigslistApt', craigslistAptSchema);

module.exports = CraigslistApt;
