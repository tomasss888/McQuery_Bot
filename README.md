# Minecraft Status Discord Bot

Simple Minecraft server status bot created to be running on one server. Bot fetches simple data from the server(using query data) and constantly updates and displays server info.

![Bot Showcase image](https://github.com/tomasss888/ServerStatus.git/images/showcase.png?raw=true)

## Launch(Simple)

Launch `node deploy-commands.js` to update commands and `node index.js` to initiate bot.

## Launch(Docker)

* Start:
```bash
cd ~/discord-bot 
docker build -t discord-bot 
docker run -d discord-bot 
```

* Common:
```bash
docker ps
docker stop <CONTAINER ID> 
docker restart <CONTAINER ID> 
```
