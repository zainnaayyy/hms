import path from 'path';
import Customer from '../models/Customer.js';
import expressAsyncHandler from 'express-async-handler'; // read about express-async-handler in NodeJS Fundamentals notes;
import ErrorResponse from '../utils/ErrorResponse.js';

export const getCustomers = expressAsyncHandler(async (req, res, next) => {
  const customers = await Customer.find();

  if (!customers)
    throw new ErrorResponse(`No customers found`, 404);

  //if customers are found then fill the res object
  res
    .status(200)
    .json({
      success: true,
      count: customers.length,
      data: customers
    });

});

export const getCustomer = expressAsyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    throw new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: customer });
});

export const updateCustomer = expressAsyncHandler(async (req, res, next) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!customer)
    throw new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: customer });
});

export const deleteCustomer = expressAsyncHandler(async (req, res, next) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer)
    throw new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: {} });
});

//customer signup function
export const signup = expressAsyncHandler(async (req, res, next) => {
  //pulling props out of req.body for validation reasons
  const { firstName, lastName, email, password } = req.body;

  if (!(firstName && lastName && email && password))
    throw new ErrorResponse('One of the required fields is missing. Make sure all fields are filled correctly.', 400);

  // Create Customer
  const customer = await Customer.create({
    firstName,
    lastName,
    email,
    password
  });

  //create token:
  const token = customer.getSignedJwtToken();

  res.status(200).json({ success: true, token, data: customer });

});

//customer signin endpoint function
export const signin = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please enter email and password' });
  }

  // Check for customer and also make the query to return the pass which when querying a document normally wouldn't be returned as we have for the password field the "select" property = false in the Customer Model
  const customer = await Customer.findOne({ email }).select('+password');

  if (!customer) {
    return res.status(401).json({ success: false, message: 'Customer does not exist' });
  }

  // Check if password matches
  const isMatch = await customer.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid Credentials' });
  }

  //generate token for signed user:
  const token = customer.getSignedJwtToken();

  res.status(200).json({ success: true, token, data: customer });

});

//customer image upload
export const customerImageUpload = expressAsyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    throw new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404);


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
  file.name = `photo_${customer._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      throw new ErrorResponse('Could not upload the image.', 500);
    }

    const imageURL = "/uploads/" + file.name;

    await Customer.findByIdAndUpdate(req.params.id, { imageURL });
    const customer = await Customer.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: customer
    });

  });

});