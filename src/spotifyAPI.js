'use strict';

var request = require('request-promise');

module.exports = (function()
{
    var baseUrl = 'https://api.spotify.com/v1/';

    function handleError(err) {
        console.log("error with Spotify web API request: " + err);
    }

    function getUrl(action) {
        return encodeURI(baseUrl + action);
    }

    function search(query) {
        let searchURI = getUrl('search?q=' + query + '&type=track&limit=10');

        return request(searchURI)
            .then(response => JSON.parse(response).tracks)
            .catch(err => this.handleError(err));
    }

    return {
        search: search
    }
})();