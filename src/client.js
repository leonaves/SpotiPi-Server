var io = require('socket.io')(3000);
var request = require('request-promise');
var queue = require('./queue.js');

module.exports = (function()
{
    io.on('connection', () => console.log('Client connected'));

    function getQueue() {
        queue.get();
    }

    function add(track) {
        let queue = queue.add(track);
        io.emit('add track to queue', track.uri);
        return queue;
    }

    function skip() {
        return new Promise(fulfill => {
            io.emit('skip');
            return fulfill();
        });
    }

    function play() {
        return new Promise(fulfill => {
            io.emit('play');
            return fulfill();
        });
    }

    function pause() {
        return new Promise(fulfill => {
            io.emit('pause');
            return fulfill();
        });
    }
    
    return {
        getQueue: getQueue,
        add: add,
        skip: skip,
        play: play,
        pause: pause
    }
})();
