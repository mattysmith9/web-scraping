'use strict';
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('../config/mongodb');

const app = express();

/* BODY PARSER MIDDLEWARE */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* DATABASE CONFIG */
const db = config.get('mongoURI');

/* CONNECT TO MONGO */
mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log('Mongo Connected'))
  .catch((err) => console.log(err));

/* USE ROUTES */
app.use('/api/listings', require('../routes/api/listings'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
