var express = require('express');
var router = express.Router();

var devices = [];

router.get('/', function (req, res) {
    res.json(devices);
});

router.post('/', function (req, res) {
    var device = req.body;
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    device.ip = ip.startsWith('::ffff:')
        ? ip.replace('::ffff:', '')
        : ip;

    console.log("new device: ");
    console.dir(device);

    if (device != undefined) {
        devices.push(device);
        res.status(201).send(device);
    }
    else
        res.status(400).send("");
})

module.exports = router;