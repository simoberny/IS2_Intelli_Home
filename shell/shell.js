var data = require('./database.js');


class Actuator{
  constructor(name, file, room){
    this.name = name;
    this.file = file;
    this.room = room;
    this.act  = require("plugins/"+name+"/code.js");
  }
}

var objects = {
  readables: [],
  writeables: []
};


var init = function(){

  objects.readables.forEach(function(element){
    if(!element.act.init())
      console.log("problem while initializing " + element.name);
  });

  objects.wtiteables.forEach(function(element){
    if(!element.act.init())
      console.log("problem while initializing " + element.name);
  });

};

var populateObjects
