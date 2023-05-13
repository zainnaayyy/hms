//our amenities api which is going to deal with amenities in the database
import express from 'express';
import { deleteAmenity, getAmenity, getAmenities, createAmenity, autocompleteTitles } from '../controllers/amenities.js';

const router = express.Router();

//all these below are different endpoints of the amenities api
router.route('/').get(getAmenities).post(createAmenity);

//search autocomplete endpoint
router.route('/search').get(autocompleteTitles);

router.route('/:id').get(getAmenity).delete(deleteAmenity);

export default router;