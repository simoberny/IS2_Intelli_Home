var mongoose = require("mongoose");
var url = "mongodb://localhost:27017/intelliHomeDatabase";


mongoose.connect('mongodb://localhost:27017/intelliHomeDatabase', { useMongoClient: true }).then(
    () => { console.log('DB connected successfully!'); },
    err => { console.error(`Error while connecting to DB: ${err.message}`); }
);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var UserSchema = mongoose.Schema({
    _id: String,
    name: String,
    birth_date: Date
});

exports.User = mongoose.model('users', UserSchema);

var ThingSchema = mongoose.Schema({
    _id: String,
    name: String,
    room: String,
    pluginName: String
});

exports.Thing = mongoose.model('things', ThingSchema);
