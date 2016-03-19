'use strict';

module.exports = function(client)
{
    var config = require('../config.json');
    var token = config.slack_bot_API_key;

    var RtmClient = require('@slack/client').RtmClient;
    var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
    var rtm = new RtmClient(token);

    var spotifyAPI = require('./spotifyAPI.js');
    var spotify = new spotifyAPI('https://api.spotify.com/v1/');

    rtm.start();

    rtm.on(RTM_EVENTS.MESSAGE, function (message) {
        let messageIntent = intent(message);

        if (messageIntent.action === 'add track') {
            react('I\'ve queued up %trackName by %trackArtist', addTrack)
        } else if (messageIntent.action === 'default') {
            react("Hey " + userString(message.user) + ", why don't you try asking me to play something?");
        }
    });

    function addTrack(query) {
        spotify.search(query)
            .then(tracks => {
                let track = tracks.items[0];
                client.add(track);
                rtm.sendMessage("I've queued up " + track.name + " by " + track.artists[0].name, message.channel);
            });
    }
    
    function userString(userID) {
        return '<@' + userID + '>';
    }

    function intent(message) {
        if (!message.hasOwnProperty('text')) return false;

        if(message.text.indexOf(userString(rtm.activeUserId)) > -1) {
            let index,
                data,
                messageText = message.text.toLowerCase();

            if ((index = messageText.indexOf(' add ')) > -1) {
                data = messageText.substring(index + 5, messageText.length);
                return { action: 'add track', data: data };
            }

            return { action: 'default' };
        } else {
            return { action: false };
        }
    }

    function react(response, action) {
        let returnVal = action === undefined ? {} : action();
        let responseParams = returnVal === null ? {} : returnVal;

        if (typeof responseParams !== 'object') {
            throw new Error('Action must return an object mapping response parameters to strings, a Promise that—when fulfilled–returns the same, or null.');
        }

        for (let param in responseParams) {
            response = response.replace('%' + param, responseParams['param']);
        }

        rtm.sendMessage(response, message.channel);
    }

};