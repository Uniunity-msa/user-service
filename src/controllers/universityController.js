const University = require("../models/university");

exports.findAllUniversityName = async (req, res) => {
    const university_name = new University();
    const response = await university_name.showUniversityNameList();
    return res.json(response);
};

