'use strict';

var config = require('../config.json');
var token = config.slack_bot_API_key;

var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var rtm = new RtmClient(token);

var spotifyAPI = require('./spotifyAPI.js');
var spotify = new spotifyAPI('https://api.spotify.com/v1/');

rtm.start();

function userString(userID) {
    return '<@' + userID + '>';
}

function stringContains(string, contains) {
    return (string.indexOf(contains) > -1);
}

module.exports = function(spotiPiClient) {

    rtm.on(RTM_EVENTS.MESSAGE, function (message) {

        if (!message.hasOwnProperty('text')) return;

        if(stringContains(message.text, userString(rtm.activeUserId))) {
            var messageContent = message.text.toLowerCase();

            console.log(messageContent);

            var index;

            if ((index = messageContent.indexOf(' add ')) > -1) {

                var searchQuery = messageContent.substring(index + 5, messageContent.length);

                spotify.search(searchQuery)
                    .then(tracks => {
                        return tracks.items[0];
                    })
                    .then(track => {
                        spotiPiClient.add(track);
                        return track;
                    })
                    .then(track => {
                        rtm.sendMessage("I've queued up " + track.name + " by " + track.artists[0].name, message.channel);
                    });

            } else if(messageContent.indexOf(' night ') > -1) {

                rtm.sendMessage("Night " + userString(message.user), message.channel);

            } else {

                rtm.sendMessage("Hey " + userString(message.user) + ", why don't you try asking me to play something?", message.channel);

            }
        }
    });

};