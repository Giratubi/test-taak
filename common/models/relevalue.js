'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

module.exports = function(Relevalue) {


	var methodsToDisplay =  ['findById','find','create','deleteById','createChangeStream'];
	methodsHelper.disableAllExcept(Relevalue, methodsToDisplay);



   Relevalue.findByDate = async (code,from,to,releId) => {	
		
		
		try
		{	
			
			var filter = {
				where:{and:[{code:code},{releId:releId},{reciveddate:{between:[from,to]}}]}
			}


			var senvalues = await Relevalue.find(filter);

			if(senvalues){

				var differenceon = 0
				var differenceof = 0
				var hon = 0	
				var mon = 0	
				var hoff = 0
				var moff = 0		

				for(let i = 0; i < senvalues.length; i++) {


					if(senvalues[i].value == true){						

						if(senvalues[i+1]){
							differenceon += senvalues[i+1].reciveddate - senvalues[i].reciveddate
						}
						
					}
					if(senvalues[i].value == false){						

						if(senvalues[i+1]){
							differenceof += senvalues[i+1].reciveddate - senvalues[i].reciveddate							
						}

					}

				}

				hoff = Math.floor(differenceof/1000/60/60);
				moff = Math.floor((differenceof/1000/60/60 - hoff)*60);

				hon = Math.floor(differenceon/1000/60/60);
				mon = Math.floor((differenceon/1000/60/60 - hon)*60);

				

				for(var rv of senvalues){					

					rv['hourson'] = hon+':'+mon
					rv['hoursoff'] = hoff+':'+moff
				}
				
			}
			//console.log("senvalues",senvalues);
			let validSensValue = []
			
			return senvalues;
		}
		catch(results) {
			
			throw(results);

		}
		
	};
	Relevalue.remoteMethod(
		'findByDate', {
		  http: {
		    path: '/findByDate',
		    verb: 'get'
		  },
		  accepts: [{arg: 'code', type: 'string',require:false, description:"Code find ",root:true},
		  			{arg: 'from', type: 'string',require:false, description:"from find ",root:true},
		  			{arg: 'to', type: 'string',require:false, description:"to find ",root:true},
		  			{arg: 'releId', type: 'string',require:false, description:"to find ",root:true},],
		  
		  returns: {arg: 'results',type: 'Relevalue'},
		  description: "Find Relevalue by date "
	});


};
