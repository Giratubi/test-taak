'use strict';

var methodsHelper = require('../../server/helpers/methods');


module.exports = function(Operationsservices) {
	
	var methodsToDisplay =  [];
	methodsHelper.disableAllExcept(Operationsservices, methodsToDisplay);  




};
