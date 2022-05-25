/****************************
    password form validation 
*****************************/

// require passwordSchema
const passwordSchema = require("../models/password");

//password form validation
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    // password != password schema pattern
    res.writeHead(
      400,
      '{"message": "Your password must contain at least 8 characters including min one uppercase letter, min one lowercase letter and a number, space not allowed "}',
      {
        "content-type": "application/json",
      }
    );
    res.end("Incorrect password format");
  } else {
    next();
  }
};
