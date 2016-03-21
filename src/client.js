var io = require('socket.io')(3000);
var request = require('request-promise');
var spotify = require('./spotifyAPI.js');
var playlist = require('./playlist.js');

module.exports = (function()
{
    io.on('connection', () => console.log('Client connected'));

    function getPlaylist() {
        playlist.get();
    }

    function add(track) {
        var queue = playlist.add(track);
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
        getPlaylist: getPlaylist,
        add: add,
        skip: skip,
        play: play,
        pause: pause
    }
})();
