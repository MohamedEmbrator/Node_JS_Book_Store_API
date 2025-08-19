const jwt = require("jsonwebtoken");


// Verify JWT Token
function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid Token" });
    }
  } else {
    res.status(401).json({ message: "No Token Provided" });
  }
}


// Verify Token & Authorize the User
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "You Are Not Allowed, You Can Update Your Profile Only" });
  }
  });
}

// Verify Token & Admin
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "You Are Not Allowed, Only Admin Allowed" });
  }
  });
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
