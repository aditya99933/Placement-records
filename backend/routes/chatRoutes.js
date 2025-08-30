const express = require("express");
const userMiddleware = require("../middlewares/userMiddleware");
const rateLimitMiddleware = require("../middlewares/rateLimitMiddleware");
const { chatHandler } = require("../controllers/chatcontroller");
const router = express.Router();

router.post("/message", userMiddleware, rateLimitMiddleware, chatHandler);

module.exports = router;