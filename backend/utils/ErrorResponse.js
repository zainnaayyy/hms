// we are extending the core Error class why ? read on NodeJS Fundamentals search for "Error class constructor"
//we are going to use this ErrorResponse class to throw explicit error objects which are also going to have a statusCode property along with message property
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  };
}

export default ErrorResponse;