const permissions = {
    admin: ['admin'],
    user: ['user']
};
  
const checkPermission = (permission) => {
    return (req, res, next) => {
      const userPermission = req.decoded.role;
  
      if (permissions[permission].includes(userPermission)) {
        // User has the required permission, allow access to the route
        next();
      } else {
        // User does not have the required permission, return a forbidden error
        res.status(403).json({ error: 'Forbidden' });
      }
    };
};
  
module.exports = {
    checkPermission,
};
  