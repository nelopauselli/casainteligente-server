var express = require('express');
var request = require('request');
var router = express.Router();

var devices = [];

router.get('/', function (req, res) {
    res.json(devices);
});

router.post('/', function (req, res) {
    if (req.body != undefined) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        var device = {
            name: req.body.name,
            ip: ip.replace('::ffff:', ''),
            components: []
        };
        device.url = 'http://' + device.ip;

        req.body.components.forEach(url => {
            var componentUrl = device.url + url;
            request(componentUrl, function (error, response, body) {
                if (error) console.error(error);
                else {
                    var component = JSON.parse(body);
                    component.url = componentUrl;
                    console.log(component);
                    device.components.push(component);
                }
            });
        });

        console.log("new device: ");
        console.dir(device);

        devices.push(device);
        res.status(201).send(device);
    }
    else
        res.status(400).send("");
})

module.exports = router;