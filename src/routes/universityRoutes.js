const express = require("express");
const router = express.Router();
const universityController = require("../controllers/universityController");

router.get("/findAllUniversityName", universityController.findAllUniversityName); // post

module.exports = router;