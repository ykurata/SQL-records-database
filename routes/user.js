const auth = require('basic-auth');
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models').User;


// Get a sign up form
router.get('/', function(req, res){
  res.render('user/sign-up');
});


// Post user route
router.post('/', function(req, res, next){
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcryptjs.hashSync(req.body.password)
  }).then(function(user){
    res.redirect('/records');
  }).catch(function(err){
    if (err.name === "SequelizeValidationError") {
      res.render('user/sign-up', { user: User.build(req.body), errors: err.errors });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.send(500, err);
  });
});

// Get a sign in form
router.get('/signin', function(req, res){
  res.render('user/sign-in');
});


// User sign in route
router.get('/signin', function(req, res, next){
  const { email } = req.body;
  const password = beryptjs.compareSync(req.body.password);

  User.findOne({ where: { email: email, password: password } })
  .then(function(user){
    if (user) {
      console.log("Successfully authenticated");
      req.currentUser = user;
      res.redirect('/records');
    } else {
      res.redirect('/records');
    }
  })
});



module.exports = router;
