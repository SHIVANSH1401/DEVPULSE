export const validateRequest = (schema) => async (req, res, next) => {
  try {
    const validated = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // Overwrite with parsed & sanitized values
    if (validated.body !== undefined) req.body = validated.body;
    if (validated.query !== undefined) req.query = validated.query;
    if (validated.params !== undefined) req.params = validated.params;
    next();
  } catch (error) {
    next(error);
  }
};
