const http = require('http');
const parse = require('url').parse;
const join = require('path').join;
const fs = require('fs');

let root = __dirname;

let server = http.createServer(function(req, res){
    let url = parse(req.url);
    let path = join(root, url.pathname);
    let stream = fs.createReadStream(path);
    /*
    stream.on('data', function(chunk){
        res.write(chunk);

    });z
    stream.on('end', function(){
        res.end();
    });
    */

    console.log(url);

    stream.pipe(res);
    stream.on('error', function(err){
        res.statusCode = 500;
        res.end('Internal Server Error');
    });
});

server.listen(3000);