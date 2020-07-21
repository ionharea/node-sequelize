const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).send({ isTokenSet: false})
    }
    const { isAdmin } = jwt.decode(req.headers.authorization.split(" ")[1])
    console.log(req.method)
    if (isAdmin) {
        return next()
    } 
    if(["GET","PUT","DELETE"].includes(req.method)) {
      
    }
}