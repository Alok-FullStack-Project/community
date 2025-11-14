// usage: permit('admin'), permit('representative'), or permit('admin','representative')
module.exports = (...permittedRoles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: 'Not authenticated' });
    if (permittedRoles.includes(req.user.role)) return next();
    return res.status(403).json({ message: 'Forbidden' });
  };
};
