const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
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
app.get('*', checkUser); // * will apply to every single route
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);
