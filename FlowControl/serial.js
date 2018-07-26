// npm install nimble

const flow = require('nimble');

flow.series([
    function(callback) {
        setTimeout(function() {
            console.log('I execute first');
            callback();
        }, 1000);
    },
    function (callback) {
        setTimeout(function() {
            console.log('I execute next.');
        }, 500);
    },
    function (callback) {
        setTimeout(function() {
            console.log('i execute last.');
        }, 100);
    }
]);
