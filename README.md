#  McQuery_Bot

Simple Minecraft server status bot created to be running on one server. Bot fetches simple data from the server(using query data) and constantly updates and displays server info.

![Bot Showcase image](https://github.com/tomasss888/ServerStatus/blob/master/images/showcase.png?raw=true)

## Setup

- Set `enable-query=true` inside your server.properties file.
- Fill out [config.js](https://github.com/tomasss888/ServerStatus/blob/master/data/config.js) bot data.
- Launch `npm init` to install dependencies and `node index.js` to initiate bot.

## Launch(Docker)

* Start:
```bash
cd ~/ServerStatus 
docker build -t ServerStatus .
docker run -d ServerStatus .
```

* Common:
```bash
docker ps
docker stop <CONTAINER ID> 
docker restart <CONTAINER ID> 
```
