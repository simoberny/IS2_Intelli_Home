var exports = module.exports = {};

var Gpio = require('onoff').Gpio;

var mappa;

var ambienti;
global.count = 0;

function Ambiente_luce(call_back){
    this.past_time = 0;
    this.last_staus = 0;
    this.callback=call_back;
    this.lock = 0;
  }

  Ambiente_luce.crea_ascolto = function(pin,pout){
    console.log(this.callback);
    var ascolto = new Gpio(pin, 'in', 'both');
    var out = new Gpio(pout, 'out');

    ascolto.watch(function (err, value) {
        if(out.readSync()==0 && lock==0){
            out.writeSync(1);
            last_staus=1;
            this.callback(1);
        }else if(out.readSync()==1 && lock==0){
            out.writeSync(0);
            last_staus=0;
            this.callback(0); //ATTENZIOE! se premo pulsente e non c'è nessun soket collegato la funzione non esiste e termina con errore

        }
            if(value == 0) this.lock = 0;
            if(value == 1) this.lock = 1;
    },100);
}

function Ambiente_tap(call_back){
    this.past_time = 0;
    this.last_staus = 0;
    this.callback=call_back;
    this.lock = 0;
  }

  Ambiente_tap.crea_ascolto = function(pin_up,pin_down,pout_up,pout_down){
    console.log(this.callback);
    var ascolto_up = new Gpio(pin_up, 'in', 'both');
    var ascolto_down = new Gpio(pin_down, 'in', 'both');
    var out_up = new Gpio(pout_up, 'out');
    var out_dow = new Gpio(pout_down, 'out');

    ascolto_up.watch(function (err, value) {
    },100);

    ascolto_down.watch(function (err, value) {
    },100);
}

global.bind = function(funz,i){
    Ambiente_luce(funz);
}
global.bind_tap = function(funz,i){
    Ambiente_tap(funz);
}

exports.setup = function(map){
    mappa = map
    var numero = map.length;
    for(var i=0; i<numero; i++){
        if(map[i].tipo == "luce"){
            //progremma per la gestione delle luci:
            //necessario per creare una funzione con nome definito a runtime! (nome assegnato dal'oggetto map.funzione_ricezione)
            var f = new Function('exports','exports.'+mappa[i].funzione_ricezione+' = function(funz){bind(funz,count);}');
            f(exports);
            var f1 = new Function('exports,Gpio','exports.'+mappa[i].funzione_azione+' = function(stato){var out = new Gpio('+map[i].out1+', "out"); out.writeSync(stato);}');            console.log(f1);
            f1(exports,Gpio);
            Ambiente_luce.crea_ascolto(mappa[i].in1,map[i].out1);
            count++       //nota B: da implementare!! se no va solo una luce!!!!
        }else if(map[i].tipo == "tapp"){
            //progremma per la gestione delle taparelle:
            //necessario per creare una funzione con nome definito a runtime! (nome assegnato dal'oggetto map.funzione_ricezione)
            var f = new Function('exports','exports.'+mappa[i].funzione_ricezione+' = function(funz){bind_tap(funz,count);}');
            f(exports);
            //var f1 = new Function('exports,Gpio','exports.'+mappa[i].funzione_azione+' = function(stato){var out = new Gpio('+map[i].out1+', "out"); out.writeSync(stato);}');            console.log(f1);
            //f1(exports,Gpio);
            Ambiente_tap.crea_ascolto(mappa[i].in1,map[i].out1);
            count++       //nota B: da implementare!! se no va solo una luce!!!!
        }
        
    }
}
