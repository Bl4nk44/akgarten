export function authRequired(req, res, next) {
  const token = process.env.ADMIN_TOKEN || '';
  const isProd = (process.env.NODE_ENV || 'production') === 'production';

  if (!isProd) {
    // W dev bez tokena przepuszczamy dla wygody
    return next();
  }
  if (!token) {
    return res.status(503).json({ message: 'ADMIN_TOKEN nie skonfigurowany' });
  }
  const header = req.headers['authorization'] || '';
  const ok = header === `Bearer ${token}`;
  if (!ok) return res.status(401).json({ message: 'Unauthorized' });
  return next();
}
