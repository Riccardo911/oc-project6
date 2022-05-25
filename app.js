//import Express framework
const express = require('express')
//import Mongoose
const mongoose = require('mongoose')
//import user
const userRoutes = require('./routes/user')
//import sauce
const sauceRoutes = require('./routes/sauce')
//DATABASE_URL .env
const env = require('dotenv').config()
//import path - needed to path images folder
const path = require('path');
//import helmet helps secure Express apps by setting various HTTP headers
const helmet = require("helmet")



//connect to MongoDB database
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!')
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!')
    console.log(error)
  })
  
//express app
const app = express()
//secure Express app
app.use(helmet({ crossOriginResourcePolicy: false }));
  
//CORS
app.use('/', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//set up server accepts JSON as a body - intercepts every request that has a JSON content type
app.use(express.json());


//linking user route to path
app.use('/api/auth', userRoutes);

//linking sauce route to path
app.use('/api/sauces', sauceRoutes);

//path images folder
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app