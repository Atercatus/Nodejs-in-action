const http = require('http');
const fs = require('fs');
/*
http.createServer(function (req, res) {
    if (req.url == '/') {
        fs.readFile('./titles.json', function (err, data) {
            if (err) {
                console.error(err);
                res.end('Server Error');
            }

            else {
                let titles = JSON.parse(data.toString());

                fs.readFile('./template.html', function (err, data) {
                    if (err) {
                        console.error(err);
                        res.end('Server Error');
                    }
                    else {
                        let tmpl = data.toString();

                        let html = tmpl.replace('%', titles.join('</li><li>'));
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(html);
                    }
                });
            }
        });
    }
}).listen(8000, "127.0.0.1");
*/
function getTitles(res) {
    if(res.url == '/') {
        fs.readFile('./titles.json', function(err, data) {
            if(err) 
                return hadError(err, res);
    
            getTemplate(JSON.parse(data.toString()), res);
        });
    }

    else {
        res.end('Server err');
    }
}

function getTemplate(titles, res) {
    fs.readFile('./public/template.html', function(err, data) {
        if(err)
            return hadError(err, res);
    
        formatHtml(titles, data.toString(), res);
    });
}

function formatHtml(titles, tmpl, res) {
    let html = tmpl.replace('%', titles.join('</li><li>'));
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
}

function hadError(err, res) {
    console.err(err);
    res.end('Server Error');
}

const server = http.createServer(function(req, res) {
    getTitles(res);

}).listen(8000, "127.0.0.1");
