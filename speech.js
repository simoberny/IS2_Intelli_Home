var express = require('express');

var Gpio = require('onoff').Gpio;
var LED = new Gpio(4, 'out');
var button = new Gpio(17, 'in', 'both');

//Inclusione libreria APIAI
var apiai = require('apiai');
//Defizione Api.ai con il codice identificativo dell'agente 
var app = apiai("1d6aa22653f341be840ff33c0f2dda0c");

var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
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
        let city = response.result.parameters['geo-city'];
        let date = response.result.parameters['date'];
        let azione = response.result.parameters['azione_attuatori'];
        let attuatore = response.result.parameters['attuatori'];
        console.log("Azione: " + azione);
        console.log('Attuatore: ' + attuatore);

        LED.writeSync(parseInt(azione));
                

        if(!response.result.parameters['geo-city'] || !response.result.parameters['date']){
            req.session.message.push({position: 'comp', text: response.result.fulfillment.speech});

            res.write(response.result.fulfillment.speech);
            res.end();
            //console.log(response);
        }else{
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
        }
    });
    
    request.on('error', function(error) {
        console.log(error);
    });

    request.end();
});

function callWeatherApi (city, date) {
    return new Promise((resolve, reject) => {
      // Create the path for the HTTP request to get the weather
      let path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
        '&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date + '&lang=it';

      console.log('API Request: ' +  path);

      http.get({host: host, path: path}, (res) => {
        let body = ''; // var to store the response chunks
        res.on('data', (d) => { body += d; }); // store each response chunk
        res.on('end', () => {
          // After all the data has been received parse the JSON for desired data
          let response = JSON.parse(body);
          let forecast = response['data']['weather'][0];
          let location = response['data']['request'][0];
          let conditions = response['data']['current_condition'][0];
          let currentConditions = conditions['weatherDesc'][0]['value'];
          let icon = conditions['weatherIconUrl'][0]['value'];
          let italian = conditions['lang_it'][0]['value'];

          // Create response
          let output = `Il meteo nella ${location['type']} 
          ${location['query']} è ${italian} con le temperature massime previste di
          ${forecast['maxtempC']}°C e minime di
          ${forecast['mintempC']}°C in data
          ${forecast['date']}.`;
          // Resolve the promise with the output text
          resolve({output: output, icon: icon});
        });
        res.on('error', (error) => {
          reject(error);
        });
      });
    });
  }

module.exports = router;