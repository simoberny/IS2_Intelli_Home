exports.setup = function(){
	console.log("i'm prova setup");
	return true;
}

exports.init = function(){
	console.log("i'm prova init");
	return true;
}

exports.update = function(value){
	console.log("i'm prova update");
	return true;
}

exports.read = function(){
	console.log("i'm prova read");
	return "my value";
}
