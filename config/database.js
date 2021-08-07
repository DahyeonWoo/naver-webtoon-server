const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'db.c9kcehhjliha.ap-northeast-2.rds.amazonaws.com',
    user: 'name',
    port: '3306',
    password: 'password',
    database: 'naverwebtoon'
});

module.exports = {
    pool: pool
};