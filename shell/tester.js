var shell = require("./shell.js");

setTimeout(function(){
  shell.executeCommand({name: "luce", room: "prova", value: "testcommand"});

  shell.shutDown();
}, 3000);
