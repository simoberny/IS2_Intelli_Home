var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "temporaneaprogetto",
  database: "progettoIngegneria"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


exports.getAllActuators = function(callback){
  con.query("select * from actuators", function (err, result) {
    if(err) throw err;
    else callback(result);
  });
}

exports.addActuator = function(name, room, pluginName, callback){
  con.query("INSERT INTO actuators (name, room, plugin_name) VALUES ('" + name + "', '" + room + "', '" + pluginName + "')", function (err, result) {
    if (err) callback();
  });
}

exports.removeActuator = function(name, room, callback){
  con.query("DELETE FROM actuators WHERE name = '" + name + "' AND room = '" + room + "'", function (err, result) {
    if (err) callback();
  });
}

exports.end = function(){con.end();}
