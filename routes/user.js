const auth = require('basic-auth');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models').User;


// Get a sign up form
router.get('/signup', function(req, res){
  res.render('user/sign-up');
});

// Get a sign in form
router.get('/signin', function(req, res){
  res.render('user/sign-in');
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
router.post('/', function(req, res, next) {
  if (req.body.password !== req.body.confirmPassword) {
    const errorMessage = "Password and confirm password need to match!";
    res.render('user/sign-up', { user: User.build(req.body), errorMessage: errorMessage });
  } else {
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }).then(function(user){
      req.session.userId = user.id;
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
  }
});


// User sign in route
router.post('/signin', function(req, res, next){
  const email = req.body.email;
  const inputPassword = req.body.password;

  User.findOne({ where: { email: email } })
  .then(function(user){
    if (!user) {
      res.render('user/sign-in', { errors: "Email doesn't match!"} );
    } else {
      bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (result == true) {
          console.log("Logged in!");
          req.session.userId = user.id;
          res.locals.currentUser = req.session.userId;
          res.render("index", { user: user });
        } else {
          res.render('user/sign-in', { errors: "Password doesn't match!"});
        }
      });
    }
  })
  .catch(function(err){
    res.render('user/sign-in', { errors: "Login failed!"} );
  });
});


router.get('/logout', function(req, res, next){
  if (req.session) {
    // delete session object
    req.session.destroy(function(err){
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});



module.exports = router;
