var express = require('express'),
    path = require('path');
var deviceRepository = require("../repositories/deviceRepository"),
    deviceEventRepository = require("../repositories/deviceEventRepository");

function DeviceController(io) {
    var router = express.Router();

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
            device.status = "online";
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

    router.post('/resetInfo', function (req, res, next) {
        console.log(req.body);
        if (req.body != undefined) {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            var event = {
                date: new Date(),
                ip: ip.replace("::ffff:", ""),
                type: 'reset-info',
                message: req.body
            };

            deviceEventRepository.add(event, function (err) {
                if (err) next(err);
                else res.status(201).send("");
            });

            io.sockets.emit('events', JSON.stringify(event));
        }
        else
            res.status(400).send("");
    });

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