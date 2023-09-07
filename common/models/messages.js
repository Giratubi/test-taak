'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');


module.exports = function(Messages) {

/* ---------------------------------- SETTINGS ---------------------------------- */

	var methodsToDisplay =  ['find'];
	methodsHelper.disableAllExcept(Messages, methodsToDisplay); 

/* ---------------------------------- REMOTE METHODS ---------------------------- */	
	
	
	Messages.inserts = async (messagesList) => {
   	    debugger;
   	    let results = [];
   	    try
   	    {
   	    	var Operations = app.models.Operations;
   	    	for(const ms of messagesList){
   	    		try{
   	    		
   	    			const operations = await Operations.findById(ms.operationsid);
   	    			if(!operations){
	    				throw new Error('Non è possibile inserire un messaggio per un operazione che non esiste');
	    			}
	    			const message = await Messages.findById(ms.id);
					if(!message) {
   	    				var messages = await Messages.create([ms]);   	    			
   	    				results.push(ms)
   	    			}else
   	    			{
   	    				throw new Error('Non è possibile inserire un messaggio che esiste già');
   	    			}
   	    		}catch(error)
   	    		{
   	    			var message = error.message;
   	    			
   	    			var obj = {id:ms.id,error:message}
   	    			results.push(obj);
   	    		}
   	    	}

   	    	return results;	
   	    		
   	    }
   	    catch(results) {
   	    	throw(results);
   	    }	
  	};
	Messages.remoteMethod(
		'inserts', {
		  http: {
		    path: '/inserts',
		    verb: 'post'
		  },
		  accepts: {arg: 'messagesList', type:['Messages'] ,required:true,http: {source: 'body'},description:'List of messages'},
		  returns: {arg: 'results', type:['Messages'],root:true},
		  description: "Create a new message for operation and event code."
	});
	
	Messages.updateAttributes = async (id,properties) => {
	   
		debugger;
		    let results;
		    try
		    {
			const message = await Messages.findById(id);
			if(message) {
				results = await Messages.updateAttributes(properties);
				return results;	
			}else{
				throw new Error('Utente non trovato');
			}		
		}
		catch(results) {
			throw(results);
		}	

	};
	Messages.remoteMethod(
		
		'updateAttributes', {
		  http: {
		    path: '/:id/updateAttributes',
		    verb: 'put'
		  },
		  accepts: [{arg: 'id', type: 'number',required: true, description:"Messages id"},
		  			 {arg: 'properties', type:'Messages',http: {source: 'body'},description:"Refer to Model and ModelSchema"}
		  		   ],
		  returns: {arg: 'results', type:['Messages'],root:true},
		  description: "Update properties. Admitted "
	});

	Messages.deleteByid = async (id) => {
	   
		var OperationsUsersMessages = app.models.UsersOperatiosMessages;
	    let results;
	    try
	    {
			const message = await Messages.findById(id);
			var findedOUM = await OperationsUsersMessages.find({where:{messagesid:id}});
			if(findedOUM){
				throw new Error('Non è possibile cancellare un messaggio attualmente notificato ad un utente.');
			}

			if(message) {
				results = await message.deleteByid(id);

				return results;	
			}else{
				throw new Error('Messaggio non trovato');
			}		
		}
		catch(results) {
			throw(results);
		}	

	};
	Messages.remoteMethod(
		
		'deleteByid', {
		  http: {
		    path: '/deleteByid/:id/',
		    verb: 'delete'
		  },
		  accepts: {arg: 'id', type: 'number',required: true, description:"Messages id"},
		  returns: {arg: 'results', type:'boolean',root:true},
		  description: "Delete message "
	});



	Messages.NotifyToUserForOperation = async (id,userId) => {
	   
	   	var Users = app.models.Users;
   		var Operations = app.models.Operations;
   		var Messages = app.models.Messages;
   		var OperationsUsersMessages = app.models.UsersOperatiosMessages;
 		let results;

   		debugger;	
   	    try
   	    {

   	    	var exist_user = await Users.findById(userId);
   	    	if(!exist_user) {
   	    		throw new Error('L\' utente deve esistere');    
   	    	}

   	    	var exist_messages = await Messages.findById(id);
   	    	if(!exist_messages) {
   	    		throw new Error('I messaggi devono esistere');    
   	    	}

			var exist_operation = await Operations.findById(exist_messages.operationsid);
   	    	if(!exist_operation) {
   	    		throw new Error('L\' operazione deve esistere');    
   	    	}

   	    	var id_ = userId + '_' + exist_messages.operationsid + '_' + exist_messages.id;
   	    	var existing_row = await OperationsUsersMessages.find({where: {id:id_}});
   	    	
   	    	if(existing_row.length == 0){
   	
   	    		const messageop = [{operationsid:exist_messages.operationsid,usersid:userId,messagesid:exist_messages.id,id:id_}];   
   	    		results = await OperationsUsersMessages.create(messageop);
    				
   	    	}
   	
   	    	var messagesToUser = await Messages.generateJsonMessageForUser(userId);	    	
   	    	return results;	

   	    }
   	    catch(results) {
   	    	throw(results);
   	    }
       		
	};
	Messages.remoteMethod(
		
		'NotifyToUserForOperation', {
		  http: {
		    path: '/:id/NotifyToUserForOperation',
		    verb: 'post'
		  },
		  returns: {arg:'MessageNotificated',type: 'Messages',root:true},
		  accepts: [
		  			{arg: 'id', type: 'number',required: true,description:"Id of message that want to notificate to user"},
		  			{arg: 'userId', type: 'number',required: true,description:"Id of user that recive message"}
		  		   ],
		  description: "write a useroperationsmessages row. Message was sent to user"
	});

	
	Messages.DeNotifyToUserForOperation = async (id,userId) => {
	   	
	   	var Users = app.models.Users;
   		var Operations = app.models.Operations;
   		var Messages = app.models.Messages;
   		var OperationsUsersMessages = app.models.UsersOperatiosMessages;
 		let results;

   		debugger;	
   	    try
   	    {

   	    	console.log('MESSAGEID',id);
			console.log('USERSID',userId);


   	    	var exist_user = await Users.findById(userId);
   	    	if(!exist_user) {
   	    		throw new Error('L\' utente deve esistere');    
   	    	}

   	    	var exist_messages = await Messages.findById(id);
   	    	if(!exist_messages) {
   	    		throw new Error('I messaggi devono esistere');    
   	    	}

			var exist_operation = await Operations.findById(exist_messages.operationsid);
   	    	if(!exist_operation) {
   	    		throw new Error('L\' operazione deve esistere');    
   	    	}

   	    	var id_ = userId + '_' + exist_messages.operationsid + '_' + id;
   	    	var existing_row = await OperationsUsersMessages.find({where: {id:id_}});
   	    	
   	    	if(existing_row.length > 0){
   	
   	    		existing_row[0].remove();
   	    		existing_row[0].save();
   	    		
			}

	   		var messagesToUser = await Messages.generateJsonMessageForUser(userId);
    		return results;


	   	}
   	    catch(results) {
   	    	throw(results);
   	    }
    

	};
	Messages.remoteMethod(
		
		'DeNotifyToUserForOperation', {
		  http: {
		    path: '/:id/DeNotifyToUserForOperation',
		    verb: 'post'
		  }, 
		  returns:{arg:'MessageNotificated',type: 'Messages',root:true},
		  accepts: [
		  			{arg: 'id', type: 'number',required: true,description:"Id of message that want to denotificate to user"},
		  			{arg: 'userId', type: 'number',required: true,description:"Id of user that want to denotificate to user"}
		  		   ],
		  description: "delete a useroperationsmessages row.Message was acquired from user"
	});


/* ---------------------------------- PRIVATE METHODS ---------------------------- */	
	
	// Generate Message Dashboard
	Messages.generateJsonMessageForUser =  async (userId) => { 
	   
		
		var OperationsUsersMessages = app.models.UsersOperatiosMessages;
 		var Users = app.models.Users;
   		var Messages = app.models.Messages;
 		
 		let results = [];
	   	debugger;
   	    try
   	    {

   	    	var exist_user = await Users.findById(userId);

   	    	if(!exist_user) {
   	    		throw new Error('L\' utente deve esistere');    
   	    	}

   	    	var updated = await exist_user.updateAttributes({messages:''});

   	    	const activeMessagesForUser = await OperationsUsersMessages.find({where: {usersid:userId}});
			const messages =  await Messages.find();

			let messagesForUser = [];   	    
   	    	for(const msg of messages) {
   	    		let messages = [];
   	    		for(const amu of activeMessagesForUser) {	
   	    			if(amu.messagesid == msg.id) {
   	    				messagesForUser.push(msg);
   	    			}	    			
   	    		}
   	    	}
			
			if(messagesForUser.length==0){
				updated = await exist_user.updateAttributes({messages:''});	
			}else{
				updated = await exist_user.updateAttributes({messages:JSON.stringify(messagesForUser)});
			}
   	    	

			return messages;
   	    }
   	    catch(results) {
  
   	    	throw(results);
   	    } 
	};
 

/* ---------------------------------- HOOKS ---------------------------- */	

	Messages.observe('after save', async (ctx) => { 
  			
  		try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	
	});

	
	Messages.observe('before save', async (ctx)  => {

  		
  		try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	
	});

	Messages.observe('after delete', async (ctx) => {
  		
  		
  		try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	});

	Messages.observe('before delete', async (ctx) => {
  		
  		
  		try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	});

};
