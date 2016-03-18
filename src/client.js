var io = require('socket.io')(3000);
var request = require('request-promise');
var spotifyAPI = require('./spotifyAPI.js');
var playlist = require('./playlist.js');

var spotify = new spotifyAPI('https://api.spotify.com/v1/');

io.on('connection', () => console.log('Client connected'));

exports.getPlaylist = () => playlist.get();

exports.add = track => {
    var queue = playlist.add(track);
    io.emit('add track to queue', track.uri);
    return queue;
};

exports.skip = () => (
    new Promise((fulfill) => {
        io.emit('skip');
        return fulfill();
    })
);

exports.play = () => (
    new Promise((fulfill) => {
        io.emit('play');
        return fulfill();
    })
);

exports.pause = () => (
    new Promise((fulfill) => {
        io.emit('pause');
        return fulfill();
    })
);
