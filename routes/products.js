var express = require('express');
var fs = require('fs');
var router = express.Router();
var productInventory = require('./../db/products.js');

router.get('/', function(request, response){
  response.send('aloha');
  response.end();
});

router.post('/', function(request, response){
  var postRequestValidation = ['name', 'price', 'inventory'];

  console.log(request.body);

  //console.log(request.body.hasOwnProperty(name));

  // for(var i = 0; i < postRequestValidation.length ; i++){
  //   if(!request.body.hasOwnProperty(postRequestValidation[i])){
  //     return response.send(false + ' needs to have name, price, and inventory keys');
  //   }

  //   if(request.body[postRequestValidation[i] ].length === 0){
  //     return response.send(false + " missing " + postRequestValidation + 'value');
  //   }
  // }

  productInventory.push(request.body);
  console.log(productInventory);
  response.end();
});


module.exports = router;