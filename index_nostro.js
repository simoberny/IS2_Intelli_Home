var express = require('express');

var apps = express();

var session = require('express-session');
var url = require('url');
var http = require('http').Server(apps);
var io = require('socket.io')(http);

var Gpio = require('onoff').Gpio;
//var LED = new Gpio(4, 'out');
//var button = new Gpio(17, 'in', 'both');

var GPIO = require ('./plugins/plugin_GPIO.js');

var speech = require('./speech.js');
//var navigator = require('web-midi-api');

const host = 'api.worldweatheronline.com';
const wwoApiKey = 'fda2e356d0ba46ecbc7153434171511';


//mappa link input output e azioni
var map = [{tipo:'luce',out1:'4',in1:'17',funzione_azione:'set_ogg1',funzione_ricezione:'read_ogg1'},{tipo:'luce',out1:'27',in1:'22',funzione_azione:'set_ogg2',funzione_ricezione:'read_ogg2'},{tipo:'tapp',in_up:'10',out_up:'9',in_down:'23',out_down:'24',funzione_azione:'set_ogg3'}]



apps.use(session({ secret: 'quellochevuoi', resave: true, saveUninitialized: true}));

apps.set('view engine', 'ejs');
apps.set('port', (process.env.PORT || 8081));
apps.use(express.static(__dirname));

apps.get('/', function(req, res) {

    if(!req.session.message){
        req.session.message = [];
    }
    res.render('pages/index', {
        messages: req.session.message,
    });
});

apps.use('/ajax', speech);

io.on('connection', function(socket){
    console.log('a user connected');
/*
    button.watch(function (err, value) {
        if (err) {
          throw err;
        }
        
        LED.writeSync(value);
        socket.emit('light', value);
    });
*/

    GPIO.read_ogg1(function(value){
        socket.emit('light', value);
        console.log("read ogg 1");
    });

    GPIO.read_ogg2(function(value){
        console.log("read ogg 2");
    });


    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });

apps.get('/attuatori', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    var evento = req.query.evento;
    var stato = req.query.stato;

    var resp = "<strong>AJAX:</strong> " + evento + " - Stato evento: " + stato;

    var out = req.query.stato == "on" ? 1 : 0;
    GPIO.set_ogg2(out);
    //GPIO.set_ogg3(out);
    //LED.writeSync(out);

    res.write(resp);
    res.end();
});

http.listen(apps.get('port'), function() {
    console.log('App is running, server is listening on port ', apps.get('port'));
    GPIO.setup(map);
});


