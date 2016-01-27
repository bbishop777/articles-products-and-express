module.exports = (function () {

var fs = require('fs');
//require Bluebird for promises
var promise = require('bluebird');

var options = {
  promiseLib: promise //overiding the default promise library with Bluebird. So making sure PG Promise will use Bluebird
};

//require PG Promise allows us to use Postgresql commands in express
//'require' returns the function in the first set of parenthises as a function.  The second set of parenthises
//invokes this returned function with whatever is in the second set of parenthises as the argument.  This can be seen
//with with other requires Ex:
//var express = require('express');
//var app = express();
//This could be written as:
//var express = require('express')();
var pgp = require('pg-promise')(options); //options calls the object above setting
//configure database connection
var cn = {
  host: 'localhost', //default server name
  port : 5432,
  database : 'articles_n_products', //database you are connecting to.  Change this when starting project
  user : 'Kainoa'
};

//create a new db in memory
var db = pgp(cn);

// db.query("select * from users", true)
//     .then(function (data) {
//         // success;
//         console.log(data);
//     })
//     .catch(function (error) {
//         // error;
//     });

//sample insert
// db.one("insert into users(id, username, first_name, last_name) values(default, $1, $2, $3) returning id",
//     ['studmuffin8', 'Pete', 'Wingding'])
//     .then(function (data) {
//         console.log(data.id); // print new user id;
//     })
//     .catch(function (error) {
//         console.log("ERROR:", error); // print error;
//     });
// //
//     db.query("select count(*) from users", true)
//     .then(function (data) {
//         // success;
//         console.log(data);
//     })
//     .catch(function (error) {
//         // error;
//     });
//

// db.result("delete from users where id = 50003", false)
//     .then(function (result) {
//         console.log(result.rowCount); // print how many records were deleted;
//     })
//     .catch(function (error) {
//         console.log("ERROR:", reason); // print error;
//     });


  function _add(productObject, callback) {
    return _getAll()
    .then(function(data){
      for (var x = 0; x < data.length; x++) {
        if(productObject.name === data[x].name) {
          throw new Error(': this product has already been posted');
        }

      }
    })
    .then(function() {
      return db.one("insert into products (id, name, price, inventory) values(default, $1, $2, $3) returning id",
      [productObject.name, productObject.price, productObject.inventory]);
    });
  }

  function _getAll() {
    // return new promise(function(resolve, reject) {

    return db.query("select * from products", true);
  }

  function _editById(requestBody, requestId){
    //This checks for keys to edit in the database.  If found, values are reassigned
      return db.result('update products set name = $1, price = $2, inventory = $3 where id= $4', [requestBody.name, requestBody.price, requestBody.inventory,requestId], true);
      }


  function _getById(requestId){
    return db.query("select * from products where id = " + requestId, true);
  }

  function _deleteProduct(requestId, callback) {
    return db.result("delete from products where id = " + requestId, false);
  }

//all the methods we are exposing/exporting on our productModule
  return {
    add: _add,
    getAll: _getAll,
    getById: _getById,
    editById: _editById,
    deleteProduct: _deleteProduct
  };
})();
