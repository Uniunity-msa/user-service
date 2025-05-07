const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const refreshToken = req.headers['x-refresh-token']; // 헤더에서 리프레시 토큰
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "액세스 토큰 없음" });
    }

    const accessToken = authHeader.split(" ")[1];

    console.log(refreshToken);
    console.log(accessToken);

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        return next(); // 유효한 accessToken


      } catch (err) {
        if (err.name === "TokenExpiredError") {
          // 액세스 토큰 만료 → 리프레시 토큰 검증 시도
          if (!refreshToken) {
            return res.status(401).json({ message: "리프레시 토큰 없음" });
          }
    
          const userModel = new User();
          const savedToken = await userModel.getRefreshTokenByToken(refreshToken);

          console.log(savedToken);
    
          if (!savedToken) {
            return res.status(403).json({ message: "리프레시 토큰 만료 또는 무효" });
          }
    
          // 새 Access Token 생성
          const newAccessToken = jwt.sign(
            {
              userEmail: savedToken.user_email,
              nickname: savedToken.user_nickname,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
          );
    
          // 👉 클라이언트에게 새 accessToken을 헤더로 전달
          res.setHeader("x-access-token", newAccessToken);
    
          // 미들웨어 통과하도록 새 user 정보 세팅
          req.user = jwt.verify(newAccessToken, process.env.JWT_SECRET);
          return next();
        }
    
        return res.status(401).json({ message: "유효하지 않은 토큰" });
      }
    };