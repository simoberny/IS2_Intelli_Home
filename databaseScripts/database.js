var mongo = require("mongodb");
var url = "mongodb://localhost:27017/intelliHomeDatabase";


var insertUser;
mongo.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("users").insertOne({name: "Donato", age: "21", password: "mammt"});
  db.close();
});
