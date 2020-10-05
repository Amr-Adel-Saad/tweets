require('dotenv').config({path: __dirname + '/.env'});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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

// Serve static assets
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/user', require('./api/routes/user'));
app.use('/api/tweet', require('./api/routes/tweet'));

// DB config
const db = process.env.MONGO_URI;

// Connect to database
mongoose.connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) });
