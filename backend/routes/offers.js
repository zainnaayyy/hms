import express from 'express';
import { deleteOffering, getOffering, getHotels, updateOffering, createOffering } from '../controllers/offers.js';

const router = express.Router();

//all hotels offering a particular amenity:
router.route('/').get(getHotels).post(createOffering);


router.route('/:id').get(getOffering).put(updateOffering).delete(deleteOffering);

export default router;