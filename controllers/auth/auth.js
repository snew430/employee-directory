const router = require("express").Router();
const passport = require("passport");

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
    if (!req.user.first_name) {
      res.redirect("/profile");
    } else {
      res.redirect("/directory");
    }
  }
);

router.get("/session", async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
