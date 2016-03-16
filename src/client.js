var io = require('socket.io')(3000);
var request = require('request-promise');
var spotifyAPI = require('./spotifyAPI.js');
var playlist = require('./playlist.js');

var apiClient = new spotifyAPI('https://api.spotify.com/v1/');

io.on('connection', function() {
    console.log('Client connected');
});

exports.search = function(searchQuery, callback) {
    apiClient.search(searchQuery, callback);
};

exports.getPlaylist = function () {
    return playlist.get();
};

exports.add = function (track) {
    var queue = playlist.add(track);
    io.emit('add track to queue', track.uri);
    return queue;
};

exports.searchAndAdd = function(searchQuery, callback) {

    console.log("Searching for..." + searchQuery);

    apiClient.search(searchQuery, function (tracks) {
        var track = tracks.items[0];

        io.emit('add track to queue', track.uri);
        console.log('Queued track ' + track.artists[0].name + ': ' + track.name);

        callback({
            name: track.name,
            artist: track.artists[0].name
        });
    });
};

exports.skip = function(callback) {

    console.log("skipping...");

    io.emit('skip');

    callback();

};

exports.play = function(callback) {
    var callback = callback  || function() {};

    console.log("playing...");

    io.emit('play');

    callback();
};

exports.pause = function(callback) {
    var callback = callback  || function() {};

    console.log("pausing...");

    io.emit('pause');

    callback();
};
