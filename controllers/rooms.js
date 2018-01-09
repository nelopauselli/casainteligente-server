var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.json(
    [
      { id: 1, image: 'images/banio.png', title: 'Baño', text: 'Bla bla bla' },
      { id: 2, image: 'images/patio.png', title: 'Patio', text: 'Bla bla bla' }
    ]);
})

// About page route.
router.post('/', function (req, res) {
  console.log(req.body);
  res.send("Not implemented");
})

module.exports = router;