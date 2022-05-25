/****************************
    create password schema
****************************/

//import password-validator - npm install --save password-validator
const passwordValidator = require('password-validator')

const passwordSchema = new passwordValidator()

// password schema
passwordSchema
.has().not().spaces() //space not allowed
.is().min(8)          // min length             
.is().max(30)         // max length    
.has().lowercase()    // min one lowercase 
.has().uppercase()    // min one capital letter  
.has().digits()       // no empty password allowed
.is().not().oneOf(["SELECT", "accounts", "=", "'", "\"", "*"]); // prevent injections - blacklist these values

module.exports = passwordSchema;