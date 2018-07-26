function Watcher(watchDir, processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}

const events = require('events')
    , util = require('util');

util.inherits(Watcher, events.EventEmitter); // ==> Watcher.prototype = new events.EventEmitter();

const fs = require('fs');
let watchDir = './watch'
    , processedDir = './done';

Watcher.prototype.watch = function () {
    let watcher = this;
    fs.readdir(this.watchDir, function (err, files) {
        if (err) throw err;
        for (let index in files) {
            watcher.emit('process', files[index]);
        }
    });
}

Watcher.prototype.start = function () {
    let watcher = this;
    fs.watchFile(watchDir, function () {
        watcher.watch();
    });
}

let watcher = new Watcher(watchDir, processedDir);

watcher.on('process', function process(file) {
    let watchFile = this.watchDir + '/' + file;
    let processedFile = this.processedDir + '/' + file.toLowerCase();

    fs.rename(watchFile, processedFile, function(err) {
        if(err) throw err;
    });
});

watcher.start();