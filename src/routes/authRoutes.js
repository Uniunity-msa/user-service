const express = require("express");
const router = express.Router();
const userController = require("../controllers/authController");

router.get("/login", userController.login); // post

module.exports = router;