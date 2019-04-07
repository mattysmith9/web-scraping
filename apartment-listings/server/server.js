'use strict';
import express from 'express';
import { connect } from 'mongoose';
import { urlencoded, json } from 'body-parser';
import { get } from '../config/mongodb';

const app = express();

/* BODY PARSER MIDDLEWARE */
app.use(urlencoded({ extended: false }));
app.use(json());

/* DATABASE CONFIG */
const db = get('mongoURI');

/* CONNECT TO MONGO */
connect(
  db,
  { useNewUrlParser: true, useCreateIndex: true }
)
  .then(() => console.log('Mongo Connected'))
  .catch(err => console.log(err));

/* USE ROUTES */
app.use('/api/listings', require('../routes/api/listings'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
