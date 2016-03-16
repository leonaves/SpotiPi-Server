var config = require('../config.json');
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var token = config.slack_bot_API_key;
var rtm = new RtmClient(token);

rtm.start();

module.exports = function(spotiPiClient) {

    rtm.on(RTM_EVENTS.MESSAGE, function (message) {
        if(message.text.indexOf('<@' + rtm.activeUserId + '>') > -1) {
            var messageContent = message.text.toLowerCase();

            console.log(messageContent);

            var index;

            if ((index = messageContent.indexOf('play ')) > -1) {
                var searchQuery = messageContent.substring(index + 5, messageContent.length);
                spotiPiClient.searchAndAdd(searchQuery, function (track) {
                    rtm.sendMessage('I\'ve queued up ' + track.name + ' by ' + track.artist, message.channel);
                });
            } else if(messageContent.indexOf('night') > -1) {
                rtm.sendMessage('Night <@' + message.user + '>', message.channel);
            } else {
                rtm.sendMessage('Hey <@' + message.user + '>, why don\'t you try asking me to play something?', message.channel);
            }
        }
    });

};