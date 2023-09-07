'use strict';

var async = require('async');
var methodsHelper = require('../helpers/methods');
var app = require('../../server/server');

module.exports = function(app) {

  start();
  
  async function start() {
      var entity = await autoupdateAllEntity();
      var services = await initializateServices();
  }


  function printFoundedModel(){
     console.log('Updating Models....:', Object.keys(app.models));
  }
  
  async function autoupdateAllEntity(){

    //printFoundedModel();
    var mongoDs = app.dataSources.MongoDs;

    for (var model in app.models) {

      console.log("model",model);
       try{
            await mongoDs.autoupdate(model);
        }
       catch(ex){
        console.log("EX",ex);
       }
       
    };
  }

  async function initializateServices(){

    var Services = app.models.Services;
    //var Factory = app.models.Factory;
   // var Internalcauses = app.models.InternalCauses;
    var Operations = app.models.Operations;
    var OperationsCategory = app.models.OperationsCategory;

   // var ic = await Internalcauses.loadInternalCauses();

    var oc = await OperationsCategory.loadOperationsCategory();

    var op = await Operations.loadOperations();   

    var si = await Services.initializateServices();
  
   

    if(await Services.start()){
       console.log('External Services correctly started');
    }else
    {
       console.log('ERROR: Factory service stopped');
    }
  }  

};

/*

function disableUnusedMethodsForLbTables()
{
 
    //printFoundedModel();
    
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;
    var ACL = app.models.ACL;    

    var methodsToDisplayRole =  [];
    methodsHelper.disableAllExcept(Role, methodsToDisplayRole); 

    var methodsToDisplayRoleMapping =  [];;
    methodsHelper.disableAllExcept(RoleMapping, methodsToDisplayRoleMapping); 

    var methodsToDisplayAcl =  [];
    methodsHelper.disableAllExcept(ACL, methodsToDisplayAcl); 
     
} 

function createLbTables(){
  
    var ds = app.dataSources.oracleDs;
    
    var lbTables = ['AccessToken','Role','RoleMapping'];

    ds.automigrate(lbTables, function(er) {
      if (er) throw console.log(er);
      console.log('Loopback tables [' + lbTables + '] created in ', ds.adapter.name);
    });
  }
 

  Refactoring actual unused

  function automigrateEntityInOrder() {
      //data sources 
      var oracleDs = app.dataSources.oracleDs;
      async.parallel({
          //factory:async.apply(createFactory),
          //users: async.apply(createUsers),   
          //operations:async.apply(createOperations),
          //operationscategory:async.apply(createOperationsCategory),
          //usersoperations:async.apply(createUsersOperations)
          //graphs:async.apply(createGraphs),
          //requests:async.apply(createRequests)
      }, function(err, results) {
        if (err) throw err;
          //createLbTables();  
         
      });
      //autoupdateAllEntity();
  }
  

  function createLbTables(){
  
    var ds = app.dataSources.oracleDs;
    
    var lbTables = ['AccessToken'];

    ds.automigrate(lbTables, function(er) {
      if (er) throw er;
      console.log('Loopback tables [' + lbTables + '] created in ', ds.adapter.name);
    });
  }

  function createFactory(cb) {
    
    var ds = app.dataSources.oracleDs;

    var factory = app.models.Factory;
   
    ds.createModel(factory.name, factory.definition.properties, factory.definition.options);

    ds.automigrate(function () {
      ds.discoverModelProperties('Factory', function (err, props) {
        console.log(props);
      });
    });
  }

  function createUsers(cb) {
    
    var ds = app.dataSources.oracleDs;

    var users = app.models.Users;
    
    ds.createModel(users.name, users.definition.properties, users.definition.options);

    ds.automigrate(function () {
      ds.discoverModelProperties('Users', function (err, props) {
        console.log(props);
      });
    });
  }

  function createOperations(cb) {
    
    var ds = app.dataSources.oracleDs;

    var operations = app.models.Operations;

    ds.createModel(operations.name, operations.definition.properties, operations.definition.options);

    ds.automigrate(function () {
      ds.discoverModelProperties('Operations', function (err, props) {
        console.log(props);
      });
    });
  
  }

  function createOperationsCategory(cb) {
    
    var ds = app.dataSources.oracleDs;

    var operationscategory = app.models.OperationsCategory;
   
    ds.createModel(operationscategory.name, operationscategory.definition.properties, operationscategory.definition.options);

    ds.automigrate(function () {
      ds.discoverModelProperties('OperationsCategory', function (err, props) {
        console.log(props);
      });
    });
  }

 function createUsersOperations(cb) {
    
    var ds = app.dataSources.oracleDs;

    var usersoperations = app.models.UsersOperations;

    ds.createModel(usersoperations.name, usersoperations.definition.properties, usersoperations.definition.options);

    ds.automigrate(function () {
      ds.discoverModelProperties('UsersOperations', function (err, props) {
        console.log(props);
      });
    });
  
  }


function createGraphs(cb) {
    
    var ds = app.dataSources.oracleDs;

    var graphs = app.models.Graphs;

    ds.createModel(graphs.name, graphs.definition.properties, graphs.definition.options);

    ds.automigrate(function () {
      ds.discoverModelProperties('Graphs', function (err, props) {
        console.log(props);
      });
    });
  
}

function createRequests(cb) {
    
    var ds = app.dataSources.oracleDs;

    var requests = app.models.Requests;

    ds.createModel(requests.name, requests.definition.properties, requests.definition.options);

    ds.automigrate(function () {
      ds.discoverModelProperties('Requests', function (err, props) {
        console.log(props);
      });
    });
  
}

*/