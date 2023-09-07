'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

module.exports = function(Sensorvalue) {


	var methodsToDisplay =  ['findById','find','create','deleteById'];
	methodsHelper.disableAllExcept(Sensorvalue, methodsToDisplay);

	Sensorvalue.findVolt = async (code,from,to) => {	

			/*var filter = {
					where:{
						and:[{
							code:code
						}
					]}
				}*/

		    var filter = {
				where:{and:[{code:code},{reciveddate:{between:[from,to]}}]}
			}	

			//console.log("filter",filter);

			var senvalues = await Sensorvalue.find(filter);
			//console.log("senvalues",senvalues);
		

			return senvalues;
	}
	Sensorvalue.remoteMethod(
		'findVolt', {
		  http: {
		    path: '/findVolt',
		    verb: 'get'
		  },
		  accepts: [{arg: 'code', type: 'string',require:false, description:"Code find ",root:true},
		  			{arg: 'from', type: 'string',require:false, description:"from find ",root:true},
		  			{arg: 'to', type: 'string',require:false, description:"to find ",root:true}],
		  
		  returns: {arg: 'results',type: 'Sensorvalue'},
		  description: "Find Sensorvalue by date "
	});


	Sensorvalue.findByDate = async (code,from,to,connectorid) => {	
		
		/*console.log("====== Sensorvalue.findByDate ======\n");
		console.log("code",code);
		console.log("from",from);
		console.log("to",to);
		console.log("connectorid",connectorid);*/
		try
		{	
			
			var filter = {
				where:{and:[{code:code},{connectorId:connectorid},{reciveddate:{between:[from,to]}}]}
			}



			/*var filter = {
				where:{
					and:[{
						code:code
					},{
						connectorId:connectorid
					}
				]}
			}*/	



			var senvalues = await Sensorvalue.find(filter);
			//console.log("senvalues",senvalues);
			let validSensValue = []
			/*if(from && to){
				for(let sensorvalue of senvalues){
				//	console.log("sensorvalue.recivedDate",sensorvalue.reciveddate);
					if(Number(sensorvalue.reciveddate)>=Number(from) && Number(sensorvalue.reciveddate)<= Number(to)){
						validSensValue.push(sensorvalue);
					}
				}
			}*/
					
			//console.log("validSensValue\n",validSensValue);
			//console.log("\n====== Sensorvalue.findByDate END ======\n");
			return senvalues;
		}
		catch(results) {
			//console.log("in catch",results);
			//console.error("\n====== Sensorvalue.findByDate END ======\n");
			throw(results);

		}
		
	};
	Sensorvalue.remoteMethod(
		'findByDate', {
		  http: {
		    path: '/findByDate',
		    verb: 'get'
		  },
		  accepts: [{arg: 'code', type: 'string',require:false, description:"Code find ",root:true},
		  			{arg: 'from', type: 'string',require:false, description:"from find ",root:true},
		  			{arg: 'to', type: 'string',require:false, description:"to find ",root:true},
		  			{arg: 'connectorid', type: 'string',require:false, description:"to find ",root:true},],
		  
		  returns: {arg: 'results',type: 'Sensorvalue'},
		  description: "Find Sensorvalue by date "
	});





};
