'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

module.exports = function(Sensortype) {


	var methodsToDisplay =  ['findById','find','create','deleteById'];
	methodsHelper.disableAllExcept(Sensortype, methodsToDisplay);


	Sensortype.updateAttributes = async (id,properties) => {
	 
   	    let results;
   	    try
   	    {
			var sensortype = await Sensortype.findById(id);

			if(sensortype) {
				var updated = await sensortype.updateAttributes(properties)
				results = updated;
				
				return results;	
			}else{
				throw new Error('Tipo di sensortype non trovato');
			}		
		}
		catch(e) {
			throw e;
		}	

	};
	Sensortype.remoteMethod(
		
		'updateAttributes', {
		  http: {
		    path: '/updateAttributes/:id',
		    verb: 'put'
		  },
		  accepts: [{arg: 'id', type: 'string',required: true,description:'The id of MeintinanceType that you want change properties'},
		  			 {arg: 'properties', type:'Sensortype' ,http: {source: 'body'},description:'Refer To Model and ModelSchema.Id must be removed'}
		  		   ],
		  returns: {arg: 'results ', type:'Sensortype',root:true},
		  description: "Update Sensortype. Admitted "
	});

	

};
