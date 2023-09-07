'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

module.exports = function(Gatewayspositions) {


	var methodsToDisplay =  ['findById','find','create','deleteById'];
	methodsHelper.disableAllExcept(Gatewayspositions, methodsToDisplay);



	Gatewayspositions.distance = async (lat1, lon1, lat2, lon2, unit) => { 
	   	
	   	if ((lat1 == lat2) && (lon1 == lon2)) {
	        return 0;
	    }
	    else {
	        var radlat1 = Math.PI * lat1/180;
	        var radlat2 = Math.PI * lat2/180;
	        var theta = lon1-lon2;
	        var radtheta = Math.PI * theta/180;
	        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	        if (dist > 1) {
	            dist = 1;
	        }
	        dist = Math.acos(dist);
	        dist = dist * 180/Math.PI;
	        dist = dist * 60 * 1.1515;
	        if (unit=="K") { dist = dist * 1.609344 }
	        if (unit=="N") { dist = dist * 0.8684 }
	        return dist;
	    }
	
	}

	Gatewayspositions.updateAttributes = async (id,properties) => {
	 
   	    let results;
   	    try
   	    {
			var gatewaypos = await Gatewayspositions.findById(id);

			if(gatewaypos) {
				var updated = await gatewaypos.updateAttributes(properties)
				results = updated;
				
				return results;	
			}else{
				throw new Error('Tipo di Gatewayspositions non trovato');
			}		
		}
		catch(e) {
			throw e;
		}	

	};
	Gatewayspositions.remoteMethod(
		
		'updateAttributes', {
		  http: {
		    path: '/updateAttributes/:id',
		    verb: 'put'
		  },
		  accepts: [{arg: 'id', type: 'string',required: true,description:'The id of Gateway that you want change properties'},
		  			 {arg: 'properties', type:'Gatewayspositions' ,http: {source: 'body'},description:'Refer To Model and ModelSchema.Id must be removed'}
		  		   ],
		  returns: {arg: 'results ', type:'Gatewayspositions',root:true},
		  description: "Update Gatewayspositions. Admitted "
	});



};
