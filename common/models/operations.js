'use strict';
	
var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

const SUPERVISOR_OPERATION = 3;
const HISTORY_SUPERVISOR_OPERATION = 8;

module.exports = function(Operations) {

/* ---------------------------------- SETTINGS ---------------------------------- */

	var methodsToDisplay =  ['findById','find','create'];
	methodsHelper.disableAllExcept(Operations, methodsToDisplay);


	Operations.loadOperations = async () => {
		try {

			const operations = [
				{
				"id": 11,
				"name": "Inserisci azienda",
				"slug": "inserisciazienda",
				"view": "inserisciazienda.html",
				"controllername": "inserisciAziendaController",
				"controllerjs": "inserisciazienda.js",
				"operationsCategoryId": 6,
				"icon": "f",
				"isfortimecards": false
				},
				{
				"id": 12,
				"name": "Visualizza aziende",
				"slug": "visualizzaaziende",
				"view": "visualizzaaziende.html",
				"controllername": "visualizzaAziendeController",
				"controllerjs": "visualizzaaziende.js",
				"operationsCategoryId": 6,
				"icon": "f",
				"isfortimecards": false
				},
				{
				"id": 13,
				"name": "Inserisci utente",
				"slug": "inserisciutente",
				"view": "inserisciutente.html",
				"controllername": "inserisciUtenteController",
				"controllerjs": "inserisciutente.js",
				"operationsCategoryId": 7,
				"icon": "f",
				"isfortimecards": false
				},
				{
				"id": 14,
				"name": "Visualizza utenti",
				"slug": "visualizzautenti",
				"view": "visualizzautenti.html",
				"controllername": "visualizzaUtentiController",
				"controllerjs": "visualizzautenti.js",
				"operationsCategoryId": 7,
				"icon": "f",
				"isfortimecards": false
				},				
				{
				"id": 16,
				"name": "Tipi sensori",
				"slug": "tipisensori",
				"view": "tipisensori.html",
				"controllername": "tipiSensoriController",
				"controllerjs": "tipisensori.js",
				"operationsCategoryId": 8,
				"icon": "f",
				"isfortimecards": false
				},
				{
				"id": 17,
				"name": "Connettori",
				"slug": "connettori",
				"view": "connettori.html",
				"controllername": "connettoriController",
				"controllerjs": "connettori.js",
				"operationsCategoryId": 8,
				"icon": "f",
				"isfortimecards": false
				},	
				{
				"id": 18,
				"name": "Gateways",
				"slug": "gateways",
				"view": "gateways.html",
				"controllername": "gatewaysController",
				"controllerjs": "gateways.js",
				"operationsCategoryId": 8,
				"icon": "f",
				"isfortimecards": false
				},				

			];

		 	for (const i of operations) {
	       	 
	          var opExist = await Operations.findById(i.id);
	        
	          if (!opExist){
	          	let results = await Operations.create(i);
	            console.log('Operation created: ', results)
	          } else if (opExist.slug != i.slug || opExist.controllerjs != i.controllerjs || opExist.controllername != i.controllername || opExist.operationsvalidationid != i.operationsvalidationid) {
	          	let results = await Operations.updateAttributes(i.id, {slug: i.slug, controllerjs: i.controllerjs, controllername: i.controllername, operationsvalidationid: i.operationsvalidationid});
	          	console.log('Operation updated id =', i.id, 'slug =', i.slug, 'controllerjs =', i.controllerjs, 'controllername =', i.controllername, "operationsvalidationid =", i.operationsvalidationid);
	          }
	        }

		}catch(results){
			console.log(results.message);
		}
		  
	}

/* ---------------------------------- VALIDATOR --------------------------------- */

	

/* ---------------------------------- REMOTE METHODS ---------------------------- */	
	
	
	Operations.delete = async (id) => {
		
		debugger;
		var OperationsUsers = app.models.UsersOperations;	
   	    let results;
   	    try
   	    {
   	    	const operation = await Operations.findById(id);
   	    	if(!operation)
   	    	{
   	    		throw new Error('Operazione non trovata');
   	    	}

			var opUs = await OperationsUsers.find({where:{and:[{operationsid:id},{active:false}]}});		
			
			if(opUs.length>0) {
				operation.remove();
				operation.save();
				return {count:1};	
			}
			else{
				throw new Error('Non è possibile cancellare una operazione in stato attivo per un utente');
			}    		
		}
		catch(results) {
			console.log(results);
		throw(results);
		}	
	   	
		
	};


	Operations.remoteMethod(
		'delete', {
		  http: {
		    path: '/:id/delete',
		    verb: 'delete'
		  },
		  returns: {arg: 'results',type: 'object',root:true},
		  accepts: {arg: 'id', type: 'number', required: true, description:"Operation id to delete"},
		  description: "Delete Operations. Only no related element was deleted "
	});

	Operations.activateForUser = async (userId,operationId) => {

		console.log("USER ID E OP",userId,operationId);		   

		var Users = app.models.Users;
		var OperationsUsers = app.models.UsersOperations;
	  	let results = [];

		debugger;	
		try
		{

			var exist_user = await Users.findById(userId);
			if(!exist_user) {
				throw new Error('L\' utente deve esistere');    
			}

			

			var id = operationId + '_' + userId;
			var existing_row = await OperationsUsers.find({where: {id:id}})

			if (existing_row.length > 0) {
				if (!existing_row[0].active) {
					existing_row[0].active = true;
					results.push(existing_row[0].save());
				} else {
					results.push(existing_row[0]);
					return results[0];
				}
			} else {
				const userop = [{operationsid:operationId,usersid:userId,active:true,id:id}];   	    	
				results = await OperationsUsers.create(userop);
			}

			var dashoboard = await Operations.generateDashboardForUser(userId);

	 		return results[0];
		}
		catch(results) {
			throw(results);
		}

 	};
	Operations.remoteMethod(
		
		'activateForUser', {
		  http: {
		    path: '/:id/activateForUserId',
		    verb: 'post'
		  },
		  returns: {arg: 'UsersOperations',type: 'UsersOperations',root:true},
		  accepts: [{arg: 'userId', type: 'number',required: true, description:"User id that you want to activate operation"},
		  			{arg: 'operationId', type: 'number',required: true,description:"Operations id that you want to activate to User"}
		  		   ],
		  description: "write a useroperations row if not present or change to active the correct row"
	});

	// DONT REPEAT YOURSELF Two methods activate and deactivate are the same(?). Use Active as Parameter
	// Priority high, Violated Design Pattern DRY.
	Operations.deactivateForUser = async (userId,operationId) => {
		var Users = app.models.Users;
   		var OperationsUsers = app.models.UsersOperations;
   		var Graphs = app.models.Graphs;
 		let results = [];
   		debugger;
   	    try
   	    {
   	    	var exist_user = await Users.findById(userId);
   	    	if(!exist_user) {
   	    		throw new Error('L\' utente deve esistere');    
   	    	}

   	    	
   	    	

   	    	var id = operationId + '_' + userId;
   	    	var existing_row = await OperationsUsers.find({where: {id:id}})
   	    	if(existing_row.length > 0){
   	    		if(existing_row[0].active){
   	    			existing_row[0].active = false;
   	    			results.push(existing_row[0].save());
   	    		} else {
   	    			results.push(existing_row[0]);
   	    			return results[0];
   	    		}
   	    	} else {
   	    		const userop = [{operationsid:operationId,usersid:userId,active:false,id:id}];   	    	
   	    		results = await OperationsUsers.create(userop);
   	    	}

   	   		var dashboard = await Operations.generateDashboardForUser(userId);

   	    	return results[0];
   	    }
   	    catch(results) {
   	    	console.log(results);
   	    	throw(results);
   	    }

	};
	Operations.remoteMethod(
		
		'deactivateForUser', {
		  http: {
		    path: '/:id/deactivateForUser',
		    verb: 'post'
		  },
		  returns: {  arg: 'UsersOperations',type: 'UsersOperations',root:true},
		  accepts: [{arg: 'userId', type: 'number',required: true,description:"User id that you want to deactivate operation"},
		  			{arg: 'operationId', type: 'number',required: true,description:"Operation id that you want to deactivate to user"}
		  		   ],
		  description: "write a useroperations row if not present with deactivate <br> state or change to deactive the correct row"
	});


	Operations.setOperationForRole = async (operationId,roleId) => {		   

   		var AuthenticationOperations = app.models.AuthenticationsOperations; 
   		var Authentications = app.models.Authentication;

 		let results;

   		debugger;	
   	    try
   	    {
   	    	
   	    	var existRole = await Authentications.findById(roleId);
   	    	if(!existRole) {
   	    		throw new Error('L\' operazione deve esistere');    
   	    	}

   	    	var existOperation = await Operations.findById(operationId);
   	    	if(!existOperation) {
   	    		throw new Error('L\' operazione deve esistere');    
   	    	}

   	    	var id = operationId + '_' + roleId;
   	    	var existingRow = await AuthenticationOperations.find({where: {id:id}})

   	    	if(existingRow.length == 0){
   	    		console.log(operationId);
   	    		console.log(roleId);
   	    	    const roleop = [{authenticationid:roleId,operationsid:operationId,id:id}];   	    	
   	    		results = await AuthenticationOperations.create(roleop);	
   	    	}
   	    }
   	    catch(result) {
   	    	var errore = new Error();
			errore.message = result;
			errore.status = 400;
			throw errore;
   	    }	
	};
	Operations.remoteMethod(
		
		'setOperationForRole', {
		  http: {
		    path: '/setOperationForRole',
		    verb: 'post'
		  },
		  returns: {arg: 'AuthenticationOperations',type: 'AuthenticationsOperations',root:true},
		  accepts: [{arg: 'operationId', type: 'number',required: true,description:"Operations id that you want to activate"},
		  			{arg: 'roleId', type: 'number',required: true, description:"Role id that you want to activate operation"}
		  		   ],
		  description: "write a authenticationoperations row if not present "
	});

	Operations.unSetOperationForRole = async (operationId,roleId) => {		   

   		var AuthenticationOperations = app.models.AuthenticationsOperations; 
   		var Authentications = app.models.Authentication;

 		let results;

   		debugger;	
   	    try
   	    {

   	    	var existRole = await Authentications.findById(roleId);
   	    	if(!existRole) {
   	    		throw new Error('L\' operazione deve esistere');    
   	    	}

   	    	var existOperation = await Operations.findById(operationId);
   	    	if(!existOperation) {
   	    		throw new Error('L\' operazione deve esistere');    
   	    	}

   	    	var id = operationId + '_' + roleId;
   	    	var existingRow = await AuthenticationOperations.find({where: {id:id}})

   	    	if(existingRow.length > 0){
   	    	       	    	
   	    		results = await AuthenticationOperations.deleteById(id);	
   	    	}
   	    }
   	    catch(result) {
   	    	var errore = new Error();
			errore.message = result;
			errore.status = 400;
			throw errore;
   	    }	
	};
	Operations.remoteMethod(
		
		'unSetOperationForRole', {
		  http: {
		    path: '/unSetOperationForRole',
		    verb: 'post'
		  },
		  returns: {arg: 'AuthenticationsOperations',type: 'string',root:true},
		  accepts: [{arg: 'operationId', type: 'number',required: true,description:"Operations id that you want to activate"},
		  			{arg: 'roleId', type: 'number',required: true, description:"Role id that you want to activate operation"}
		  		   ],
		  description: "delete a authenticationoperations row if present "
	});



	
	Operations.listActiveForUser = async (userId) => { 
	   
	   	var OperationsUsers = app.models.UsersOperations;
 		var Users = app.models.Users;
   	
 		let results = [];
	   	debugger;
   	    try
   	    {
   	    	var exist_user = await Users.findById(userId);
   	    	if(!exist_user) {
   	    		throw new Error('L\' utente deve esistere');    
   	    	}

   	    	var activeOperations = await OperationsUsers.find({where: {and: [{usersid:userId},{active: true}]}});
			
			for(const acop of activeOperations){
				
				var operation = await Operations.findById(acop.operationsid);

				results.push(operation);
			}
			return results;
   	    }
   	    catch(results) {
   	    	console.log(results);
   	    	throw(results);
   	    }
	};
	Operations.remoteMethod(
		
		'listActiveForUser', {
		  http: {
		    path: '/listActiveForUser',
		    verb: 'get'
		  },
		  returns: {arg: 'UsersActiveOperations', type: ['Operations'],root:true},
		  accepts: [{arg: 'userId', type: 'number',required: true,description:"User id that you want to know active op"}],
		  description: "Get a list of active operation for user"
	});


	Operations.updateAttributes = async (id,properties) => {
	   
		debugger;

		var OperationsUsers = app.models.UsersOperations;

		let results;
   	    try
   	    {
			const operation = await Operations.findById(id);
		
			if(operation) {

				results = await operation.updateAttributes(properties);
				if(results){
					var opUsers = await OperationsUsers.find({where:{operationsid:id}});
					
					for(const opu of opUsers){
						if(opu.active){
						
							var dashboard = await Operations.generateDashboardForUser(opu.usersid);	
						}
					}
				}
				return results;	
			}else{
				throw new Error('Operazione non trovata');
			}		
		}
		catch(results) {
			console.log(results.message);
			throw(results);
		}	

	};
	Operations.remoteMethod(
		
		'updateAttributes', {
		  http: {
		    path: '/:id/updateAttributes',
		    verb: 'put'
		  },
		  accepts: [{arg: 'id', type: 'number',required: true,description:"Operations id to change"},
		  			 {arg: 'properties', type:'Operations' ,http: {source: 'body'},description:"Refer to Model and ModelSchema.ID must be removed"}
		  		   ],
		  returns: {arg: 'results', type:'Operations', root:true },
		  description: "Update properties. Admitted only all Except ID"
	});

	Operations.findCategory = async (filter) => {

	 	var OperationsCategory = app.models.OperationsCategory;
   	    try
   	    {
   	    	var where = {};
   	    	if(filter){
				where = JSON.parse(filter);
   	    	}
   	    	
   	    	const results = await OperationsCategory.find(where , { order: 'order ASC' });
   	    	
    		return results;	
   	    }
   	    catch(results) {
   	    	throw(results);
   	    }
	}	
	Operations.remoteMethod(
		
		'findCategory', {
		  http: {
		    path: '/findCategory',
		    verb: 'get'
		  },
		  accepts: {arg: 'filter', type: 'string',description:'Insert a where clause to filter data. Example:{"where":{"field":value}}}'},
		  returns: {arg: 'results', type:'OperationsCategory', root:true },
		  description: "Find a category list"
	});

	Operations.createCategory = async (operationsCategory) => { 
	   	
	   	var OperationsCategories = app.models.OperationsCategory;
   	    try
   	    {

   	    	const categories = await OperationsCategories.find({ order: 'order ASC' });
   	    	var afterFinded = false;
   	    	for(var ctg of categories){
   	    		if(operationsCategory.order == ctg.order || afterFinded){
   	    			ctg.order += 1;
   	    			const saved = await ctg.save();
   	    			afterFinded = true;
   	    		}
   	    	}

   	    	const results = await OperationsCategories.create(operationsCategory);
    		return results;	
   	    }
   	    catch(results) {
   	    	throw(results);
   	    }
		
	};
	Operations.remoteMethod(
		
		'createCategory', {
		  http: {
		    path: '/createCategory',
		    verb: 'post'
		  },
		  returns: {arg: 'operationsCategory',type: 'OperationsCategory',root:true},
		  accepts: {arg: 'category', type: 'OperationsCategory',required: true,http: {source: 'body'},description:"Refer to Model and Model Schema"},
		  description: "Create operationCategory with description"
	});


	Operations.updateCategoryAttributes = async (id,properties) => { 
	   	
	   	debugger;
   	   
   	   	var OperationsCategories = app.models.OperationsCategory;
		var OperationsUsers = app.models.UsersOperations;
		
		let results;
   	    try
   	    {
			const operationCategory = await OperationsCategories.findById(id);
			if(operationCategory) {
			
				results = await operationCategory.updateAttributes(properties);

				const operations = await Operations.find({where:{operationsCategoryId:id}});
				
				for(const op of operations){
				
					var opUsers = await OperationsUsers.find({where:{operationsid:op.id}});
					
					for(const opu of opUsers){
						if(opu.active){
							var dashboard = await Operations.generateDashboardForUser(opu.usersid);	
						}
					}
				}	
				return results;	
			}else{
				throw new Error('Operazione non trovata');
			}		
	
		}
		catch(results) {
			console.log(results.message);
			throw(results);
		}
	};
	Operations.remoteMethod(
		
		'updateCategoryAttributes', {
		  http: {
		    path: '/:id/updateCategoryAttributes',
		    verb: 'put'
		  },
		  returns: {arg: 'operationsCategory',type: 'OperationsCategory',root:true},
		  accepts: [{arg: 'id', type: 'number',required: true,description:"OperationCategory id to change"},
		  			{arg: 'properties', type:'OperationsCategory' ,http: {source: 'body'},description:"Refer to Model and ModelSchema. Read Admitted"}
		  		   ],
		  description: "Edit operationCategory description. Admitted all Except ID"
	});

	Operations.deleteCategory = async (id) => {
		
		var OperationsCategories = app.models.OperationsCategory;
		
		debugger;
   	    let results;
   	    try
   	    {
   	    	const operation = await Operations.find({where:{operationsCategoryId:id}});
   	    
   	    	if(operation.length == 0){
   				
   				const operationCategory = await OperationsCategories.findById(id);
				if(operationCategory) {
					results = await OperationsCategories.deleteById(id);
					return results;	
				}
			}else{
				throw new Error('Non è possibile cancellare una categoria <br> se sono presenti delle operazioni al suo interno.');
			}    		
		}
		catch(results) {
			console.log(results);
			throw(results);
		}	
	   	
		
	};
	Operations.remoteMethod(
		
		'deleteCategory', {
		  http: {
		    path: '/:id/deleteCategory',
		    verb: 'delete'
		  },
		  returns: {arg: 'results',type: 'object',root:true},
		  accepts: {arg: 'id', type: 'number',required: true,description:"OperationCategory id to delete"},
		  description: "Delete Category. Only no related element was deleted "
	});

	// Generate dashboard for User
	Operations.generateDashboardForUser = async (userId) => {
		var OperationsCategories = app.models.OperationsCategory;
		var OperationsUsers = app.models.UsersOperations;
 		var Users = app.models.Users;
		
		console.log("GENERATE Dashboard");
   	
 		let results = [];
	   	debugger;
   	    try
   	    {

   	    	var exist_user = await Users.findById(userId);

   	    	if(!exist_user) {
   	    		throw new Error('L\' utente ' +  userId + ' deve esistere');    
   	    	}

   	    	

   	    	var updated = await exist_user.updateAttributes({activeoperations:''});

   	    	const activeOperationsForUser = await Operations.listActiveForUser(userId);

   	    	const categories = await OperationsCategories.find({ order: 'order ASC' });
			   	    
			let dashboard = [];   	    
   	    	for(const ct of categories) {
   	    		let operations = [];
   	    		var categoryJson = {category:ct,operations:operations}
				//console.log(activeOperationsForUser);   
				for(const auo of activeOperationsForUser) {	
   	    			if(auo.operationsCategoryId == ct.id) {   	    				
   	    				
	   	    			operations.push(auo);
   	    			}	    			
   	    		}
   	    		if(operations.length>0) {

   	    			dashboard.push(categoryJson);	
   	    		}
   	    	}
   	    	
   	    	updated = await exist_user.updateAttributes({activeoperations:JSON.stringify(dashboard)});

   	    	console.log('Dashboard generated for user', userId);
			return dashboard;
   	    }
   	    catch(results) {
   	    	console.log(results);
   	    	throw(results);
   	    } 
		
	};
	Operations.remoteMethod(
		
		'generateDashboardForUser', {
		  http: {
		    path: '/generateDashboardForUser',
		    verb: 'post'
		  },
		  returns: {arg: 'Dashboard',type: 'array',root:true},
		  accepts: [{arg: 'userId', type: 'number',required: true, description:"User id that you want to generate dashboard"}
		  		   ],
		  description: "Generate dashboard for a user"
	});

	Operations.updateServiceUrl = async (id,url) => { 
	   	
		debugger;
   	    let results;
   	    var Services = app.models.Services;

   	    try
   	    {
   	    	var serviceExist = await Services.findById(id);
   	    	if (!serviceExist){
   	    		throw new Error('Il servizio non esiste');
   	    	}

   	    	var validUrl = require('valid-url');
		    if (!validUrl.isUri(url)){
		        throw new Error('Url non valido');
		    }
   	    	serviceExist.url = url;
   	    	const results = await serviceExist.save();
   	    			
   	    	return results;
		}
		catch(results) {
			console.log(results.message);
			throw(results);
		}	

	};
	Operations.remoteMethod(
		
		'updateServiceUrl', {
		  http: {
		    path: '/:id/updateServiceUrl',
		    verb: 'put'
		  },
		  returns: {arg: 'Services',type: 'Services',root:true},
		  accepts: [{arg: 'id', type: 'number',required: true,description:"Service to update url"},
		  			{arg: 'url', type:'string',required: true,description:"Service url"}
		  		   ],
		  description: "Edit service url"
	});

	Operations.services = async (filter) => {

		debugger;
   	    let results = [];
   	    var Services = app.models.Services;

    	var where = {};
    	if(filter){
			where = JSON.parse(filter);
    	}
   	   
   	    try
   	    {
   	    	results = await Services.find(where);
   	    	return results;
		}
		catch(results) {
			console.log(results.message);
			throw(results);
		}
	};
	Operations.remoteMethod(
		
		'services', {
		  http: {
		    path: '/services',
		    verb: 'get'
		  },
		  accepts: {arg: 'filter', type: 'string',description:'Insert a where clause to filter data. Example:{"where":{"field":value}}'},
		  returns: {arg: 'Services', type: ['Services'],root:true},
		  description: "Get services list"
	});


/* ---------------------------------- PRIVATE METHODS ---------------------------- */	

	// Find the appropriate Service to send Request Data to External Service
	Operations.servicesForRequests = async (operationsId) => {

		debugger;
   	    let results = [];
   	    var OpService = app.models.OperationsServices;
   	    var Services = app.models.Services;
   	    try {
   	    	console.log(operationsId);
   	    	var findedserviceforoperation = await OpService.find({where: {operationsid: operationsId}});
   	    	if(findedserviceforoperation.length==0){
   	    		throw new Error('Legame con il servizio inesistente');
   	    	}
   	    	for(const os of findedserviceforoperation){
   	    		var service = await Services.find({where: {and: [{verb:"POST"}, {operationsid: operationsId}]}});
   	    		if(service.length > 0 ){
   	    			results.push(service[0]);	
   	    		}
   	    		else{
   	    			throw new Error('Grave errore di configurazione. Sono abilitati servizi che non esistono')}
   	    	}

   	    	return results;
		}
		catch(results) {
			console.log(results.message);
			throw(results);
		}
	};


/* ---------------------------------- HOOKS ---------------------------- */	


	Operations.observe('before save', async (ctx) => {
	  
	  try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	});

	
	Operations.observe('after save', async (ctx) => {

  		try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	
	});

	Operations.observe('before delete', async (ctx) => {
  		
  		// Remove a process from graphs, remove process from requests and messages 
  		try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	});
	
	Operations.observe('after delete', async (ctx) => {
  		
  		try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	});	

};
