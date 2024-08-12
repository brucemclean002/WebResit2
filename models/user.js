const Datastore = require('nedb');
const users = new Datastore({ filename: 'db/users.db', autoload: true });

// User model with methods for CRUD operations and finding by email
const User = {
    create: (user, callback) => users.insert(user, callback),
    findAll: (callback) => users.find({}, callback),
    findById: (id, callback) => users.findOne({ _id: id }, callback),
    findByEmail: (email, callback) => users.findOne({ email }, callback),
    update: (id, newData, callback) => users.update({ _id: id }, { $set: newData }, {}, callback),
    delete: (id, callback) => users.remove({ _id: id }, {}, callback)
};

module.exports = User;
