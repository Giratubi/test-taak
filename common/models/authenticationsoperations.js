'use strict';


var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

module.exports = function(Authenticationsoperations) {

	var methodsToDisplay =  ['findById','find','create'];
	methodsHelper.disableAllExcept(Authenticationsoperations, methodsToDisplay);  

};




