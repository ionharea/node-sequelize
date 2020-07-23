const express = require('express');
const bodyParser = require('body-parser')
const db = require('../models/index')
const passport = require('passport');
const authenticate = require('../authenticate');
const userService = require('../services/user-service');
const articleService = require('../services/article-service');

const User = db.User

const userRouter = express.Router()
userRouter.use(bodyParser.json())

userRouter.post('/signup', (req, res, next) => {
  User.register(User.build({ username: req.body.username, isAdmin: req.body.isAdmin }), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      console.log(err)
      res.json({ err: err });
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, status: 'Registration Successful!' });
      });
    }
  })
});

userRouter.post('/login', passport.authenticate('local'), async (req, res) => {
  let token = await authenticate.getToken(req.user.id)
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});

userRouter.get('/logout', (req, res, next) => {
  req.logOut()
  res.redirect('/');
});

userRouter.route('/')
  .get(authenticate.verifyUser, (req, res, next) => {
    userService.getUsers()
      .then(users => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(users)
      }, (err) => next(err))
      .catch(err => next(err))
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('POST operation is supported on /users through /users/signup')
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /users')
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    userService.deleteAllUsers()
      .then(resp => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, err => next(err))
      .catch(err => next(err))
  })

userRouter.route('/:userId')
  .get(authenticate.verifyUser, (req, res, next) => {
    userService.getUser(req.params.userId)
      .then(user => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(user)
      }, (err) => next(err))
      .catch(err => next(err))
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /users/'
      + req.params.userId)
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    userService.updateUser(req.params.userId, req.body)
      .then(user => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(user)
      }, (err) => next(err))
      .catch(err => next(err))
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    userService.deleteUser(req.params.userId)
      .then(resp => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, err => next(err))
      .catch(err => next(err))
  })


userRouter.route('/:userId/articles')
  .get(authenticate.verifyUser, (req, res, next) => {
    userService.getUser(req.params.userId).
      then(user => {
        if (user != {}) {
          articleService.getArticlesByUserId(req.params.userId)
            .then(user => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(user)
            }, (err) => next(err))
            .catch(err => next(err))
        }
        else {
          err = new Error('User ' + req.params.userId + ' not found')
          err.status = 404
          return next(err)
        }
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .post(authenticate.verifyUser, (req, res, next) => {
    userService.getUser(req.params.userId).
      then(user => {
        if (user != {}) {
          articleService.createArticle({ ...req.body, userId: req.params.userId })
            .then(article => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(article)
            }, (err) => next(err))
            .catch(err => next(err))
        }
        else {
          err = new Error('User ' + req.params.userId + ' not found')
          err.status = 404
          return next(err)
        }
      }, (err) => next(err))
      .catch((err) => next(err))

  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /users/' + req.params.userId + '/articles')
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    userService.getUser(req.params.userId).
      then(user => {
        if (user != {}) {
          articleService.deleteAllArticlesByUserId(req.params.userId)
            .then(resp => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(resp)
            }, (err) => next(err))
            .catch(err => next(err))
        }
        else {
          err = new Error('User ' + req.params.userId + ' not found')
          err.status = 404
          return next(err)
        }
      }, (err) => next(err))
      .catch((err) => next(err))
  })

userRouter.route('/:userId/articles/:articleId')
  .get(authenticate.verifyUser, (req, res, next) => {
    userService.getUser(req.params.userId).
      then(user => {
        if (user && user != {}) {
          articleService.getArticlesByUserId(req.params.userId)
            .then(articles => {
              if (articles && articles.length > 0) {
                articleService.getArticle(req.params.articleId)
                  .then(article => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(article)
                  }, (err) => next(err))
                  .catch(err => next(err))
              }
              else {
                err = new Error('User ' + req.params.userId + ' has no articles')
                err.status = 404
                return next(err)
              }
            }, (err) => next(err))
            .catch(err => next(err))
        }
        else {
          err = new Error('User ' + req.params.userId + ' not found')
          err.status = 404
          return next(err)
        }
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /users/' + req.params.userId + '/articles/' + req.params.articleId)
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    userService.getUser(req.params.userId).
      then(user => {
        if (user && user != {}) {
          articleService.getArticlesByUserId(req.params.userId)
            .then(articles => {
              if (articles && articles.length > 0) {
                articleService.updateArticle(req.params.articleId, req.body)
                  .then(resp => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(resp)
                  }, (err) => next(err))
                  .catch(err => next(err))
              }
              else {
                err = new Error('User ' + req.params.userId + ' has no articles')
                err.status = 404
                return next(err)
              }
            }, (err) => next(err))
            .catch(err => next(err))
        }
        else {
          err = new Error('User ' + req.params.userId + ' not found')
          err.status = 404
          return next(err)
        }
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    userService.getUser(req.params.userId).
      then(user => {
        if (user && user != {}) {
          articleService.getArticlesByUserId(req.params.userId)
            .then(articles => {
              if (articles && articles.length > 0) {
                articleService.deleteArticle(req.params.articleId)
                  .then(resp => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(resp)
                  }, (err) => next(err))
                  .catch(err => next(err))
              }
              else {
                err = new Error('User ' + req.params.userId + ' has no articles')
                err.status = 404
                return next(err)
              }
            }, (err) => next(err))
            .catch(err => next(err))
        }
        else {
          err = new Error('User ' + req.params.userId + ' not found')
          err.status = 404
          return next(err)
        }
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  
module.exports = userRouter;
