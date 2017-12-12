var express = require('express');
var session = require('express-session');
var url = require('url');
var http = require('http');
var speech = require('./speech.js');

var apps = express();


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

    var resp = "<strong>AJAX:</strong> " + evento + " - Stato evento: " + stato;

    res.write(resp);
    res.end();
});

apps.listen(apps.get('port'), function() {
    console.log('App is running, server is listening on port ', apps.get('port'));
});


