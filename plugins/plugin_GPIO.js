var exports = module.exports = {};

var Gpio = require('onoff').Gpio;

var funz_ack_padre=[];
global.count = 0;

var mappa;

global.bind = function(funz,i){
    funz_ack_padre[i]=funz;
    console.log(funz_ack_padre[i])

}

exports.setup = function(map){
    mappa = map
    var numero = map.length;
    for(var i=0; i<numero; i++){
        if(map[i].tipo == "luce"){
            //progremma per la gestione delle luci:
            nome = mappa[i].funzione_ricezione
            var f = new Function('variabile,exports','exports.'+nome+' = function(funz){bind(funz,0);}');
            f(funz_ack_padre,exports);
            crea_ascolto(mappa[i].in1,0,map[i].out1);
            //count++       //nota B: da implementare!! se no va solo una luce!!!!
        }
    }
}

function crea_ascolto(pin,fun_padre,out){
    console.log(fun_padre)
    var valore = fun_padre;
    var ascolto = new Gpio(17, 'in', 'both');
    var out = new Gpio(4, 'out');

    ascolto.watch(function (err, value) {
        if(out.readSync() == 0){
            out.writeSync(1);
            funz_ack_padre[fun_padre](1);
        }else{
            out.writeSync(0);
            funz_ack_padre[fun_padre](0);
        }
    });
}
