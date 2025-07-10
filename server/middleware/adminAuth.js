//  creat auth middleware for admin routes
const jwt = require('jsonwebtoken');
const AdminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded.id;
    req.role = decoded.role; // Store role in request for further use
    if (req.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied, admin only' });
    }

    next();
  } catch (err) {
    res.status(400).json({ msg: 'Invalid token' });
  }
};

module.exports = AdminAuth;