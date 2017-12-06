exports.setup = function(){
	console.log("i'm nuovoPlugin setup");
	return true;
}

exports.init = function(){
	console.log("i'm nuovoPlugin init");
	return true;
}

exports.update = function(value){
	console.log("i'm nuovoPlugin update");
	return true;
}

exports.read = function(){
	console.log("i'm nuovoPlugin read");
	return "my value";
}
