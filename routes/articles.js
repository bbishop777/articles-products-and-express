var express = require('express');
var fs = require('fs');
var router = express.Router();
//don't need ./../db jus ../db/products also no .js needed. Express knows.
//could also capitalize articleModule to make it look like a class
var articleModule = require('./../db/articles.js');

router.get('/', function(request, response){
  return response.render('articles/index', {
    articles: articleModule.getAll()
  });
});
router.get('/new', function(request,response) {
  return response.render('articles/new');
});

router.get('/:url_title', function(request, response){
  var requestUrlTitle = encodeURI(request.params.url_title);
  return response.render('articles/show', {
    articles: articleModule.getByTitle(requestUrlTitle)
  });
});

router.get('/:url_title/edit', function(request, response){
  var requestUrlTitle = encodeURI(request.params.url_title);

  return response.render('articles/edit', {
    article: articleModule.getByTitle(requestUrlTitle)
  });
});


function postValidation(request, response, next){
  var postRequestValidation = ['title', 'body', 'author'];

  for(var i = 0; i < postRequestValidation.length ; i++){

    //here we are checking for all required keys for the POST
    if(!request.body.hasOwnProperty(postRequestValidation[i])){
      return response.send(false + ': needs to have title, body, and author keys');
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
    'author' : request.body.author,
    'url_title' : encodeURI(request.body.title)
  };

  articleModule.add(articleObject, function(err){
    if(err) {
      return response.send({
        success: false,
        message: err.message
      });
    } else {
      //var postResults = articleModule.getAll();
      return response.render('articles/index', {
        articles: articleModule.getAll()
      });
    }
  });
});

function putValidation(request, response, next){

  var putRequestValidation = ['title', 'author', 'body'];

  for(var i = 0; i < putRequestValidation.length ; i++){

    //here we are checking for all required keys for the POST
    if(!request.body.hasOwnProperty(putRequestValidation[i])){
      return response.send(false + ': needs to have title, author, and body keys');
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
    if(key === 'author'){
      //checking that there is a value
      if(request.body.author.length === 0) {
        return response.send(false + ': Missing values for author');
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

router.put('/:title/edit', putValidation, function(request, response){
  var requestTitle = request.params.title;
  articleModule.editByName(requestTitle, request.body); // , function(err){
  //   if(err) {
  //     return response.send({
  //       success: false,
  //       message: err.message
  //     });
  //     //falsey return from callback function
  //   } else {
      //var putChange = articleModule.getByTitle(requestUrlTitle);
      return response.render('articles/index', {
        articles: articleModule.getAll()
      //});
    });
  //});
});

router.delete('/:url_title',function(request, response){
   var requestUrlTitle = encodeURI(request.params.url_title);

  articleModule.deleteArticle(requestUrlTitle, function (err) {
    if(err) {
      return response.send({
        success: fail,
        message: err.message
      });

    } else { //if this callback function returns falsey to error then returns
      //success with what the id# now show (null)
      //var deleteChange = articleModule.getById(requestId);
      return response.render('articles/index', {
        articles: articleModule.getAll()
      });
    }
  });

});


module.exports = router;