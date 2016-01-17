var express = require('express');
var fs = require('fs');
var router = express.Router();
var productModule = require('./../db/products.js');
var idCounter = 0;

router.get('/', function(request, response){
  response.send('aloha');
});

//Middleware for our POST request
function postValidation(request, response, next) {


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

  //this validates that request.body.price is a number
  if(isNaN(parseInt(request.body.price))){
    return response.send(false + ': price needs to be a number');
  }
  //this validates that request.body.inventory is a number
  if(isNaN(parseInt(request.body.inventory))){
    return response.send(false + ': inventory needs to be a number');
  }
  //If everything is 'good'
  next();
}

//here is our POST, first calls Middleware 'postValidation'
router.post('/', postValidation, function(request, response){
  //After getting thru validation we buid the object to return to the
  //database.  We also increment the counter for the next ID
  var productObject = {
    'name': request.body.name ,
    'price' : parseInt(request.body.price) ,
    'inventory': parseInt(request.body.inventory) ,
    'id' : idCounter
  };

  idCounter++;

//Here we call on the module we brought in from the products.js db
//We pass in the productObject (an object we created)and a callback function which we pass in
// 'err' as a variable that will be defined as either a new Error or as null
// in db.
  productModule.add(productObject, function (err) {
//if there is an error on the db side it will pass that error in with a message
//to this function.  So on the db side a 'truthy' will be returned if errors
    if(err) { //with a truthy this activates

      //here products.js on db side encountered an error and gave us back a message
      //which we put in our response.send below
      return response.send({
        success: false,
        message: err.message
      });

      //here the db side invoked the callback function passing in null, giving a
      //falsy activated the else below
    } else {
      var postResults = productModule.getAll();
      response.send({
        success :true,
        result: postResults
      });
    }
  });
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
});

router.delete('/:id', function(request, response){
  //this checks to see if the id exist
  if((parseInt(request.params.id) > (productInventory.length-1))){
    return response.send(false + ': ID not found');
  }
  //this checks to make sure the index isn't null
  if(productInventory[parseInt(request.params.id)]  === null){
    return response.send(false + ': ID is Null');
  }

  productInventory[request.params.id]=null;
  response.send({'success': true});

});

module.exports = router;