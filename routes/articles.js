var express = require('express');
var fs = require('fs');
var router = express.Router();
//don't need ./../db jus ../db/products also no .js needed. Express knows.
//could also capitalize articleModule to make it look like a class
var articleModule = require('./../db/articles.js');

router.get('/', function(request, response){
  articleModule.getAllArticles()
    .then(function(data) {
      response.render('articles/index', {
        articles: data
      });
    })
    .catch(function (error) {
      // error;
      reject(error);
    });
});

router.get('/new', function(request, response){
  return response.render('articles/new');
});

router.get('/:id', function(request, response){
  var requestId = parseInt(request.params.id);
    articleModule.getById(requestId)
      .then(function(data) {
        response.render('articles/show', {
          article: data[0]
        });
      })
      .catch(function(error) {
        response.send({
          success: false,
          message: error.message
        });
      });
});

router.get('/:id/edit', function(request, response){
  var requestId = (request.params.id);

  return response.render('articles/edit', {
    article: articleModule.getById(requestId)
  });
});

function postValidation(request, response, next){

  var postRequestValidation = ['title', 'body', 'first_name', 'last_name'];

  for(var i = 0; i < postRequestValidation.length ; i++){

    //here we are checking for all required keys for the POST
    if(!request.body.hasOwnProperty(postRequestValidation[i])){
      return response.send(false + ': needs to have title, body, first_name, last_name keys');
    }
    //here we are checking to make sure there is a value assigned to
    //each key
    if(request.body[postRequestValidation[i] ].length === 0){
      return response.send(false + ": missing " + postRequestValidation[i] + 'value');
    }

    // if(typeof(request.body.[postRequestValidation[i]]) !== 'string'){
    //   return response.send(false + ': all values need to be a string');
    // }

  }

  next();

}


router.post('/new', postValidation, function(request, response){
  var articleObject = {
    'title' : request.body.title,
    'body' : request.body.body,
    'first_name' : request.body.first_name,
    'last_name' : request.body.last_name,
    'urlTitle' : encodeURI(request.body.title)
  };
  // console.log(articleObject);

  articleModule.add(articleObject)
  .then(function() {
    response.redirect('/articles');
  })
  .catch(function (error) {
    response.send({
    success: false,
    message: error.message
    });
  });
});

function putValidation(request, response, next){

  var putRequestValidation = ['title', 'first_name', 'last_name', 'body'];

  for(var i = 0; i < putRequestValidation.length ; i++){

    //here we are checking for all required keys for the POST
    if(!request.body.hasOwnProperty(putRequestValidation[i])){
      return response.send(false + ': needs to have title, first_name, last_name, and body keys');
    }
    //here we are checking to make sure there is a value assigned to
    //each key
    if(request.body[putRequestValidation[i] ].length === 0){
      return response.send(false + ": missing " + putRequestValidation[i] + 'value');
    }

  }

  for(var key in request.body){

    if(key === 'title'){
      //checking that there is a value
      if(request.body.title.length === 0) {
        return response.send(false + ': Missing values for title');
      }
    }
    if(key === 'first_name'){
      //checking that there is a value
      if(request.body.first_name.length === 0) {
        return response.send(false + ': Missing values for first_name');
      }
    }
    if(key === 'last_name'){
      //checking that there is a value
      if(request.body.last_name.length === 0) {
        return response.send(false + ': Missing values for last_name');
      }
    }
    if(key === 'body'){
      //checking that there is a value
      if(request.body.body.length === 0) {
        return response.send(false + ': Missing values for 0');
      }
    }

  }

  next();
}

router.put('/:id/edit', putValidation, function(request, response){
  var requestId = parseInt(request.params.id);
  request.body.id = requestId;
  articleModule.editById(request.body)
    .then(function() {
    response.redirect('/articles/' + request.params.id);
    })
    .catch(function(data) {
      response.send({
        success: false,
        message: error.message
      });
    });
});

router.delete('/:id',function(request, response){
  var requestId = parseInt(request.params.id);
  articleModule.deleteArticle(requestId)
    .then(function() {
      response.redirect('/articles');
    })
    .catch(function (error) {
      response.send({
      success: false,
      message: error.message
    });
  });

});


module.exports = router;