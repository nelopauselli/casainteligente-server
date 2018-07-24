function DeviceEventRepository() {
    this.collection = [];
}

DeviceEventRepository.prototype.add = function add(event) {
    this.collection.push(event);
};

DeviceEventRepository.prototype.getByIp = function (ip, callback) {
    var device = this.collection.filter(d => d.ip == ip);
    callback(null, device);
};

module.exports = new DeviceEventRepository();