import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const inboxSchema = new Schema({
  members: {
    type: Array,
    required: true
  }
}, { timestamps: true });

//by setting timestamps to true, any customer document pushed into the mongoDB via the mongoose will implicitly add-onto the the document being inserted two extra fields: 1) createdAt 2) updatedAt fields; the createdAt is going to have the timestamp for when the document was inserted , and the updatedAt is going to have the timestamp for when the record was last updated in the database;

const Inbox = model('Inbox', inboxSchema);
export default Inbox;