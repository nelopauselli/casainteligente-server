var express = require('express');
var request = require('request');
var urljoin = require('url-join');

var router = express.Router();

var fs = require('fs');
var path = require('path');

var devices = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/devices.json'), 'utf8'));

router.get('/', function (req, res) {
    res.json(devices);
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

        devices = devices.filter(d => d.ip != device.ip);
        devices.push(device);

        res.status(201).send(device);
    }
    else
        res.status(400).send("");
})

module.exports = router;