var express = require('express');
var app = express();
var productsRouter = require('./routes/products.js');

// middleware
app.use('/products', productsRouter);


app.get('/',function(request,response){
  response.send('hello world!');
  response.end();
});

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('connected');
});