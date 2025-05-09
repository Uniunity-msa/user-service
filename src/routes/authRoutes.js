const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middelware/authMiddleware");

router.get("/login", authController.loginPage); // post
router.post("/login", authController.login);

router.get("/me", authMiddleware, authController.me); 

router.post("/logout", authController.logout);


module.exports = router;