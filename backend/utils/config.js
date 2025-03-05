import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

//use testing db not actual db
const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

export {
  MONGODB_URI,
  PORT
};
