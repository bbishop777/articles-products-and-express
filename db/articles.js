module.exports = (function(){
  var fs = require('fs');
  var promise = require('bluebird');
  var options = {
    promiseLib: promise
  }
  var pgp = require('pg-promise')(options);

  var cn = {
    host: 'localhost',
    port: 5432,
    database: 'articles_n_products',
    user: 'Kainoa'
  };

  var db = pgp(cn);


  var articlesArray = [
    {
      title: 'The Green Sea Turtle',
      body: 'There was a Hawaiian green sea turtle that lived on the beach',
      author: 'kai',
      urlTitle: 'The%20Green%20Sea%20Turtle'
    },
    {
      title: 'house of the rising sun',
      body: 'every morning starts crazy',
      author: 'salisbury',
      url: 'house%20of%20the%20rising%20sun'
    }

  ];

  function _add(articleObject, callback){
    //here we are checking to make sure there are no duplicate values
    //in our array
    var filterArticlesArray = articlesArray.filter(function(article) {
      return (article !== null);
    });

    for (var x = 0; x < filterArticlesArray.length; x++) {

      if(articleObject.title === filterArticlesArray[x].title) {
        return callback(new Error(': this article has already been posted'));
      }
    }

    articlesArray.push(articleObject);
    callback(null);
  }

  function _getAll() {
    return db.query("SELECT * FROM articles", true);
  }

  function _getById(requestId){
    return db.query("SELECT articles.*, authors.first_name, authors.last_name FROM articles INNER JOIN authors ON articles.author_id = authors.id WHERE articles.id = " + requestId, true);
  }

  function _editByName(requestBody, callback){

    for(var i = 0 ; i < articlesArray.length ; i++){
      if(articlesArray[i].title === requestBody.title){
        for(var key in requestBody){
          if(key === 'title'){
            articlesArray[i].title = requestBody.title;
            articlesArray[i].urlTitle = encodeURI(requestBody.title);
          }
          if(key === 'author'){
            articlesArray[i].author = requestBody.author;
          }
          if(key === 'body'){
            articlesArray[i].body = requestBody.body;
          }
        }
      }
    }

    callback(null);
  }

  function _deleteArticle(requestBody, callback){

    for(var i = 0 ; i < articlesArray.length ; i++){
      if(articlesArray[i].title === requestBody){
        articlesArray[i] = null;
      }
    }

    callback(null);
  }

  return{
    getAll:_getAll,
    add:_add,
    getById:_getById,
    editByName:_editByName,
    deleteArticle:_deleteArticle

  };
})();