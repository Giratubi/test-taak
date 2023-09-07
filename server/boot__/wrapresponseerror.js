
var errorHandler = require('../../server/helpers/errorhandler');

module.exports = function (app) {
  
  var remotes = app.remotes();

  remotes.options.rest = remotes.options.rest || {}
  remotes.options.rest.handleErrors = false;

  app.middleware('final', FinalErrorHandler);

  function FinalErrorHandler(err, req, res, next) {

    var code = res.statusCode; 
 
    if(err) {
      if(code==200){
         // Fix the fake good response
         code = 400;
      }
      err = errorHandler.manageError(err, code);
    } 

    console.log(new Date() + ' FinalErrorHandler returns - code:' + code + ' err.message: ', err.message);      

    res.status(code).send({
      code: code,
      message: err.message,
      data: {},
      result: "fail"
    }).end();

  }
};