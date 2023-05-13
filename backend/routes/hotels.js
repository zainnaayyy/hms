//our hotels api which is going to deal with Hotels in the database
import express from 'express';
import { deleteHotel, getNearbyHotel, getHotel, getHotels, hotelImageUpload, updateHotel, signup, signin } from '../controllers/hotels.js';

const router = express.Router();

//nearby hotels endpoint:
router.route('/radius/:longitude/:latitude/:distance').get(getNearbyHotel);

router.route('/:id/image').put(hotelImageUpload);

//all these below are different endpoints of the hotels api
router.route('/').get(getHotels);

//hotels signin and signup endpoint:
router.post('/signup', signup);
router.post('/signin', signin);

router.route('/:id').get(getHotel).put(updateHotel).delete(deleteHotel);

export default router;