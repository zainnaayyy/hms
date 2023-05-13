import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const transactionSchema = new Schema({
  reservationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: [true, 'Please provide transaction ID']
  },
  hotelID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Please provide transaction ID']
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Please provide transaction ID']
  },
  reservationDuration: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Transaction = model('Transaction', transactionSchema);
export default Transaction;