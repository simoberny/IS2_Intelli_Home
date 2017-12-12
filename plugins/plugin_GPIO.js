var exports = module.exports = {};

var Gpio = require('onoff').Gpio;

var mappa;

var ambienti=[];
global.count = 0;

class Ambiente_luce{
    constructor(call_back){
        this.callback=call_back;
        this.lock = 0;
    }
    crea_ascolto(pin,pout){
        var ascolto = new Gpio(pin, 'in', 'both');
        var out = new Gpio(pout, 'out');
        var lock = this.lock;
        var callback=this.callback;

        ascolto.watch(function (err, value) {
            //console.log("pulsante "+value);
            if(out.readSync()==0 && lock==0){
                out.writeSync(1);
                callback(1);
            }else if(out.readSync()==1 && lock==0){
                out.writeSync(0);
                callback(0); //ATTENZIOE! se premo pulsente e non c'è nessun soket collegato la funzione non esiste e termina con errore
            }
                if(value == 0) lock = 0;
                if(value == 1) lock = 1;
        },100);
        this.lock = lock;
    }
}

global.bind = function(funz,i,count){
    ambienti[count] = new Ambiente_luce(funz);
    ambienti[count].crea_ascolto(mappa[i].in1,mappa[i].out1);

}
//global.bind_tap = function(funz,i){
//    Ambiente_luce(funz);
//}

exports.setup = function(map){
    mappa = map
    var numero = map.length;
    for(var i=0; i<numero; i++){
        if(map[i].tipo == "luce"){
            //progremma per la gestione delle luci:
            //necessario per creare una funzione con nome definito a runtime! (nome assegnato dal'oggetto map.funzione_ricezione)
            var f = new Function('exports','exports.'+mappa[i].funzione_ricezione+' = function(funz){bind(funz,'+i+','+count+');}');
            f(exports);
            var f1 = new Function('exports,Gpio','exports.'+mappa[i].funzione_azione+' = function(stato){var out = new Gpio('+map[i].out1+', "out"); out.writeSync(stato);}');            console.log(f1);
            f1(exports,Gpio);
            count++;
        }/*else if(map[i].tipo == "tapp"){
            //progremma per la gestione delle taparelle:
            //necessario per creare una funzione con nome definito a runtime! (nome assegnato dal'oggetto map.funzione_ricezione)
            var f = new Function('exports','exports.'+mappa[i].funzione_ricezione+' = function(funz){bind(funz,count);}');
            f(exports);
            var f1 = new Function('exports,Gpio','exports.'+mappa[i].funzione_azione+' = function(stato){var out = new Gpio('+map[i].out1+', "out"); out.writeSync(stato);}');            console.log(f1);
            f1(exports,Gpio);
            Ambiente_luce.crea_ascolto(mappa[i].in1,map[i].out1);
            count++       //nota B: da implementare!! se no va solo una luce!!!!
        }
        */
    }
}
