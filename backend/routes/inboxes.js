//our inboxes api which is going to deal with inboxes in the database
import express from 'express';
import { getInbox, getInboxes, createInbox } from '../controllers/inboxes.js';

const router = express.Router();

//all these below are different endpoints of the inboxes api
router.route('/').post(createInbox);

router.route('/:id').get(getInboxes);

router.route('/:firstMemberID/:secondMemberID').get(getInbox);

export default router;