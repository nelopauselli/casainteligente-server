var express = require('express'),
    path = require('path'),
    ping = require('ping');
var deviceRepository = require("../repositories/deviceRepository");

function DeviceController(io) {
    var router = express.Router();

    setInterval(function () {
        deviceRepository.getAll(function (err, devices) {
            devices.forEach(function (device) {
                var host = device.ip;
                if (host) {
                    ping.sys.probe(host, function (isAlive) {
                        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
                        console.log(msg);

                        device.status = isAlive ? "online" : "offline";

                        io.sockets.emit('status', JSON.stringify({ ip: device.ip, status: device.status }));
                    });
                }
            });
        });
    }, 10 * 1000);

    router.get('/', function (req, res) {
        deviceRepository.getAll(function (err, devices) {
            res.json(devices);
        });
    });

    router.post('/', function (req, res) {
        if (req.body != undefined) {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            var device = req.body;
            device.ip = ip.replace("::ffff:", "");
            device.topic = path.posix.join(device.topic, device.name);
            device.metrics.forEach(m => m.topic = path.posix.join(device.topic, m.topic));
            device.components.forEach(c => c.topic = path.posix.join(device.topic, c.topic));

            console.log("new device: ");
            console.dir(JSON.stringify(device));

            deviceRepository.add(device);

            res.status(201).send(device);
        }
        else
            res.status(400).send("");
    })

    router.get('/{id}', function (req, res, next) {
        var id = req.query.id;
        deviceRepository.getById(id, function (err, device) {
            if (err) next(err);
            else res.json(device);
        });
    });

    return router;
}

module.exports = DeviceController;