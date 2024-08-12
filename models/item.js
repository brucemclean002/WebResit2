const Datastore = require('nedb');
const items = new Datastore({ filename: 'db/items.db', autoload: true });

// Item model with methods for CRUD operations
const Item = {
    create: (item, callback) => items.insert(item, callback),
    findAll: (callback) => items.find({}, callback),
    findById: (id, callback) => items.findOne({ _id: id }, callback),
    update: (id, newData, callback) => items.update({ _id: id }, { $set: newData }, {}, callback),
    delete: (id, callback) => items.remove({ _id: id }, {}, callback)
};

module.exports = Item;
