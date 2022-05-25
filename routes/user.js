/*************************************************
    user routes -
    contains all of our user related business logic
 *************************************************/

const express = require('express');
const router = express.Router(); //create separate routers for each main route

//import user controller
const userCtrl = require('../controllers/user');
//import email validation
const checkEmail = require("../middleware/checkemail");
//import password validator
const checkPassword = require("../middleware/password-validator");

//POST
router.post('/signup', checkEmail, checkPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;