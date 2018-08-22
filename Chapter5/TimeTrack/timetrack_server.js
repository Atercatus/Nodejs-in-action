const http = require('http');
const work = require('./lib/timetrack');
const MySQL = require('mysql');

const db = MySQL.createConnection({
    host: '127.0.0.1',
    user: 'tracker',
    password: 'scotish1',
    database: 'timetrack'
});

const server = http.createServer(function (req, res) {
    switch (req.method) {
        case 'POST':
            switch (req.url) {
                case '/':
                    work.add(db, req, res);
                    break;
                case '/archive':
                    work.archive(db, req, res);
                    break;
                case '/delete':
                    work.delete(db, req, res);
                    break;
            }
            break;

        case 'GET':
            switch (req.url) {
                case '/':
                    console.log("get!");
                    work.show(db, res);
                    break;
                case '/archive':
                    work.showArchived(db, res);
                    break;
            }
            break;
    }
});

let sql = "CREATE TABLE IF NOT EXISTS work ("
    + "id INT(10) NOT NULL AUTO_INCREMENT, "
    + "hours DECIMAL(5,2) DEFAULT 0,"
    + "date DATE, "
    + "archived INT(1) DEFAULT 0, "
    + "description LONGTEXT, "
    + "PRIMARY KEY(id));";

db.query(
    sql,
    function (err, result) {
        if (err) throw err;
        console.log('Server started...');
        server.listen(3000, '127.0.0.1');
    }
);


