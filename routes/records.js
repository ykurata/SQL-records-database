var express = require('express');
var router = express.Router();
var Record = require('../models').Record;

/* GET users listing. */
router.get('/', function(req, res, next) {
  Record.findAll().then(function(records){
    res.render("records", { records: records });
  }).catch(function(err){
    res.send(500, err);
  });
});


router.get('/new', function(req, res){
  res.render("new-record");
});

module.exports = router;
