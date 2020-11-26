require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// mongoose fix deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const app = express();

// CORS middleware
app.use(cors());

// Bodyparser middleware
app.use(express.json());

// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See 
// http://expressjs.com/api#app-settings for more details.
app.enable('trust proxy');

// Add a handler to inspect the req.secure flag (see 
// http://expressjs.com/api#req.secure). This allows us 
// to know whether the request was via http or https.
app.use(function (req, res, next) {
  if (req.secure) {
    // request was via https, so do no special handling
    next();
  } else {
    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url);
  }
});

// Routes
app.use('/api/user', require('./api/routes/user'));
app.use('/api/tweet', require('./api/routes/tweet'));

// DB config
const db = process.env.MONGO_URI;

// Connect to database
mongoose.connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  app.use(express.static('client/build'));

  // Express serve up index.html file if it doesn't recognize route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) });
