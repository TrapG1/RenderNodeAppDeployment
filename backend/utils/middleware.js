// utils/middleware.js

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

const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    res.status(500).send({ error: 'something went wrong' });
    next(error);
};

// Export all middleware functions as a default export
export default {
    requestLogger,
    unknownEndpoint,
    errorHandler
};
