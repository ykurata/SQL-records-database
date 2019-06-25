const express = require('express');
const router = express.Router();
const md = require("node-markdown").Markdown;

const Record = require('../models').Record;
const mid = require('../middleware');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


/* GET records listing. */
router.get('/', function(req, res, next) {
  Record.findAll({order: [["artist", "ASC"]]}).then(function(records) {
    res.render("records", { records: records });
  }).catch(function(err){
    res.send(500, err);
  });
});


//Get a new record form
router.get('/new', mid.requiresLogin, function(req, res){
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


// Search records
router.get('/search', function(req, res){
  const { term } = req.query;  // same as req.query.term

  // Make lowercase
  // term = term.toLowerCase();
  Record.findAll({where: {[Op.or]: [
      {
        artist: {
          [Op.like]: '%' + term + '%'
        }
      },
      {
        title: {
          [Op.like]: '%' + term + '%'
        }
      },
      {
        genre: {
          [Op.like]: '%' + term + '%'
        }
      },
  ]}})
      .then(function(records){
        if (records.length == 0) {
          res.render("no-result", { term: term });
        } else {
          res.render("records", { records: records});
        }
      })
      .catch(function(err){
        res.send(500, err);
      });
});


//Get a specific record
router.get('/:id', function(req, res, next){
  Record.findByPk(req.params.id).then(function(record){
    if (record){
      res.render("edit", { record: record, md: md });
    } else {
      res.render("page-not-found");
    }
  });
});


// Get a update page
router.get('/:id/edit', mid.requiresLogin, function(req, res, next){
  Record.findByPk(req.params.id).then(function(record){
    if (record){
      res.render("edit", { record: record });
    } else {
      res.render("page-not-found");
    }
  });
});


// Update a specific record
router.post('/:id', mid.requiresLogin, function(req, res, next){
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
router.post("/:id/delete", mid.requiresLogin, function(req, res, next){
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
