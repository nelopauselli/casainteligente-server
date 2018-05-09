var express = require('express');
var request = require('request');
var urljoin = require('url-join');

var router = express.Router();

var fs = require('fs');
var path = require('path');

router.get('/', function (req, res) {
    var devices = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/devices.json'), 'utf8'));
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
        device.url = 'http://' + device.ip + "/";

        req.body.components.forEach(path => {
            var componentUrl = urljoin(device.url, path);
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

        var indexOfSame = devices.indexOf(d=>{return d.ip==device.ip});
        if(indexOfSame){
            devices.splice(indexOfSame);
        }

        devices.push(device);
        res.status(201).send(device);
    }
    else
        res.status(400).send("");
})

module.exports = router;