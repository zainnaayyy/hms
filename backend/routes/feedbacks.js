//our feedbacks api which is going to deal with feedbacks in the database
import express from 'express';
import { deleteFeedback, getFeedbacks, updateFeedback, createFeedback } from '../controllers/feedbacks.js';

const router = express.Router();

//all these below are different endpoints of the feedbacks api
router.route('/').post(createFeedback);

router.route('/:id').get(getFeedbacks).put(updateFeedback).delete(deleteFeedback);

export default router;