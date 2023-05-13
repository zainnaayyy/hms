//this is a node script which when run will cause the following script code to run in node environment and insert bulk data into our DB
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
const __dirname = path.resolve();

// Load env vars
dotenv.config({ path: './config/.env' });

// Load models
import Hotel from './models/Hotel.js';
import Customer from './models/Customer.js';

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://mik:xenderoo7@clusterhotelperhour.5nvdg.mongodb.net/hotelPerHour?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const hotels = JSON.parse(
  fs.readFileSync(__dirname + '/_jsonData/hotels.json', 'utf-8')
);

const customers = JSON.parse(
  fs.readFileSync(__dirname + '/_jsonData/customers.json', 'utf-8')
);

// Insert into DB
const insertData = async () => {
  try {
    await Hotel.create(hotels);
    await Customer.create(customers);
    console.log('Data inserted...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Hotel.deleteMany();
    await Customer.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
