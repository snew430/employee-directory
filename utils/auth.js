const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.status(401).redirect("/");
};

const hasProfile = async (req, res, next) => {
  if (!req.user) {
    res.status(401).redirect("/");
  } else if (!req.user.first_name) {
    next();
  } else {
    res.status(401).redirect("/directory");
  }
};

module.exports = { isLoggedIn, hasProfile };
