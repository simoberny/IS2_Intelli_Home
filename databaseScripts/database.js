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

exports.end = function(){con.end();}
