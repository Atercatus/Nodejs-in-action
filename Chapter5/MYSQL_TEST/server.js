const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'scotish1',
    database: 'test',
    multipleStatements: true
});

let sql = "CREATE TABLE test5 (name VARCHAR(255), address VARCHAR(255))";

db.connect();

db.query(sql, function (err) {
    if (err) throw err;
    console.log('query!');
});

db.end();