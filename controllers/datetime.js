var express = require('express');
var request = require('request');
var urljoin = require('url-join');

var router = express.Router();

router.get('/', function (req, res) {
    var response = new Date().toISOString();
    console.log(response);

    res.status(200).send(response);
});

module.exports = router;
