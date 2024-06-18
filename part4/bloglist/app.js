const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const app = express();
const mongoose = require('mongoose');
const { handleError, tokenExtractor, userExtractor } = require('./utils/middleware');

mongoose.connect(config.BLOGLIST_URI);

app.use(cors());
app.use(express.json());

app.use(tokenExtractor);

app.use('/api/blogs', userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(handleError);

module.exports = app;
