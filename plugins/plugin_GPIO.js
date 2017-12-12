var exports = module.exports = {};

var Gpio = require('onoff').Gpio;

var mappa;

var ambienti=[];
var ambienti_tap=[];
var count_tap=0;
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

class Ambiente_tap{
    constructor(){
        this.lock_up = 0;
        this.lock_down = 0;
        var ascolto_up;
        var ascolto_down;
        var out_up;
        var out_down;
    }

    crea_ascolto(pin_up,pout_up,pin_down,pout_down){
        var ascolto_up = new Gpio(pin_up, 'in', 'both');
        var ascolto_down = new Gpio(pin_down, 'in', 'both');
        var out_up = new Gpio(pout_up, 'out');
        var out_down = new Gpio(pout_down, 'out');

        this.ascolto_up = ascolto_up;
        this.ascolto_down =  ascolto_down;
        this.out_up = out_up;
        this.out_down = out_down;

        var up=0;
        var down =0;

        var lock_up = this.lock_up;
        var lock_down = this.lock_down;

        console.log("pronti per ascolatre le taparelle! porte:"+pin_up+" "+pout_up+" "+pin_down+" "+pout_down)

        ascolto_up.watch(function (err, value) {
            if(out_up.readSync() ==1 && out_down.readSync()==0 && lock_up==0){
                out_up.writeSync(0);
            }else if(out_up.readSync() ==0 && lock_up==0){
                out_down.writeSync(0);
                out_up.writeSync(1);
            }
            up=value;
            if(value == 0) lock_up = 0;
            if(value == 1) lock_up = 1;
        },100);
        ascolto_down.watch(function(err, value){
            if(out_up.readSync() ==0 && out_down.readSync()==1 && lock_down==0){
                out_down.writeSync(0);
            }else if(out_down.readSync() ==0 && lock_down==0){
                out_up.writeSync(0);
                out_down.writeSync(1);
            }
            down=value;
            if(value == 0) lock_down = 0;
            if(value == 1) lock_down = 1;
        },100)

    
    }

    setup(up,down){
        if(up==1){
            if(out_up.readSync() ==1 && out_down.readSync()==0){
                out_up.writeSync(0);
            }
            if(out_up.readSync() ==0){
                out_down.writeSync(0);
                out_up.writeSync(1);
            }
        }
        if(down==1){
            if(out_up.readSync() ==0 && out_down.readSync()==1){
                out_down.writeSync(0);
            }
            if(out_down.readSync() ==0){
                out_up.writeSync(0);
                out_down.writeSync(1);
            }
        }
    }
}


global.bind = function(funz,i,count){
    ambienti[count] = new Ambiente_luce(funz);
    ambienti[count].crea_ascolto(mappa[i].in1,mappa[i].out1);
}

exports.setup = function(map){
    mappa = map
    var numero = map.length;
    for(var i=0; i<numero; i++){
        if(map[i].tipo == "luce"){
            console.log("numero funz: "+mappa[i].funzione_ricezione+" count: "+count);
            //progremma per la gestione delle luci:
            //necessario per creare una funzione con nome definito a runtime! (nome assegnato dal'oggetto map.funzione_ricezione)
            var f = new Function('exports','exports.'+mappa[i].funzione_ricezione+' = function(funz){bind(funz,'+i+','+count+');}');
            f(exports);
            var f1 = new Function('exports,Gpio','exports.'+mappa[i].funzione_azione+' = function(stato){var out = new Gpio('+map[i].out1+', "out"); out.writeSync(stato);}');
            f1(exports,Gpio);
            count++;
        }
        else if(map[i].tipo == "tapp"){
            ambienti_tap[count_tap] = new Ambiente_tap();
            ambienti_tap[count_tap].crea_ascolto(mappa[i].in_up,mappa[i].out_up,mappa[i].in_down,mappa[i].out_down);
            //var f1 = new Function('exports,Gpio','exports.'+mappa[i].funzione_azione+' = function(out_up,out_down){var out = new Gpio('+map[i].out1+', "out"); out.writeSync(stato);}');
            //f1(exports,Gpio);
            //count_tap++;
        }
        
    }
}
