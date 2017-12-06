var shell = require("./shell.js");

setTimeout(function(){
  shell.removeActuator({name: "prova", room: "prova", pluginName: "prova"});

  shell.shutDown();
}, 3000);
