const express = require('express');
const bodyParser = require('body-parser')
const authenticate = require('../authenticate');
const articleService = require('../services/article-service')
const userAccess = require('../user-roles/user-access')

const articleRouter = express.Router()
articleRouter.use(bodyParser.json())

articleRouter.route('/')
    .get(authenticate.verifyUser, userAccess.trickyAcl, (req, res, next) => {
        articleService.getArticles()
            .then(articles => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(articles)
            }, (err) => next(err))
            .catch(err => next(err))
    })
    .post(authenticate.verifyUser, userAccess.trickyAcl, (req, res, next) => {
        articleService.createArticle(req.body)
            .then(article => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(article)
            }, (err) => next(err))
            .catch(err => next(err))
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403
        res.end('PUT operation not supported on /articles')
    })
    .delete(authenticate.verifyUser, userAccess.trickyAcl, (req, res, next) => {
        articleService.deleteAllArticles()
            .then(resp => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, err => next(err))
            .catch(err => next(err))
    })

articleRouter.route('/:articleId')
    .get(authenticate.verifyUser, userAccess.trickyAcl, (req, res, next) => {
        articleService.getArticle(req.params.articleId)
            .then(article => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(article)
            }, (err) => next(err))
            .catch(err => next(err))
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403
        res.end('POST operation not supported on /articles/'
            + req.params.articleId)
    })
    .put(authenticate.verifyUser, userAccess.trickyAcl, (req, res, next) => {
        articleService.updateArticle(req.params.articleId, req.body)
            .then(resp => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, (err) => next(err))
            .catch(err => next(err))
    })
    .delete(authenticate.verifyUser, userAccess.trickyAcl, (req, res, next) => {
        articleService.deleteArticle(req.params.articleId)
            .then(resp => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, err => next(err))
            .catch(err => next(err))
    })

module.exports = articleRouter