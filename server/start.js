var app = require('express')(),
    server = require('http').createServer(app),
    path = require('path'),
    socket = require('./game/socket'),
    os = require('os'),
    config = require('./config.json');

//For convenience, grab the IP address for users on the same network
function ouputListeningAddresses(port) {
    var ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                //console.log(ifname + ':' + alias, iface.address);
                console.log(ifname + ':' + alias, iface.address);
            } else {
                // this interface has only one ipv4 adress
                //console.log(ifname, iface.address);
                console.log(ifname, iface.address + ':' + port);
            }
            ++alias;
        });
    });
}

ouputListeningAddresses(config.port);

/*************************************************************************************
 Server Setup
 *************************************************************************************/
server.listen(config.port || 3001);
socket.init(server);