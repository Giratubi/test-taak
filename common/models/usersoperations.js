'use strict';

var methodsHelper = require('../../server/helpers/methods');

module.exports = function(Usersoperations) {


/* ---------------------------------- SETTINGS ---------------------------------- */

	var methodsToDisplay =  [];
	methodsHelper.disableAllExcept(Usersoperations, methodsToDisplay); 


/* ---------------------------------- VALIDATOR --------------------------------- */

	

/* ---------------------------------- REMOTE METHODS ---------------------------- */	



/* ---------------------------------- HOOKS ---------------------------- */	

	Usersoperations.observe('before save', async (ctx) => {
	  
	  try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	});

	
	Usersoperations.observe('after save', async (ctx) => {

  		try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	
	});

	Usersoperations.observe('before delete', async (ctx) => {
  		
  		// Remove a process from graphs, remove process from requests 
  		try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	});
	
	Usersoperations.observe('after delete', async (ctx) => {
  		
  		try {
       			    	
	      
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	});	

};
