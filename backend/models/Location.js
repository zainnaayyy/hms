import mongoose from 'mongoose';
import geocoder from '../utils/geocoder.js';

const Schema = mongoose.Schema;
const model = mongoose.model;

const locationSchema = new Schema({
  hotelID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Please provide Hotel ID']
  },
  latitude: {
    type: Number,
    required: [true, 'Please provide latitude point for the hotel location']
  },
  longitude: {
    type: Number,
    required: [true, 'Please provide longitude point for the hotel location']
  },
  location: {
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
  }
}, { timestamps: true });

//before feeding the data into the collection we will convert the  latitude and longitude point submitted by the hotel into an address and zip code etc:
locationSchema.pre('save', async function (next) {
  const loc = await geocoder.reverse({ lat: this.latitude, lon: this.longitude });

  this.location = {
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

const Location = model('Location', locationSchema);
export default Location;