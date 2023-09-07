'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

module.exports = function(Rele) {


	var methodsToDisplay =  ['findById','find','create','deleteById'];
	methodsHelper.disableAllExcept(Rele, methodsToDisplay);




	

	Rele.find_ = async (companyId,installationcompanyId) => {		
		
	

		let Gatewaycompany = app.models.Gatewaycompany;		

		
		let filtergatewaycomp = {};


		if(companyId){

			

			filtergatewaycomp = {where:{companyId:companyId}}
		}

		if(installationcompanyId){

			
			filtergatewaycomp = {where:{installationcompanyId:installationcompanyId}}
		}

		if(!companyId && !installationcompanyId){

			filtergatewaycomp = {}
		}
			
		
		
		try
		{	
					

			var gtwcom = await Gatewaycompany.find(filtergatewaycomp)				

				gtwcom = JSON.parse(JSON.stringify(gtwcom))

			var alarms = []

			for(var g of gtwcom){				

				var filterforalarm = {where:{gatewayId:g.gatewayId}};

				var alarm = await Rele.find({where:{
					gatewayId:g.gatewayId

					},
						include:[{
		                    relation:"alarmtype",

		                },
		                {
		                    relation:'gateway',
		                    scope:{
		                    	include:[{
		                    		relation:"companies"
		                    	}]
		                    }
		                }
		                ]
	            })

	            for(var a of alarm){

	            	alarms.push(a)

	            }

	            	

			}  

					

			
			return alarms;
		}
		catch(results) {
			throw(results);

		}
		
	};
	Rele.remoteMethod(
		'find_', {
		  http: {
		    path: '/find_',
		    verb: 'get'
		  },
		  accepts: [{arg: 'companyId', type: 'string',require:false, description:"Reles find ",root:true},
		  			{arg: 'installationcompanyId', type: 'string',require:false, description:"Reles find ",root:true}],
		  
		  returns: {arg: 'results',type: 'Rele'},
		  description: "Find Rele "
	});



	Rele.updateAttributes = async (id,properties) => {
	 
   	    let results;
   	    try
   	    {
			var rele = await Rele.findById(id);

			if(rele) {
				var updated = await rele.updateAttributes(properties)
				results = updated;
				
				return results;	
			}else{
				throw new Error('Tipo di rele non trovato');
			}		
		}
		catch(e) {
			throw e;
		}	

	};
	Rele.remoteMethod(
		
		'updateAttributes', {
		  http: {
		    path: '/updateAttributes/:id',
		    verb: 'put'
		  },
		  accepts: [{arg: 'id', type: 'string',required: true,description:'The id of MeintinanceType that you want change properties'},
		  			 {arg: 'properties', type:'Rele' ,http: {source: 'body'},description:'Refer To Model and ModelSchema.Id must be removed'}
		  		   ],
		  returns: {arg: 'results ', type:'Rele',root:true},
		  description: "Update Reles. Admitted "
	});



};
