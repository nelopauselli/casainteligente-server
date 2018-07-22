function HistoryRepository() {
    this.db = [];
}

HistoryRepository.prototype.add = function add(topic, payload) {
    var element = { date: Date(), data: payload };

    var collection = this.db[topic];
    if (collection == undefined) {
        this.db[topic] = [element];
    } else {
        if (collection.length > 50)
            collection.shift();
        collection.push(element);
    }
};

HistoryRepository.prototype.getByTopic = function (topic, callback) {
    callback(null, this.db[topic]);
}

module.exports = new HistoryRepository();