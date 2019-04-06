'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Listing = require('../../model/CraigslistApt');

/*
 * @route GET api/listings/test
 * @desc TESTS LISTINGS ROUTE
 * @access PUBLIC
 */
router.get('/test', (req, res) => res.json({ msg: 'Listings Work' }));

/*
 * @route GET api/listings/all
 * @desc GET LISTINGS
 * @access PUBLIC
 */
router.get('/all', (req, res) => {
  const errors = {};

  Listing.find()
    .populate('apartment', ['address', 'price'])
    .then(listings => {
      if (!listings) {
        errors.noprofile = 'There are no listings';
        return res.status(404).json(errors);
      }
      res.json(listings);
    })
    .catch(err => res.status(404).json({ listing: 'There are no listings' }));
});

/*
 * @route GET api/listings/:id
 * @desc GET LISTINGS BY ID
 * @access PUBLIC
 */
router.get('/:id', (req, res) => {
  Listing.findById(req.params.id)
    .then(listing => res.json(listing))
    .catch(err =>
      res.status(404).json({ nolistingfound: 'No listing found with that ID' })
    );
});

module.exports = router;
