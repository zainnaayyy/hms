import Inbox from '../models/Inbox.js';
import expressAsyncHandler from 'express-async-handler'; // read about express-async-handler in NodeJS Fundamentals notes;
import ErrorResponse from '../utils/ErrorResponse.js';

//get all inboxes of a user (hotel or customer) using their ID:
export const getInboxes = expressAsyncHandler(async (req, res, next) => {
  const inboxes = await Inbox.find({
    members: req.params.id
  });

  if (!inboxes)
    throw new ErrorResponse(`No inboxes found`, 404);

  //if inboxes are found then fill the res object
  res
    .status(200)
    .json({
      success: true,
      count: inboxes.length,
      data: inboxes
    });

});

// get a particular inbox that contains two specific ids as members:
export const getInbox = expressAsyncHandler(async (req, res, next) => {
  const inbox = await Inbox.findOne({
    members: { $all: [req.params.firstMemberID, req.params.secondMemberID] },
  });

  if (!inbox)
    throw new ErrorResponse(`No inbox found`, 404);

  //if inbox are found then fill the res object
  res
    .status(200)
    .json({
      success: true,
      data: inbox
    });

});

//create new inbox 
export const createInbox = expressAsyncHandler(async (req, res, next) => {
  //pulling props out of req.body for validation reasons
  const { ownerID, opponentID } = req.body;

  if (!(ownerID && opponentID))
    throw new ErrorResponse('One of the required fields is missing. Make sure all fields are filled correctly.', 400);
  // Create Inbox
  const inbox = await Inbox.create({
    members: [
      ownerID,
      opponentID,
    ]
  });

  // //create token:
  // const token = inbox.getSignedJwtToken();

  res.status(200).json({ success: true, data: inbox });

});