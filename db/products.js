module.exports = (function () {
  var productArray = [{name: 'kai',price:55, id:0, inventory:1}, {name: 'brad', price: 100, inventory:8, id: 1}];


  function _add(productObject, callback) {
    //here we are checking to make sure there are no duplicate values
    //in our array
    for (var x = 0; x < productArray.length; x++) {

      if(productObject.name === productArray[x].name) {
        return callback(new Error(': this product has already been posted'));
      }
    }

    productArray.push(productObject);
    callback(null);
  }

//returns everything in the productArray when called
  function _getAll() {
    return productArray;
  }

  function _editById(requestBody, requestId, callback){
    //Here we are checking to make sure someone has not deleted the information
    //at the position in the array making it null
    if(productArray[requestId]  === null){
      //if null we invoke the callback function with a truthy value to throw an error
      return callback(new Error(': ID is Null'));
    }

    //Here we are checking if PUT request ID is actually an ID in our array
    //by looking at the length of array minus 1 (since ID's equal the position
    //in the array)
    if(requestId > (productArray.length-1)){
      //if true we invoke callback function with a truthy value to throw an error
      return callback(new Error(': ID not found'));
    }

    //This checks for keys to edit in the database.  If found, values are reassigned
    for(var key in requestBody){
      if(key === 'name'){
        productArray[requestBody.id].name = requestBody.name;
      }
      if(key === 'price'){
        productArray[requestBody.id].price = requestBody.price;
      }
      if(key === 'inventory'){
        productArray[requestBody.id].inventory = requestBody.inventory;
      }
    }
    //if passed to here, changes have been made and callback is invoked
    //with a null which is a falsey passed into callback function
    callback(null);
  }

  function _getById(requestId){
    return productArray[requestId];
  }

  function _deleteProduct(requestId, callback) {
    //this checks to see if the id exist
    if(requestId > (productArray.length-1)){
      return callback(new Error(': ID not found'));
    }

    //this checks to make sure the index isn't null
    if(productArray[requestId]  === null){
    return callback(new Error(': ID is Null'));
    }
    //at this point, it erases the object at ID# index and replaces it with
    //null.  The callback function is called with null
    productArray[requestId] = null;
    callback(null);
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
