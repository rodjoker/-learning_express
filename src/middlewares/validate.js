const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Formateamos los errores de Zod en una lista limpia
    const issues = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    const error = new Error('Error de validación');
    error.status = 400;
    error.details = issues;
    return next(error);
  }

  // Sobrescribe req.body con los datos ya saneados/parseados por Zod
  req.body = result.data;
  next();
};

module.exports = validate;