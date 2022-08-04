const util = require('minecraft-server-util');

const options = {
    timeout: 1000 * 5, 
    enableSRV: true // SRV record lookup
};

// get query data from minecraft server
function getMcData(ip) {
    return util.queryFull(ip, 25565, options)
        .then((result) => {
            return ({
                "online": true,
                ...result,
                "hostname": ip
            })
        })
        .catch((error) => {
            return { 
                "online": false,
                "hostname": ip
             }
        });
}

// sleep function in miliseconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

module.exports = {
    sleep,
    getMcData
}