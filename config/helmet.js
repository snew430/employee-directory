const helmet = require("helmet");

const ContentSecurityPolicy = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    fontSrc: ["'self'"],
    imgSrc: ["'self'"],
    styleSrc: [
      "'self'",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css",
    ],
  },
  reportOnly: false,
});

module.exports = ContentSecurityPolicy;
