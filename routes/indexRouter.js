var express = require('express');
var router = express.Router();
const authenticate = require('../authenticate')
const acl = require('../user-roles/user-access')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
