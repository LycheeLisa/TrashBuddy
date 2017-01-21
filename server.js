/**
 * Created by chenji13 on 1/21/2017.
 */
var express = require('express');
var app = express();
var db = require('./db.json');
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res ) {
    res.sendFile(__dirname + '/public/index.html');
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
var server = app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('SmartCan started at http://%s:%s', host, port);
});