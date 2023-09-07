'use strict';

var methodsHelper = require('../../server/helpers/methods');

module.exports = function(Usersoperatiosmessages) {


/* ---------------------------------- SETTINGS ---------------------------------- */

	var methodsToDisplay =  [];
	methodsHelper.disableAllExcept(Usersoperatiosmessages, methodsToDisplay); 


/* ---------------------------------- VALIDATOR --------------------------------- */

	

/* ---------------------------------- REMOTE METHODS ---------------------------- */	



/* ---------------------------------- HOOKS ---------------------------- */	

	Usersoperatiosmessages.observe('before save', async (ctx) => {
	  
	  try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	});

	
	Usersoperatiosmessages.observe('after save', async (ctx) => {

  		try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	
	});

	Usersoperatiosmessages.observe('before delete', async (ctx) => {
  		
  		// Remove a process from graphs, remove process from requests 
  		try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	});
	
	Usersoperatiosmessages.observe('after delete', async (ctx) => {
  		
  		try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	});	

};
