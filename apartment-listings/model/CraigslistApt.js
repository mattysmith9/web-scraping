import { Schema as _Schema, model } from 'mongoose';

const Schema = _Schema;

const craigslistAptSchema = new Schema({
  url: String,
  timestamp: Date,
  title: String,
  price: {},
  neighborhood: {},
  size: {}
});

const CraigslistApt = model('CraigslistApt', craigslistAptSchema);

export default CraigslistApt;
