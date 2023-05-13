//our reservations api which is going to deal with reservations in the database
import express from 'express';
import { getFilledSlots, getReservationByID, getReservations, updateReservation, createReservation } from '../controllers/reservations.js';

const router = express.Router();

//all these below are different endpoints of the reservations api

//create new reservation
router.route('/').post(createReservation);

//get all reservations for a user (hotel or customer) using their ID pass via query parameters
router.route('/').get(getReservations);

//get a single reservation between a hotel and a customer via their ids
// router.route('/:hotelID/:customerID').get(getReservation);

//get list of the filled reservation slots for a hotel via ID
router.route('/slots/:userID').get(getFilledSlots);

//get or update a reservation using reservationID
router.route('/:id').get(getReservationByID).put(updateReservation);

export default router;