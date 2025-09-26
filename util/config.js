require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.LOCAL_DB_URL,
  PORT: process.env.PORT,
  SECRET: process.env.SECRET
}