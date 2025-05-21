const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/agreement", userController.agreement);
router.get("/signup/:marketing", userController.signup);

router.get("/forgotpassword", userController.forgotpasswordPage); //3
router.get("/modify/password", userController.modifyPasswordPage); //2
router.get("/modify/nickname", userController.modifyNicknamePage);

router.post("/forgotpassword", userController.forgotpassword);
router.post("/modify/password", userController.modifyPassword);
router.post("/modify/nickname", userController.modifyNickname);

router.get("/withdrawal", userController.withdrawalPage);
router.post("/withdrawal", userController.withdrawal);

router.get("/info", userController.info);
router.post("/duplicateCheckEmail", userController.duplicateCheckEmail);
router.post("/emailAuth", userController.emailAuth);
router.post("/register", userController.register);


module.exports = router;