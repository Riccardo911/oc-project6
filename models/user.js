/****************************
    create user schema
****************************/

//// mongoose package
const mongoose = require('mongoose');

// unique user validator package
const uniqueValidator = require('mongoose-unique-validator');

//define userSchema
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,   //equal emails are not allowed - create an index in our database to guarantee uniqueness
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  }
});

// unique user validator
userSchema.plugin(uniqueValidator);

//convert schema into a model end export
module.exports = mongoose.model('User', userSchema);
