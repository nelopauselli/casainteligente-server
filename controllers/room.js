var express = require('express');
var router = express.Router();

var rooms = [
  { id: 1, image: 'banio.png', title: 'Baño', text: 'Bla bla bla' },
  { id: 2, image: 'patio.png', title: 'Patio', text: 'Bla bla bla' }
];

router.get('/', function (req, res) {
  res.json(rooms);
})

router.get('/:id', function (req, res) {
  var room = rooms.find(r => r.id == req.params.id);
  res.json(room);
})

// About page route.
router.post('/', function (req, res) {
  var room = req.body;
  console.log(room);
  if (room != undefined) {
    rooms.push(room);
    res.status(201).send(room);
  }
  else
    res.status(400).send("");
})

module.exports = router;