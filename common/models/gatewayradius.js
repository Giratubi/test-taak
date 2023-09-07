'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

module.exports = function(Gatewayradius) {


	var methodsToDisplay =  ['findById','find','create','deleteById'];
	methodsHelper.disableAllExcept(Gatewayradius, methodsToDisplay);



	Gatewayradius.updateAttributes = async (id,properties) => {
	 
   	    let results;
   	    try
   	    {
			var gatewayrad = await Gatewayradius.findById(id);

			if(gatewayrad) {
				var updated = await gatewayrad.updateAttributes(properties)
				results = updated;
				
				return results;	
			}else{
				throw new Error('Tipo di Gatewayradius non trovato');
			}		
		}
		catch(e) {
			throw e;
		}	

	};
	Gatewayradius.remoteMethod(
		
		'updateAttributes', {
		  http: {
		    path: '/updateAttributes/:id',
		    verb: 'put'
		  },
		  accepts: [{arg: 'id', type: 'string',required: true,description:'The id of Gateway that you want change properties'},
		  			 {arg: 'properties', type:'Gatewayradius' ,http: {source: 'body'},description:'Refer To Model and ModelSchema.Id must be removed'}
		  		   ],
		  returns: {arg: 'results ', type:'Gatewayradius',root:true},
		  description: "Update Gatewayradius. Admitted "
	});



};

