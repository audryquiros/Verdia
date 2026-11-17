export function errorHandler(error, _req, res, _next) {
  console.error('[Verdia API]', error);

  const status = error.statusCode || error.status || 500;
  res.status(status).json({
    message: error.message || 'Error interno del servidor.',
  });
}
