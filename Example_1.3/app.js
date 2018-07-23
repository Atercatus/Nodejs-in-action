const http = require('http');
const fs = require('fs');
const server = http.createServer();
let stream = fs.createReadStream('./resource.json');
stream.on('data', function(chunk) {
    console.log(chunk);
});
stream.on('end', function() {
    console.log('finished');
});
