var io = require('socket.io')(3000);
var request = require('request-promise');

io.on('connection', function() {
    console.log('Client connected');
});

exports.searchAndAdd = function(searchQuery, callback) {

    console.log("Searching for..." + searchQuery);
    var searchURI = encodeURI('https://api.spotify.com/v1/search?q=' + searchQuery + '&type=track&limit=1');

    request(searchURI).then(function (response) {
            
            var track = JSON.parse(response).tracks.items[0];
            io.emit('add track to queue', track.uri);

            callback({
                name: track.name,
                artist: track.artists[0].name
            });
        })
        .catch(function (err) {

            console.log("error with Spotify web API request: " + err);
            console.log("tried to search with URI: " + searchURI)

        });

};

exports.skip = function(callback) {

    console.log("skipping...");

    io.emit('skip');

    callback();

};