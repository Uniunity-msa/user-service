const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const rabbitMQ = require("./src/rabbit/universityRabbitMQ");

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

// RabbitMQ 연결 및 메시지 소비
(async () => {
  try {
      await rabbitMQ.connectToRabbitMQ();
      rabbitMQ.consumeMessages();
      console.log('RabbitMQ 연결 및 메시지 소비 준비 완료');
  } catch (err) {
      console.error("RabbitMQ 연결 실패:", err);
      process.exit(1);
  }
})();

// POST 요청 파싱
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 라우터 등록
app.use("/auth", require("./src/routes/authRoutes")); 
app.use("/user", require("./src/routes/userRoutes")); 
app.use("/university", require("./src/routes/universityRoutes")); 



module.exports = app;
