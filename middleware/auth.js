/*
    check incoming requests for a token,
    it will then validate that token,
    it will also decode it 
    and check that the userId encoded within it is the same 
    as any userId within the body of the request

    if everything is fine, the user is authenticated
    and the request will be passed along
    otherwise it will refuse access to those particular endpoints
*/

const jwt = require('jsonwebtoken')
const env =require('dotenv').config()

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const userId = decodedToken.userId;
    req.auth = { userId }
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID'
    } else {
      next()
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Request not authenticated' })
  }
}
