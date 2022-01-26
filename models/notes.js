// Mongoose Hooks - Notes

// LESSON:
// https://www.youtube.com/watch?v=teDkX-_Zkbw&list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp&index=6

const mongoose = require("mongoose");
const { isEmail } = require("validator");

// define what user documents should look like in the database
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    // add custom error message for different conditions:
    // encapsulate the value in an array and pass the error message as the second value:
    required: [true, "Please enter an email"],
    unique: true, // can't add custom error message to unique
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
    // validate: [(value) => {}, "Please enter a valid email"],
    // first position in the array is a function that takes an argument which is the value the user submitted.
    // returns true if valid and false if not (validator).
    // if invalid then throw the error message defined in the second position of the array.
  },
  password: {
    type: String,
    required: [true, "Please enter an password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
});

// fire a function AFTER doc is saved to database
UserSchema.post("save", function (doc, next) {
  // post does not refer to a post request, it instead refers to something happening after something else has happened.
  // first argument is the event that occurs.
  // second argument is a callback function which fires after the event occurs. Takes two arguments, the document which was saved and a method to progress onto the next middleware.
  // non arrow function as we use the 'this' keyword to refer to the instance of the user we're trying to create.
  console.log("new user was created & saved", doc);
  next();
});

// fire a function BEFORE doc is saved to database
UserSchema.pre("save", function (next) {
  // we don't receive the doc as it has not yet been saved
  console.log("user about to be created and saved", this);
  next();
});

const User = mongoose.model("user", UserSchema);
// first arg must be the singular of our database collection as Mongoose pluralizes it.

module.exports = User;
