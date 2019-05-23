var express = require('express');
var router = express.Router();
var Record = require('../models').Record;

/* GET users listing. */
router.get('/', function(req, res, next) {
  Record.findAll({order: [["createdAt", "DESC"]]}).then(function(records) {
    res.render("records", { records: records });
  })
});


// Get new record form
router.get('/new', function(req, res){
  res.render("new-record");
});


// Creat a new record
router.post('/', function(req, res, next){
  Record.create(req.body).then(function(record){
    res.redirect("/records/" + record.id);
  });
});


router.get('/:id', function(req, res, next){
  Record.findByPk(req.params.id).then(function(record){
    if (record) {
      res.render("record-detail", { record: record });
    } else {
      res.render("page-not-found");
    }
  });
})

module.exports = router;
