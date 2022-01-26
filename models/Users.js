const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

// define what user documents should look like in the database
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    // add custom error message for different conditions:
    // encapsulate the value in an array and pass the error message as the second value:
    required: [true, 'Please enter an email'],
    unique: true, // can't add custom error message to unique
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
    // validate: [(value) => {}, "Please enter a valid email"],
    // first position in the array is a function that takes an argument which is the value the user submitted.
    // returns true if valid and false if not (validator).
    // if invalid then throw the error message defined in the second position of the array.
  },
  password: {
    type: String,
    required: [true, 'Please enter an password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
});

// fire a function before doc is saved to database
UserSchema.pre('save', async function (next) {
  // generate a salt
  const salt = await bcrypt.genSalt();
  // combine salt with password and hash it
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// create static method on our User model to login when its created
UserSchema.statics.login = async function (email, password) {
  // compare email value to our database emails
  const user = await this.findOne({ email });
  // 'this' is the user model itself
  if (user) {
    // takes password that is not hashed and compares with hashed
    const auth = await bcrypt.compare(password, user.password);
    // auth will be truthy if it passes and falsy if not.
    if (auth) {
      return user;
    }
    // throw Error('incorrect password');
    // bad practice to reveal which field was incorrect instead:
    throw Error('incorrect email and/or password');
  }
  // throw Error('Incorrect email');
  // bad practice to reveal which field was incorrect instead:
  throw Error('incorrect email and/or password');
}; // creates a login method for our user model

const User = mongoose.model('user', UserSchema);
// first arg must be the singular of our database collection as Mongoose pluralizes it.

module.exports = User;
