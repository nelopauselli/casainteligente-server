function DeviceRepository() {
    this.collection = [];
}

DeviceRepository.prototype.add = function add(device) {
    this.collection = this.collection.filter(d => d.ip != device.ip);
    this.collection.push(device);
};

DeviceRepository.prototype.getAll = function (callback) {
    callback(null, this.collection);
};

DeviceRepository.prototype.getByIp = function (ip, callback) {
    var device = this.collection.find(d => d.ip == ip);
    callback(null, device);
};


module.exports = new DeviceRepository();