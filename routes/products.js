var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(request, response){
  response.send('aloha');
  response.end();
});


module.exports = router;