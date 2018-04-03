var express = require('express');
var app = express();
var port = process.env.PORT || 80;
var path = require('path');

app.use(express.static(path.resolve("./src/")));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/indexNode.html');
}); 

app.listen(port);
console.log("Miracles occur in port " + port);