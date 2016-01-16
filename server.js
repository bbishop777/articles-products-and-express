var express = require('express');
var app = express();
var jade = require('jade');


app.use(express.static('public'));

app.set('views', '/templates');
app.set('view engine', 'jade');

app.get('/',function(req,res){
  res.send('hello world!');
  res.end();
});

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('connected');
});