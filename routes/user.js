const auth = require('basic-auth');
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models').User;


// Get a sign up form
router.get('/signup', function(req, res){
  res.render('user/sign-up');
});


// Post user route
router.post('/', function(req, res, next){
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  }).then(function(user){
    res.session.user = user;
    res.redirect('/records');
  }).catch(function(err){
    if (err.name === "SequelizeValidationError") {
      res.render('user/sign-up', { user: User.build(req.body), errors: err.errors });
    } else if (err.name === " SequelizeUniqueConstraintError") {
      res.render('user/sign-up', { user: User.build(req.body), errors: err.errors });
    } else {
      res.render('user/sign-up', { user: User.build(req.body), errors: err.errors });
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
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } }).then(function(user){
    if (!user) {
      res.redirect('/signin');
      console.log("failed to logged in");
    } else if (!user.validPassword(password)) {
      res.redirect('/signin');
      console.log("Password didn't match");
    } else {
      req.session.user = user;
      res.render('records', { user: user });
      console.log("Successfully logged in!");
    }
  })
  .catch(function(err){
    res.send("Login failed!");
  });
});



module.exports = router;
