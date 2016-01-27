var express = require('express');
var app = express();
var productsRouter = require('./routes/products.js');
var arcticlesRouter = require('./routes/articles.js');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var fs = require('fs');
var monthArry=['Jan ', 'Feb ', 'Mar ', 'Apr ', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride(function(request,response){
  if ((request.body) && (typeof request.body === 'object') && ('_method' in request.body)){
    var method = request.body._method;
    delete request.body._method;
    return method;
  }
}));

app.use('*', function (request, response, next) {
  if ((request.headers.hasOwnProperty('dnt')) && (request.headers.dnt === '1')) {
    return response.send({
      'error': 'sorry, we wanna track you'
    });
  }
  next();
});

//this middleware takes the request and extracts the method, url,
//the headers, and creates a timestamp and writes this to a file in
//a string mapped out like an object.
app.use('*', function (request, response, next) {
  var trackingObj = {
    method: request.method,
    url: request.url,
    timestamp: new Date(),
    headers: request.headers
  };
  //here we creating a 'dates' variable which will have the year,
  //month abbreviation and day of month and will use that as
  //the file name we writ in fs.appendFile.  Each day, this file name
  //will change causing a new log file to be created
  var dateMaker = new Date();
  var dates = dateMaker.getFullYear() + '.' + monthArry[dateMaker.getMonth()] + '.' + dateMaker.getDate();
  var trackingString = '';
  for (var key in trackingObj) {
    if (key === 'headers') {
      trackingString += ' ' +key + ': ' + JSON.stringify(trackingObj[key]) +'\n\n';
    } else {
      trackingString += key + ': ' + trackingObj[key] + ' ';
    }
  }
  fs.appendFile('./' + dates + '.log', trackingString, function(err) {
    if(err) {
      throw new Error(err);
    }
  });
    next();
});

app.set('views', './templates');
app.set('view engine', 'jade');
app.use('/products', productsRouter);
app.use('/articles', arcticlesRouter);



app.get('/',function(request,response){
  response.send('hello world!');
  response.end();
});

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Connected to', port);
});