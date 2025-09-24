const jwt = require('jsonwebtoken');

function verifyJWT(role) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ASas12.,');

      if (role && decoded.role !== role) {
        return res.status(403).json({ error: 'Forbidden: Role mismatch' });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

module.exports = { verifyJWT };