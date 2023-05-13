//our messages api which is going to deal with messages in the database
import express from 'express';
import { getMessages, createMessage } from '../controllers/messages.js';

const router = express.Router();

//all these below are different endpoints of the messages api
router.route('/').post(createMessage);

router.route('/:inboxID').get(getMessages);

export default router;