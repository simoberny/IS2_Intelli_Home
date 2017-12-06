var shell = require("./shell.js");

setTimeout(function(){ //il setTimeout è (per adesso) necessario dato che le cose non sono sincrone
  
  shell.shutDown();
}, 3000);
