const db = require('../models/index')
const User = db.User

module.exports.getUser = async (userId) => {
    return User.findOne({ id: userId })
}
