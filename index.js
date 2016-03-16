var spotiPi = require('./src/client.js');
var slack = require('./src/slackInterface.js');

slack(spotiPi);

//TODO: have options for http interface, slack interface, etc, defined in config.
//Perhaps eventually move this out into plugins, but that's probably way down the line.