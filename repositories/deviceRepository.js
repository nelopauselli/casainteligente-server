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

module.exports = new DeviceRepository();