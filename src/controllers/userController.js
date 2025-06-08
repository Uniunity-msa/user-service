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

// 이메일 중복 확인
exports.duplicateCheckEmail = async (req, res) => {
    const user = new User({
        user_email: req.body.user_email
    })
    const response = await user.duplicateCheckEmail();
    return res.json(response)
    
};

// 회원정보 반환
exports.info = async (req, res) => {
    const { email } = req.query;

    const user = new User({
        user_email: email
    })
    const response = await user.userInfo();
    return res.json(response)
    
};

// 이메일 코드 인증
exports.emailAuth = async (req, res) => {
    const emailAdderess = req.body.email;

    sendEmailWithAuthorization(emailAdderess)
        .then((authentication_code) => {
            return res.json({
                "status": 200,
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

// 회원 정보 저장
exports.register = async (req, res) => {

    //console.log(req.body);

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
        return res.status(200).json({ success: true, message: "회원가입 완료" });

    } catch (err) {
        return res.json(err)
    }
}



exports.forgotpasswordPage = (req, res) => {

    return res.render("forgotPassword.html");
};
exports.forgotpassword = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.new_psword, 10)
    const user = new User({
        user_email: req.body.user_email,
        new_psword: hashedPassword
    });
    const response = await user.modifyPsword2();
    return res.status(200).json(response);

};


exports.modifyPasswordPage = (req, res) => {

    return res.render("modifyPassword.html");
};
exports.modifyPassword = async (req, res) => {
    //console.log("비밀번호 변경 요청 바디:", req.body);

    const hashedPassword = await bcrypt.hash(req.body.new_psword, 10)
    const user = new User({
        user_email: req.body.user_email,
        new_psword: hashedPassword,
        psword: req.body.psword
    });
    const response = await user.modifyPsword1();
    return res.status(200).json(response);
};



exports.modifyNicknamePage = (req, res) => {

    return res.render("modifyNickname.html");
};
exports.modifyNickname = async (req, res) => {
    const user = new User({
        user_email: req.body.user_email,
        user_nickname: req.body.user_nickname,
    });
    //console.log(user);

    const response = await user.modifyNickname();


    return res.status(200).json(response);
};



exports.withdrawalPage = (req, res) => {

    return res.render("withdrawal.html");
};
exports.withdrawal = async (req, res) => {

    const user = new User({
        user_email: req.body.user_email,
        psword: req.body.psword,
    });
    //console.log(user);
    const response = await user.withdrawalUser(); // 1. 회원 삭제

    // 2. 해당 유저의 모든 Refresh Token 삭제
    await user.deleteRefreshTokenByEmail(req.body.user_email);

    // 3. 쿠키 삭제 (accessToken, refreshToken)
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false, 
        sameSite: "Strict",
        path: "/"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        path: "/"
    });

    return res.status(200).json({ success: true, message: "회원탈퇴 완료" });
};