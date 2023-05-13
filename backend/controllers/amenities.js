import Amenity from '../models/Amenity.js';
import expressAsyncHandler from 'express-async-handler'; // read about express-async-handler in NodeJS Fundamentals notes;
import ErrorResponse from '../utils/ErrorResponse.js';

//get all amenities
export const getAmenities = expressAsyncHandler(async (req, res, next) => {
  const amenities = await Amenity.find();

  if (!amenities)
    throw new ErrorResponse(`No amenities found`, 404);

  //if amenities are found then fill the res object
  res
    .status(200)
    .json({
      success: true,
      count: amenities.length,
      data: amenities
    });

});

//get one amenity
export const getAmenity = expressAsyncHandler(async (req, res, next) => {
  const amenity = await Amenity.findById(req.params.id);

  if (!amenity)
    throw new ErrorResponse(`Amenity not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: amenity });
});

//autocomplete amenity titles / search suggestions
export const autocompleteTitles = expressAsyncHandler(async (req, res, next) => {

  const term = req.query.term.trim();

  const titles = await Amenity.find(
    {
      title: {
        $regex: new RegExp('^' + term + '.*', 'i')
      }
    },
    { _id: 0, __v: 0 }
  ).exec();

  if (titles.length > 16)
    titles = titles.slice(0, 15);

  if (!titles.length)
    res.status(200).json([]);
  else
    res.status(200).json(titles);
});

//delete single amenity by id
export const deleteAmenity = expressAsyncHandler(async (req, res, next) => {
  const amenity = await Amenity.findByIdAndDelete(req.params.id);

  if (!amenity)
    throw new ErrorResponse(`Amenity not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: {} });
});

//create new amenity 
export const createAmenity = expressAsyncHandler(async (req, res, next) => {
  //pulling props out of req.body for validation reasons
  const { title } = req.body;

  if (!title)
    throw new ErrorResponse('One of the required fields is missing. Make sure all fields are filled correctly.', 400);

  // Create Amenity
  const amenity = await Amenity.updateOne(
    { title },
    { $setOnInsert: { title } },
    { upsert: true }
  );

  res.status(200).json({ success: true, data: amenity });

});