var data = require('../databaseScripts/database.js');

class Actuator{
  constructor(name, room, pluginName){
    this.name = name;
    this.room = room;
    this.act  = require("../plugins/"+pluginName+"/code.js");
  }
}

var actuators = [];

function setupAll(){
  data.getAllActuators(function(result){
    result.forEach(function(el){
      actuators.push(new Actuator(el.name, el.room, el.plugin_name));
    });
    initAllActuators();
  });
}

function initAllActuators(){
  actuators.forEach(function(el){
    el.act.init();
  });
}

setupAll();

data.end();
