class AppError extends Error {
  constructor({ message, statusCode, type, error }) {
    super(message);
    this.message = message;
    this.code = statusCode;
    this.type = type;
    this.error = error;
  }
}

export default AppError;
