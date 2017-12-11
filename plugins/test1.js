var express = require('express');

var app = express();
app.set('port', (process.env.PORT || 8081));



app.get('/',function(req,res){
    console.log('connessione avvenuta');
    res.send('ciao');
});

app.listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
