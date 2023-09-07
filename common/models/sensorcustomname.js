'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

module.exports = function(Sensorcustomname) {


	var methodsToDisplay =  ['findById','find','create','deleteById'];
	methodsHelper.disableAllExcept(Sensorcustomname, methodsToDisplay);




	Sensorcustomname.updateAttributes_ = async (obj) => {		
		
	
		console.log("obj",obj)

		
		
		
		try
		{	
					
			var check = await Sensorcustomname.find({where:{and:[{gatewayId:obj.gatewayId},{connectorId:obj.connectorId},{sensortypeId:obj.sensortypeId}]}})
			
			if(check.length > 0){

				var update = await check[0].updateAttributes(obj)
			}else{

				var create = await Sensorcustomname.create(obj)
			}		

			
			return check;
		}
		catch(results) {
			throw(results);

		}
		
	};
	Sensorcustomname.remoteMethod(
		'updateAttributes_', {
		  http: {
		    path: '/updateAttributes_',
		    verb: 'post'
		  },
		  accepts: {arg: 'obj', type: 'Object',require:false, description:"Reles find ",root:true},		  
		  returns: {arg: 'results',type: 'Sensorcustomname'},
		  description: "Find Sensorcustomname "
	});



};
