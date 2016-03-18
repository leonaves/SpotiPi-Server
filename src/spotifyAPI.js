'use strict';

var request = require('request-promise');

var SpotifyAPI = function (baseUrl) {
    this.baseUrl = baseUrl || 'https://api.spotify.com/v1/';
};

SpotifyAPI.prototype.handleError = error => console.log("error with Spotify web API request: " + error);

SpotifyAPI.prototype.getUrl = action => encodeURI(this.baseUrl + action);

SpotifyAPI.prototype.search = query => {
    let searchURI = this.getUrl('search?q=' + query + '&type=track&limit=10');

    return request(searchURI)
        .then(response => JSON.parse(response).tracks)
        .catch(err => this.handleError(err));
};

module.exports = SpotifyAPI;
