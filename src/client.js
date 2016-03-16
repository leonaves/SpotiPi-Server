var io = require('socket.io')(3000);
var request = require('request-promise');

io.on('connection', function() {
    console.log('Client connected');
});

exports.searchAndAdd = function(searchQuery, callback) {

    console.log(searchQuery);

    request('https://api.spotify.com/v1/search?q=track:' + searchQuery + '&type=track&limit=1')
        .then(function (response) {
            
            var track = JSON.parse(response).tracks.items[0];
            io.emit('add track to queue', track.uri);

            callback({
                name: track.name,
                artist: track.artists[0].name
            });
        })
        .catch(function (err) {
            return "error: " + err;
        });

};