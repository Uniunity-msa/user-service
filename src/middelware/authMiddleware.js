const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return res.status(401).json({ message: "액세스 토큰 없음" });
  }

  //console.log(accessToken);
  //console.log(refreshToken);

  try {
    // accessToken이 유효할 경우
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // accessToken 만료 → refreshToken 사용
      if (!refreshToken) {
        return res.status(401).json({ message: "리프레시 토큰 없음" });
      }

      const userModel = new User();
      const savedToken = await userModel.getRefreshTokenByToken(refreshToken);

      if (!savedToken) {
        return res.status(403).json({ message: "리프레시 토큰 만료 또는 무효" });
      }

      // 새 accessToken 발급
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false,         
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000, // 15분 (밀리초 기준)
        path: "/"
      });

      // 미들웨어 통과
      req.user = jwt.verify(newAccessToken, process.env.JWT_SECRET);
      return next();
    }

    // 다른 에러
    return res.status(401).json({ message: "유효하지 않은 토큰" });
  }
};
