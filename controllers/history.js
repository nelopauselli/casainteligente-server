var express = require('express'),
    router = express.Router();

var historyRepository = require("../repositories/historyRepository.js");

function HistoryController(io, client) {
    router.get('/', function (req, res, next) {
        historyRepository.getByTopic(req.query.topic, function (err, history) {
            if (err) next(err);
            else res.json(history);
        });
    });

    client.on('message', function (topic, message) {
        //console.log(topic + ": " + message.toString());
        io.sockets.emit("events", JSON.stringify({ topic: topic, message: message.toString() }));
        historyRepository.add(topic, message.toString());
    });
    return router;
}
module.exports = HistoryController;