var express = require('express'),
    router = express.Router();

var historyRepository = require("../repositories/historyRepository.js");

router.get('/', function (req, res, next) {
    historyRepository.getByTopic(req.query.topic, function (err, history) {
        if (err) next(err);
        else res.json(history);
    });
});

module.exports = router;