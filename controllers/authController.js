const User = require('../models/Users');
const jwt = require('jsonwebtoken');

// handle errors
const errorHandler = (error) => {
  console.log(error.message, error.code);
  // error.code relates to the 'unique' case in our schema

  let errors = {
    email: '',
    password: '',
  };

  // login incorrect email/password
  if (error.message === 'incorrect email and/or password') {
    errors.email = error.message;
    errors.password = error.message;
  }

  // duplicate errors
  if (error.code === 11000) {
    errors.email = 'That email address is already registered';
    return errors;
  }

  // validation errors
  if (error.message.includes('user validation failed')) {
    // take the errors object and get the values inside
    // returns an array which we can loop over:
    Object.values(error.errors).forEach(({ properties }) => {
      // access 'errors' object and for each key (path) update its value with the error message:
      errors[properties.path] = properties.message;
    });
  }
  // cycles through the values of the error, finds the message for each one and updates an errors object with that message.
  return errors;
};

// store the maximum token age
const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

// create a JSON Web Token
const createToken = (id) => {
  // id is used in the payload of the JWT
  // id is from our user instance when saving to db
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge, // expects time in seconds
  });
  // sign method accepts a payload, a secret and an options object
  // the headers automatically get applied.
  // secret should not be published anywhere (i.e. repository)
};
// returns us a token with a signature.

// route handler functions
const signup_get = (req, res) => {
  res.render('signup');
};

const login_get = (req, res) => {
  res.render('login');
};

const signup_post = async (req, res) => {
  // data parsed to req object (express json parser middleware)
  const { email, password } = req.body;

  // create a new user in the database
  try {
    const user = await User.create({ email, password });
    // creates an instance of a user locally and then saves it to the database.
    // pass in an object that defines our user and must match our defined schema.

    // create and receive an instance of our token
    const token = createToken(user._id);

    // place token in a cookie send to the browser as a response
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ user: user._id });
    // once finished send back the user as json to whatever sent the request (browser/postman).
  } catch (error) {
    const errors = errorHandler(error);
    res.status(400).json({ errors });
  }
};

const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    // login static method created by us in Users.js

    // create and receive an instance of our token
    const token = createToken(user._id);

    // place token in a cookie send to the browser as a response
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    // send back the user id
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = errorHandler(error);
    res.status(400).json({ errors });
  }
};

const logout_get = (req, res) => {
  // replace the JWT cookie with a blank cookie and short expiry
  res.cookie('jwt', '', { maxAge: 1 });
  // if jwt exists replace with empty string

  // redirect to homepage
  res.redirect('/');
};

// A comment pointed out the process of replacing the JWT is not an entirely secure approach:

// "let's say if the expiry time of the cookie is 10 hours from the issued at time, then if the user logs out the jwt is just removed from the cookies but the jwt is still valid. If an attacker has got the JWT in some way then he can impersonate the user. The correct approach is to blacklist the JWT token by storing in some table and periodically cleaning it after the expiry time using some cron job."

module.exports = {
  signup_get,
  login_get,
  signup_post,
  login_post,
  logout_get,
};
