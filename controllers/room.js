var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var rooms = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/rooms.json'), 'utf8'));

router.get('/', function (req, res) {
  res.json(rooms);
})

router.get('/:id', function (req, res) {
  var room = rooms.find(r => r.id == req.params.id);
  res.json(room);
})

module.exports = router;