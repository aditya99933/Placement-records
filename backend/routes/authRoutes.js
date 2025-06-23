const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authcontroller.js");


router.post("/login", login);

module.exports = router;


