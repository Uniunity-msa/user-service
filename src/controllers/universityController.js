const University_user = require("../models/university/university");
const Partner_user = require("../models/university/partner");
const User = require("../models/user");

// user
exports.findAllUniversityName = async (req, res) => {
    const university_user = new University_user();
    const response = await university_user.showUniversityNameList();

    //console.log(response);
    return res.json(response);
};

// partner
const University_partner = new Partner_user();

// 대학 ID 조회
exports.getUniversityID = async (req, res) => {
    const { university_url } = req.query;
    const response = await University_partner.getUniversityID(university_url);
    return res.json(response);
};

// 대학 이름 조회
exports.getUniversityName = async (req, res) => {
    const { university_url } = req.query;
    const response = await University_partner.getUniversityName(university_url);
    return res.json(response);
};

// 대학 위치 조회
exports.getUniversityLocation = async (req, res) => {
    const { university_id } = req.query;
    const response = await University_partner.getUniversityLocation(university_id);
    return res.json(response);
};

// 대학 전체 정보 조회
exports.showUniversity = async (req, res) => {
    const { university_url } = req.query;
    const response = await University_partner.showUniversity(university_url);
    return res.json(response);
};

// 대학 이름으로 대학 ID 조회
exports.getUniversityIDByName = async (req, res) => {
    const { university_name } = req.query;
    const response = await University_partner.getUniversityID_name(university_name);
    return res.json(response);
};


