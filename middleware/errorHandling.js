// 404 Not Found Handler
const notFound = (req, res, next) => {
  res.status(404).render("errors/404", {
    url: req.originalUrl,
  });
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  console.error("Error occurred:", err);

  // Set status code
  const statusCode = err.statusCode || 500;

  // Don't expose stack traces in production
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong. Please try again later."
      : err.message;

  const stack = process.env.NODE_ENV === "production" ? null : err.stack;

  // If headers already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Render error page
  res.status(statusCode).render("errors/500", {
    message,
    stack,
    statusCode,
  });
};

module.exports = { notFound, errorHandler };
