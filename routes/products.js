var express = require('express');
var fs = require('fs');
var router = express.Router();
//could also capitalize productModule to make it look like a class
var productModule = require('./../db/products.js');
productModule.getAll().then(function(data) {

});

router.get('/', function(request, response){
  productModule.getAll()
    .then(function(data) {
      response.render('products/index', {
        products: data
      });
    })
    .catch(function (error) {
      // error;
      reject(error);
    });
});

router.get('/new', function(request, response){
  return response.render('products/new');
});

router.get('/:id', function(request, response){
  var requestId = parseInt(request.params.id);
    productModule.getById(requestId)
      .then(function(data) {
        response.render('products/show', {
          product: data[0]
        });
      })
      .catch(function(error) {
        response.send({
          success: false,
          message: error.message
        });
      });
});

router.get('/:id/edit', function(request, response) {
  var requestId = parseInt(request.params.id);
  productModule.getById(requestId)
    .then(function(data) {
      response.render('products/edit', {
      product: data[0]
      });
    })
    .catch(function(data) {
      response.send({
        success: false,
        message: error.message
      });
    });
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
router.post('/new', postValidation, function(request, response){
  var productObject = {
    'name': request.body.name ,
    'price' : parseInt(request.body.price) ,
    'inventory': parseInt(request.body.inventory)
  };
  productModule.add(productObject)
  .then(function() {
    response.redirect('/products');
  })
  .catch(function (error) {
    response.send({
    success: false,
    message: error.message
    });
  });
});


function putValidation(request, response, next){
  for(var key in request.body){
    //are checking for
    //name, price, and inventory keys. Then checking for values to
    //those keys
    if(key === 'name'){
      //checking that there is a value
      if(request.body.name.length === 0) {
        return response.send(false + ': Missing values for name');
      }
    }
    if(key === 'price'){
      //checking that there is a value
      if(request.body.price === undefined) {
        return response.send(false + ': Missing values for price');
      }
    }
    if(key === 'inventory'){
      //checking that there is a value
      if(request.body.inventory === undefined) {
        return response.send(false + ': Missing values for inventory');
      }
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
  next();
}

router.put('/:id/edit', putValidation, function(request, response){
  var requestId = parseInt(request.params.id);
  request.body.id = requestId;
  productModule.editById(request.body,requestId)
    .then(function() {
    response.redirect('/products/' + request.params.id);
    })
    .catch(function(data) {
      response.send({
        success: false,
        message: error.message
      });
    });
});

router.delete('/:id', function(request, response) {
  var requestId = parseInt(request.params.id);
  productModule.deleteProduct(requestId)
    .then(function() {
      response.redirect('/products');
    })
    .catch(function (error) {
      response.send({
      success: false,
      message: error.message
    });
  });
});


module.exports = router;