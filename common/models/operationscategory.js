'use strict';

var methodsHelper = require('../../server/helpers/methods');

module.exports = function(Operationscategory) {

	var methodsToDisplay =  [];
	methodsHelper.disableAllExcept(Operationscategory, methodsToDisplay); 

	Operationscategory.loadOperationsCategory = async () => {
		try {

			const operationscategory = [

				{
				"id": 6,
				"name": "Aziende",
				"order": 6,
				"url": null,
				"icon": "fa fa-building-o"
				},				
				{
				"id": 7,
				"name": "Utenti",
				"order": 7,
				"url": null,
				"icon": "fa fa-users"
				},
				{
				"id": 8,
				"name": "Impostazioni",
				"order": 8,
				"url": null,
				"icon": "fa fa-cog"
				}
				
				
			];

		 	for (const i of operationscategory) {
	       	 
	          var opExist = await Operationscategory.findById(i.id);
	        
	          if (!opExist){
	          	var results = await Operationscategory.create(i);
	            console.log(results)
	          } else if (opExist.name != i.name) {
	          	results = await opExist.updateAttributes({name: i.name});
	          	console.log('Operationscategory updated id =', i.id, ' name =', i.name);
	          }
	        }

		}catch(results){
			console.log(results.message);
		}
		  
	}

};

