'use strict';

var app = require('../../server/server');
var methodsHelper = require('../../server/helpers/methods');
var loopback = require('loopback');


module.exports = function(Pddstorageb) {

	var methodsToDisplay =  ['find','create','deleteById','findById'];
	methodsHelper.disableAllExcept(Pddstorageb, methodsToDisplay);



	
	

	

};
