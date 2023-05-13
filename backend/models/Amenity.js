import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const amenitySchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please add a amenity title'],
    unique: true,
    trim: true,
    lowercase: true
  }
}, { _id: false });

//by setting timestamps to true, any customer document pushed into the mongoDB via the mongoose will implicitly add-onto the the document being inserted two extra fields: 1) createdAt 2) updatedAt fields; the createdAt is going to have the timestamp for when the document was inserted , and the updatedAt is going to have the timestamp for when the record was last updated in the database;

const Amenity = model('Amenity', amenitySchema);
export default Amenity;