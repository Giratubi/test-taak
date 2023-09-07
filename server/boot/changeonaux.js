'use strict';

var async = require('async');
var methodsHelper = require('../helpers/methods');
var app = require('../../server/server');

var es = require('event-stream');


module.exports = function(server) {

    var Relevalue = app.models.Relevalue

   


	Relevalue.createChangeStream(function(err, changes) {
        //changes.pipe(es.stringify()).pipe(process.stdout);

        //console.log("CAMBIO AUX")
    });


};
