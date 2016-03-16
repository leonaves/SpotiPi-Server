var express = require('express');

module.exports = function (spotiPiClient) {
    var app = express();

    app.listen(4000);

    app.get('/play_from_query', function (req, res) {

        if (req.query.hasOwnProperty('q')) {
            var searchQuery = req.query.q;

            res.send('Searching for "' + searchQuery + '"...');

            spotiPiClient.searchAndAdd(searchQuery, function (track) {
                rtm.sendMessage('I\'ve queued up ' + track.name + ' by ' + track.artist, message.channel);
            });
        } else {
            res.send('You must provide a query.');
        }

    });
};
