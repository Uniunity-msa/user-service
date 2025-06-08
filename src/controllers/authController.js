const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");


exports.loginPage = (req, res) => {
  return res.render("login.html");
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  //console.log(email);

  const userModel = new User();
  const user = await userModel.getUserInfo(email);
  
  //console.log(user);

  // 이메일 존재하지 않음
  if (!user.loginStatus) {
    return res.status(401).json({ message: "이메일이 존재하지 않습니다." });
  }

  // 비밀번호 불일치
  const valid = await bcrypt.compare(password, user.psword);
  if (!valid) {
    return res.status(401).json({ message: "비밀번호가 틀렸습니다." });
  }


  // Access Token 생성
  const accessToken = jwt.sign(
    { userEmail: user.user_email, nickname: user.user_nickname },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );

  // Refresh Token 생성
  const refreshToken = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일
  // Refresh Token 저장
  await userModel.saveRefreshToken(user.user_email, refreshToken, expiresAt);


  // 쿠키 설정
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false, // HTTPS에서만 동작
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, // 15분 정도 유효 (ex: access token 유효기간)
    path: "/"
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    path: "/"
  });

  // 응답
  return res.json({
    message: "로그인 성공"
    //accessToken,
    //refreshToken
  });  
}

// 토큰
exports.me = async (req, res) => {
    
  try {
    const userEmail = req.user.userEmail;

    const userModel = new User();
    const user = await userModel.getUserInfo(userEmail);

    if (!user.loginStatus) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 비밀번호는 제외하고 응답
    delete user.psword;

    return res.json(user);
  } catch (err) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};



exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "리프레시 토큰이 없습니다." });
    }

    const userModel = new User();
    
    // const savedToken = await userModel.getRefreshTokenByToken(refreshToken);
    // if (!savedToken) {
    //   return res.status(404).json({ message: "토큰이 존재하지 않거나 이미 삭제되었습니다." });
    // }

    // DB에서 refreshToken 삭제
    await userModel.deleteRefreshToken(refreshToken);

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false, // 프로덕션에선 true
      sameSite: "Strict",
      path: "/"
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      path: "/"
    });

    return res.status(200).json({ message: "로그아웃 완료" });

  } catch (err) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};