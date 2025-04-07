const User = require("../models/user");
const sendEmailWithAuthorization = require("../../mailer");
const bcrypt = require('bcrypt');

//agreement
exports.agreement = (req, res) => {

    return res.render("agreement.html");
};

// 회원가입
exports.signup = (req, res) => {

    return res.render("signup.html");
};

exports.duplicateCheckEmail = async (req, res) => {
    const user = new User({
        user_email: req.body.user_email
    })
    const response = await user.duplicateCheckEmail();
    return res.json(response)
    
};

exports.emailAuth = async (req, res) => {
    const emailAdderess = req.body.email;

    sendEmailWithAuthorization(emailAdderess)
        .then((authentication_code) => {
            return res.json({
                "status": 201,
                "authentication_code": authentication_code
            })
        })
        .catch((err) => {
            console.error('An error occurred:', err);
            return res.json({
                "status": 500,
                "err": err
            }
            );
        });
}

exports.register = async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.psword, 10)
        const user = new User({
            user_email: req.body.user_email,
            psword: hashedPassword,
            user_name: req.body.user_name,
            user_type: req.body.user_type,
            user_nickname: req.body.user_nickname,
            university_id: req.body.university_id,
            user_marketing: req.body.user_marketing,
        });
        const response = await user.register();
        return res.json(response)
    } catch (err) {
        return res.json(err)
    }
}




exports.forgotpassword = (req, res) => {

    return res.render("forgotpassword.html");
};

exports.modifyNickname = (req, res) => {

    return res.render("modifyNickname.html");
};

exports.modifyPassword = (req, res) => {

    return res.render("modifyPassword.html");
};

exports.withdrawal = (req, res) => {

    return res.render("withdrawal.html");
};
