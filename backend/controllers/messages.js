import Message from '../models/Message.js';
import expressAsyncHandler from 'express-async-handler'; // read about express-async-handler in NodeJS Fundamentals notes;
import ErrorResponse from '../utils/ErrorResponse.js';

//get all messages for an Inbox via Inbox id
export const getMessages = expressAsyncHandler(async (req, res, next) => {
  const messages = await Message.find({
    inboxID: req.params.inboxID,
  });

  if (!messages)
    throw new ErrorResponse(`No messages found`, 404);

  //if messages are found then fill the res object
  res
    .status(200)
    .json({
      success: true,
      count: messages.length,
      data: messages
    });

});

//create new message 
export const createMessage = expressAsyncHandler(async (req, res, next) => {
  //pulling props out of req.body for validation reasons
  const { inboxID, message, senderID, senderImageURL } = req.body;

  if (!(inboxID && message && senderID))
    throw new ErrorResponse('One of the required fields is missing. Make sure all fields are filled correctly.', 400);

  // Create Message
  const msg = await Message.create({
    inboxID,
    message,
    senderID,
    senderImageURL
  });

  // //create token:
  // const token = message.getSignedJwtToken();

  res.status(200).json({ success: true, data: msg });

});