var express = require('express');
var router = express.Router();

var fs = require('fs');
var rooms = JSON.parse(fs.readFileSync('data/rooms.json', 'utf8'));

router.get('/', function (req, res) {
  res.json(rooms);
})

router.get('/:id', function (req, res) {
  var room = rooms.find(r => r.id == req.params.id);
  res.json(room);
})

module.exports = router;