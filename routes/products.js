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

  // console.log(request.body);
  // console.log(request.body.hasOwnProperty('name'));

  for(var i = 0; i < postRequestValidation.length ; i++){
    //here we are checking for all required keys for the POST
    if(!request.body.hasOwnProperty(postRequestValidation[i])){
      return response.send(false + ' needs to have name, price, and inventory keys');
    }
    //here we are checking to make sure there is a value assigned to
    //each key
    if(request.body[postRequestValidation[i] ].length === 0){
      return response.send(false + " missing " + postRequestValidation + 'value');
    }
  }

    //here we are checking to make sure there are no duplicate values
    //in our array
  for (var x = 0; x < productInventory.length; x++) {
    if(request.body.name === productInventory[x].name) {
      return response.send(false + ' this product has already been posted');
    }
  }

  var productObject = { 'name': request.body.name ,
                        'price' : parseInt(request.body.price) ,
                        'inventory': request.body.inventory ,
                        'id' : idCounter
                        };

  idCounter++;

  productInventory.push(productObject);
  console.log(productInventory);
  response.send({'success':true});
  response.end();
});

router.put('/:id', function(request, response){

  if((parseInt(request.params.id) > (productInventory.length-1))){
    return response.send('id not found');
  }

  if(productInventory[parseInt(request.params.id)]  === null){
    return response.send('ID is Null');
  }




  //id
  //name



  response.end();

});

module.exports = router;