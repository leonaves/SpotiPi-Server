var express = require('express');
var bodyParser = require('body-parser');

module.exports = function (spotiPiClient, playlist) {
    var app = express();

    app.listen(4000);
    app.use(express.static(__dirname + '/../assets'));
    app.use(bodyParser.json());
    app.set('views', __dirname + '/../views');
    app.engine('html', require('ejs').renderFile);

    app.get('/', function (req, res) {
        res.render('index.html');
    });
    
    app.get('/api/play', function (req, res) {
        spotiPiClient.play();

        res.json({ 'status': 'playing' });
    });

    app.get('/api/pause', function (req, res) {
        spotiPiClient.pause();

        res.json({ 'status': 'paused' });
    });

    app.get('/api/playlist', function (req, res) {
        res.json(spotiPiClient.getPlaylist());
    });

    app.post('/api/queue', function (req, res) {
        var queue = spotiPiClient.add(req.body);
        res.json({ 'added': true, 'queue': queue });
    });

    app.get('/api/search', function (req, res) {
        if (req.query.hasOwnProperty('q')) {
            var searchQuery = req.query.q;

            spotiPiClient.search(searchQuery, function (tracks) {
                res.json(tracks);
            });
        } else {
            res.json({ 'error': 'Must specify a query' });
        }
    });

    app.get('/play_from_query', function (req, res) {

        if (req.query.hasOwnProperty('q')) {
            var searchQuery = req.query.q;

            res.send('Searching for "' + searchQuery + '"...');

            spotiPiClient.searchAndAdd(searchQuery, function (track) {
                rtm.sendMessage('I\'ve queued up ' + track.name + ' by ' + track.artist, message.channel);
            });

            res.json({ 'status': 'queued', 'artist': track.artist, 'track': track.name });
        } else {
            res.json({ 'error': 'Must specify a query' });
        }

    });
};
