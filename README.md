Minecraft Server Status Bot

## Launch

`node index.js`

* Start:
```bash
cd ~/discord-bot 
docker build -t discord-bot 
docker run -d discord-bot 
```

* Restart:
```bash
docker ps
docker stop <CONTAINER ID> 
docker restart <CONTAINER ID> 
```
