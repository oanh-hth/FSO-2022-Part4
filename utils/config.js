// The file handle with environment variables
// The other parts of the application can access the environment variables by importing this module
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
    PORT, MONGODB_URI
}