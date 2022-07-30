require("dotenv").config();
const express = require("express");
const path = require("path");
const passport = require("passport");
require("./config/passport");
const serverSession = require("./config/session");

const routes = require("./controllers");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(serverSession);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "/public")));

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
