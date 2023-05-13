//our customers api which is going to deal with customers in the database
import express from 'express';
import { deleteCustomer, getCustomer, getCustomers, updateCustomer, signup, customerImageUpload, signin } from '../controllers/customers.js';

const router = express.Router();

//all these below are different endpoints of the customers api
router.route('/').get(getCustomers);

//customers signin and signup endpoints:
router.post('/signup', signup);
router.post('/signin', signin);

router.route('/:id/image').put(customerImageUpload);

router.route('/:id').get(getCustomer).put(updateCustomer).delete(deleteCustomer);

export default router;