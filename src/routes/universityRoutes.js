const express = require("express");
const router = express.Router();
const universityController = require("../controllers/universityController");


//  모든 대학 반환환
router.get("/findAllUniversityName", universityController.findAllUniversityName); // post

// 대학 URL로 대학 ID 조회
router.get("/university-id", universityController.getUniversityID);

// 대학 URL로 대학 이름 조회
router.get("/university-name", universityController.getUniversityName);

// 대학 ID로 위치 조회
router.get("/university-location", universityController.getUniversityLocation);

// 대학 URL로 전체 대학 정보 조회
// router.get("/university", universityController.showUniversity);

// 대학 이름으로 대학 ID 조회
router.get("/university-id-by-name", universityController.getUniversityIDByName);



module.exports = router;