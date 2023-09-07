'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

module.exports = function(Sensorvaluelimitrele) {


	var methodsToDisplay =  ['findById','find','create','deleteById'];
	methodsHelper.disableAllExcept(Sensorvaluelimitrele, methodsToDisplay);

	
	Sensorvaluelimitrele.updateAttributes = async (id,properties) => {
	 
   	    let results;
   	    try
   	    {
			var senvallim = await Sensorvaluelimitrele.findById(id);

			if(senvallim) {
				var updated = await senvallim.updateAttributes(properties)
				results = updated;
				
				return results;	
			}else{
				throw new Error('Tipo di Sensorvaluelimitrele non trovato');
			}		
		}
		catch(e) {
			throw e;
		}	

	};
	Sensorvaluelimitrele.remoteMethod(
		
		'updateAttributes', {
		  http: {
		    path: '/updateAttributes/:id',
		    verb: 'put'
		  },
		  accepts: [{arg: 'id', type: 'string',required: true,description:'The id of Sensorvaluelimit that you want change properties'},
		  			 {arg: 'properties', type:'Sensorvaluelimitrele' ,http: {source: 'body'},description:'Refer To Model and ModelSchema.Id must be removed'}
		  		   ],
		  returns: {arg: 'results ', type:'Sensorvaluelimitrele',root:true},
		  description: "Update Sensorvaluelimit. Admitted "
	});

	Sensorvaluelimitrele.delete_ = async (sensovaluelimitsId) => {
		

		try
		{
		    
		    var senvallimitrele = await Sensorvaluelimitrele.find({where:{sensorvaluelimitsId:sensovaluelimitsId}})

		    var delsen = await Sensorvaluelimitrele.deleteById(senvallimitrele[0].id)

			return {}

		}
		catch(results) {
			

			throw(results);
		}
	};
	Sensorvaluelimitrele.remoteMethod(
		'delete_', {
			http: {
			    path: '/delete_/:sensovaluelimitsId',
			    verb: 'delete'
			},
		    returns: {arg: 'results', type:'string',root:true},
		    accepts: {arg: 'sensovaluelimitsId', type: 'string', required: true, description:'delete sensorvaluelimitsId with sensorvaluelimitsId id where is no page saved'},
		  	description: "Delete Sensorvaluelimitrele By sensorvaluelimitsId where no page savede"
		}
	);

};
