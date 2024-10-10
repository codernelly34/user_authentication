import "dotenv/config";

const errorHandler = (err, _req, res, _next) => {
  const development = process.env.NODE_ENV === "development";
  const stack = development ? err.stack : null;

  if (development) console.log(stack);

  res.status(err.code).json({ message: err.message, stack });
};

export { errorHandler };
