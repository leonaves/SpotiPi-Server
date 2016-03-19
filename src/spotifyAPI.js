'use strict';

var request = require('request-promise');

var SpotifyAPI = function (baseUrl) {
    this.baseUrl = baseUrl || 'https://api.spotify.com/v1/';
};

SpotifyAPI.prototype.handleError = function (err) {
    console.log("error with Spotify web API request: " + err);
};

SpotifyAPI.prototype.getUrl = function (action) {
    return encodeURI(this.baseUrl + action);
};

SpotifyAPI.prototype.search = function(query) {
    let searchURI = this.getUrl('search?q=' + query + '&type=track&limit=10');

    return request(searchURI)
        .then(response => JSON.parse(response).tracks)
        .catch(err => this.handleError(err));
};

module.exports = SpotifyAPI;