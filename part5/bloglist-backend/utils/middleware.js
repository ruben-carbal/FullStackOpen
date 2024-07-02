const jwt = require('jsonwebtoken');
const User = require('../models/user');

const handleError = (error, request, response, next) => {
  console.error('error.message');

  if (error.name === 'MongoServerError') {
    response.status(400).json({ error: 'The user already exists' });
  } else if (error.name === 'ValidationError') {
    response.status(400).json({ error: 'You should type a valid username' });
  } else if (error.name === 'TypeError') {
    response.status(401).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    response.status(401).json({ error: 'Invalid Token ' });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  }

  next();
};

const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'invalid token' });
    }

    const user = await User.findById(decodedToken.id);
    request.user = user;
  }

  next();
};

module.exports = { handleError, tokenExtractor, userExtractor };
