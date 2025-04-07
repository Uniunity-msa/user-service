const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

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

// POST 요청 파싱
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 라우터 등록
app.use("/auth", require("./src/routes/authRoutes")); 
app.use("/user", require("./src/routes/userRoutes")); 
app.use("/university", require("./src/routes/universityRoutes")); 



module.exports = app;
