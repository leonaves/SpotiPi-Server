var request = require('request-promise');

var SpotifyAPI = function (baseUrl) {
    this.baseUrl = baseUrl || 'https://api.spotify.com/v1/';
};

SpotifyAPI.prototype.handleError = function (err) {
};

SpotifyAPI.prototype.getUrl = function (action) {
    return encodeURI(this.baseUrl + action);
};

SpotifyAPI.prototype.search = function (query, callback) {
    var self = this,
        searchURI = self.getUrl('search?q=' + query + '&type=track&limit=1');

    request(searchURI)
        .then(function (response) {
            var tracks = JSON.parse(response).tracks;
            callback(tracks);
        })
        .catch(function (err) {
            self.handleError(err);
        })
    ;

};

module.exports = SpotifyAPI;
