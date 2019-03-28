'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/* 
* @route GET api/listings/test 
* @desc TESTS LISTINGS ROUTE
* @access PUBLIC
*/
router.get('/test', (req, res) => res.json({ msg: 'Listings Work' }));

/* 
* @route GET api/listings
* @desc GET LISTINGS
* @access PUBLIC
*/
router.get('/', (req, res) => {
  Listing.find()
    .sort({ date: -1 })
    .then((listings) => res.json(listings))
    .catch((err) =>
      res.status(404).json({ nolistingsfound: 'No listings found' })
    );
});

/* 
* @route GET api/listings/:id
* @desc GET LISTINGS BY ID
* @access PUBLIC
*/
router.get('/:id', (req, res) => {
  Listing.findById(req.params.id)
    .then((listing) => res.json(listing))
    .catch((err) =>
      res.status(404).json({ nolistingfound: 'No listing found with that ID' })
    );
});

module.exports = router;
