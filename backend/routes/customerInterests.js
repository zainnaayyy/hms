//our feedbacks api which is going to deal with feedbacks in the database
import express from 'express';
import { deleteCustomerInterest, createOrUpdateInterest, getCustomerInterests } from '../controllers/customerInterests.js';

const router = express.Router();

//all these below are different endpoints of the feedbacks api
//get interests of a customer using ID
router.route('/:customerID').get(getCustomerInterests);

// Create or update an interest
router.route('/').post(createOrUpdateInterest);

router.route('/').delete(deleteCustomerInterest);

//update a customer interest
// router.route('/:customerID').put(updateCustomerInterests).delete(deleteCustomerInterests);

export default router;