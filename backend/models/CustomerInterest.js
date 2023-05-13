import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const customerInterestSchema = new Schema({
  interests: {
    type: Array,
    required: true
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    unique: true,
    required: [true, 'Please provide customer ID']
  }
}, { timestamps: false });

const CustomerInterest = model('CustomerInterest', customerInterestSchema);
export default CustomerInterest;