//our locations api which is going to deal with locations in the database
import express from 'express';
import { getHotels, getLocation, createLocation, getHotelsWithinRadius } from '../controllers/locations.js';

const router = express.Router();

//all these below are different endpoints of the locations api
router.route('/').post(createLocation);

//endpoint for getting location of a single hotel via id
router.route('/:id').get(getLocation);

//following endpoint is used to get all hotels from a specific location
router.route('/:latitude/:longitude').get(getHotels);

//get specific list of hotel in a specific location circle radius:
router.route('/radius').post(getHotelsWithinRadius);

export default router;