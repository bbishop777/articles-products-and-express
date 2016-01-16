var express = require('express');
var fs = require('fs');
var router = express.Router();
var productInventory = require('./../db/products.js');
var idCounter = 0;

router.get('/', function(request, response){
  response.send('aloha');
  response.end();
});

router.post('/', function(request, response){
  var postRequestValidation = ['name', 'price', 'inventory'];

  for(var i = 0; i < postRequestValidation.length ; i++){
    //here we are checking for all required keys for the POST
    if(!request.body.hasOwnProperty(postRequestValidation[i])){
      return response.send(false + ': needs to have name, price, and inventory keys');
    }
    //here we are checking to make sure there is a value assigned to
    //each key
    if(request.body[postRequestValidation[i] ].length === 0){
      return response.send(false + ": missing " + postRequestValidation + 'value');
    }
  }
  var nan = NaN;
  var nanString = nan.toString();

  // console.log(typeof request.body.price);
  // console.log(nan);
  // console.log(typeof nan + ' this is the typeof nan');
  // console.log(nanString);
  // console.log(typeof nanString + ' this is the typeof nanString');

  // console.log(typeof parseInt(request.body.price)+ ' this is after parseInt');

  if(isNaN(parseInt(request.body.price))){
    return response.send(false + ': price needs to be a number');
  }

  if(isNaN(parseInt(request.body.inventory))){
    return response.send(false + ': inventory needs to be a number');
  }

    //here we are checking to make sure there are no duplicate values
    //in our array
  for (var x = 0; x < productInventory.length; x++) {
    if(request.body.name === productInventory[x].name) {
      return response.send(false + ': this product has already been posted');
    }
  }

  var productObject = { 'name': request.body.name ,
                        'price' : parseInt(request.body.price) ,
                        'inventory': parseInt(request.body.inventory) ,
                        'id' : idCounter
                        };

  idCounter++;

  productInventory.push(productObject);
  console.log(productInventory);
  response.send({'success':true});
  response.end();
});

router.put('/:id', function(request, response){
//Here we are checking if PUT request ID is actually an ID in our array
//by looking at the length of array minus 1 (since ID's equal the position
//in the array)
  if((parseInt(request.params.id) > (productInventory.length-1))){
    return response.send(false + ': ID not found');
  }
//Here we are checking to make sure someone has not deleted the information
//at the position in the array making it null
  if(productInventory[parseInt(request.params.id)]  === null){
    return response.send(false + ': ID is Null');
  }

  var putRequestValidation = ['name', 'id'];

  for(var z = 0; z < putRequestValidation.length; z++) {
//Here we are checking to make sure they include a name and ID key
    if(!request.body.hasOwnProperty(putRequestValidation[z])) {
      return response.send(false + ': Missing name and ID keys');
    }
//Here we are checking to make sure they have values for the the name and ID keys
    if(request.body[putRequestValidation[z]].length === 0) {
      return response.send(false + ': Missing values for ' + putRequestValidation[z]);
    }
  }
//Here we are checking to make sure the url ID matched ID in the client's PUT Request
  if(parseInt(request.params.id) !== parseInt(request.body.id)) {
    return response.send(false + ': Your url ID does not match your PUT ID');
  }

//this checks to see if the request.body had any of the keys
  for(var key in request.body){
    if(key === 'name'){
      productInventory[request.body.id].name = request.body.name;
    }
    if(key === 'price'){
      productInventory[request.body.id].price = request.body.price;
    }
    if(key === 'inventory'){
      productInventory[request.body.id].inventory = request.body.inventory;
    }

  }

  console.log(productInventory[request.body.id]);

  response.end();
});

module.exports = router;