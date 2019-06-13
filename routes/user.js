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

router.get('/all', function(req, res) {
  User.findAll({}).then(function(users){
    res.render('user/all-user', { users: users });
  });
})

router.get('/:id', function(req, res, next){
  User.findByPk(req.params.id).then(function(user){
    res.render('user/user', { user: user });
  })
})

router.post('/:id/delete', function(req, res, next){
  User.findByPk(req.params.id).then(function(user){
    return user.destroy();
  })
  .then(function(){
    res.redirect('/user/all');
  });
});



// Post user route
router.post('/', function(req, res, next){
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  }).then(function(user){
    // res.session.user = user;
    res.redirect('/records');
  }).catch(function(err){
    if (err.name === "SequelizeValidationError") {
      res.render('user/sign-up', { user: User.build(req.body), errors: err.errors });
    } else {
      // res.render('user/sign-up', { user: User.build(req.body), errors: err.errors });
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
  const email = req.query.email;
  const password = req.query.password;

  User.findOne({ where: { email: email } }).then(function(user){
    if (!user) {
      res.send("failed to logged in");
      res.redirect('/signin');
    } else if (!user.validPassword(password)) {
      res.send("Password didn't match");
      res.redirect('/signin');
    } else {
      req.session.user = user;
      res.send("Successfully logged in!");
      res.render('records', { user: user });
    }
  })
  .catch(function(err){
    res.send("Login failed!");
  });
});



module.exports = router;
