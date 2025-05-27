const errorHandler = (err, _req, res, _next) => {
  const development = process.env.NODE_ENV === "development";
  const statusCode = err.statusCode || 500;
  const message =
    !err.message && statusCode === 500 ? "We encountered an error, please try again" : err.message;

  if (development) {
    console.error("Error Stack:", err.stack, "\n");
    if (statusCode === 500) console.error("Full Error:", err, "\n");
  }

  res.status(statusCode).json({
    message,
    ...(development && { stack: err.stack }),
  });
};

export default errorHandler;
