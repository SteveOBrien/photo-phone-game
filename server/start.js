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

/*************************************************************************************
 FILE SERVER
 *************************************************************************************/
server.listen(config.port || 8000);

//Inform the server admin where the users can access the game
console.log('Server listening at the following locations: ');
ouputListeningAddresses(config.port || 8000);

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.get('*', function (req, res) {
    if (req.url.indexOf("/bower_components/") > -1 || req.url.indexOf("/shared/") > -1) {
        res.sendFile(path.resolve(__dirname + '/..') + req.url);
    }
    else if (req.url.indexOf("/photo_telephone/") > -1) {
        res.sendFile(path.resolve(__dirname + '/../..') + req.url);
    }
    else {
        res.sendFile(path.resolve(__dirname + '/../client') + req.url);
    }
});

socket.init(server);