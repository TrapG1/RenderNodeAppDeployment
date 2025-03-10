// utils/middleware.js
import jwt from 'jsonwebtoken';
import { SECRET } from './config.js';
const requestLogger = (req, res, next) => {
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('---');
    next();
};

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
    // no next, it should be the last middleware
};


// Extract and verify the token from the request header
// decode token to identify the user that it belongs to 
//and save that in the req to use in other middlewear/routers
const tokenExtractor = (req, res, next) => {
  //requests that dont need token
    if (req.method === 'POST' && req.path === '/api/users') {
      return next();
    }
    else if (req.method === 'POST' && req.path === '/api/testing/reset') {
      return next();
    }
    const authorization = req.get('authorization');    
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.replace('Bearer ', '');
      // Decode the token and verify it
      jwt.verify(token, SECRET, (err, decodedToken) => {
        //execute this callback function after vreification 
        if (err) {
          return res.status(401).json({ error: 'Token invalid or expired' });
        }
        req.user = decodedToken; // Attach user info to req
        
        next(); // Continue to the next middleware/route handler
      });
    } else {
      return res.status(401).json({ error: 'Token missing or invalid' });
    }
};


const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
  } else if (error.code === 11000) {
      return res.status(400).json({ error: 'expected `username` to be unique' });
  } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'token invalid' });
  } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'token expired' });
  } else if (error.message === 'Failed to delete person') {
      return res.status(500).json({ error: 'Failed to delete person' });
  }

  res.status(500).send({ error: 'something went wrong' });
  next(error);
};


// Export all middleware functions as a default export
export default {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor
};
