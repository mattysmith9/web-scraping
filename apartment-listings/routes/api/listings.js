'use strict';
import { Router } from 'express';
import { find, findById } from '../../model/CraigslistApt';
const router = Router();

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

  find()
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
  findById(req.params.id)
    .then(listing => res.json(listing))
    .catch(err =>
      res.status(404).json({ nolistingfound: 'No listing found with that ID' })
    );
});

export default router;
