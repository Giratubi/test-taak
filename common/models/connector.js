'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

module.exports = function(Connector) {


	var methodsToDisplay =  ['findById','find','create','deleteById'];
	methodsHelper.disableAllExcept(Connector, methodsToDisplay);

	



	Connector.updateAttributes = async (id,properties) => {
	 
   	    let results;
   	    try
   	    {
			var connector = await Connector.findById(id);

			if(connector) {
				var updated = await connector.updateAttributes(properties)
				results = updated;
				
				return results;	
			}else{
				throw new Error('Tipo di Connector non trovato');
			}		
		}
		catch(e) {
			throw e;
		}	

	};
	Connector.remoteMethod(
		
		'updateAttributes', {
		  http: {
		    path: '/updateAttributes/:id',
		    verb: 'put'
		  },
		  accepts: [{arg: 'id', type: 'string',required: true,description:'The id of MeintinanceType that you want change properties'},
		  			 {arg: 'properties', type:'Connector' ,http: {source: 'body'},description:'Refer To Model and ModelSchema.Id must be removed'}
		  		   ],
		  returns: {arg: 'results ', type:'Connector',root:true},
		  description: "Update Connector. Admitted "
	});


	Connector.updateAssociation = async (id,properties) => {

		console.log("CONNECTOR ID",id)

		var Sensorvalue = app.models.Sensorvalue

		var Rele = app.models.Rele

		var Relevalue = app.models.Relevalue
	 
		let results;
		try
		{
		 var connector = await Connector.findById(id);

		 if(connector) {
			

			 var sensorvalue = await Sensorvalue.find({where:{connectorId:connector.id}})

			 console.log("sensorvalue",sensorvalue)

			 if(sensorvalue.length >0){

				for(var sv of sensorvalue){

					console.log("sv",sv)

					var delsv = await Sensorvalue.deleteById(sv.id)
				}
			 }

			 var rele = await Rele.find({where:{connectorId:connector.id}})

			 if(rele.length >0){
				for(var r of rele){

					var delrele = await Rele.deleteById(r.id)

					var relevalue = await Relevalue.find({where:{releId:r.id}})

					if(relevalue.length >0){

						for(var rv of relevalue){
							var relevaluedel = await Relevalue.deleteById(rv.id)
						}
					}
				}
			 }

			 var updated = await connector.updateAttributes(properties)
			 results = updated;
			 
			 return results;	
		 }else{
			 throw new Error('Tipo di Connector non trovato');
		 }		
	 }
	 catch(e) {
		 throw e;
	 }	

	};
	Connector.remoteMethod(
		
		'updateAssociation', {
		http: {
			path: '/updateAssociation/:id',
			verb: 'put'
		},
		accepts: [{arg: 'id', type: 'string',required: true,description:'The id of MeintinanceType that you want change properties'},
						{arg: 'properties', type:'Connector' ,http: {source: 'body'},description:'Refer To Model and ModelSchema.Id must be removed'}
					],
		returns: {arg: 'results ', type:'Connector',root:true},
		description: "Update Connector association. Admitted "
	});


};
