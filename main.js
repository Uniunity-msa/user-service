const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const rabbitMQ = require("./src/rabbit/universityRabbitMQ");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const app = express();

// 정적 파일
app.use(express.static(path.join(__dirname, "src/public")));

// 뷰 엔진 설정
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// sql db 연결
const pool = require("./src/config/db");

//RabbitMQ 연결 및 메시지 소비
(async () => {
  try {
      await rabbitMQ.connectToRabbitMQ();
      console.log('RabbitMQ 연결 및 메시지 소비 준비 완료');
  } catch (err) {
      console.error("RabbitMQ 연결 실패:", err);
      process.exit(1);
  }
})();

//쿠키 사용
app.use(cookieParser());

// POST 요청 파싱
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// cors 정책 허용
const allowedOrigins = [
  "http://post-service:3000",
  "http://start-service:3001",     
  "http://partner-service:3003",       
  "http://post-reaction-service:3002"
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS 차단: 허용되지 않은 origin"));
    }
  },
  credentials: true
}));

// 라우터 등록
app.use("/auth", require("./src/routes/authRoutes")); 
app.use("/user", require("./src/routes/userRoutes")); 
app.use("/university", require("./src/routes/universityRoutes")); 



module.exports = app;
