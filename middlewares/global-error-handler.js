// This middleware is used to handle all the errors that are not handled by the application
export const globalErrorHandler = (err, req, res, next) => {
  // Set default error status code to 500
  const statusCode = err?.statusCode ? err?.statusCode : 500;
  const stack = err?.stack;
  const message = err?.message;
  // If the error is a validation error, return a custom error message
  return res.status(statusCode).json({
    message,
    stack,
    statusCode,
  });
};

// 404 Error Handler
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req?.originalUrl}`);
  res.status(404);
  next(error);
};
