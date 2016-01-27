module.exports = (function () {

  // var productArray
  // = [
  //   {
  //     name: 'kai',
  //     price:55,
  //     id:0,
  //     inventory:1
  //   },
  //   {
  //     name: 'brad',
  //     price: 100,
  //     inventory: 110,
  //     id: 1
  //   }
  // ];
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
  user : 'bradbishop'
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
    //here we are checking to make sure there are no duplicate values
    //in our array
    // var filterProdArray = productArray.filter(function(product) {
    //   return (product !== null);
    // });
    //var dataAll = _getAll();
    return _getAll()
    .then(function(data){
      for (var x = 0; x < data.length; x++) {
        if(productObject.name === data[x].name) {
          throw new Error(': this product has already been posted');
        }

      }
    })
    .then(function() {

  //     // return new promise(function(resolve, reject) {
      return db.one("insert into products (id, name, price, inventory) values(default, $1, $2, $3) returning id",
      [productObject.name, productObject.price, productObject.inventory]);
  //       .then(resolve)
  //       .catch(function (reject) {
  //           console.log("ERROR:", reject); // print error;
  //       });
  //     });
    });
  }

  function _getAll() {
    // return new promise(function(resolve, reject) {

    return db.query("select * from products", true);
  }
    //here we are filtering out the Null in the array because when we ran
    //a Delete request it erase the object and puts null in its place.  Then
    //Jade tries to render the index page again but doesn't know what to do with
    //null
    // var filterProdArray = productArray.filter(function (product) {
      //filter goes thru each product in productArray and asks if it is 'not'
      //null. For every item that is not null it returns true.
      // return (product !== null);
    // });
    //filter puts all 'true' items in an array which is saved in line 39
    //as filterProdArray and returned below
    // return filterProdArray;
  // }

  function _editById(requestBody, requestId){

    //Here we are checking to make sure someone has not deleted the information
    //at the position in the array making it null
    // if(productArray[requestId]  === null){
    //   //if null we invoke the callback function with a truthy value to throw an error
    //   return callback(new Error(': ID is Null'));
    // }


    //This checks for keys to edit in the database.  If found, values are reassigned
    // for(var key in requestBody){
    //   if(key === 'name'){
      return db.result('update products set name = $1, price = $2, inventory = $3 where id= $4', [requestBody.name, requestBody.price, requestBody.inventory,requestId], true);
      }
    //   if(key === 'price'){
    //     db.result('update products set price= ' + requestBody.price + 'where id= '+ requestId, true);
    //   }
    //   if(key === 'inventory'){
    //     db.result('update products set inventory= ' + requestBody.inventory + 'where id= '+ requestId, true);
    //   }
    // }
    //if passed to here, changes have been made and callback is invoked
    //with a null which is a falsey passed into callback function
  //   callback(null);
  // }

  function _getById(requestId){
    return db.query("select * from products where id = " + requestId, true);
  }

  function _deleteProduct(requestId, callback) {


    // //this checks to make sure the index isn't null
    // if(productArray[requestId]  === null){
    // return callback(new Error(': ID is Null'));
    // }
    return db.result("delete from products where id = " + requestId, false);
//     .then(function (result) {
//         console.log(result.rowCount); // print how many records were deleted;
//     })
//     .catch(function (error) {
//         console.log("ERROR:", reason); // print error;
//     });
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
