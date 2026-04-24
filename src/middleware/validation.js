export function validateIdParam(paramName) {
  return (req, res, next) => {
    const raw = req.params[paramName];
    const id = parseInt(raw, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    req.params[paramName] = id;
    next();
  };
}