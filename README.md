# SpotiPi-Server

A server component to send SpotiPi events over a websocket connection.

## Requirements

- A client running [SpotiPi](https://github.com/leonaves/SpotiPi).

## Usage

First add a slack API key to the config file (copy from config.json.example). The run:

```
npm install
node index.js
```
Start talking to your bot in slack. At the moment bots can only add songs to SpotiPi (supported by saying "@<bot name> play <track name>"), but obviously much more functionality will be added very soon.

## Future
Only a slack bot interface is supported right now as that's where I'm starting. Soon there will be an HTTP interface, and maybe a full web interface. Might make these things plugins. This is all way down the line though.
