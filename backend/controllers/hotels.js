import path from 'path';
import Hotel from '../models/Hotel.js';
import expressAsyncHandler from 'express-async-handler'; // read about express-async-handler in NodeJS Fundamentals notes;
import ErrorResponse from '../utils/ErrorResponse.js';

export const getHotels = expressAsyncHandler(async (req, res, next) => {
  let query;
  let queryString = JSON.stringify(req.query);
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  );

  query = Hotel.find(JSON.parse(queryString));

  const hotels = await query;

  if (!hotels)
    throw new ErrorResponse(`No Hotels found.`, 404);

  res.status(200).json({ success: true, count: hotels.length, data: hotels });
});

export const getHotel = expressAsyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel)
    throw new ErrorResponse(`Hotel not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: hotel });
});

export const updateHotel = expressAsyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!hotel)
    throw new ErrorResponse(`Hotel not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: hotel });
});

export const deleteHotel = expressAsyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id);

  if (!hotel)
    throw new ErrorResponse(`Hotel not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: {} });
});

//get nearby hotels within a sphere of defined radius:
//GET /api/hotels/radius/:longitude/:latitude/:distance (In Km)
export const getNearbyHotel = expressAsyncHandler(async (req, res, next) => {
  const { longitude, latitude, distance } = req.params;

  //calculate radius of the circle using the radian formula as an input to that formula "the distance in miles from the user". That way we could define how big or small the user defines the circle he/she wanna search hotels in;

  //divide distance by radius of earth
  //earth radius: 6,378 km

  const radius = distance / 6378;

  const hotels = await Hotel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radius]
      }
    }
  });

  if (!hotels)
    throw new ErrorResponse(`No nearby hotels found.`, 404);

  res.status(200).json({
    success: true,
    count: hotels.length,
    data: hotels
  });
});

export const hotelImageUpload = expressAsyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel)
    throw new ErrorResponse(`Hotel not found with id of ${req.params.id}`, 404);

  if (!req.files)
    throw new ErrorResponse('Please attach your photo.', 400);

  const file = req.files.image;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image'))
    throw new ErrorResponse('Please attach file of type image.', 400);

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD)
    throw new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400);

  // Create custom filename
  file.name = `photo_${hotel._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      throw new ErrorResponse('Could not upload the image.', 500);
    }

    const imageURL = "/uploads/" + file.name;

    await Hotel.findByIdAndUpdate(req.params.id, { imageURL });
    const hotel = await Hotel.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: hotel
    });

  });

});

//hotel signup endpoint function
export const signup = expressAsyncHandler(async (req, res, next) => {
  const { hotelName, email, password, hourlyRate, rooms, description } = req.body;

  // Create Hotel
  const hotel = await Hotel.create({
    hotelName,
    email,
    password,
    hourlyRate,
    rooms,
    description
  });

  //create token:
  const token = hotel.getSignedJwtToken();

  res.status(200).json({ success: true, token, data: hotel });

});

//signin endpoint function hotel
export const signin = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please enter email and password' });
  }

  // Check for hotel and also make the query to return the pass which when querying a document normally wouldn't be returned as we have for the password field the "select" property = false in the Hotel Model
  const hotel = await Hotel.findOne({ email }).select('+password');

  if (!hotel) {
    return res.status(401).json({ success: false, message: 'Hotel does not exist' });
  }

  // Check if password matches
  const isMatch = await hotel.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid Credentials' });
  }

  //generate token for signed user:
  const token = hotel.getSignedJwtToken();

  res.status(200).json({ success: true, token, data: hotel });

});