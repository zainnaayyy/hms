//our transactions api endpoints which is going to deal with transactions in the database
import express from 'express';
import { deleteTransaction, getTransaction, getTransactions, updateTransaction, createTransaction } from '../controllers/transactions.js';

const router = express.Router();

//all these below are different endpoints of the transactions api
router.route('/').post(createTransaction);

//get all transactions for a user (hotel or customer) using their ID pass via query parameters
router.route('/').get(getTransactions);

router.route('/:id').get(getTransaction).put(updateTransaction).delete(deleteTransaction);

export default router;