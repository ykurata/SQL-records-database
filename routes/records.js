const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const express = require('express');
const router = express.Router();
const md = require("node-markdown").Markdown;

const Record = require('../models').Record;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


// // User authentication middleware
// const authenticateUser = (req, res, next) => {
//   const credential = auth(req);
//
//   if (credential) {
//     User.findOne({ email: credential.name }, function(err, user){
//       if (err) return next(err);
//
//       if (user) {
//         const authenticated = bcryptjs.compareSync(credential.pass, user.password);
//
//         if (authenticted) {
//           console.log(`Authentication successful for email address: ${credential.name}`);
//           req.currentUser = user;
//           next();
//         } else {
//           const err = new Error("Incorrect password. Please try again!");
//           err.status = 401;
//           next(err);
//         }
//       } else {
//         err = new Error(`User not found for email address: ${credential.name}`);
//       }
//     });
//   } else {
//     const err = new Error("Authentication is required!");
//     err.status = 401;
//     next(err);
//   }
// }
// const app = express();
// const session = require('express-session');
// app.use((req, res, next) => {
//     if (req.cookies.user_sid && !req.session.user) {
//         res.clearCookie('user_sid');
//     }
//     next();
// });
// app.use(session({
//     key: 'user_sid',
//     secret: 'somerandonstuffs',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         expires: 600000
//     }
// }));
// middleware function to check for logged-in users
// const sessionChecker = (req, res, next) => {
//     if (req.session.user && req.cookies.user_sid) {
//         res.redirect('/records');
//     } else {
//         next();
//     }
// };

/* GET records listing. */
router.get('/', function(req, res, next) {
  Record.findAll({order: [["artist", "ASC"]]}).then(function(records) {
    res.render("records", { records: records });
  }).catch(function(err){
    res.send(500, err);
  });
});


//Get new record form
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


// Search records
router.get('/search', function(req, res){
  const { term } = req.query;  // same as req.query.term

  // Make lowercase
  term = term.toLowerCase();
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
