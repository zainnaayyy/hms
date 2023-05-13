import Location from '../models/Location.js';
import Hotel from '../models/Hotel.js';
import expressAsyncHandler from 'express-async-handler'; // read about express-async-handler in NodeJS Fundamentals notes;
import ErrorResponse from '../utils/ErrorResponse.js';

//get specific list of hotel in a specific location circle radius:
export const getHotelsWithinRadius = expressAsyncHandler(async (req, res, next) => {
  const { hotelIDs, latitude, longitude, distance } = req.body;

  //radius of earth in meters 6371000 m and 6,371 km
  //we will divide the passed distance in meters by the total radius of earth in meters

  //calculation radius in meters for the circle inside which the user wants hotels
  const radius = distance / 6371000;

  const hotels = await Location.find({
    location: {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radius]
      }
    },
    hotelID: { "$in": hotelIDs }
  },
    { _id: 0, __v: 0, updatedAt: 0, createdAt: 0, location: 0 }
  );

  const filteredHotelIDs = hotels.map((hotel) => hotel.hotelID);

  if (!filteredHotelIDs.length)
    res.status(200)
      .json({
        success: false,
        data: []
      });
  else
    res
      .status(200)
      .json({
        success: true,
        data: filteredHotelIDs
      });

});

//get all hotels for a specific point
export const getHotels = expressAsyncHandler(async (req, res, next) => {
  const hotels = await Location.find({
    inboxID: req.params.inboxID,
  });

  if (!hotels)
    throw new ErrorResponse(`No hotels found`, 404);

  //if hotels are found then fill the res object
  res
    .status(200)
    .json({
      success: true,
      count: hotels.length,
      data: hotels
    });

});

//get location of a hotel via his id:
export const getLocation = expressAsyncHandler(async (req, res, next) => {
  const location = await Location.findOne({
    hotelID: req.params.id
  });

  if (!location)
    throw new ErrorResponse(`location not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: location.location });
});

//create new location 
export const createLocation = expressAsyncHandler(async (req, res, next) => {
  //pulling props out of req.body for validation reasons
  const { latitude, longitude, hotelID } = req.body;

  if (!(latitude && longitude && hotelID))
    throw new ErrorResponse('One of the required fields is missing. Make sure all fields are filled correctly.', 400);

  // Create Location
  const location = await Location.create({ latitude, longitude, hotelID });

  const city = location.location.city;
  const country = location.location.country;

  //updating hotel's city and country via his id:
  await Hotel.findByIdAndUpdate(hotelID, { city, country }, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: location.location });

});