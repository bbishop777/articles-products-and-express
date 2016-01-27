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
    // when a new article is added
    var authorChecker = false;

    return _getAllAuthors()
      // we need to check if the author already exists
      //if it alredy exists
        // throw Error
    .then(function(data){
      var existingAuthor=null;
      for (var x = 0; x < data.length; x++) {
        if(articleObject.first_name === data[x].first_name && articleObject.last_name === data[x].last_name ) {
          existingAuthor= data[x];
          authorChecker = true;
        }
      }
    })
          //else
            // make a new author
    .then(function(data) {
      if(authorChecker===false){
        console.log(data);
        // return db.none("INSERT INTO authors(id, first_name, last_name) values(default, $1, $2) returning id",
        // [articleObject.first_name, articleObject.last_name]);

      }
    })

    // // we need to check to see if the article already exists
    // .then(function(){
    //   _getAllArticles()
    // })

    //   //if it already exists - by matching both first name and last name
    //     //don't add a new article
    // .then(function(data) {
    //   for (var x = 0; x < data.length; x++) {
    //     if( articleObject.title === data[x].title ) {
    //       throw new Error(': this article has already been posted');
    //     }
    //   }
    // })
    //   //else
    //     //add a new article
    // .then(function(){
    //   return db.none("INSERT INTO articles(id, title, body, urltitle, author_id) values (default, $1, $2, $3, $4) authors.first_name, authors.last_name FROM articles INNER JOIN authors ON articles.author_id = authors.id WHERE articles.id = ",
    //   [articleObject.title, articleObject.body, articleObject.urltitle, articleObject]);
    // })

    // //INSERT INTO with a INNER JOIN between authors and articles

    // .then(function() {
    //   return db.one("INSERT INTO authors (id, ) values(default, $1, $2, $3, $4) returning id",
    //   [articleOject.title, articleObject.body, articleObject.urltitle, articleObject.author_id]);
    // });

    // //     .then(function() {
    // //   return db.one("INSERT INTO articles (id, title, body, urltitle, author_id) values(default, $1, $2, $3, $4) returning id",
    // //   [articleOject.title, articleObject.body, articleObject.urltitle, articleObject.author_id]);
    // // });

  }

  function _getAllArticles() {
    return db.query("SELECT * FROM articles", true);
  }

  function _getAllAuthors(){
    return db.query("SELECT * FROM authors", true);
  }

  function _getById(requestId){
    return db.query("SELECT articles.*, authors.first_name, authors.last_name FROM articles INNER JOIN authors ON articles.author_id = authors.id WHERE articles.id = " + requestId, true);
  }

  function _editById(requestBody, callback){
    //This checks for keys to edit in the database.  If found, values are reassigned
    return db.result('update articles set title = $1, body = $2, first_name = $3 , last_name = $4 where id= $5', [requestBody.title, requestBody.body, requestBody.first_name, requestBody.last_name, requestBody.Id], true);
  }

  function _deleteArticle(requestId, callback){
    return db.result("delete from articles where id = " + requestId, false);
  }

  return{
    getAllArticles:_getAllArticles,
    getAllAuthors:_getAllAuthors,
    add:_add,
    getById:_getById,
    editById:_editById,
    deleteArticle:_deleteArticle

  };
})();