const { token } = require("../../token.js");

function isAuthenticated(req, res, next) {
  if (!req.query.token) {
    return res.status(401).json();
  }

  if (req.query.token !== token) {
    return res.status(401).json();
  }

  next();
}

module.exports = {
  isAuthenticated,
};
