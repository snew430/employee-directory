require("dotenv").config();
const { hash } = require("../utils/crypto");
const passport = require("passport");
const { Person } = require("../models");
const GitHubStrategy = require("passport-github2").Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CLIENT_CALLBACK_URL,
    },

    async function (accessToken, refreshToken, profile, done) {
      try {
        const hashId = hash(profile.id.toString());
        // check if user already exists in our db
        const { rowCount, rows } = await Person.findUser({
          github_id: hashId,
        });

        if (rowCount > 0) {
          return done(null, rows[0]);
        } else {
          return done(null, { github_id: hashId });
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);
