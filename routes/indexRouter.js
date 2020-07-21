var express = require('express');
var router = express.Router();
const authenticate = require('../authenticate')
const acl = require('../crud/user-crud')

/* GET home page. */
router.get('/', authenticate.verifyUser, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
