const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const rabbitMQ = require("./src/rabbit/universityRabbitMQ");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const mysql = require('mysql2/promise');
const amqp = require('amqplib');

dotenv.config();

const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Readiness Probe용 엔드포인트: DB & RabbitMQ 연결 검사
app.get('/ready', async (req, res) => {
  try {
    // MySQL 연결 검사
    const dbConn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      connectTimeout: 2000  // 연결 타임아웃 2초
    });

    // 간단한 쿼리로 DB ping 대체 (SELECT 1)
    await dbConn.execute('SELECT 1');
    await dbConn.end();

    // 2) RabbitMQ 연결 검사
    // 아래 URL 형식: amqp://user:password@host:port
    const rabbitUrl = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
    const rabbitConn = await amqp.connect(rabbitUrl, { timeout: 2000 }); 
    // 채널을 열었다가 바로 닫으면 연결 상태 확인 가능
    const channel = await rabbitConn.createChannel();
    await channel.close();
    await rabbitConn.close();

    // 둘 다 성공하면 READY
    res.status(200).json({ status: 'READY' });
  } catch (err) {
    console.error('Readiness check failed:', err.message);
    res.status(500).json({ status: 'NOT_READY', error: err.message });
  }
});


// cors 정책 허용
const allowedOrigins = [
  "http://34.22.87.148:3000",
  "http://34.22.87.148:3001",
  "http://34.22.87.148:3002",
  "http://34.22.87.148:3003",
  "http://uniunity.store",
  "https://uniunity.store",
  "http://34.22.87.169:3000",
  "http://34.22.87.169:3001",
  "http://34.22.87.169:3002",
  "http://34.22.87.169:3003", 
  "http://34.22.87.169:80", 
  "https://34.22.87.169:80"
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
app.use("/user/css", express.static(path.join(__dirname, "src/public/css")));
app.use("/user/js", express.static(path.join(__dirname, "src/public/js"))); 

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
