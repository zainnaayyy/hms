import mongoose from 'mongoose';
import geocoder from '../utils/geocoder.js';

const Schema = mongoose.Schema;
const model = mongoose.model;

const reservationSchema = new Schema({
  venue: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number], //array of nums where longitude comes first then latitude
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zipcode: String
  },
  latitude: {
    type: Number,
    required: [true, 'Please provide latitude point for the hotel location']
  },
  longitude: {
    type: Number,
    required: [true, 'Please provide longitude point for the hotel location']
  },
  status: {
    type: String,
    required: [true, 'Please provide reservation status'],
    enum: ['pending', 'attended'],
    default: "pending"
  },
  hotelID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Please provide hotel ID']
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Please provide customer ID']
  },
  feedbackID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback',
    default: null
  },
  startDate: {
    type: String,
    trim: true,
    required: [true, 'Please select a date when you want to schedule the reservation']
  },
  endDate: {
    type: String,
    trim: true,
    required: [true, 'Please select a date when you want to schedule the reservation']
  }
}, { timestamps: true });

//before feeding the data into the collection we will convert the  latitude and longitude point submitted by the customer into an address and zip code etc:
reservationSchema.pre('save', async function (next) {
  const loc = await geocoder.reverse({ lat: this.latitude, lon: this.longitude });

  this.venue = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    country: loc[0].countryCode,
    zipcode: loc[0].zipcode
  };

  //do not save longitude and latitude points in DB
  this.latitude = undefined;
  this.longitude = undefined;
  next();
});


const Reservation = model('Reservation', reservationSchema);
export default Reservation;