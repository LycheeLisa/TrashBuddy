var express = require('express');
var app = express();
var crypto = require('crypto'),
  fs = require("fs"),
  https = require("https");

  
  
var privateKey  = fs.readFileSync('sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

app.use(express.static(__dirname + '/public'));

/*
 * Visit the home page
 */
app.get('/', function (req, res) {
	//console.log(1);
	res.header('Access-Control-Allow-Origin', '*');
	res.sendFile(__dirname + '/public/camera.html');
	//res.send("done");
});



var httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.PORT || 3000, function () {
    var host = httpsServer.address().address;
    var port = httpsServer.address().port;
    console.log('TrashBuddy started at https://%s:%s', host, port);
});