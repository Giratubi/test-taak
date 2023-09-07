'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');


module.exports = function(Users) {

/* ---------------------------------- SETTINGS ---------------------------------- */

	var methodsToDisplay =  ['findById','find','deleteById','login','logout'];
	methodsHelper.disableAllExcept(Users, methodsToDisplay); 
	Users.disableRemoteMethodByName("prototype.verify",true);  
	Users.disableRemoteMethodByName("credentials",true);
	Users.disableRemoteMethodByName("identities",true);  


/* ---------------------------------- VALIDATOR --------------------------------- */
	
  	//Users.validatesUniquenessOf('id', {message: 'L\' utente esiste già nella piattaforma'});
  	//Users.validatesUniquenessOf('email', {message: 'La mail esiste già nella piattaforma'});
  	//Users.validatesUniquenessOf('username', {message: 'Lo username esiste già nella piattaforma'});
  	//Users.validatesPresenceOf('username', 'email','roleids');
	//Users.validatesLengthOf('password', {min: 6, message: {min: 'La password è troppo corta'}});

/* ---------------------------------- REMOTE METHODS ---------------------------- */	

	Users.inserts = async (usersList) => {
   	    debugger;
   	    let results = [];
   	    try
   	    {
			var auth = app.models.Authentication;

			var authenticationoperations = app.models.AuthenticationsOperations;

		   	var operations = app.models.Operations;

		   	console.log('USerlist',usersList);
				
   	    	for(const us of usersList){
   	    		try{
   	    			var errorvalidating = false;

   	    			console.log('US',us);

   	    			var id_exists = await Users.findById(us.id);


   	    			console.log('id_exists',id_exists);



   	    			if(id_exists!=null){
   	    				var obj = {id:us.id,error:'Utente già presente sulla piattaforma s'}
   	    				results.push(obj);
   	    				errorvalidating = true;
   	    			}
   	    			
   	    			var username_exists = await Users.find({where:{username:us.username}});
   	    			if(username_exists.length>0){
   	    				var obj = {id:us.id,error:'Utente già presente sulla piattaform d'}
   	    				results.push(obj);
   	    				errorvalidating = true;
   	    			}

   	    			var email_exists = await Users.find({where:{email:us.email}});
   	    			if(email_exists.length>0){
   	    				var obj = {id:us.id,error:'Utente già presente sulla piattaforma q'}
   	    				results.push(obj);
   	    				errorvalidating = true;
   	    			}

   	    			if(us.password.length < 6){
   	    				var obj = {id:us.id,error:'La password deve contenere almeno 6 caratteri'}
   	    				results.push(obj);
   	    				errorvalidating = true;
   	    			}


   	    			if(!us.roleids){
   	    				
   	    				var obj = {id:us.id,error:'Non salvato per errore di rolemappings'}
   	    				results.push(obj);
   	    				errorvalidating = true;


   	    			}else{

   	    				if(!errorvalidating){
   	    					/*
   	    					if(us.roleids.indexOf('|') == -1){
	   	    					us.roleids = us.roleids + '|';
		   	    			}*/

		   	    			us.messages = [];
		   	    			us.activeoperations = [];
		   	    			us.active = true;

		   	    			var users = await Users.create([us]);

		   	    			results.push(us);

		   	    			/*const mapped = await auth.mapRoleToUser(users[0].id,users[0].roleids);	
		   	    			if(!mapped){
		   	    				users[0].remove();
		   	    				users[0].save();

		   	    				var obj = {id:us.id,error:'Non salvato per errore di rolemappings'}
		   	    				results.push(obj);

		   	    			
		   	    			}else{
		   	    				results.push(us)
		   	    			}*/
		   	    			

		   	    			var where = { where:{authenticationid:users[0].roleids} };
			   		   		var activated = await authenticationoperations.find(where);
			   		   		console.log("activated",activated);

			   		   		for(const ac of activated){

			   		   			const activatedInsertRequestOperation = await operations.activateForUser(users[0].id,ac.operationsid);

			   		   		}


   	    				}

   	    			}

   	    		}catch(error)
   	    		{
					console.log('errore',error);
 					console.log('GIAMPAOLO');  	    			
   	    			
   	    			var obj = {id:us.id,error:error}
   	    			results.push(obj);
   	    		}
   	    		
   	    	}

   	    	console.log("RESULT",results);

   	    	return results;		
   	    }
   	    catch(results) {
   	    	throw(results);
   	    }
   	    	
    	
  	};
	Users.remoteMethod(
		'inserts', {
		  http: {
		    path: '/inserts',
		    verb: 'post'
		  },
		  accepts: {arg: 'usersList', type:['Users'] ,http: {source: 'body'},description:'List of candidate users'},
		  returns: {arg: 'results', type:['Users'],root:true},
		  description: "Insert a list of users whit role and set Active"
	});
	
	Users.updateAttributes = async (id,properties) => {
	   
		debugger;
   	    let results;
   	    try
   	    {
			var user = await Users.findById(id);

			var authenticationoperations = app.models.AuthenticationsOperations;

		   	var operations = app.models.Operations;

			if(user) {

			var email = properties['email'];


				if(email){

						var email_exists = await Users.find({where:{email:email}});
						if(email_exists.length>0){
							throw new Error("L'email esiste già sulla piattaforma");
						}
				}
				
				if(properties.password){
					throw new Error("La password deve essere cambiata dall'apposito metodo")
				}
				/*
				if(properties.roleids){
					var auth = app.models.Authentication;
					auth.mapRoleToUser(id,properties.roleids);	
				}*/
				if(properties.username){
					throw new Error("La matricola deve essere cambiata dall'apposito metodo")
				}
			
				

				

				var where = { where:{authenticationid:user.roleids} };

   		   		var deactivated = await authenticationoperations.find(where);

   		   		for(const de of deactivated){

   		   			const activatedInsertRequestOperation = await operations.deactivateForUser(user.id,de.operationsid);

   		   		}  		   		

   		   		results = await user.updateAttributes(properties);
   		   		
   		   		var queryForActive =  {where:{authenticationid:results.roleids} };

   		   		var activated = await authenticationoperations.find(queryForActive);

   		   		for(const ac of activated){

   		   			const activatedInsertRequestOperation = await operations.activateForUser(results.id,ac.operationsid);

   		   		}


				return results;
			}else{
				throw new Error('Utente non trovato');
			}		
		}
		catch(results) {
			throw(results);
		}	

	};
	Users.remoteMethod(
		
		'updateAttributes', {
		  http: {
		    path: '/:id/updateAttributes',
		    verb: 'put'
		  },
		  accepts: [{arg: 'id', type: 'number',required: true,description:'The id of user that you want change properties'},
		  			 {arg: 'properties', type:'Users' ,http: {source: 'body'},description:'Refer To Model and ModelSchema.Id must be removed'}
		  		   ],
		  returns: {arg: 'results', type:'Users',root:true},
		  description: "Update properties. Admitted "
	});
	
	

	Users.deactivate = async (userId) => {
	   
		debugger;
   	    let results;
   	    try
   	    {
			const user = await Users.findById(userId);
			if(user) {

				results = await user.updateAttributes({ active : false });
				return false;	
			}else{
				throw new Error('Utente non trovato');
			}		
		}
		catch(results) {
			throw(results);
		}	

	};
	Users.remoteMethod(
		
		'deactivate', {
		  http: {
		    path: '/:id/deactivate',
		    verb: 'put'
		  },
		  accepts: {arg: 'id', type: 'number',required: true,description:'The id of user that you want to deactivate'},
		  returns: {arg: 'results', type:'boolean',root:true },
		  description: "Deactivate users by id."
	});
	

	Users.activate = async (userId) => {	
		debugger;
   	    let results;
   	    try
   	    {
			const user = await Users.findById(userId);
			if(user) {

				results = await user.updateAttributes({ active : true });
				return  true;	
			}else{
				throw new Error();
			}		
		}
		catch(results) {
			throw(results);
		}	
		
	};
	Users.remoteMethod(
		'activate', {
		  http: {
		    path: '/:id/activate',
		    verb: 'put'
		  },
		  accepts: {arg: 'id', type: 'number',required: true,description:'The id of user that you want to activate'},
		  returns: {arg: 'results', type:'boolean',root:true },
		  description: "Activate users by id."
	});


	Users.requestResetPassword = async (username) => {	
		debugger;
   	    let results;
   	    try
   	    {

   	    	console.log('SONO QUI CON USERNAME',username);
			const Factory = app.models.Factory;

			const thisFactory = await Factory.find({where:{isdefault:true}});
			if(thisFactory.length == 0) {
   	    		throw new Error('Factory non trovato');
   	    	}

   	    	const users = await Users.find({where:{username:username}});
   	    	if(users.length == 0) {
   	    		throw new Error('Utente non trovato');
   	    	}
   	    	const user = users[0];

   	    	const tokenData = {
          		ttl:  15 * 60, // 900ms
          		scopes: ['reset-password']
        	};

        	var options = {};  
        	
        	var tokenContainer = await user.createAccessToken(tokenData, options, null);
 
					var accessToken = tokenContainer.id;
					var url = thisFactory[0].url.replace('/api','/') + '#!/passwordreset?access_token='+accessToken;
    		
				var html = 'Gent.le '+user.firstname +' '+user.secondname+', è stata effettuata una richiesta di reset password dal suo account. <br><br>'
								 + 'Dal link di seguito riportato sarà possibile completare la procedura. '
								 + 'Per completare il cambio password clicca '+' <a href="' + url + '">qui</a>'+'. <br><br> Se il link non dovesse funzionare provare a copiare ed incollare nel browser il seguente link: <br><br> <b>'+url+'</b> <br><br>'
								 + 'Per ulteriore supporto potete contattare l\'ufficio del personale.'

				var email = {to: user.email, from: 'Taaak Srl <'+thisFactory[0].emailfrom+'>' ,subject: 'Dashboard '+thisFactory[0].name+' - Reset password', html: html}
		    

		    var email_sent =  await app.models.Email.send(email);
		
			console.log(email_sent);

			return email_sent;
		}
		catch(results) {
			throw(results);
		}	
		
	};
	Users.remoteMethod(
		'requestResetPassword', {
		  http: {
		    path: '/requestResetPassword',
		    verb: 'post'
		  },
		  accepts: {arg: 'username', type: 'string',description:'The username of the user who want to retrive password'},
		  returns: {arg: 'results', type:'string',root:true },
		  description: "Request password reset. Temporary token generated"
	});


	Users.setNewPassword = async (credentials) => {	
		debugger;
   	    let results;
   	    try
   	    {	
   	    	const AccessToken = app.models.AccessToken;

   	    	console.log(credentials);

   	    	var token = await AccessToken.findById(credentials.username);
   	   
			if (!token){
				throw new Error('Il link non è più valido');
			}

   	    	const users = await Users.find({where:{id:token.userId}});
   	    	if(users.length == 0) {
   	    		throw new Error('Utente non trovato');
   	    	}
   	    
   	    	const user = users[0];

   	    	var options = {};
   	 
   	    	results = await user.updateAttributes({password:credentials.password});
   	    
   	    	
   	    	return results;
   	    	
		
		}
		catch(results) {
			throw(results);
		}	
		
	};
	Users.remoteMethod(
		'setNewPassword', {
		  http: {
		    path: '/setNewPassword',
		    verb: 'post'
		  },
		  accepts: {arg: 'credentials', type: 'object',required: true,http: {source: 'body'},description:'Credentials'},
		  returns: {arg: 'results', type:'string',root:true },
		  description: "set NewPassword to user"
	});




	Users.findWithRole_ = async (filter) => {

		try
		{
			var fi = null;

			if(filter){

				fi = JSON.parse(filter);
			}

			const us = await Users.find( {include: ['authentication'], "where": { "authenticationId": { "nin": [1,2]}}});

		

			return us;

			
		}
		catch(results) {
			
			throw(results);
		}
	   	
		
	};
	Users.remoteMethod(
		'findWithRole_', {
		  http: {
		    path: '/findWithRole_',
		    verb: 'get'
		  },
		  returns: {arg: 'results',type: ['Users'],root:true},
		  accepts: {arg: 'filter', type: 'string', required: false, description:'Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"where":{"something":"value"}}). '},
		  description: "Find Users with roles."
	});



	Users.findWithFoto = async (parameter,id,companyids) => {
		
		
		 var Gatewaycompany = app.models.Gatewaycompany

		 var Pddstorageb = app.models.Pddstorageb;


		try
		{
			var para = parameter;
			var filterforuser = {}
		    
		    if(companyids){

		    	var listofcompanies = []

		    	var gtw = await Gatewaycompany.find({where:{installationcompanyId:companyids}})		    			    	

		    	for(var g of gtw){

		    		listofcompanies.push(g.companyId)

		    	}
		    	
		    	filterforuser = {where:{and:[{id:id},{companyId:{inq: [listofcompanies]}}]},include:['company']};


		    }

		    if(id){

		    	filterforuser = {where:{id:id},include:['company']}
		    }

		    if(!id && !companyids){

		    	filterforuser ={include:['company']}
		    
		    }				
			
			const users = await Users.find(filterforuser);				
			
			const pddstorage = await Pddstorageb.find();
		    	
			
			for(var h of users){
				
			 	var pd = pddstorage.filter(el => {
                  
	                  if(el.modelid == h.id && el.model == para) {    
	                    return true;
	                  }                  
                    return false; 
              
                 });

			    h['pddstorageb'] = pd; 

			}

			

			return users;
			
		}
		catch(results) {
			
			throw(results);
		}
	   	
		
	};
	Users.remoteMethod(
		'findWithFoto', {
		  http: {
		    path: '/findWithFoto',
		    verb: 'get'
		  },
		  returns: {arg: 'results',type: ['Users'],root:true},
		  accepts: [{arg: 'parameter', type: 'string', required: false, description:'Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"where":{"something":"value"}}). '},
		            {arg: 'id', type: 'number', required: false, description:'Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"where":{"something":"value"}}). '},
		            {arg: 'companyids', type: 'number', required: false, description:'Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"where":{"something":"value"}}). '}

		  ],
		  
		  description: "Find Users with Pic."
	});




/* ---------------------------------- HOOKS ---------------------------- */	
	
	var FILTERED_PROPERTIES = ['',''];
	Users.observe('before save', async (ctx) =>{
	    try {
			return Promise.resolve();	  		

	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	
	});	


	Users.observe('after save', async (ctx) =>{
	
	    try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	
	});	

	Users.observe('before delete', async (ctx) =>{
	
	    try {
       		
	    	
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	
	});	


	Users.observe('after delete', async function(ctx) {
		try {
       		
	    	
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	
	});
	

	Users.beforeRemote( 'before login', async function(ctx) {
    	try {
       		
	    	
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
		 
	});


};
