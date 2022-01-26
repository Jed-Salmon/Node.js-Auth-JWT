// middleware to check the authentication status and is applied to any route that requires authentication.

// this middleware is placed in front of the route and will fire first of all. If it finds no token then it will not carry on with the request handler and instead re-direct to the login page.

const e = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const requireAuth = (req, res, next) => {
  // retrieve the token
  const token = req.cookies.jwt;
  // detect if the JWT cookie exists on the request
  if (token) {
    // verify JWT is authentic and hasn't been tampered with
    // must use the same secret we used to sign the token
    jwt.verify(token, 'net ninja secret', (error, decodedToken) => {
      // function fires after the check and returns an error or a decoded token.
      if (error) {
        console.log(error.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    // redirect to login
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  // check if token exists
  if (token) {
    // verify JWT is authentic and hasn't been tampered with
    jwt.verify(token, 'net ninja secret', async (error, decodedToken) => {
      if (error) {
        console.log(error.message);
        res.locals.user = null;
        // must provide the user property as we perform a check against it in our views - i.e. user ? user.email / logout : signup / login
        next();
      } else {
        console.log(decodedToken);
        // find user
        let user = await User.findById(decodedToken.id);
        // if we have a valid user and found that user in the database, pass that user into the view so we can access properties on it it:
        res.locals.user = user;
        // res.locals property is an object that contains response local variables scoped to the request and because of this, it is only available to the view/views rendered during that request/response cycle.
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
