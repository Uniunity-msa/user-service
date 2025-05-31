const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const rabbitMQ = require("./src/rabbit/universityRabbitMQ");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const app = express();

// cors 정책 허용
const allowedOrigins = [
  "http://34.22.87.148:3000",
  "http://34.22.87.148:3001",
  "http://34.22.87.148:3002",
  "http://34.22.87.148:3003",
  "http://34.22.87.148:3004"
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("CORS 차단: ", origin);
      // 대신 거부하면 그냥 false 리턴 (에러 객체 말고)
      callback(null, false); 
    }
  },
  credentials: true
}));

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


// 라우터 등록
app.use("/auth", require("./src/routes/authRoutes")); 
app.use("/user", require("./src/routes/userRoutes")); 
app.use("/university", require("./src/routes/universityRoutes")); 



module.exports = app;
