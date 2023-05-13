import Reservation from '../models/Reservation.js';
import expressAsyncHandler from 'express-async-handler'; // read about express-async-handler in NodeJS Fundamentals notes;
import ErrorResponse from '../utils/ErrorResponse.js';

export const getReservations = expressAsyncHandler(async (req, res, next) => {

  const userID = req.query.userID.trim();

  const reservations = await Reservation.find(
    {
      $or: [{ hotelID: userID }, { customerID: userID }]
    },
    { __v: 0 }
  );

  if (!reservations)
    res
      .status(200)
      .json([]);
  else
    res
      .status(200)
      .json(reservations);

});

export const getReservationByID = expressAsyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation)
    throw new ErrorResponse(`Reservation not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: reservation });
});

export const updateReservation = expressAsyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!reservation)
    throw new ErrorResponse(`Reservation not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: reservation });
});

export const getFilledSlots = expressAsyncHandler(async (req, res, next) => {
  const { userID } = req.params;
  //find all reservations having either customer or hotel ID:
  const reservations = await Reservation.find(
    {
      $or: [{ hotelID: userID }, { customerID: userID }]
    },
    {
      _id: 0,
      amenity: 0,
      customerID: 0,
      hotelID: 0,
      feedbackID: 0,
      status: 0,
      venue: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0
    }
  );

  if (!reservations.length)
    res.status(200).json([]);
  else
    res.status(200).json(reservations);
});

//create new reservation 
export const createReservation = expressAsyncHandler(async (req, res, next) => {
  //pulling props out of req.body for validation reasons
  const { latitude, longitude, hotelID, customerID, startDate, endDate } = req.body;

  if (!(latitude && longitude && hotelID && customerID && startDate && endDate))
    throw new ErrorResponse('One of the required fields is missing. Make sure all fields are filled correctly.', 400);

  // Create Reservation
  const reservation = await Reservation.create({
    latitude,
    longitude,
    hotelID,
    customerID,
    startDate,
    endDate
  });

  res.status(200).json({ success: true, data: reservation });

});