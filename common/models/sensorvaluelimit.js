'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

module.exports = function(Sensorvaluelimit) {


	var methodsToDisplay =  ['findById','find','create','deleteById'];
	methodsHelper.disableAllExcept(Sensorvaluelimit, methodsToDisplay);




	Sensorvaluelimit.updateAttributes = async (id,properties) => {
	 
   	    let results;
   	    try
   	    {
			var senvallim = await Sensorvaluelimit.findById(id);

			if(senvallim) {
				var updated = await senvallim.updateAttributes(properties)
				results = updated;
				
				return results;	
			}else{
				throw new Error('Tipo di Sensorvaluelimit non trovato');
			}		
		}
		catch(e) {
			throw e;
		}	

	};
	Sensorvaluelimit.remoteMethod(
		
		'updateAttributes', {
		  http: {
		    path: '/updateAttributes/:id',
		    verb: 'put'
		  },
		  accepts: [{arg: 'id', type: 'string',required: true,description:'The id of Sensorvaluelimit that you want change properties'},
		  			 {arg: 'properties', type:'Sensorvaluelimit' ,http: {source: 'body'},description:'Refer To Model and ModelSchema.Id must be removed'}
		  		   ],
		  returns: {arg: 'results ', type:'Sensorvaluelimit',root:true},
		  description: "Update Sensorvaluelimit. Admitted "
	});
	



};
