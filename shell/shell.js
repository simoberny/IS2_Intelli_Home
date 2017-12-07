const fs = require('fs');
const rmR = require('rimraf');

var data = require('../databaseScripts/database.js');



var actuators = {
  info: [],
  actuators: [],
  addActuator: function(name, room, pluginName){
    var res = true;
    if(this.checkPluginValidity(pluginName)){
      this.actuators[name + " " + room] = require("../plugins/" + pluginName + "/code.js");
      this.info[name + " " + room] = pluginName;
    }
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
      }else console.log("plugin " + plugin + " not valid");
    }else console.log("plugin " + plugin + " not found");
    return result;
  },
  getActuatorPath: function(name, room){
    return "../plugins/" + this.info[name + " " + room];
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
  if(command.rw == w)
    return actuators.updateActuator(command.name, command.room, command.value);
  return actuators.readFromActuator(command.name, command.room);
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

exports.removeActuator = function(actuator, files){
  var result = true;

  data.removeActuator(actuator.name, actuator.room, function(){
    result = false;
    console.log("error while removing the actuator from the database, please retry or contact system admin");
  });

  if(files)
    rmR(actuators.getActuatorPath(actuator.name, actuator.room), function(err){
      if(err)
        console.log("error while deleting files");
    });

  return result;
}

exports.shutDown = function(){
  data.end();
}
