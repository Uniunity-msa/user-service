const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/agreement", userController.agreement);
router.get("/signup/:marketing", userController.signup);

router.get("/forgotpassword", userController.forgotpassword);
router.get("/modify/nickname", userController.modifyNickname);
router.get("/modify/password", userController.modifyPassword);

router.get("/withdrawal", userController.withdrawal);

router.post("/duplicateCheckEmail", userController.duplicateCheckEmail);
router.post("/emailAuth", userController.emailAuth);
router.post("/register", userController.register);

module.exports = router;