const fs = require('fs');

var data = require('../databaseScripts/database.js');



var actuators = {
  actuators: [],
  addActuator: function(name, room, pluginName){
    var res = true;
    if(this.checkPluginValidity(pluginName))
      this.actuators[name + " " + room] = require("../plugins/" + pluginName + "/code.js");
    else{
      console.log("error while loading actuator " + name + " in room: " + room);
      res = false;
    }
    return res;
  },
  checkPluginValidity: function(plugin){
    var result = false;
    var path = "../plugins/" + plugin;
    if(fs.existsSync(path)){
      if(fs.existsSync(path + "/code.js") && fs.existsSync(path + "/version")){
        result = true;
      }else console.log("plugin " + pluginName + " not valid");
    }else console.log("plugin " + pluginName + " not found");
    return result;
  },
  getActuator: function(name, room){
    return this.actuators[name + " " + room];
  },
  setupActuator: function(name, room){
    return this.getActuator(name, room).setup();
  },
  initActuator: function(name, room){
    return this.getActuator(name, room).init();
  },
  initAllActuators: function(){
    for(el in this.actuators){
      if(!this.actuators[el].init())
        console.log("error while init of " + index);
    }
  },
  updateActuator: function(name, room, value){
    return this.getActuator(name, room).update(value);
  },
  readFromActuator: function(name, room){
    return this.getActuator(name, room).read();
  }
}

data.getAllActuators(function(result){
  result.forEach(function(el){
    actuators.addActuator(el.name, el.room, el.plugin_name);
  });
  actuators.initAllActuators();
});


exports.executeCommand = function(command){
  return actuators.updateActuator(command.name, command.room, command.value);
}

exports.installActuator = function(actuator){
  var result = false;
  if(actuators.addActuator(actuator.name, actuator.room, actuator.pluginName)){
    if(actuators.setupActuator(actuator.name, actuator.room)){
      if(actuators.initActuator(actuator.name, actuator.room)){
        result = true;
        data.addActuator(actuator.name, actuator.room, actuator.pluginName, function(){
          console.log("error while adding the actuator to the database, at next restart the actuator won't work");
        });
      }else console.log("error while init of " + actuator.name + " " + actuator.room);
    }else console.log("error while setup of " + actuator.name + " " + actuator.room);
  }else console.log("actuator installation failed");
  return result;
}


exports.shutDown = function(){
  data.end();
}
