import Offering from '../models/Offering.js';
import expressAsyncHandler from 'express-async-handler'; // read about express-async-handler in NodeJS Fundamentals notes;
import ErrorResponse from '../utils/ErrorResponse.js';

//get all hotels that offers a specific amenity
export const getHotels = expressAsyncHandler(async (req, res, next) => {
  const amenity = req.query.amenity.trim();

  const hotels = await Offering.find(
    {
      amenity: {
        $regex: new RegExp('^' + amenity + '.*', 'i')
      }
    },
    { _id: 0, __v: 0, amenity: 0, createdAt: 0, updatedAt: 0 }
  ).exec();

  if (!hotels.length)
    res.status(200).json([]);
  else
    res.status(200).json(hotels);

});

//get one offering
export const getOffering = expressAsyncHandler(async (req, res, next) => {
  const offering = await Offering.findById(req.params.id);

  if (!offering)
    throw new ErrorResponse(`Offering not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: offering });
});

// update single offering data
export const updateOffering = expressAsyncHandler(async (req, res, next) => {
  const offering = await Offering.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!offering)
    throw new ErrorResponse(`Offering not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: offering });
});

//delete single offering by id
export const deleteOffering = expressAsyncHandler(async (req, res, next) => {
  const offering = await Offering.findByIdAndDelete(req.params.id);

  if (!offering)
    throw new ErrorResponse(`Offering not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: {} });
});

//create new offering 
export const createOffering = expressAsyncHandler(async (req, res, next) => {
  //pulling props out of req.body for validation reasons
  const { hotelID, amenity } = req.body;

  if (!(hotelID && amenity))
    throw new ErrorResponse('One of the required fields is missing. Make sure all fields are filled correctly.', 400);

  // Create Offering
  const offering = await Offering.create({
    hotelID,
    amenity
  });

  // //create token:
  // const token = offering.getSignedJwtToken();

  res.status(200).json({ success: true, data: offering });

});