var express = require('express');
var http = require('http');

//Inclusione libreria APIAI
var apiai = require('apiai');
//Defizione Api.ai con il codice identificativo dell'agente 
var app = apiai("1d6aa22653f341be840ff33c0f2dda0c");

var router = express.Router();

//Api meteo
const host = 'api.wunderground.com';
const wwoApiKey = '942594c6e5922dd9';

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

//Pagina principale
router.get('/', function(req, res) {
	if(!req.session.message){
        req.session.message = [];
    }

    res.writeHead(200, {'Content-Type': 'text/html'});

    var data = req.query.data;

    req.session.message.push({position: 'me', text: data});

    var request = app.textRequest(data, {
        sessionId: '5'
    });

    request.on('response', function(response) { 
        var intent = response.result.metadata["intentName"];
        console.log("Intent: " + intent);

        switch(intent){
            case "weather":
                //Gestione conversazioni meteo
                let city = response.result.parameters['geo-city'];
                let date = response.result.parameters['date'];

                if(city && date){
                    callWeatherApi(city, date).then((output) => {      
                        req.session.message.push({position: 'comp', text: output.output, table: true, geo: city, icon: output.icon});
                        
                        var htmlWeather = '' + 
                        '<div class="card">' +
                            '<div class="card-body">' +
                                '<h4 class="card-title">Meteo' + city + '</h4>' +
                                '<h6 class="card-subtitle mb-2 text-muted">Weather Online</h6>' +
                                '<img src="'+ output.icon +'" alt="..." class="img-thumbnail">' +
                                '<p class="card-text">' + output.output + '</p>' +
                            '</div>'+
                        '</div>';
    
                        res.write(htmlWeather);
                        res.end();
                    }).catch((error) => {
                        console.log("Errore: " + error)
                    });
                }else{
                    console.log("Mancanza dati per ottenere meteo!");
                    req.session.message.push({position: 'comp', text: response.result.fulfillment.speech});
                    res.write(response.result.fulfillment.speech);
                    res.end();
                }

                break;
            case "servizio_Attuatori":
                //Gestione servizio attuatori

                //Nome attuatore (tapparelle, luci...)
                let attuatore = response.result.parameters['attuatori'];
                //Azione attuatore (0 o 1)
                let azione = response.result.parameters['azione_attuatori'];
                //Posizione attuatore (cucina, soggiorno)
                let posizione = response.result.parameters['zone'];
                console.log("Attuatore: " + attuatore);
                console.log('Posizione: ' + posizione);
                console.log('Azione: ' + azione);

                req.session.message.push({position: 'comp', text: response.result.fulfillment.speech});
                res.write(response.result.fulfillment.speech);
                res.end();

                break;
            default:
                //Gestione discorsi normali
                req.session.message.push({position: 'comp', text: response.result.fulfillment.speech});
                res.write(response.result.fulfillment.speech);
                res.end();
                break;
        }
    });
    
    request.on('error', function(error) {
        console.log(error);
    });

    request.end();
});


//Implementazione Meteo

function callWeatherApi (city, date) {
    return new Promise((resolve, reject) => {
      // Create the path for the HTTP request to get the weather
      let path = '/api/' + wwoApiKey + '/forecast/lang:IT/q/Italy/' + encodeURIComponent(city) + ".json";

      console.log('API Request: ' +  path);

      var today = new Date();
      var dd = today.getDate();

      var wday = date.slice(-2);
      var period = 2*(wday - dd);

      console.log("Period:" +  2*(wday - dd));

      http.get({host: host, path: path}, (res) => {
        let body = ''; // var to store the response chunks
        res.on('data', (d) => { body += d; }); // store each response chunk
        res.on('end', () => {
          // After all the data has been received parse the JSON for desired data
          let response = JSON.parse(body);
          let forecast = response["forecast"]['txt_forecast']['forecastday'][period];
          console.log(forecast);


          
          let conditions = forecast.fcttext_metric;
          let icon = forecast.icon_url;
          let giorno = forecast.title;

          // Create response
          let output = `Il meteo a ${city} in data ${giorno} ${date} è ${conditions}.`;

          resolve({output: output, icon: icon});
        });
        res.on('error', (error) => {
          reject(error);
        });
      });
    });
  }

module.exports = router;