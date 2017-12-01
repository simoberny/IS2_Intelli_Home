var mongo = require("mongodb");
var url = "mongodb://localhost:27017/intelliHomeDatabase";


exports.insertUser = function(name, age, password){
  mongo.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("users").insertOne({_id: name, name: name, age: age, password: password});
    db.close();
  });
}

exports.insertObject = function(name, room, pluginName){
  mongo.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("objects").insertOne({_id: name + " " + room, name: name, room: room, pluginName: pluginName});
    db.close();
  });
}

exports.getAllObjects = function(){
  var res;
  mongo.connect(url, function(err, db) {
    if (err) throw err;
    res = db.collection('objects').find({});
    db.close();
  });
  return res;
}
