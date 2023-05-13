import Transaction from '../models/Transaction.js';
import expressAsyncHandler from 'express-async-handler'; // read about express-async-handler in NodeJS Fundamentals notes;
import ErrorResponse from '../utils/ErrorResponse.js';

//get all transactions
export const getTransactions = expressAsyncHandler(async (req, res, next) => {
  const userID = req.query.userID.trim();

  const transactions = await Transaction.find(
    {
      $or: [{ hotelID: userID }, { customerID: userID }]
    },
    { __v: 0 }
  );

  if (!transactions)
    res
      .status(200)
      .json([]);
  else
    res
      .status(200)
      .json(transactions);

});

//get one transaction
export const getTransaction = expressAsyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction)
    throw new ErrorResponse(`Transaction not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: transaction });
});

// update single transaction data
export const updateTransaction = expressAsyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!transaction)
    throw new ErrorResponse(`Transaction not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: transaction });
});

//delete single transaction by id
export const deleteTransaction = expressAsyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findByIdAndDelete(req.params.id);

  if (!transaction)
    throw new ErrorResponse(`Transaction not found with id of ${req.params.id}`, 404);

  res.status(200).json({ success: true, data: {} });
});

//create new transaction 
export const createTransaction = expressAsyncHandler(async (req, res, next) => {
  //pulling props out of req.body for validation reasons
  const { reservationID, hotelID, customerID, reservationDuration, amount } = req.body;

  if (!(reservationID && hotelID && customerID && reservationDuration && amount))
    throw new ErrorResponse('One of the required fields is missing. Make sure all fields are filled correctly.', 400);

  // Create Transaction
  const transaction = await Transaction.create({
    reservationID,
    hotelID,
    customerID,
    reservationDuration,
    amount
  });

  // //create token:
  // const token = transaction.getSignedJwtToken();

  res.status(200).json({ success: true, data: transaction });

});