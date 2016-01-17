module.exports = (function () {
  var productArray = [];


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

  function _getAll() {
    return productArray;
  }

  return {
    add: _add,
    getAll: _getAll
  };
})();
