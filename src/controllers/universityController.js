const University = require("../models/university");

exports.findAllUniversityName = async (req, res) => {
    const university_name = new University();
    const response = await university_name.showUniversityNameList();

    console.log(response);
    return res.json(response);
};

