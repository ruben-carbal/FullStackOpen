require('dotenv').config();

const PORT = process.env.PORT;
const BLOGLIST_URI = process.env.NODE_ENV !== 'test'
  ? process.env.BLOGLIST_URI
  : process.env.TEST_BLOGLIST_URI;

module.exports = {
  PORT, BLOGLIST_URI
};
