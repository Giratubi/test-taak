'use strict';

var app = require('../../server/server');
var fs = require('fs');
var generator = require('loopback-sdk-angular');
var path = require('path');

module.exports = function(Installation) {

	Installation.generateLbServices = async() => {

	  var ngModuleName = 'lbServices';
	  var apiUrl = '/api';
	  var namespaceCommonModels = false;
	  var namespaceDelimiter = '.';
	  var includeSchema = false;

	  var result = generator.services(app, {
	    ngModuleName: ngModuleName,
	    apiUrl: apiUrl,
	    namespaceCommonModels: namespaceCommonModels,
	    namespaceDelimiter: namespaceDelimiter,
	    includeSchema: includeSchema,
	  });

	    var outputFile = path.resolve('client/js/services/lb-services.js');
	    fs.writeFileSync(outputFile, result);
	}

};
