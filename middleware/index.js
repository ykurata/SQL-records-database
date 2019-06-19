function loggedOut(req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect('/records');
  } else {
    return next();
  }
}

function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    const err = "You must be logged in!";
    err.status = 401;
    res.render('requiresLogin', { err: err });
    return next();
  }
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;
