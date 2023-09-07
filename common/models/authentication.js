'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

module.exports = function(Authentication) {

/* ---------------------------------- SETTINGS ---------------------------------- */

	var methodsToDisplay =  ['find','create'];
	methodsHelper.disableAllExcept(Authentication, methodsToDisplay); 

/* ---------------------------------- VALIDATOR --------------------------------- */
	
	Authentication.findACLRole= async (filter) => { 
	   	

	   	var ACL = app.models.ACL;
   	    try
   	    {
   	    	var where = {};
   	    	if(filter){
				where = JSON.parse(filter);
   	    	}
   	    	
   	    	const results = await ACL.find(where , { order: 'order ASC' });
   	    	
    		return results;	
   	    }
   	    catch(results) {
   	    	throw(results);
   	    }
		
	};
	Authentication.remoteMethod(
		
		'findACLRole', {
		  http: {
		    path: '/findACLRole',
		    verb: 'get'
		  },
		  returns: {arg: 'AclWhere',type: ['ACL'],root:true,description:"Filtered row"},
		  accepts: {arg: 'filter', type: 'string',required: false,description:'Insert a where clause to filter data. Example:{"where":{"field":value}}'},
		  description: "Get ACL filtered by where"
	});	

	Authentication.createACLRows = async (ACLRow) => { 
	   	
	   	var ACL = app.models.ACL;
   	    try
   	    {
   	    	const acl = await ACL.find({where:{id:ACLRow.id}});
   	    	if(acl.length==0){
   	    		const results = await ACL.create(ACLRow);
    			return results;	
   	    	}
   	    }
   	    catch(results) {
   	    	throw(results);
   	    }
		
	};
	Authentication.remoteMethod(
		
		'createACLRow', {
		  http: {
		    path: '/createACLRow',
		    verb: 'post'
		  },
		  returns: {arg: 'ACLRow',type: ['ACL'],root:true},
		  accepts: {arg: 'ACLRow', type: ['ACL'],required: true, http: {source: 'body'},description:"Refer to Model and ModelSchema"},
		  description: "Create ACL Rows"
	});


	Authentication.updateACLAttributes = async (id,properties) => { 
	   	
		debugger;
   	    
	   	var ACL = app.models.ACL;
   	
		let results;
   	    try
   	    {
			const acl = await ACL.findById(id);
			if(acl) {
				results = await ACL.updateAttributes(properties);
				return results;	
			}else{
				throw new Error('Riga ACL non trovata');
			}		
	
		}
		catch(results) {
			console.log(results.message);
			throw(results);
		}
	};
	Authentication.remoteMethod(
		
		'updateACLAttributes', {
		  http: {
		    path: '/:id/updateACLAttributes',
		    verb: 'put'
		  },
		  returns: {arg: 'ACLRow',type: 'ACL',root:true },
		  accepts: [{arg: 'id', type: 'number',required: true,description:"id of ACL Row"},
		  			{arg: 'properties', type:'ACL' ,http: {source: 'body'},description:"Refer to Model and ModelSchema, id field ignored."}
		  		   ],
		  description: "Edit ACL Attributes"
	});

	Authentication.deleteACLRow = async (id) => {
		
		var ACL = app.models.ACL;
   
		debugger;
   	    let results;
   	    try
   	    {
			const acl = await ACL.findById(id);
			if(acl) {
				results = await ACL.deleteById(id);
				return results;	
			}
		
		}
		catch(results) {
			console.log(results);
			throw(results);
		}	
	   	
		
	};
	Authentication.remoteMethod(
		
		'deleteACLRow', {
		  http: {
		    path: '/:id/deleteACLRow',
		    verb: 'delete'
		  },
		  returns: {arg: 'results',type: 'string',root:true},
		  accepts: [{arg: 'id', type: 'number',required: true,description:"id of ACL Row"}
		  		   ],
		  description: "Delete ACL Row"
	});



	Authentication.updateAttributes = async (id,properties) => {
	   
		debugger;
		let results;
	    try {
			const authentication = await Authentication.findById(id);
			if(authentication) {
				results = await authentication.updateAttributes(properties);
				return results;	
			}else{
				throw new Error('Regola non trovata');
			}		
		}
		catch(results) {
		throw(results);
		}	

	};
	Authentication.remoteMethod(
		
		'updateAttributes', {
		  http: {
		    path: '/:id/updateAttributes',
		    verb: 'put'
		  },
		  accepts: [{arg: 'id', type: 'number',required: true,description:"id of role row"},
		  			 {arg: 'properties', type:'Authentication' ,http: {source: 'body'},description:"Refer to Model and Model Schema. Id must be removed"}
		  		   ],
		  returns: {arg: 'results', type:'Authentication',root:true},
		  description: "Update properties. Admitted All except ID"
	});

	Authentication.deleteRole = async (id) => {
	  
		debugger;
   	    let results;
   	    try
   	    {
   	    
   	    	const authentication = await Authentication.findById(id);
   	    	if(!authentication){
   	    		throw new Error('Regola non trovata')
   	    	}
			
   	    	const authMapped = await authentication.principals.find({where: {roleid: id}});

   	    	if(authMapped.length == 0){
   				
   				const auth = await Authentication.findById(id);
				if(auth) {
					results = await Authentication.deleteById(id);
					return results;	
				}
			}else{
				throw new Error('Non è possibile cancellare una regola che attualmente applicata ad un utente.');
			}    		
		}
		catch(results) {
			console.log(results);
			throw(results);
		}	
	};
	Authentication.remoteMethod(
		
		'deleteRole', {
		 http: {
		    path: '/:id/deleteRole',
		    verb: 'delete'
		},
		returns: {arg: 'count', type:'number',root:true},
		accepts: {arg: 'id', type: 'number',required: true,description:"id of role row"},
		description: "Delete Role only if is empty and no ACL is Mapped"
	});

	Authentication.mapRoleToUser = async (userId,Role) => {
		
		try{

			var Users = app.models.Users;

			var user = await Users.findById(userId);

			let authentication;
	   		
			var roleForUser = Role.split('|');
	   		let oldUserRole = [];
	   		if(user) {
	   			oldUserRole = user.roleids.split('|');
	   		}

			for(const rfu of roleForUser){
					
		   		if(rfu > 0) {
		   			
	   				authentication = await Authentication.findById(rfu);
	   				
	   				if(!authentication)
					{
						throw new Error('La regola che si sta cercando di mappare non esiste');
					}
	
					const existingRole = await authentication.principals.find({where: {and: [{ principalid: userId },{roleid: rfu}]}});
					if(existingRole.length > 0) {
						
						for (const tod of existingRole){

							if(tod.principalId == userId && tod.roleId == rfu){
								tod.remove();
								tod.save();							
							}
						}	
					}
					
			   		//create new rolemapping.

			   		var RoleMapping = app.models.RoleMapping;
			   		const setted = authentication.principals.create({principalType: RoleMapping.USER,principalId: userId,roleId:rfu});	   		  
		   		   
			   		let finded = false;
			   		for(const our of oldUserRole) {

			   			if(rfu == our){
			   				finded = true;
			   			}

			   		}
			   		if(!finded){
			   			var userrole = user.roleids;
			   			
			   			if(userrole.length==0){
			   				userrole = rfu + '|' ;
			   			}else{
			   				userrole = userrole + rfu + '|';
			   			}
			   			user.roleids = userrole;
			   			user.save();
			   		}
	   			}
	   		}

	   		return true

		}catch(results) {
			console.log(results.message);
			return false;
		}	

		
	};
	Authentication.remoteMethod(
		'mapRoleToUser', {
		  http: {
		    path: '/mapRoleToUser',
		    verb: 'post'
		  },
		  
		  returns: {arg: 'results', type:'boolean',root:true },
		  accepts: [{arg: 'userId', type: 'number',required: true,description:"Id of user who have new role subscribed"},
				    {arg: 'Role', type: 'string',required: true,description:"id of Role Row"}],
		  description: "Map Role To Users"
	});



/* ---------------------------------- REMOTE METHODS ---------------------------- */	



/* ---------------------------------- HOOKS ------------------------------------- */	


};
