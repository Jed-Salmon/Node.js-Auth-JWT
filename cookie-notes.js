// Cookies Notes
// Lesson: https://www.youtube.com/watch?v=mevc_dl1i1I&list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp&index=9

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();

// middleware
app.use(express.static('public'));

// cookie parser middleware
app.use(cookieParser());
// provides access to a 'cookie' method on the response object

// express json parser middleware
app.use(express.json());
// takes json data from a request and parses it into a JavaScript object. Attaches that object with the data to the request object so we can access it in our request handlers.

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI =
  'mongodb+srv://jED:sYFN9SHws4KN2N7N@cluster0.jljg1.mongodb.net/node-auth';
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes);

// cookies
app.get('/set-cookies', (req, res) => {
  // res.setHeader('Set-Cookie', 'newUser=true');
  // newUser is the name and true is the value
  // cookies are tied to the browsers session
  // can access a cookie in Javascript with 'document.cookie'

  // utilise cookie parser package
  res.cookie('newUser', false);
  // if we create a cookie it will look for it in the browser and if it exists already it will replace its value.

  res.cookie('isEmployee', true, {
    maxAge: 1000 * 60 * 60 * 24,
    secure: true,
    httpOnly: true,
  });
  // can pass an options object as the third argument.
  // specify different properties and override default behavior.
  // in our case we set the cookie to expire in one day (1000ms x 60 x 60 x 24).
  // we set secure to true which only sends the cookie over an https connection.
  // httpOnly prevents accessing the cookie from within JavaScript.
  // both options are important because in production you should only use authentication cookies over a secure https connection and don't want them to be accessed or modified in client side code.

  res.send('you got the cookies!');
});

app.get('/read-cookies', (req, res) => {
  // can access cookies on the request
  // available on all handlers as we used cookie parser
  const cookies = req.cookies;
  console.log(cookies);
  res.json(cookies.newUser);
});
