export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred.';
  let details = err.details || [];

  // Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_IDENTIFIER';
    message = `Invalid format for resource ID: ${err.value}`;
  }

  // MongoDB Duplicate Key (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_RESOURCE';
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    message = `A resource with ${field} '${value}' already exists.`;
  }

  // Zod Validation Error
  if (err.name === 'ZodError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    details = err.errors.map((e) => {
      // Strip out top-level wrapper ('body', 'query', 'params') from field path
      const fieldPath = e.path.filter((p) => p !== 'body' && p !== 'query' && p !== 'params').join('.');
      return {
        field: fieldPath || 'payload',
        message: e.message,
      };
    });
    // Use first validation message for top-level readability if available
    message = details.length > 0 ? details[0].message : 'Request payload validation failed.';
  }

  // Fallback for general unhandled operational errors
  if (statusCode === 500 && process.env.NODE_ENV === 'development') {
    console.error('Unhandled Server Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code,
      message,
      details,
    },
  });
};
