var express = require('express');
var router = express.Router();
var Record = require('../models').Record;
var md = require("node-markdown").Markdown;

/* GET records listing. */
router.get('/', function(req, res, next) {
  Record.findAll({order: [["artist", "ASC"]]}).then(function(records) {
    res.render("records", { records: records });
  }).catch(function(err){
    res.send(500, err);
  });
});


// Get new record form
router.get('/new', function(req, res){
  res.render("new-record");
});


// Creat a new record
router.post('/', function(req, res, next) {
  Record.create(req.body).then(function(record) {
    res.redirect('/records');
  }).catch(function(err){
      if (err.name === "SequelizeValidationError"){
        res.render("new-record", {record: Record.build(req.body), errors: err.errors});
      } else {
        throw err;
      }
  }).catch(function(err){
    res.send(500, err);
  });
});


// Get a specific record
router.get('/:id', function(req, res, next){
  Record.findByPk(req.params.id).then(function(record){
    if (record) {
      res.render('edit', {record: record, md: md} );
    } else {
      res.render("page-not-found");
    }
  });
});


// Get a update page
router.get('/:id/edit', function(req, res, next){
  Record.findByPk(req.params.id).then(function(record){
    if (record){
      res.render("edit", { record: record });
    } else {
      res.render("page-not-found");
    }
  });
});


// Update a specific record
router.post('/:id', function(req, res, next){
  Record.findByPk(req.params.id).then(function(record){
    if (record) {
      return record.update(req.body);
    } else {
      res.render('page-not-found');
    }
  }).then(function(){
    res.redirect('/records');
  }).catch(function(err){
      if(err.name === "SequelizeValidationError") {
        var record = Record.build(req.body);
        record.id = req.params.id;
        res.render('edit', {record: record, md: md, errors: err.errors})
      } else {
        throw err;
      }
  }).catch(function(err){
      res.send(500, err);
  });
});


// Delete a record
router.post("/:id/delete", function(req, res, next){
  Record.findByPk(req.params.id).then(function(record){
    if(record) {
      return record.destroy();
    } else {
      res.send(404);
    }
  }).then(function(){
    res.redirect("/records");
  }).catch(function(err){
    res.send(500, err);
  });
});


module.exports = router;
