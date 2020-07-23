const db = require('../models/index')
const Article = db.Article

async function createArticle(data) {
    return Article.build(data).save()
}

async function getArticle(articleId) {
    return Article.findOne({ where: { id: articleId }, raw: true })
}

async function getArticles() {
    return Article.findAll({ raw: true })
}

async function updateArticle(articleId, data) {

    return Article.update(data, { where: { id: articleId } })
}

async function deleteArticle(articleId) {
    return Article.destroy({ where: { id: articleId } })
}

async function deleteAllArticles() {
    return Article.destroy({ where: {} })
}

async function getArticlesByUserId(userId) {
    return Article.findAll({ where: { userId }, raw: true })
}

async function deleteAllArticlesByUserId(userId) {
    return Article.destroy({ where: { userId } })
}

module.exports = {
    createArticle,
    getArticle,
    getArticles,
    updateArticle,
    deleteArticle,
    deleteAllArticles,
    getArticlesByUserId,
    deleteAllArticlesByUserId
}