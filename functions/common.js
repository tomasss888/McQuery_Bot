const util = require('minecraft-server-util');

const options = {
    timeout: 1000 * 15, 
    enableSRV: true // SRV record lookup
};

// get query data from minecraft server
function getMcData(ip, port) {
    return util.queryFull(ip, port, options)
        .then(async (result) => {
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

function getFavicon(ip, port) {
    return util.status(ip, port, options)
        .then(async (result) => {
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
    getMcData,
    getFavicon
}