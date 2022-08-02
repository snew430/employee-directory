require("dotenv").config();
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const passport = require("passport");

const routes = require("./controllers");
const ContentSecurityPolicy = require("./config/helmet");
const serverSession = require("./config/session");
const hotlink = require("./utils/hotlink");
const app = express();
const PORT = process.env.PORT || 3001;

require("./config/passport");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ContentSecurityPolicy);
app.use(
  helmet.referrerPolicy({
    policy: "no-referrer",
  })
);
app.use(helmet.noSniff());

app.use(serverSession);
app.use(passport.initialize());
app.use(passport.session());
app.use(hotlink);

app.use(express.static(path.join(__dirname, "/public")));

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
