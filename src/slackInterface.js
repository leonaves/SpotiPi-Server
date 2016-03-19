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
            let query = messageIntent.data;
            react('I\'ve queued up %trackName by %trackArtist', message.channel, addTrack, query)
        } else if (messageIntent.action === 'skip') {
            react('I agree, this one is rubbish.', message.channel, skipTrack)
        } else if (messageIntent.action === 'default') {
            react("Hey %user, why don't you try asking me to play something?", message.channel, () => ({ user: userString(message.user) }));
        }
    });

    function addTrack(query) {
        return spotify.search(query)
            .then(tracks => {
                let track = tracks.items[0];
                client.add(track);
                return {
                    trackName: track.name,
                    trackArtist: track.artists[0].name
                }
            });
    }

    function skipTrack() {
        client.skip();
        return null;
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
            } else if (messageText.indexOf(' skip this') > -1) {
                return {action: 'skip'};
            } else {
                return { action: 'default' };
            }

        } else {
            return { action: false };
        }
    }

    function react(response, channel, action) {
        action = action === undefined ? () => null : action;
        if (typeof action !== 'function') throw new InvalidActionError();

        let args = Array.prototype.slice.call(arguments);
        let actionResult = action.apply(undefined, args.slice(3, args.length));
        actionResult = actionResult === null ? {} : actionResult;

        if (typeof actionResult !== 'object') {
            throw new InvalidActionError();
        }

        if (typeof actionResult.then === 'function') {
            actionResult.then(responseParams => {
                rtm.sendMessage(replaceParams(response, responseParams), channel);
            });
        } else {
            rtm.sendMessage(replaceParams(response, actionResult), channel);
        }

        function replaceParams(text, paramObj) {
            for (let param in paramObj) {
                text = text.replace('%' + param, paramObj[param]);
            }
            return text;
        }

        function InvalidActionError() {
            return new Error('Action must be a function returning an object mapping response parameters to strings, a Promise that—when fulfilled–returns the same, or null.');
        }
    }

};