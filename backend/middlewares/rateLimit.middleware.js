const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per 15 minutes
    message: {
      success: false,
      message: "Too many attempts. Try again later.",
    },
});

module.exports = rateLimiter;