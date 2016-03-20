'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var spotify = require('./spotifyAPI.js');

module.exports = function (spotiPiClient, playlist) {
    var app = express();

    app.listen(4000);
    app.use(express.static(__dirname + '/../assets'));
    app.use(bodyParser.json());
    app.set('views', __dirname + '/../views');
    app.engine('html', require('ejs').renderFile);

    app.get('/', (req, res) => {
        res.render('index.html');
    });
    
    app.get('/api/play', (req, res) => {
        spotiPiClient.play()
            .then(res.json({'status': 'playing'}))
            .catch(e => console.log(e));
    });

    app.get('/api/pause', (req, res) => {
        spotiPiClient.pause()
            .then(res.json({'status': 'paused'}))
            .catch(e => console.log(e));
    });

    app.get('/api/playlist', (req, res) => {
        res.json(spotiPiClient.getPlaylist());
    });

    app.post('/api/queue', (req, res) => {
        res.json({'added': true, 'queue': spotiPiClient.add(req.body)});
    });

    app.get('/api/search', (req, res) => {
        req.query.hasOwnProperty('q')
            ? spotify.search(req.query.q).then(tracks => res.json(tracks))
            : res.json({'error': 'Must specify a query'});
    });
};
