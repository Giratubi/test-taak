'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

module.exports = function(Gatewaycompany) {


	var methodsToDisplay =  ['findById','find','create','deleteById'];
	methodsHelper.disableAllExcept(Gatewaycompany, methodsToDisplay);



	Gatewaycompany.updateAssociation = async (id,properties) => {

		console.log("CONNECTOR ID",id)

		var Gateway = app.models.Gateway

        var Gatewayradius = app.models.Gatewayradius

		var Gatewayspositions = app.models.Gatewayspositions

		var Rele = app.models.Rele

		var Relevalue = app.models.Relevalue

		var Sensorvalue = app.models.Sensorvalue

		
		let results;
		try
		{

			

			var gateway = await Gateway.findById(id)

			
			if(gateway){

				var obj = {email:'',relename:'Gruppo Aux',volt:0,secondmail:'',reciveddate:'',nosignal:0,emailsent:0}

				var updategtw = await gateway.updateAttributes(obj)
			}			

			var gatewaycompany = await Gatewaycompany.find({where:{gatewayId:gateway.id}});			

			if(gatewaycompany.length >0){

				var gtwcomp = gatewaycompany[0]				

				var updated = await Gatewaycompany.updateAttributes(gtwcomp.id,properties)				
				
			}			

			var gatewayradius = await Gatewayradius.find({where:{gatewayId:gateway.id}})			

			if(gatewayradius.length >0){

				for (var gr of gatewayradius){

					var deletegtwradius = await Gatewayradius.deleteById(gr.id)
				}
			}

			var gatewayposition = await Gatewayspositions.find({where:{gatewayId:gateway.id}})			

			if(gatewayposition.length >0){

				for (var gp of gatewayposition){

					var deletegtwpoition = await Gatewayspositions.deleteById(gp.id)
				}
			}

			var rele = await Rele.find({where:{gatewayId:gateway.id}})

			if(rele.length >0){

				for(var r of rele){
					var deleterele = await Rele.deleteById(r.id)

					var relevalue = await Relevalue.find({where:{releId:r.id}})

					if(relevalue.length >0){

						for(var rv of relevalue){

							var deleterelevalue = await Relevalue.deleteById(rv.id)
						}
					}
				}

			}

			var sensorvalue = await Sensorvalue.find({where:{code:gateway.id}})

			if(sensorvalue.length >0 ){
				for(var sv of sensorvalue){
					var deletesenval = await Sensorvalue.deleteById(sv.id);
				}
			}
		 
			 
			return results;	
		 	
	 }
	 catch(e) {
		 throw e;
	 }	

	};
	Gatewaycompany.remoteMethod(
		
		'updateAssociation', {
		http: {
			path: '/updateAssociation/:id',
			verb: 'put'
		},
		accepts: [{arg: 'id', type: 'string',required: true,description:'The id of MeintinanceType that you want change properties'},
						{arg: 'properties', type:'Connector' ,http: {source: 'body'},description:'Refer To Model and ModelSchema.Id must be removed'}
					],
		returns: {arg: 'results ', type:'Gatewaycompany',root:true},
		description: "Update Gatewaycompany association. Admitted "
	});


	Gatewaycompany.updateAttributes = async (id,properties) => {

		console.log("ID CICCIO",id)

		

		

		console.log("properties ciccio",properties)
	 
		let results;
		try
		{
		 var gtwcomp = await Gatewaycompany.find({where:{id:id}});

		 console.log("gtwcomp ciccio",gtwcomp)

		 if(gtwcomp.length >0) {

			gtwcomp[0].companyId = properties.companyId
			gtwcomp[0].installationcompanyId = properties.installationcompanyId

			gtwcomp[0].save()			

			 results = gtwcomp[0];
			 
			 return results;	
		 }else{
			 throw new Error('Tipo di gtwcomp non trovato');
		 }		
	 }
	 catch(e) {
		 throw e;
	 }	

 };
 Gatewaycompany.remoteMethod(
	 
	 'updateAttributes', {
	   http: {
		 path: '/updateAttributes/:id',
		 verb: 'put'
	   },
	   accepts: [{arg: 'id', type: 'string',required: true,description:'The id of MeintinanceType that you want change properties'},
					{arg: 'properties', type:'Gatewaycompany' ,http: {source: 'body'},description:'Refer To Model and ModelSchema.Id must be removed'}
				  ],
	   returns: {arg: 'results ', type:'Gatewaycompany',root:true},
	   description: "Update Gatewaycompany. Admitted "
 });



	

	

};
