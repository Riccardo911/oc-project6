/****************************
    email form validation 
*****************************/

module.exports = (req, res, next) => {
  //const validEmail = (email) => {
    let emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    let isRegexTrue = emailRegex.test(req.body.email);
    isRegexTrue ? next() : res.status(400).json({ message: "invalid email" });
  //};
  //validEmail(req.body.email);
};