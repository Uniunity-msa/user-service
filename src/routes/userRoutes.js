const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/agreement", userController.agreement);
router.get("/signup", userController.signup);
router.get("/forgotpassword", userController.forgotpassword);
router.get("/modify/nickname", userController.modifyNickname);
router.get("/modify/password", userController.modifyPassword);
router.get("/withdrawal", userController.withdrawal);



module.exports = router;