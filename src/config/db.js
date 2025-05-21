require("dotenv").config();
const dbConnector = require('./dbConnector');
const mysql = require('mysql2/promise');


// Kubernetes로부터 DB 접속정보 로드
//dbConnector.getDatabasePool();

// 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 1000,
  dateStrings: "date"
});

module.exports = pool;