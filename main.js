const express = require("express");
const bodyParser = require("body-parser");
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

// POST 요청 파싱
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 라우터 등록
app.use("/auth", require("./src/routes/authRoutes")); 


module.exports = app;
