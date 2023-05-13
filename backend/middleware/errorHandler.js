import ErrorResponse from '../utils/ErrorResponse.js';

//first parameter err ? read at NodeJS Fundamentals notes; search there for "an argument to the next()"
const errorHandler = (err, req, res, next) => {

  let error = { ...err };

  if (err.name === 'CastError') {
    error = new ErrorResponse(`Resource not found with id of ${err.value}`, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Errror'
  });
};

export default errorHandler;