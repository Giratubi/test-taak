'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

module.exports = function(Companytype) {


	var methodsToDisplay =  ['findById','find','create','deleteById'];
	methodsHelper.disableAllExcept(Companytype, methodsToDisplay);

	


	


};
