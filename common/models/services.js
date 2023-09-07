'use strict';

var methodsHelper = require('../../server/helpers/methods');	
var app = require('../../server/server');
var loopback = require('loopback');

module.exports = function(Services) {

	
	Services.initializateServices = async () => {

		console.log("INIST SERV");
	    try {
	    	
	        debugger;
	        let results;
	        // service for this application versions.   

			//var Internalcauses = app.models.InternalCauses;

			//var internalAll = await Internalcauses.find();

			let modelschemaAll = {};

			var dsIn = app.dataSources.db;

		    const configIn = {dataSource:'db',public:false}
			let modelIn;
				
			let modelschema;

			/*
			
			for(const int of internalAll){
				
				modelschema = await JSON.parse(int.returnedobject);
		      
				var obj = {
		          "description": int.description,
				  "base": "Model",
				  "plural": int.description
				}

				modelIn = await dsIn.createModel(int.description,modelschema,obj); 
				var exposedIn = await app.model(modelIn,configIn);	
				
				modelschemaAll[int.description] = int.description;
				
			}

			var obj = {
	      "description": 'The results of requests',
			  "base": "Model"
			};

			const model = await dsIn.createModel('requestsresults',modelschemaAll,obj); 
			var exposed = await app.model(model,configIn);	
			*/
	        const servicesDirective = [];

	         console.log("INIST SERV22222");
	        for (const s of servicesDirective) {
	       
	          var serviceExist = await Services.findById(s.id);
	        
	          if (!serviceExist){
	          	
	          	results = await Services.create(s);
	            //console.log(results)
	          } else if (serviceExist.name != s.name) {
	          	results = await serviceExist.updateAttributes({name: s.name});
	          	console.log('Service updated id =', s.id, ' name =', s.name);
	          }
	        }
	       
	       console.log("INIST SERV3333333");
	       
      	} 
      	catch(results) {
      		throw(results);
    	}
  	}

	Services.start = async (gui) => {

		console.log("START");

	  	try{

		  	var servicesDirective = await Services.find();
			
			var errorInModelCreation = false;
			
			var methodsToDisplay = [];

			for (const s of servicesDirective) {

		  		let methods;
		  		let accepts = [];
		  		let returns;
		  		let query;
		  		let body;
		  		let url;

				if(s.verb=="POST") {
				   url = s.url;	
	               methods =  {"create": ["data"]}
	               query = {}
	               body = {"data": "{data}"}
	               accepts = [{arg: 'data', type: [s.name] ,http: {source: 'body'},description:'Refer to Model and Modelschema'}];
	               returns =  {arg: 'results', type:[s.name],root:true}
		  		}
				
				if(s.verb=="PUT"){
				   url = "/" + "{id}" + "/" + s.url;
		  		   methods =  {"updateAttributes": ["id","data"]}
	               query = {}
	               body = {"data": "{data}"}
	               accepts = [{arg: 'id', type:"number",description:'Id of element that you want to delete'},
	               			  {arg: 'data', type: [s.name] ,http: {source: 'body'},description:'Refer to Model and Modelschema'}];
	               returns =  {arg: 'results', type:[s.name],root:true}	  			
		  		}

		  		if(s.verb=="GET"){
		  		   url = s.url;
				   methods =  {"find": ["filter"]}
	               query = {"filter": "{filter}"}
	               body = {}
	               accepts = [{arg: 'filter', type: 'string',description:'Insert a where clause to filter data. Example:{"where":{"field":value}}'}];
	               returns =  {arg: 'results', type:[s.name],root:true} 
		  		}

		  		if(s.verb=="DELETE"){
		  		   url = s.url + "/" + "{id}" + "/"; 
		  		   methods =  {"deleteById": "id"}
	               query = {}
	               body = {}
	               accepts = [{arg: 'id', type:"number",description:'Id of element that you want to delete'}];
	               returns =  {arg: 'results', type:[s.name],root:true}		  				
		  		}

		      	var ds = await loopback.createDataSource({
		      	  name:s.name,		
		          connector: require("loopback-connector-rest"),
		          operations: [{
		            template: {
		              "method": s.verb,
		              "url": url,
		          	  "headers": {
		                "accepts": "application/json",
		                "content-type": "application/json",
		                "secret-key": gui
		              },
					   "query": query,
					   "body": body
		            },
		            functions:methods
		            
		          }]
		        });


		      	var modelschema = await JSON.parse(s.modelschema);
		      
		        var obj = {
		          "description": s.description,
				  "base": "PersistedModel",
				  "plural": s.name
				}

	  			var config = {dataSource:ds,public:false}

			    var model = await ds.createModel(s.name,modelschema,obj); 

			    //Add decorator and special methods here

			    var exposed = await app.model(model,config);			

				if(await Services.addEndpoint(s.name,url,s.verb,model,accepts,returns,s.description,gui)){
					
					methodsToDisplay.push(s.name);
				}
		    }
		    console.log('Services methodsToDisplay: ' + methodsToDisplay);
			methodsHelper.disableAllExcept(Services, methodsToDisplay);  

			var Installation = app.models.Installation;
			var installation = await Installation.generateLbServices();

			return methodsToDisplay;

	  	}catch(results){
	  		throw(results);
	  	}
	}
	
	Services.addEndpoint = async (name,url,method,model,accepts,returns,description,gui) => {

		let path = "/" + name + '/' ;

		//console.log('gui',gui);

		if(method=="PUT") {
			path  =  "/" + ":id" + "/" + name + '/';	
		}
		if(method=="DELETE"){
  		 	path  =   "/" + name + '/' + ":id" + '/' ; 			
  		} 
			
		Services[name] = async(query,id,data) => {

	    	if(method=="POST"){
			    return await model.invoke({data:query});
	  		}
			
			if(method=="PUT") {
				var data = JSON.parse(query);	
				return await model.invoke({id:id,data:data});		  			
	  		}

	  		if(method=="GET"){
				var properties = JSON.stringify(model.definition.properties);

				var where = {};
				if(query){
					where = JSON.parse(query);
				}
				var results = await model.invoke({filter:where});
				return results;
	  		}

	  		if(method=="DELETE"){
	  		 	return await model.invoke(id);		  				
	  		} 
	    };

	    Services.remoteMethod(
	      name, 
	      {
	      	http: {path:path ,verb: method},
	        accepts: accepts, // or whatever you need...
	        returns: returns, // whatever it returns...
	        description: description
	      }
	    );

	    return true;
  	};

};
