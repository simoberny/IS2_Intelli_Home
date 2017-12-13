var express = require('express');
var session = require('express-session');
var url = require('url');
var http = require('http');
var speech = require('./speech.js');
//agginto x api
global.GPIO = require ('./plugins/plugin_GPIO.js');

var map = [{tipo:'luce',out1:'4',in1:'17',funzione_azione:'set_ogg1',funzione_ricezione:'read_ogg1'},{tipo:'luce',out1:'27',in1:'22',funzione_azione:'set_ogg2',funzione_ricezione:'read_ogg2'},{tipo:'tapp',in_up:'10',out_up:'9',in_down:'23',out_down:'24',funzione_azione:'set_ogg3'}]


var apps = express();
var http = require('http').Server(apps);



apps.use(session({ secret: 'quellochevuoi', resave: true, saveUninitialized: true}));

apps.set('view engine', 'ejs');
apps.set('port', (process.env.PORT || 8081));
apps.use(express.static(__dirname));

apps.get('/', function(req, res) {
    if(!req.session.message){
        req.session.message = [{position: 'comp', text: 'Ciao, come posso aiutarti?'}];
    }
    res.render('pages/index', {
        messages: req.session.message,
    });
});

apps.use('/ajax', speech);

apps.get('/attuatori', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});


    //Nome dell'attuatore azionato - Ovviamente si possono usare nomi simbolici
    var evento = req.query.evento;
    //Valore di arrivo del tasto - quindi come detto 1 o 0
    var stato = req.query.stato;

    console.log("evento: "+evento+" stato: "+stato);
    if(evento=="Luce Soggiorno"){
        var out = stato == "1" ? 1 : 0;        
        GPIO.set_ogg1(out);
    }
    if(evento=="Tapparelle bagno di sinistra"){
        GPIO.set_ogg3(stato);
    }
    if(evento=="Luce cucina"){
        var out = stato == "1" ? 1 : 0;
        GPIO.set_ogg2(out);
    }

    var resp = "<strong>AJAX:</strong> " + evento + " - Stato evento: " + stato;

    res.write(resp);
    res.end();
});

http.listen(apps.get('port'), function() {
    console.log('App is running, server is listening on port ', apps.get('port'));
    GPIO.setup(map);
    GPIO.read_ogg1(function(value){
        //socket.emit('light', value);
        console.log("read ogg 1");
    });
    GPIO.read_ogg2(function(value){
        console.log("read ogg 2");
    });
});


