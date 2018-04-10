var express = require('express');
var router = express.Router();

var path = require("path");
var fs = require("fs");
const md5File = require('md5-file')

var firmwareFolder = path.join(__dirname, "firmwares");


router.get("/", function (req, res) {
    //console.dir(req.headers);

    var mac = req.headers["x-esp8266-sta-mac"];
    var md5onBoard = req.headers["x-esp8266-sketch-md5"];

    if (mac & md5onBoard) {
        console.log(`buscando actualización para ${mac}...`);

        var firmware = mac.replace(RegExp(":", 'g'), "") + ".bin";
        var firmwarePath = path.join(firmwareFolder, firmware);

        fs.exists(firmwarePath, function (exists) {
            if (exists) {
                md5File(firmwarePath, (err, hash) => {
                    if (err) throw err

                    if (md5onBoard != hash) {
                        console.log(`The MD5 sum of ${firmwarePath} is: ${hash}`);
                        console.log(`updating ${firmwarePath}`)
                        res.sendFile(firmwarePath);
                    }
                    else {
                        console.log(`no updates for ${firmware}`)
                        res.status(302).send("NO UPDATES");
                    }
                });
            }
            else {
                console.log(`file ${firmwarePath} not found`);

                console.log("unknown board");
                res.status(404).send("NOT FOUND");
            }
        });
    }
    else {
        res.status(404).send("NOT FOUND");
    }

});

module.exports = router;