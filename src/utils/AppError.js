class AppError extends Error {
  constructor(message, statusCode, type, error = null) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.originalError = error;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
