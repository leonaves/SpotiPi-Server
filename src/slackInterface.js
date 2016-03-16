var config = require('../config.json');
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var token = config.slack_bot_API_key;
var rtm = new RtmClient(token);

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

                spotiPiClient.searchAndAdd(searchQuery, function (track) {
                    rtm.sendMessage("I've queued up " + track.name + " by " + track.artist, message.channel);
                });

            } else if(messageContent.indexOf(' night ') > -1) {

                rtm.sendMessage("Night " + userString(message.user), message.channel);

            } else {

                rtm.sendMessage("Hey " + userString(message.user) + ", why don't you try asking me to play something?", message.channel);

            }
        }
    });

};