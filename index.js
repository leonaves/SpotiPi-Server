var client = require('./src/client.js');
var slack = require('./src/slackInterface.js');
var http = require('./src/httpInterface.js');

http(client);
slack(client);

//TODO: have options for http interface, slack interface, etc, defined in config.
//Perhaps eventually move this out into plugins, but that's probably way down the line.
