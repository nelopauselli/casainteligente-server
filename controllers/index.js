var express = require('express');
var router = express.Router();

router.use('/rooms', require("./rooms"))

module.exports = router;