require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
module.exports = { MONGODB_URI, PORT, MONGODB_PASSWORD };
