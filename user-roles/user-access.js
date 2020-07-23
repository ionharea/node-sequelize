const jwt = require('jsonwebtoken')
module.exports.trickyAcl = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ isAuthorized: false })
    }
    const { isAdmin } = jwt.decode(req.headers.authorization.split(" ")[1])
    if (isAdmin && ["GET", "POST", "PUT", "DELETE"].includes(req.method)) {
        return next()
    }
    else {
        return res.status(403).send({ isAdmin: false, message: "You are not privileged to access this route." })
    }
}