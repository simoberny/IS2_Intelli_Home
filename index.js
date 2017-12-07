var express = require('express');
var session = require('express-session');
var url = require('url');
var http = require('http');
var speech = require('./speech.js');
//var navigator = require('web-midi-api');

const host = 'api.worldweatheronline.com';
const wwoApiKey = 'fda2e356d0ba46ecbc7153434171511';

var apps = express();

apps.use(session({ secret: 'quellochevuoi', resave: true, saveUninitialized: true}));

apps.set('view engine', 'ejs');
apps.set('port', (process.env.PORT || 8080));
apps.use(express.static('public'));

/*if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }*/

apps.get('/', function(req, res) {
    if(!req.session.message){
        req.session.message = [];
    }
    res.render('pages/index', {
        messages: req.session.message,
    });    
});

apps.use('/ajax', speech);

apps.get('/attuatori', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    var evento = req.query.evento;
    var stato = req.query.stato;

    var resp = "<strong>AJAX:</strong> " + evento + " - Stato evento: " + stato;

    res.write(resp);
    res.end();
});

apps.listen(apps.get('port'), function() {
    console.log('App is running, server is listening on port ', apps.get('port'));
});


