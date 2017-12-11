var express = require('express');

var apps = express();

var session = require('express-session');
var url = require('url');
var http = require('http').Server(apps);
var io = require('socket.io')(http);

var Gpio = require('onoff').Gpio;
var LED = new Gpio(4, 'out');
var button = new Gpio(17, 'in', 'both');

var GPIO = require ('./plugins/plugin_GPIO.js');

var speech = require('./speech.js');
//var navigator = require('web-midi-api');

const host = 'api.worldweatheronline.com';
const wwoApiKey = 'fda2e356d0ba46ecbc7153434171511';


//mappa link input output e azioni
var map = [{tipo:'luce',out1:'D1',out2:'D2',in1:'D3',in2:'D4',funzione_azione:'set_ogg1',funzione_ricezione:'read_ogg1'},{tipo:'tap',out1:'D6',out2:'D7',in1:'D8',in2:'D9',funzione_azione:'set_ogg2',funzione_ricezione:'read_ogg2'}]



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
    LED.writeSync(out);

    res.write(resp);
    res.end();
});
   
process.on('SIGINT', function () {
    LED.unexport();
    button.unexport();
});

http.listen(apps.get('port'), function() {
    console.log('App is running, server is listening on port ', apps.get('port'));
    GPIO.setup(map);
});


