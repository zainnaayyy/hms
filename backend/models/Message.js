import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const messageSchema = new Schema({
  inboxID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inbox',
    required: [true, 'Please provide Inbox ID']
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    trim: true
  },
  senderID: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please provide sender ID']
  },
  senderImageURL: {
    type: String,
    default: '/uploads/no-photo.jpg'
  },
}, { timestamps: true });

//by setting timestamps to true, any customer document pushed into the mongoDB via the mongoose will implicitly add-onto the the document being inserted two extra fields: 1) createdAt 2) updatedAt fields; the createdAt is going to have the timestamp for when the document was inserted , and the updatedAt is going to have the timestamp for when the record was last updated in the database;

const Message = model('Message', messageSchema);
export default Message;