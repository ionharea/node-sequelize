const db = require('../models/index')
const User = db.User

async function getUser(userId) {
    return User.findOne({ where: { id: userId }, raw: true })
}

async function getUsers() {
    return User.findAll({ raw: true })
}

async function updateUser(userId, data) {

    return User.update(data, { where: { id: userId } })
}

async function deleteUser(userId) {
    return User.destroy({ where: { id: userId } })
}

async function deleteAllUsers() {
    return User.destroy({ where: {} })
}

module.exports = {
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    deleteAllUsers
}