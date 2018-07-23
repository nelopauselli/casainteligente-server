var fs = require('fs');
var path = require('path');

function DeviceRepository() {
    //this.collection = [];
    this.collection = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/devices.json'), 'utf8'));
}

DeviceRepository.prototype.add = function add(device) {
    this.collection = this.collection.filter(d => d.ip != device.ip);
    this.collection.push(device);
};

DeviceRepository.prototype.getAll = function (callback) {
    callback(null, this.collection);
};

var instance;

module.exports = instance || (instance = new DeviceRepository()); 