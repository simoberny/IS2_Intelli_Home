var exports = module.exports = {};

var Gpio = require('onoff').Gpio;

var ambienti=[];

function Ambiente_luce(call_back){
    this.past_time = 0;
    this.last_staus = 0;
    this.callback=call_back;
  }
  // class methods
  Ambiente_luce.crea_ascolto = function(pin,pout){
    console.log(this.callback);
    var ascolto = new Gpio(17, 'in', 'both');
    var out = new Gpio(4, 'out');

    ascolto.watch(function (err, value) {
        if(new Date().getTime()-past_time>200 && last_staus==0){
            console.log(new Date().getTime()+"   "+past_time);
            out.writeSync(1);
            past_time=new Date().getTime();
            last_staus=1;
            this.callback(1);
        }else if(new Date().getTime()-past_time>200 && last_staus==1){
            out.writeSync(0);
            past_time=new Date().getTime();
            this.callback(0); //ATTENZIOE! se premo pulsente e non c'è nessun soket collegato la funzione non esiste e termina con errore
            last_staus=0;
        }
    });
}


global.count = 0;

var mappa;

global.bind = function(funz,i){
    Ambiente_luce(funz);
}

exports.setup = function(map){
    mappa = map
    var numero = map.length;
    for(var i=0; i<numero; i++){
        if(map[i].tipo == "luce"){
            //progremma per la gestione delle luci:
            nome = mappa[i].funzione_ricezione
            //necessario per creare una funzione con nome definito a runtime! (nome assegnato dal'oggetto map.funzione_ricezione)
            var f = new Function('exports','exports.'+nome+' = function(funz){bind(funz,0);}');
            f(exports);
            Ambiente_luce.crea_ascolto(mappa[i].in1,map[i].out1);
            count++       //nota B: da implementare!! se no va solo una luce!!!!
        }
    }
}
