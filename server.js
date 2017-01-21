/**
 * Created by chenji13 on 1/21/2017.
 */
var Clarifai = require('clarifai');
var express = require('express');
var app = express();
var fs = require("fs");
var https = require("https");
var db = require('./db.json');
var uuid = require('uuid');

var Cclient = new Clarifai.App(
    'vHoj4XdPkGsG1ThB_pvn9QrbldygqdJLGiK2d3Xq',
    'Cg6MqLWNyRQJNNcOHgBmrniToJFqBNooNGdkWko3'
);

// set up public folder routing
app.use(express.static(__dirname + '/public'));

// set up routing
app.get('/', function (req, res ) {
    res.sendFile(__dirname + '/public/index.html');
    // res.sendFile(__dirname + '/public/js/custom.js');
});
app.get('/camera', function (req, res ) {
    res.sendFile(__dirname + '/public/camera.html');
    // res.sendFile(__dirname + '/public/js/custom.js');
});
app.get('/api/daily', function(req, res){
    var newDatabase = {
        "data": db.data.filter(function(item){
            return item.time == 0;
        })
    };
    res.send(JSON.stringify(newDatabase));
});
app.get('/api/weekly', function(req, res){
    var newDatabase = {
      "data": db.data.filter(function(item){
          return item.time <= 1;
      })
    };
    res.send(JSON.stringify(newDatabase));
});
app.get('/api/monthly', function(req, res){
    var newDatabse = {
        "data": db.data.filter(function(item){
            return item.time <= 2;
        })
    };
    res.send(JSON.stringify(newDatabse));
});

var privateKey  = fs.readFileSync('sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.PORT || 3000, function () {
    var host = httpsServer.address().address;
    var port = httpsServer.address().port;
    console.log('TrashBuddy started at https://%s:%s', host, port);
});


var io = require('socket.io').listen(httpsServer);
io.on('connection', function(socket){
	console.log("User connected...");
	
	socket.on('image', function(dataX) {
		var image = dataX.image;
		var base64Data = image.replace(/^data:image\/png;base64,/, "");
		var filename = "out_" + uuid.v4() + ".png";
        var destinationFile = "captures/" + filename;
		fs.writeFile(destinationFile, base64Data, 'base64', function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("Saved file " + filename);
                //fs.readFile(destinationFile, function(err, data) {
                    Cclient.models.predict(Clarifai.GENERAL_MODEL, {'base64':base64Data}).then(
						function(response) {
						  // do something with response
						  console.log(JSON.stringify(response));
						},
						function(err) {
						  // there was an error
						  console.log(err);
						}
					);
                //});
			}
		});
	});
	
	socket.on('disconnect', function() {
		console.log("User left...");
	});
});