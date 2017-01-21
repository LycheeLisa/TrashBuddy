var express = require('express');
var app = express();


app.use(express.static(__dirname + '/public'));

/*
 * Visit the home page
 */
app.get('/', function (req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.sendFile(__dirname + '/public/camera.html');
});

var server = app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('TrashBuddy started at http://%s:%s', host, port);
});